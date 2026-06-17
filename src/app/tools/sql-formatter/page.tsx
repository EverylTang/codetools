import ToolLayout from "@/components/ToolLayout";
import SqlFormatterClient from "./client";

export const metadata = {
  title: "SQL Formatter - Format SQL Online",
  description: "Format and beautify SQL queries online. Supports MySQL, PostgreSQL, SQLite, and more. Syntax highlighting with multiple style options.",
  keywords: ["sql formatter", "sql prettify", "format sql", "sql beautifier", "sql format", "sql formatter online", "SQL格式化"],
  openGraph: {
    title: "SQL Formatter - Free Online SQL Formatting Tool",
    description: "Format and beautify SQL queries. Supports MySQL, PostgreSQL, SQLite, and more dialects.",
    type: "website",
  },
};

export default function SqlFormatterPage() {
  return (
    <ToolLayout toolKey="sql-formatter" title="SQL Formatter" description="Format and beautify SQL queries. Paste messy SQL and get clean, readable output. Supports MySQL, PostgreSQL, SQLite, and more dialects.">
      <SqlFormatterClient />
    </ToolLayout>
  );
}