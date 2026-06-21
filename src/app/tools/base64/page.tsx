import ToolLayout from "@/components/ToolLayout";
import Base64Client from "./client";

export const metadata = {
  title: "Base64 Encode/Decode - Online Developer Tool",
  description: "Free online Base64 encoder and decoder. Encode text to Base64, decode Base64 to text, or convert files to Base64 data URIs. Client-side, no server upload.",
  keywords: ["base64", "base64 encode", "base64 decode", "base64 converter", "online base64 tool"],
  alternates: {
    canonical: "/tools/base64",
  },
  openGraph: {
    url: "/tools/base64",
    siteName: "CodeTools",
    title: "Base64 Encode/Decode - Free Online Tool",
    description: "Encode and decode Base64 instantly in your browser. No server upload, 100% client-side.",
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
    title: "Base64 Encode/Decode - Online Developer Tool",
    description: "Free online Base64 encoder and decoder. Encode text to Base64, decode Base64 to text, or convert files to Base64 data URIs. Client-side, no server upload.",
    images: ["/og-image.png"],
  },
};

export default function Base64Page() {
  return (
    <ToolLayout toolKey="base64" title="Base64 Encode / Decode" description="Encode text to Base64, decode Base64 back to text, or convert files to Base64 data URIs. All processing happens in your browser.">
      <Base64Client />
    </ToolLayout>
  );
}