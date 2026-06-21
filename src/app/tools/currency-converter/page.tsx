import ToolLayout from "@/components/ToolLayout";
import CurrencyClient from "./client";

export const metadata = {
  title: "Currency Converter - Exchange Rate Calculator",
  description: "Free online currency converter and exchange rate calculator. Convert between 50+ currencies with real-time rates. Ideal for cross-border payments and international transactions.",
  keywords: ["currency converter", "exchange rate", "forex", "currency calculator", "汇率换算", "跨境支付", "实时汇率"],
  alternates: {
    canonical: "/tools/currency-converter",
  },
  openGraph: {
    url: "/tools/currency-converter",
    siteName: "CodeTools",
    title: "Currency Converter - Free Online Exchange Rate Tool",
    description: "Convert between 50+ currencies with real-time exchange rates. Perfect for cross-border payments and international transactions.",
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
    title: "Currency Converter - Exchange Rate Calculator",
    description: "Free online currency converter and exchange rate calculator. Convert between 50+ currencies with real-time rates. Ideal for cross-border payments and international transactions.",
    images: ["/og-image.png"],
  },
};

export default function CurrencyPage() {
  return (
    <ToolLayout toolKey="currency-converter" title="Currency Converter" description="Convert between 50+ currencies with real-time exchange rates. Useful for cross-border payments, international transactions, and multi-currency financial calculations.">
      <CurrencyClient />
    </ToolLayout>
  );
}