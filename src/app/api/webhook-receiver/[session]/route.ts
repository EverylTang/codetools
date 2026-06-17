// API Route: Webhook Receiver
// Captures incoming webhook requests and stores them for the frontend to display via SSE
// POST /api/webhook-receiver/[session] - stores the webhook payload
// GET  /api/webhook-receiver/[session] - SSE stream of webhook events

import { NextRequest, NextResponse } from "next/server";

// In-memory store (simple for demo; Vercel KV would be better for production)
const stores = new Map<string, { events: any[]; listeners: Set<(event: any) => void> }>();

function getStore(session: string) {
  if (!stores.has(session)) {
    stores.set(session, { events: [], listeners: new Set() });
  }
  return stores.get(session)!;
}

// Clean up old sessions after 30 min
setInterval(() => {
  const now = Date.now();
  for (const [key, store] of stores) {
    const lastEvent = store.events[store.events.length - 1];
    if (lastEvent && now - lastEvent.timestamp > 30 * 60 * 1000) {
      stores.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params;
  const store = getStore(session);

  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const event = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    isoTime: new Date().toISOString(),
    method: "POST",
    url: req.url,
    headers,
    body,
    contentType: req.headers.get("content-type") || "unknown",
    contentLength: body.length,
  };

  store.events.push(event);
  // Keep only last 100 events
  if (store.events.length > 100) store.events.shift();

  // Notify all SSE listeners
  for (const listener of store.listeners) {
    listener(event);
  }

  return NextResponse.json({ success: true, eventId: event.id }, { status: 200 });
}

// Also handle GET / POST from any platform
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params;
  const store = getStore(session);

  // Check if SSE request
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/event-stream")) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send existing events
        const existingEvents = store.events.map(e => `data: ${JSON.stringify(e)}\n\n`).join("");
        if (existingEvents) {
          controller.enqueue(encoder.encode(existingEvents));
        }

        const listener = (event: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        store.listeners.add(listener);

        // Keepalive every 15s
        const keepalive = setInterval(() => {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        }, 15000);

        req.signal.addEventListener("abort", () => {
          store.listeners.delete(listener);
          clearInterval(keepalive);
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Regular GET: return all events
  return NextResponse.json({ events: store.events, count: store.events.length });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}