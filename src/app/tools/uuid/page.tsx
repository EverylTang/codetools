import ToolLayout from "@/components/ToolLayout";
import UuidClient from "./client";

export const metadata = {
  title: "UUID Generator - Online Developer Tool",
  description: "Free online UUID generator. Generate UUID v4 (random) and v7 (time-ordered) individually or in batches of up to 100. One-click copy. Client-side.",
  keywords: ["uuid generator", "uuid v4", "uuid v7", "generate uuid", "online uuid tool", "random uuid"],
  alternates: {
    canonical: "/tools/uuid",
  },
  openGraph: {
    url: "/tools/uuid",
    siteName: "CodeTools",
    title: "UUID Generator - Free Online Tool",
    description: "Generate UUID v4 and v7 instantly in your browser. Batch generation, one-click copy.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeTools - Free Online Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator - Online Developer Tool",
    description: "Free online UUID generator. Generate UUID v4 (random) and v7 (time-ordered) individually or in batches of up to 100. One-click copy. Client-side.",
    images: ["/og-image.png"],
  },
};

export default function UuidPage() {
  return (
    <ToolLayout toolKey="uuid" title="UUID Generator" description="Generate UUID v4 (random) and v7 (time-ordered) UUIDs. Supports batch generation up to 100 UUIDs at once.">
      <UuidClient />
    </ToolLayout>
  );
}