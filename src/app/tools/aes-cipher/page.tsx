import ToolLayout from "@/components/ToolLayout";
import AesCipherClient from "./client";

export const metadata = {
  title: "AES Encryption / Decryption - Online AES Cipher Tool",
  description: "Encrypt and decrypt text using AES-CBC and AES-GCM. Supports 128/192/256-bit keys, Base64 and Hex output. All client-side using Web Crypto API.",
  keywords: ["aes encryption", "aes decryption", "aes-cbc", "aes-gcm", "encrypt text", "decrypt text", "AES加密", "AES解密"],
  alternates: {
    canonical: "/tools/aes-cipher",
  },
  openGraph: {
    url: "/tools/aes-cipher",
    siteName: "CodeTools",
    title: "AES Encryption / Decryption - Free Online Tool",
    description: "Encrypt and decrypt text with AES-CBC and AES-GCM. All client-side using Web Crypto API.",
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
    title: "AES Encryption / Decryption - Online AES Cipher Tool",
    description: "Encrypt and decrypt text using AES-CBC and AES-GCM. Supports 128/192/256-bit keys, Base64 and Hex output. All client-side using Web Crypto API.",
    images: ["/og-image.png"],
  },
};

export default function AesCipherPage() {
  return (
    <ToolLayout toolKey="aes-cipher" title="AES Encryption" description="Encrypt and decrypt text using AES-CBC and AES-GCM. Supports 128/192/256-bit keys. All processing uses the Web Crypto API, no data leaves your browser.">
      <AesCipherClient />
    </ToolLayout>
  );
}