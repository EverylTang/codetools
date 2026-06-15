import ToolLayout from "@/components/ToolLayout";
import AcquiringMarginClient from "./client";

export const metadata = {
  title: "Acquiring Margin Calculator - Processing Fee and FX Margin Tool",
  description: "Calculate acquiring processing revenue, payment channel cost, FX margin, total gross margin, and export merchant quote assumptions.",
  keywords: ["acquiring margin calculator", "payment margin", "processing fee", "FX markup", "收单毛利", "支付报价"],
  openGraph: {
    title: "Acquiring Margin Calculator",
    description: "Calculate acquiring processing fee margin and FX margin from merchant quote assumptions.",
    type: "website",
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
