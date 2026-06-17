import ToolLayout from "@/components/ToolLayout";
import JsonDiffClient from "./client";

export const metadata = {
  title: "JSON Diff - Compare JSON Online",
  description: "Compare two JSON objects side by side with visual diff highlighting. Find differences between JSON structures instantly. All client-side.",
  keywords: ["json diff", "json compare", "json difference", "compare json", "diff json", "json comparator", "JSON对比", "JSON差异"],
  openGraph: {
    title: "JSON Diff - Free Online JSON Comparison Tool",
    description: "Compare two JSON objects side by side. See what's added, removed, or changed with color-coded diff highlighting.",
    type: "website",
  },
};

export default function JsonDiffPage() {
  return (
    <ToolLayout toolKey="json-diff" title="JSON Diff" description="Compare two JSON objects side by side. Find added, removed, and changed properties with visual diff highlighting.">
      <JsonDiffClient />
    </ToolLayout>
  );
}