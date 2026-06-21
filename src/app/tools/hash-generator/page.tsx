import ToolLayout from "@/components/ToolLayout";
import HashClient from "./client";

export const metadata = {
  title: "Hash Generator - MD5, SHA1, SHA256 Online Tool",
  description: "Free online hash generator. Generate MD5, SHA1, SHA256, SHA384, SHA512 hashes instantly. Client-side, no data uploaded to any server.",
  keywords: ["hash generator", "md5", "sha1", "sha256", "sha512", "hash calculator", "online hash tool"],
  alternates: {
    canonical: "/tools/hash-generator",
  },
  openGraph: {
    url: "/tools/hash-generator",
    siteName: "CodeTools",
    title: "Hash Generator - MD5, SHA1, SHA256 Online Tool",
    description: "Generate MD5, SHA1, SHA256 hashes instantly in your browser. 100% client-side.",
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
    title: "Hash Generator - MD5, SHA1, SHA256 Online Tool",
    description: "Free online hash generator. Generate MD5, SHA1, SHA256, SHA384, SHA512 hashes instantly. Client-side, no data uploaded to any server.",
    images: ["/og-image.png"],
  },
};

export default function HashGeneratorPage() {
  return (
    <ToolLayout toolKey="hash-generator" title="Hash Generator" description="Generate MD5, SHA1, SHA256, SHA384, and SHA512 hashes for any text. All processing happens in your browser using the Web Crypto API.">
      <HashClient />
    </ToolLayout>
  );
}