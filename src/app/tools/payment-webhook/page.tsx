import ToolLayout from "@/components/ToolLayout";
import PaymentWebhookClient from "./client";

export const metadata = {
  title: "Payment Webhook Simulator - Simulate Payment Callbacks",
  description: "Free online payment webhook simulator. Simulate Alipay, WeChat Pay, and Stripe payment callbacks for testing your webhook endpoint. Generate signed callback requests instantly. Essential for payment integration debugging.",
  keywords: ["payment webhook", "webhook simulator", "payment callback", "alipay callback", "wechat pay callback", "stripe webhook", "支付回调测试", "支付回调模拟", "webhook 测试"],
  openGraph: {
    title: "Payment Webhook Simulator - Free Payment Callback Tool",
    description: "Simulate Alipay, WeChat Pay, and Stripe payment callbacks for testing your webhook endpoint. Generate signed callback requests.",
    type: "website",
  },
};

export default function PaymentWebhookPage() {
  return (
    <ToolLayout toolKey="payment-webhook" title="Payment Webhook Simulator" description="Simulate payment callbacks from Alipay, WeChat Pay, and Stripe. Fill in parameters, generate a signed POST request, and send it to your webhook URL for testing. All processing happens client-side.">
      <PaymentWebhookClient />
    </ToolLayout>
  );
}