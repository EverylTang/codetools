import ToolLayout from "@/components/ToolLayout";
import JsonpathTesterClient from "./client";

export const metadata = {
  title: "JSONPath Tester - Test JSONPath Expressions Online",
  description: "Test JSONPath expressions against JSON data in real-time. Supports dot and bracket notation, array slicing, and recursive descent. All client-side.",
  keywords: ["jsonpath", "jsonpath tester", "jsonpath evaluation", "json path", "json query", "jsonpath online", "JSONPath测试"],
  alternates: {
    canonical: "/tools/jsonpath-tester",
  },
  openGraph: {
    url: "/tools/jsonpath-tester",
    siteName: "CodeTools",
    title: "JSONPath Tester - Free Online JSONPath Testing Tool",
    description: "Test JSONPath expressions against JSON data. Real-time evaluation with result highlighting.",
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
    title: "JSONPath Tester - Test JSONPath Expressions Online",
    description: "Test JSONPath expressions against JSON data in real-time. Supports dot and bracket notation, array slicing, and recursive descent. All client-side.",
    images: ["/og-image.png"],
  },
};

export default function JsonpathTesterPage() {
  return (
    <ToolLayout toolKey="jsonpath-tester" title="JSONPath Tester" description="Test JSONPath expressions against JSON data. Supports dot/bracket notation, array slicing, filter expressions, and recursive descent.">
      <JsonpathTesterClient />
    </ToolLayout>
  );
}