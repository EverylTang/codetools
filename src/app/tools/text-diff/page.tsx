import ToolLayout from "@/components/ToolLayout";
import TextDiffClient from "./client";

export const metadata = {
  title: "Text Diff - Compare Text Online",
  description: "Compare two texts side by side with line-by-line diff highlighting. Find added, removed, and unchanged lines. All client-side.",
  keywords: ["text diff", "text compare", "diff checker", "text difference", "compare text", "line diff", "文本对比", "文本差异"],
  alternates: {
    canonical: "/tools/text-diff",
  },
  openGraph: {
    url: "/tools/text-diff",
    siteName: "CodeTools",
    title: "Text Diff - Free Online Text Comparison Tool",
    description: "Compare two texts line by line. See added, removed, and unchanged lines with color-coded highlighting.",
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
    title: "Text Diff - Compare Text Online",
    description: "Compare two texts side by side with line-by-line diff highlighting. Find added, removed, and unchanged lines. All client-side.",
    images: ["/og-image.png"],
  },
};

export default function TextDiffPage() {
  return (
    <ToolLayout toolKey="text-diff" title="Text Diff" description="Compare two texts line by line. Find added, removed, and unchanged lines with color-coded diff highlighting.">
      <TextDiffClient />
    </ToolLayout>
  );
}