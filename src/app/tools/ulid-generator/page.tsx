import ToolLayout from "@/components/ToolLayout";
import UlidGeneratorClient from "./client";

export const metadata = {
  title: "ULID Generator - Generate ULID Online",
  description: "Generate ULID (Universally Unique Lexicographically Sortable Identifier). Time-ordered, URL-safe, and more compact than UUID. Batch generation supported.",
  keywords: ["ulid generator", "generate ulid", "ulid", "sortable id", "unique id", "ulid vs uuid", "ULID生成器"],
  alternates: {
    canonical: "/tools/ulid-generator",
  },
  openGraph: {
    url: "/tools/ulid-generator",
    siteName: "CodeTools",
    title: "ULID Generator - Free Online ULID Generator",
    description: "Generate time-ordered, sortable ULIDs. Perfect for database primary keys and distributed systems.",
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
    title: "ULID Generator - Generate ULID Online",
    description: "Generate ULID (Universally Unique Lexicographically Sortable Identifier). Time-ordered, URL-safe, and more compact than UUID. Batch generation supported.",
    images: ["/og-image.png"],
  },
};

export default function UlidGeneratorPage() {
  return (
    <ToolLayout toolKey="ulid-generator" title="ULID Generator" description="Generate ULIDs (Universally Unique Lexicographically Sortable Identifiers). Time-ordered, URL-safe, and more compact than UUID. Batch generation supported.">
      <UlidGeneratorClient />
    </ToolLayout>
  );
}