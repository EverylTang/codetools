import ToolLayout from "@/components/ToolLayout";
import AesCipherClient from "./client";

export const metadata = {
  title: "AES Encryption / Decryption - Online AES Cipher Tool",
  description: "Encrypt and decrypt text using AES-CBC and AES-GCM. Supports 128/192/256-bit keys, Base64 and Hex output. All client-side using Web Crypto API.",
  keywords: ["aes encryption", "aes decryption", "aes-cbc", "aes-gcm", "encrypt text", "decrypt text", "AES加密", "AES解密"],
  openGraph: {
    title: "AES Encryption / Decryption - Free Online Tool",
    description: "Encrypt and decrypt text with AES-CBC and AES-GCM. All client-side using Web Crypto API.",
    type: "website",
  },
};

export default function AesCipherPage() {
  return (
    <ToolLayout toolKey="aes-cipher" title="AES Encryption" description="Encrypt and decrypt text using AES-CBC and AES-GCM. Supports 128/192/256-bit keys. All processing uses the Web Crypto API, no data leaves your browser.">
      <AesCipherClient />
    </ToolLayout>
  );
}