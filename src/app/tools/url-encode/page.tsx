import ToolLayout from "@/components/ToolLayout";
import UrlEncodeClient from "./client";

export const metadata = {
  title: "URL Encode/Decode - Online Developer Tool",
  description: "Free online URL encoder and decoder. Encode strings for URL query parameters using encodeURIComponent and encodeURI. Client-side, no data leaves your browser.",
  keywords: ["url encode", "url decode", "url encoder", "percent encoding", "encodeURIComponent", "online url tool"],
  alternates: {
    canonical: "/tools/url-encode",
  },
  openGraph: {
    url: "/tools/url-encode",
    siteName: "CodeTools",
    title: "URL Encode/Decode - Free Online Tool",
    description: "Encode and decode URL strings instantly. Client-side processing, no server upload.",
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
    title: "URL Encode/Decode - Online Developer Tool",
    description: "Free online URL encoder and decoder. Encode strings for URL query parameters using encodeURIComponent and encodeURI. Client-side, no data leaves your browser.",
    images: ["/og-image.png"],
  },
};

export default function UrlEncodePage() {
  return (
    <ToolLayout toolKey="url-encode" title="URL Encode / Decode" description="Encode strings for safe URL usage or decode percent-encoded URLs. Choose between encodeURIComponent and encodeURI modes.">
      <UrlEncodeClient />
    </ToolLayout>
  );
}