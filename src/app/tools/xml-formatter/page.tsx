import ToolLayout from "@/components/ToolLayout";
import XmlFormatterClient from "./client";

export const metadata = {
  title: "XML Formatter - Format XML Online",
  description: "Format and beautify XML documents online. Indent, validate, and compress XML. All client-side processing.",
  keywords: ["xml formatter", "xml prettify", "format xml", "xml beautifier", "xml format", "xml to tree", "XML格式化"],
  alternates: {
    canonical: "/tools/xml-formatter",
  },
  openGraph: {
    url: "/tools/xml-formatter",
    siteName: "CodeTools",
    title: "XML Formatter - Free Online XML Formatting Tool",
    description: "Format and beautify XML documents. Indent, compress, and validate XML in your browser.",
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
    title: "XML Formatter - Format XML Online",
    description: "Format and beautify XML documents online. Indent, validate, and compress XML. All client-side processing.",
    images: ["/og-image.png"],
  },
};

export default function XmlFormatterPage() {
  return (
    <ToolLayout toolKey="xml-formatter" title="XML Formatter" description="Format and beautify XML documents. Paste messy XML and get clean, indented output. Also supports compression (minification).">
      <XmlFormatterClient />
    </ToolLayout>
  );
}