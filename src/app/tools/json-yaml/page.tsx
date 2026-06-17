import ToolLayout from "@/components/ToolLayout";
import JsonYamlClient from "./client";

export const metadata = {
  title: "JSON ↔ YAML Converter - Convert JSON to YAML Online",
  description: "Convert between JSON and YAML formats. Format, validate, and convert in both directions. All client-side, no data upload.",
  keywords: ["json to yaml", "yaml to json", "json yaml converter", "convert json to yaml", "yaml formatter", "JSON转YAML", "YAML转JSON"],
  openGraph: {
    title: "JSON ↔ YAML Converter - Free Online Tool",
    description: "Convert between JSON and YAML formats. Perfect for config files, API specs, and CI/CD pipelines.",
    type: "website",
  },
};

export default function JsonYamlPage() {
  return (
    <ToolLayout toolKey="json-yaml" title="JSON ↔ YAML" description="Convert between JSON and YAML formats. Paste JSON to get YAML, or paste YAML to get JSON. Perfect for config files and API specs.">
      <JsonYamlClient />
    </ToolLayout>
  );
}