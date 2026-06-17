import ToolLayout from "@/components/ToolLayout";
import JsonToCode from "@/components/JsonToCode";

export const metadata = {
  title: "JSON to Code - Convert JSON to TypeScript, Go, Python, Java & More",
  description: "Convert JSON to typed code in 8 languages: TypeScript, Go, Python, Java, Rust, C#, Swift, Kotlin. Generate interfaces, types, and classes from JSON.",
  keywords: ["json to code", "json to typescript", "json to go", "json to python", "json to java", "json converter", "json to class", "JSON转代码"],
  openGraph: {
    title: "JSON to Code - Free Online JSON to Code Converter",
    description: "Convert JSON to typed code in 8 languages. Generate TypeScript interfaces, Go structs, Python dataclasses, and more.",
    type: "website",
  },
};

export default function JsonToCodePage() {
  return (
    <ToolLayout toolKey="json-to-code" title="JSON to Code" description="Convert JSON to typed code in 8 languages. TypeScript interfaces, Go structs, Python dataclasses, Java classes, Rust structs, and more.">
      <JsonToCode />
    </ToolLayout>
  );
}