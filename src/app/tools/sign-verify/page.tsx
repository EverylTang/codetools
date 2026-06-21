import ToolLayout from "@/components/ToolLayout";
import SignVerifyClient from "./client";

export const metadata = {
  title: "Signature Verification Workbench - Verify HMAC & RSA Signatures",
  description: "Verify payment signatures in real-time. Compare computed signatures with received values. Supports HMAC-MD5, SHA1, SHA256, SHA512 and RSA-SHA256. Perfect for payment gateway debugging.",
  keywords: ["signature verification", "verify hmac", "verify rsa signature", "payment signature verify", "signature checker", "api signature verification", "签名验证", "签名校验"],
  alternates: {
    canonical: "/tools/sign-verify",
  },
  openGraph: {
    url: "/tools/sign-verify",
    siteName: "CodeTools",
    title: "Signature Verification Workbench - Free Online Signature Verifier",
    description: "Verify HMAC and RSA signatures. Paste your received signature, key, and original message to check if they match instantly.",
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
    title: "Signature Verification Workbench - Verify HMAC & RSA Signatures",
    description: "Verify payment signatures in real-time. Compare computed signatures with received values. Supports HMAC-MD5, SHA1, SHA256, SHA512 and RSA-SHA256. Perfect for payment gateway debugging.",
    images: ["/og-image.png"],
  },
};

export default function SignVerifyPage() {
  return (
    <ToolLayout toolKey="sign-verify" title="Signature Verification Workbench" description="Verify payment and API signatures. Compare computed signatures with received values. Supports HMAC-MD5, SHA1, SHA256, SHA512, and RSA-SHA256.">
      <SignVerifyClient />
    </ToolLayout>
  );
}