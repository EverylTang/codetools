import ToolLayout from "@/components/ToolLayout";
import QrClient from "./client";

export const metadata = {
  title: "QR Code Generator - Free Online Tool",
  description: "Free online QR code generator. Generate QR codes from text, URLs, or any data. Download as PNG. Client-side, no server upload, 100% private.",
  keywords: ["qr code generator", "qrcode", "qr generator", "create qr code", "free qr code", "online qr tool"],
  openGraph: {
    title: "QR Code Generator - Free Online Tool",
    description: "Generate QR codes instantly from any text or URL. Download as PNG. 100% client-side.",
    type: "website",
  },
};

export default function QrCodePage() {
  return (
    <ToolLayout toolKey="qr-code" title="QR Code Generator" description="Generate QR codes from any text, URL, or data. Download as PNG. All processing happens in your browser — nothing is sent to any server.">
      <QrClient />
    </ToolLayout>
  );
}