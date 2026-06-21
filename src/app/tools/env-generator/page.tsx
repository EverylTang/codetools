import ToolLayout from "@/components/ToolLayout";
import EnvGeneratorClient from "./client";

export const metadata = {
  title: ".env Generator - Environment Variables Manager",
  description: "Generate and manage .env files. Add variables, validate format, and export for different environments.",
  keywords: [".env generator", "environment variables", "dotenv", "env file", "config management"],
  alternates: {
    canonical: "/tools/env-generator",
  },
  openGraph: {
    url: "/tools/env-generator",
    siteName: "CodeTools",
    title: ".env Generator - Free Online Tool",
    description: "Generate and manage .env files for your projects.",
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
    title: ".env Generator - Environment Variables Manager",
    description: "Generate and manage .env files. Add variables, validate format, and export for different environments.",
    images: ["/og-image.png"],
  },
};

export default function EnvGeneratorPage() {
  return (
    <ToolLayout toolKey="env-generator" title=".env Generator" description="Generate and manage .env files. Add environment variables, validate format, and export for development, staging, or production.">
      <EnvGeneratorClient />
    </ToolLayout>
  );
}
