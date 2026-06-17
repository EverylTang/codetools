"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

interface WebhookEvent {
  id: string;
  timestamp: number;
  isoTime: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  contentType: string;
  contentLength: number;
}

export default function WebhookReceiverClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["webhook-receiver"] || {};
  const [sessionId] = useState(() => generateSessionId());
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connected" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhook-receiver/${sessionId}`
    : "";

  useEffect(() => {
    // Connect SSE
    const es = new EventSource(`/api/webhook-receiver/${sessionId}`);
    eventSourceRef.current = es;

    es.onopen = () => setStatus("connected");
    es.onmessage = (event) => {
      try {
        const evt = JSON.parse(event.data);
        setEvents(prev => {
          if (prev.some(e => e.id === evt.id)) return prev;
          return [...prev, evt].slice(-50);
        });
      } catch {}
    };
    es.onerror = () => setStatus("error");

    return () => {
      es.close();
    };
  }, [sessionId]);

  const copyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [webhookUrl]);

  const clearEvents = () => {
    setEvents([]);
    setSelectedEvent(null);
  };

  const selected = events.find(e => e.id === selectedEvent);

  const formatBody = (body: string, contentType: string): string => {
    if (contentType.includes("json")) {
      try { return JSON.stringify(JSON.parse(body), null, 2); } catch { return body; }
    }
    return body;
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Webhook URL */}
      <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === "connected" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-yellow-500"}`} />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              {status === "connected" ? "Listening" : status === "error" ? "Disconnected" : "Connecting..."}
            </span>
          </div>
          <button onClick={copyUrl} className="px-2.5 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            {copied ? "✓ Copied" : "Copy URL"}
          </button>
        </div>
        <code className="text-xs font-mono text-blue-800 dark:text-blue-200 break-all select-all">{webhookUrl}</code>
        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2">
          Copy this URL and paste it into your payment platform's webhook/callback settings. All incoming requests will appear below.
        </p>
      </div>

      {/* Quick test */}
      <div className="flex gap-2">
        <button
          onClick={async () => {
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ test: true, order_id: "DEMO-" + Date.now(), amount: "99.99", status: "success" }),
            });
          }}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
        >Send Test Webhook</button>
        <button
          onClick={async () => {
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Signature": "fake-sig-abc123" },
              body: "out_trade_no=DEMO2024&total_fee=0.01&trade_status=TRADE_SUCCESS&sign=fake",
            });
          }}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
        >Send Form-Encoded Test</button>
        <button onClick={clearEvents} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Clear</button>
      </div>

      {/* Events list */}
      <div className="flex flex-1 gap-4 min-h-[300px]">
        {/* Event list */}
        <div className="w-64 shrink-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            Events ({events.length})
          </div>
          <div className="flex-1 overflow-auto">
            {events.length === 0 ? (
              <div className="p-4 text-xs text-gray-400 text-center">Waiting for requests...</div>
            ) : (
              events.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt.id)}
                  className={`w-full text-left px-3 py-2 text-xs border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedEvent === evt.id ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  <div className="font-mono text-gray-500">{evt.isoTime.slice(11, 19)}</div>
                  <div className="text-gray-700 dark:text-gray-300 truncate">
                    {evt.contentType.slice(0, 30)} · {evt.contentLength}B
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Event detail */}
        <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
          {selected ? (
            <div className="flex-1 overflow-auto">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{selected.method} at {selected.isoTime}</div>
                <div className="space-y-1">
                  {Object.entries(selected.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-[10px]">
                      <span className="font-mono text-gray-400 w-32 shrink-0 truncate">{key}:</span>
                      <span className="font-mono text-gray-600 dark:text-gray-300 truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-gray-400 mb-1">Body</div>
                <pre className="text-xs font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {formatBody(selected.body, selected.contentType)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
              {events.length === 0 ? "Send a webhook to see details" : "Select an event from the list"}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500">
        <p>Sessions are ephemeral — events are stored in memory and cleared after 30 minutes of inactivity.</p>
        <p>For production use, copy this URL into your Alipay/WeChat Pay/Stripe webhook settings to test real callbacks.</p>
      </div>
    </div>
  );
}