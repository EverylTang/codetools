import ToolLayout from "@/components/ToolLayout";
import CaseConverterClient from "./client";

export const metadata = {
  title: "Case Converter - Convert Text Case Online",
  description: "Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more. Real-time conversion with copy support.",
  keywords: ["case converter", "camel case", "snake case", "kebab case", "pascal case", "text case converter", "大小写转换"],
  alternates: {
    canonical: "/tools/case-converter",
  },
  openGraph: {
    url: "/tools/case-converter",
    siteName: "CodeTools",
    title: "Case Converter - Free Online Text Case Converter",
    description: "Convert text between all common naming conventions. camelCase, snake_case, kebab-case, and more.",
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
    title: "Case Converter - Convert Text Case Online",
    description: "Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more. Real-time conversion with copy support.",
    images: ["/og-image.png"],
  },
};

export default function CaseConverterPage() {
  return (
    <ToolLayout toolKey="case-converter" title="Case Converter" description="Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more. Real-time conversion.">
      <CaseConverterClient />
    </ToolLayout>
  );
}