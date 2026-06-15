import ToolLayout from "@/components/ToolLayout";
import WordCounterClient from "./client";

export const metadata = {
  title: "Word Counter - Character, Word, Line Count Online",
  description: "Free online word counter and character counter. Count characters (with/without spaces), words, lines, sentences, and paragraphs in real-time. Perfect for writers, developers, and SEO content optimization.",
  keywords: ["word counter", "character counter", "word count", "character count", "text counter", "online word counter", "字数统计"],
  openGraph: {
    title: "Word Counter - Free Online Character & Word Counter",
    description: "Count characters, words, lines, sentences, paragraphs in real-time. Free, client-side, no upload.",
    type: "website",
  },
};

export default function WordCounterPage() {
  return (
    <ToolLayout toolKey="word-counter" title="Word Counter" description="Count characters (with and without spaces), words, lines, sentences, and paragraphs in real-time. All processing happens in your browser.">
      <WordCounterClient />
    </ToolLayout>
  );
}