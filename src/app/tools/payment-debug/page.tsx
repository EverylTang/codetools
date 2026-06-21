import ToolLayout from "@/components/ToolLayout";
import PaymentDebugClient from "./client";

export const metadata = {
  title: "Payment API Debugger - Debug Payment APIs Online",
  description: "Complete payment API debugging workflow: construct signed requests, send to endpoints, inspect responses. Supports Alipay, WeChat Pay, and Stripe.",
  keywords: ["payment api debugger", "payment api tester", "payment debug", "api debugger", "alipay api", "wechat pay api", "stripe api", "支付API调试"],
  alternates: {
    canonical: "/tools/payment-debug",
  },
  openGraph: {
    url: "/tools/payment-debug",
    siteName: "CodeTools",
    title: "Payment API Debugger - Free Online Payment API Testing Tool",
    description: "Construct, sign, send, and inspect payment API requests. Full debugging workflow for Alipay, WeChat Pay, and Stripe.",
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
    title: "Payment API Debugger - Debug Payment APIs Online",
    description: "Complete payment API debugging workflow: construct signed requests, send to endpoints, inspect responses. Supports Alipay, WeChat Pay, and Stripe.",
    images: ["/og-image.png"],
  },
};

export default function PaymentDebugPage() {
  return (
    <ToolLayout toolKey="payment-debug" title="Payment API Debugger" description="Complete payment API debugging workflow. Construct signed requests, send to endpoints, and inspect responses. Supports Alipay, WeChat Pay, and Stripe.">
      <PaymentDebugClient />
    </ToolLayout>
  );
}