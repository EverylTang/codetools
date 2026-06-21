import ToolLayout from "@/components/ToolLayout";
import LoremIpsumClient from "./client";

export const metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text Online",
  description: "Generate Lorem Ipsum placeholder text with configurable paragraphs, sentences, and words. Ideal for design mockups and content placeholders.",
  keywords: ["lorem ipsum", "lorem ipsum generator", "placeholder text", "dummy text", "filler text", "design mockup", "Lorem生成器", "占位文字"],
  alternates: {
    canonical: "/tools/lorem-ipsum",
  },
  openGraph: {
    url: "/tools/lorem-ipsum",
    siteName: "CodeTools",
    title: "Lorem Ipsum Generator - Free Online Placeholder Text Generator",
    description: "Generate Lorem Ipsum placeholder text. Configurable paragraphs, sentences, and words.",
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
    title: "Lorem Ipsum Generator - Generate Placeholder Text Online",
    description: "Generate Lorem Ipsum placeholder text with configurable paragraphs, sentences, and words. Ideal for design mockups and content placeholders.",
    images: ["/og-image.png"],
  },
};

export default function LoremIpsumPage() {
  return (
    <ToolLayout toolKey="lorem-ipsum" title="Lorem Ipsum Generator" description="Generate Lorem Ipsum placeholder text. Configurable paragraphs, sentences, and words. Ideal for design mockups and content placeholders.">
      <LoremIpsumClient />
    </ToolLayout>
  );
}