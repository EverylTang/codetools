import ToolLayout from "@/components/ToolLayout";
import UuidClient from "./client";

export const metadata = {
  title: "UUID Generator - Online Developer Tool",
  description: "Free online UUID generator. Generate UUID v4 (random) and v7 (time-ordered) individually or in batches of up to 100. One-click copy. Client-side.",
  keywords: ["uuid generator", "uuid v4", "uuid v7", "generate uuid", "online uuid tool", "random uuid"],
  openGraph: {
    title: "UUID Generator - Free Online Tool",
    description: "Generate UUID v4 and v7 instantly in your browser. Batch generation, one-click copy.",
    type: "website",
  },
};

export default function UuidPage() {
  return (
    <ToolLayout toolKey="uuid" title="UUID Generator" description="Generate UUID v4 (random) and v7 (time-ordered) UUIDs. Supports batch generation up to 100 UUIDs at once.">
      <UuidClient />
    </ToolLayout>
  );
}