import ToolLayout from "@/components/ToolLayout";
import UlidGeneratorClient from "./client";

export const metadata = {
  title: "ULID Generator - Generate ULID Online",
  description: "Generate ULID (Universally Unique Lexicographically Sortable Identifier). Time-ordered, URL-safe, and more compact than UUID. Batch generation supported.",
  keywords: ["ulid generator", "generate ulid", "ulid", "sortable id", "unique id", "ulid vs uuid", "ULID生成器"],
  openGraph: {
    title: "ULID Generator - Free Online ULID Generator",
    description: "Generate time-ordered, sortable ULIDs. Perfect for database primary keys and distributed systems.",
    type: "website",
  },
};

export default function UlidGeneratorPage() {
  return (
    <ToolLayout toolKey="ulid-generator" title="ULID Generator" description="Generate ULIDs (Universally Unique Lexicographically Sortable Identifiers). Time-ordered, URL-safe, and more compact than UUID. Batch generation supported.">
      <UlidGeneratorClient />
    </ToolLayout>
  );
}