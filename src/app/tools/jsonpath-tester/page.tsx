import ToolLayout from "@/components/ToolLayout";
import JsonpathTesterClient from "./client";

export const metadata = {
  title: "JSONPath Tester - Test JSONPath Expressions Online",
  description: "Test JSONPath expressions against JSON data in real-time. Supports dot and bracket notation, array slicing, and recursive descent. All client-side.",
  keywords: ["jsonpath", "jsonpath tester", "jsonpath evaluation", "json path", "json query", "jsonpath online", "JSONPath测试"],
  openGraph: {
    title: "JSONPath Tester - Free Online JSONPath Testing Tool",
    description: "Test JSONPath expressions against JSON data. Real-time evaluation with result highlighting.",
    type: "website",
  },
};

export default function JsonpathTesterPage() {
  return (
    <ToolLayout toolKey="jsonpath-tester" title="JSONPath Tester" description="Test JSONPath expressions against JSON data. Supports dot/bracket notation, array slicing, filter expressions, and recursive descent.">
      <JsonpathTesterClient />
    </ToolLayout>
  );
}