import ToolLayout from "@/components/ToolLayout";
import RsaGeneratorClient from "./client";

export const metadata = {
  title: "RSA Key Pair Generator - 2048/4096 bit Online Tool",
  description: "Free online RSA key pair generator. Generate 2048-bit, 4096-bit RSA private and public keys. Export in PEM, PKCS#8, and SPKI formats. Essential for payment gateway integration, API authentication, and JWT signing.",
  keywords: ["rsa key generator", "rsa key pair", "generate rsa keys", "rsa 2048", "rsa 4096", "pem format", "ssl certificate", "密钥生成"],
  alternates: {
    canonical: "/tools/rsa-key-generator",
  },
  openGraph: {
    url: "/tools/rsa-key-generator",
    siteName: "CodeTools",
    title: "RSA Key Pair Generator - Free Online Key Generation",
    description: "Generate RSA 2048/4096 bit key pairs instantly in your browser. Export private and public keys in PEM format.",
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
    title: "RSA Key Pair Generator - 2048/4096 bit Online Tool",
    description: "Free online RSA key pair generator. Generate 2048-bit, 4096-bit RSA private and public keys. Export in PEM, PKCS#8, and SPKI formats. Essential for payment gateway integration, API authentication, and JWT signing.",
    images: ["/og-image.png"],
  },
};

export default function RsaGeneratorPage() {
  return (
    <ToolLayout toolKey="rsa-key-generator" title="RSA Key Pair Generator" description="Generate RSA public/private key pairs (2048 or 4096 bits) directly in your browser. Export keys in PEM, PKCS#8, and SPKI formats. Perfect for payment integration, API authentication, and JWT signing.">
      <RsaGeneratorClient />
    </ToolLayout>
  );
}