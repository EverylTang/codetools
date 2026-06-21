import ToolLayout from "@/components/ToolLayout";
import Base64FileClient from "./client";

export const metadata = {
  title: "Base64 File Converter - Encode Files to Base64 Online",
  description: "Convert files to Base64 data URIs and decode Base64 strings back to files. Supports images, PDFs, documents, and more. All client-side.",
  keywords: ["base64 file", "base64 image", "file to base64", "base64 to file", "base64 converter", "base64 data uri", "文件转Base64", "Base64转文件"],
  alternates: {
    canonical: "/tools/base64-file",
  },
  openGraph: {
    url: "/tools/base64-file",
    siteName: "CodeTools",
    title: "Base64 File Converter - Free Online Tool",
    description: "Convert files to Base64 data URIs and decode Base64 back to files. Supports images, PDFs, and more.",
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
    title: "Base64 File Converter - Encode Files to Base64 Online",
    description: "Convert files to Base64 data URIs and decode Base64 strings back to files. Supports images, PDFs, documents, and more. All client-side.",
    images: ["/og-image.png"],
  },
};

export default function Base64FilePage() {
  return (
    <ToolLayout toolKey="base64-file" title="Base64 File Converter" description="Convert files to Base64 data URIs and decode Base64 strings back to downloadable files. Supports images, PDFs, documents, and more.">
      <Base64FileClient />
    </ToolLayout>
  );
}