import ToolLayout from "@/components/ToolLayout";
import LoremIpsumClient from "./client";

export const metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text Online",
  description: "Generate Lorem Ipsum placeholder text with configurable paragraphs, sentences, and words. Ideal for design mockups and content placeholders.",
  keywords: ["lorem ipsum", "lorem ipsum generator", "placeholder text", "dummy text", "filler text", "design mockup", "Lorem生成器", "占位文字"],
  openGraph: {
    title: "Lorem Ipsum Generator - Free Online Placeholder Text Generator",
    description: "Generate Lorem Ipsum placeholder text. Configurable paragraphs, sentences, and words.",
    type: "website",
  },
};

export default function LoremIpsumPage() {
  return (
    <ToolLayout toolKey="lorem-ipsum" title="Lorem Ipsum Generator" description="Generate Lorem Ipsum placeholder text. Configurable paragraphs, sentences, and words. Ideal for design mockups and content placeholders.">
      <LoremIpsumClient />
    </ToolLayout>
  );
}