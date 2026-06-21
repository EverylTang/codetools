import ToolLayout from "@/components/ToolLayout";
import HmacClient from "./client";

export const metadata = {
  title: "HMAC Generator - HMAC-MD5, SHA1, SHA256 Online",
  description: "Free online HMAC generator. Generate HMAC-MD5, HMAC-SHA1, HMAC-SHA256, HMAC-SHA384, HMAC-SHA512 signatures. Essential for payment gateway integration, API authentication, and webhook signature verification.",
  keywords: ["hmac generator", "hmac-md5", "hmac-sha256", "hmac-sha1", "signature generator", "api authentication", "payment signature", "消息签名"],
  alternates: {
    canonical: "/tools/hmac-generator",
  },
  openGraph: {
    url: "/tools/hmac-generator",
    siteName: "CodeTools",
    title: "HMAC Generator - Free Online Signature Tool",
    description: "Generate HMAC signatures for API authentication, payment integration, and webhook verification. Supports MD5, SHA1, SHA256, SHA384, SHA512.",
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
    title: "HMAC Generator - HMAC-MD5, SHA1, SHA256 Online",
    description: "Free online HMAC generator. Generate HMAC-MD5, HMAC-SHA1, HMAC-SHA256, HMAC-SHA384, HMAC-SHA512 signatures. Essential for payment gateway integration, API authentication, and webhook signature verification.",
    images: ["/og-image.png"],
  },
};

export default function HmacPage() {
  return (
    <ToolLayout toolKey="hmac-generator" title="HMAC Signature Generator" description="Generate HMAC (Hash-based Message Authentication Code) signatures. Essential for payment gateway integration, API authentication, and webhook signature verification. Supports HMAC-MD5, HMAC-SHA1, HMAC-SHA256, HMAC-SHA384, and HMAC-SHA512.">
      <HmacClient />
    </ToolLayout>
  );
}