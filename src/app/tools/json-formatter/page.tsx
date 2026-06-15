import ToolLayout from "@/components/ToolLayout";
import JsonFormatterClient from "./client";

export const metadata = {
  title: "JSON Formatter - Format, Validate & Minify JSON Online",
  description: "Free online JSON formatter and validator. Format, validate, compress, and beautify JSON. Features error detection with line/column numbers, tree view, and copy formatted/minified output. Client-side, no server upload.",
  keywords: ["json formatter", "json validator", "json pretty print", "json beautifier", "json format online", "json 格式化", "json 验证"],
  openGraph: {
    title: "JSON Formatter - Free Online JSON Format & Validation Tool",
    description: "Format, validate, and compress JSON instantly in your browser. Error detection with line/column numbers.",
    type: "website",
  },
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout toolKey="json-formatter">
      <JsonFormatterClient />
    </ToolLayout>
  );
}