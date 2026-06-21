import ToolLayout from "@/components/ToolLayout";
import RegexTesterClient from "./client";

export const metadata = {
  title: "Regex Tester - Online Regular Expression Tool",
  description: "Free online regex tester. Test regular expressions in real-time with syntax highlighting, match highlighting, and detailed match info. Supports JavaScript regex flags: g, i, m, s, u, y.",
  keywords: ["regex tester", "regular expression", "regex test", "regex tool", "regex checker", "正则表达式测试", "正则工具"],
  alternates: {
    canonical: "/tools/regex-tester",
  },
  openGraph: {
    url: "/tools/regex-tester",
    siteName: "CodeTools",
    title: "Regex Tester - Free Online Regular Expression Tool",
    description: "Test regular expressions in real-time with match highlighting. Perfect for developers and data extraction tasks.",
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
    title: "Regex Tester - Online Regular Expression Tool",
    description: "Free online regex tester. Test regular expressions in real-time with syntax highlighting, match highlighting, and detailed match info. Supports JavaScript regex flags: g, i, m, s, u, y.",
    images: ["/og-image.png"],
  },
};

export default function RegexTesterPage() {
  return (
    <ToolLayout toolKey="regex-tester" title="Regex Tester" description="Test regular expressions in real-time. Enter a regex pattern and test text to see matches highlighted with detailed match information.">
      <RegexTesterClient />
    </ToolLayout>
  );
}