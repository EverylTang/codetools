import ToolLayout from "@/components/ToolLayout";
import RandomDataClient from "./client";

export const metadata = {
  title: "Random Data Generator - Mock Data for Testing",
  description: "Generate random mock data for testing. Create datasets with names, emails, dates, and custom fields.",
  keywords: ["random data", "mock data", "test data", "fake data generator", "sample data"],
  alternates: {
    canonical: "/tools/random-data-generator",
  },
  openGraph: {
    url: "/tools/random-data-generator",
    siteName: "CodeTools",
    title: "Random Data Generator - Free Online Tool",
    description: "Generate random mock data for testing and development.",
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
    title: "Random Data Generator - Mock Data for Testing",
    description: "Generate random mock data for testing. Create datasets with names, emails, dates, and custom fields.",
    images: ["/og-image.png"],
  },
};

export default function RandomDataPage() {
  return (
    <ToolLayout toolKey="random-data-generator" title="Random Data Generator" description="Generate random mock data for testing. Create datasets with customizable fields including names, emails, dates, and more.">
      <RandomDataClient />
    </ToolLayout>
  );
}
