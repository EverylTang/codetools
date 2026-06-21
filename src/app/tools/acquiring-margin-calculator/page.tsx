import ToolLayout from "@/components/ToolLayout";
import AcquiringMarginClient from "./client";

export const metadata = {
  title: "Acquiring Margin Calculator - Processing Fee and FX Margin Tool",
  description: "Calculate acquiring processing revenue, payment channel cost, FX margin, total gross margin, and export merchant quote assumptions.",
  keywords: ["acquiring margin calculator", "payment margin", "processing fee", "FX markup", "收单毛利", "支付报价"],
  alternates: {
    canonical: "/tools/acquiring-margin-calculator",
  },
  openGraph: {
    url: "/tools/acquiring-margin-calculator",
    siteName: "CodeTools",
    title: "Acquiring Margin Calculator",
    description: "Calculate acquiring processing fee margin and FX margin from merchant quote assumptions.",
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
    title: "Acquiring Margin Calculator - Processing Fee and FX Margin Tool",
    description: "Calculate acquiring processing revenue, payment channel cost, FX margin, total gross margin, and export merchant quote assumptions.",
    images: ["/og-image.png"],
  },
};

export default function AcquiringMarginPage() {
  return (
    <ToolLayout
      toolKey="acquiring-margin-calculator"
      title="Acquiring Margin Calculator"
      description="Calculate processing fee revenue, payment channel cost, FX margin, total gross margin, and export merchant quote assumptions."
    >
      <AcquiringMarginClient />
    </ToolLayout>
  );
}
