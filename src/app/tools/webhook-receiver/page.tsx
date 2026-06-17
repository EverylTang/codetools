import ToolLayout from "@/components/ToolLayout";
import WebhookReceiverClient from "./client";

export const metadata = {
  title: "Webhook Receiver - Receive Payment Callbacks Online",
  description: "Create a temporary webhook endpoint to receive and inspect payment callbacks from Alipay, WeChat Pay, Stripe, and more. Real-time event display.",
  keywords: ["webhook receiver", "webhook endpoint", "webhook tester", "receive webhooks", "webhook inspector", "callback receiver", "支付回调接收", "webhook接收器"],
  openGraph: {
    title: "Webhook Receiver - Free Online Webhook Endpoint",
    description: "Create a temporary webhook endpoint to receive payment callbacks. Real-time event display with headers and body inspection.",
    type: "website",
  },
};

export default function WebhookReceiverPage() {
  return (
    <ToolLayout toolKey="webhook-receiver" title="Webhook Receiver" description="Create a temporary webhook endpoint to receive and inspect payment callbacks. Real-time event display with full request details.">
      <WebhookReceiverClient />
    </ToolLayout>
  );
}