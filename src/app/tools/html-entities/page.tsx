import ToolLayout from "@/components/ToolLayout";
import HtmlEntitiesClient from "./client";

export const metadata = {
  title: "HTML Entities Encoder/Decoder - Encode HTML Entities Online",
  description: "Encode or decode HTML entities. Convert special characters to HTML entities and back. All client-side.",
  keywords: ["html entities", "html encode", "html decode", "html entity encoder", "html special chars", "HTML实体编码", "HTML实体解码"],
  openGraph: {
    title: "HTML Entities Encoder/Decoder - Free Online Tool",
    description: "Encode and decode HTML entities. Convert special characters to HTML-safe entities and back.",
    type: "website",
  },
};

export default function HtmlEntitiesPage() {
  return (
    <ToolLayout toolKey="html-entities" title="HTML Entities" description="Encode or decode HTML entities. Convert special characters to their HTML entity equivalents and back.">
      <HtmlEntitiesClient />
    </ToolLayout>
  );
}