import ToolLayout from "@/components/ToolLayout";
import JsonCsvClient from "./client";

export const metadata = {
  title: "JSON ↔ CSV Converter - Convert JSON to CSV Online",
  description: "Convert between JSON arrays and CSV format. Also supports JSONL (JSON Lines) format. All client-side processing, no data upload.",
  keywords: ["json to csv", "csv to json", "json csv converter", "convert json to csv", "json array to csv", "JSON转CSV", "CSV转JSON"],
  openGraph: {
    title: "JSON ↔ CSV Converter - Free Online Tool",
    description: "Convert between JSON and CSV formats instantly. Supports nested JSON flattening and CSV parsing.",
    type: "website",
  },
};

export default function JsonCsvPage() {
  return (
    <ToolLayout toolKey="json-csv" title="JSON ↔ CSV" description="Convert between JSON arrays and CSV format. Paste JSON to get CSV, or paste CSV to get JSON. Supports nested objects.">
      <JsonCsvClient />
    </ToolLayout>
  );
}