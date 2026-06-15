import ToolLayout from "@/components/ToolLayout";
import RsaGeneratorClient from "./client";

export const metadata = {
  title: "RSA Key Pair Generator - 2048/4096 bit Online Tool",
  description: "Free online RSA key pair generator. Generate 2048-bit, 4096-bit RSA private and public keys. Export in PEM, PKCS#8, and SPKI formats. Essential for payment gateway integration, API authentication, and JWT signing.",
  keywords: ["rsa key generator", "rsa key pair", "generate rsa keys", "rsa 2048", "rsa 4096", "pem format", "ssl certificate", "密钥生成"],
  openGraph: {
    title: "RSA Key Pair Generator - Free Online Key Generation",
    description: "Generate RSA 2048/4096 bit key pairs instantly in your browser. Export private and public keys in PEM format.",
    type: "website",
  },
};

export default function RsaGeneratorPage() {
  return (
    <ToolLayout toolKey="rsa-key-generator" title="RSA Key Pair Generator" description="Generate RSA public/private key pairs (2048 or 4096 bits) directly in your browser. Export keys in PEM, PKCS#8, and SPKI formats. Perfect for payment integration, API authentication, and JWT signing.">
      <RsaGeneratorClient />
    </ToolLayout>
  );
}