import ToolLayout from "@/components/ToolLayout";
import RandomDataClient from "./client";

export const metadata = {
  title: "Random Data Generator - Mock Data for Testing",
  description: "Generate random mock data for testing. Create datasets with names, emails, dates, and custom fields.",
  keywords: ["random data", "mock data", "test data", "fake data generator", "sample data"],
  openGraph: {
    title: "Random Data Generator - Free Online Tool",
    description: "Generate random mock data for testing and development.",
    type: "website",
  },
};

export default function RandomDataPage() {
  return (
    <ToolLayout toolKey="random-data-generator" title="Random Data Generator" description="Generate random mock data for testing. Create datasets with customizable fields including names, emails, dates, and more.">
      <RandomDataClient />
    </ToolLayout>
  );
}
