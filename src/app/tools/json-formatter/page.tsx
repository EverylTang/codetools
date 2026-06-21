import ToolLayout from "@/components/ToolLayout";
import JsonFormatterClient from "./client";

export const metadata = {
  title: "JSON Formatter - Format, Validate & Minify JSON Online",
  description: "Free online JSON formatter and validator. Format, validate, compress, and beautify JSON. Features error detection with line/column numbers, tree view, and copy formatted/minified output. Client-side, no server upload.",
  keywords: ["json formatter", "json validator", "json pretty print", "json beautifier", "json format online", "json 格式化", "json 验证"],
  alternates: {
    canonical: "/tools/json-formatter",
  },
  openGraph: {
    url: "/tools/json-formatter",
    siteName: "CodeTools",
    title: "JSON Formatter - Free Online JSON Format & Validation Tool",
    description: "Format, validate, and compress JSON instantly in your browser. Error detection with line/column numbers.",
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
    title: "JSON Formatter - Format, Validate & Minify JSON Online",
    description: "Free online JSON formatter and validator. Format, validate, compress, and beautify JSON. Features error detection with line/column numbers, tree view, and copy formatted/minified output. Client-side, no server upload.",
    images: ["/og-image.png"],
  },
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout toolKey="json-formatter">
      <JsonFormatterClient />
    </ToolLayout>
  );
}