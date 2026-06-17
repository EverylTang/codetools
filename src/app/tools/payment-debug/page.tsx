import ToolLayout from "@/components/ToolLayout";
import PaymentDebugClient from "./client";

export const metadata = {
  title: "Payment API Debugger - Debug Payment APIs Online",
  description: "Complete payment API debugging workflow: construct signed requests, send to endpoints, inspect responses. Supports Alipay, WeChat Pay, and Stripe.",
  keywords: ["payment api debugger", "payment api tester", "payment debug", "api debugger", "alipay api", "wechat pay api", "stripe api", "支付API调试"],
  openGraph: {
    title: "Payment API Debugger - Free Online Payment API Testing Tool",
    description: "Construct, sign, send, and inspect payment API requests. Full debugging workflow for Alipay, WeChat Pay, and Stripe.",
    type: "website",
  },
};

export default function PaymentDebugPage() {
  return (
    <ToolLayout toolKey="payment-debug" title="Payment API Debugger" description="Complete payment API debugging workflow. Construct signed requests, send to endpoints, and inspect responses. Supports Alipay, WeChat Pay, and Stripe.">
      <PaymentDebugClient />
    </ToolLayout>
  );
}