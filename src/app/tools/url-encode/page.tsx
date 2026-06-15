import ToolLayout from "@/components/ToolLayout";
import UrlEncodeClient from "./client";

export const metadata = {
  title: "URL Encode/Decode - Online Developer Tool",
  description: "Free online URL encoder and decoder. Encode strings for URL query parameters using encodeURIComponent and encodeURI. Client-side, no data leaves your browser.",
  keywords: ["url encode", "url decode", "url encoder", "percent encoding", "encodeURIComponent", "online url tool"],
  openGraph: {
    title: "URL Encode/Decode - Free Online Tool",
    description: "Encode and decode URL strings instantly. Client-side processing, no server upload.",
    type: "website",
  },
};

export default function UrlEncodePage() {
  return (
    <ToolLayout toolKey="url-encode" title="URL Encode / Decode" description="Encode strings for safe URL usage or decode percent-encoded URLs. Choose between encodeURIComponent and encodeURI modes.">
      <UrlEncodeClient />
    </ToolLayout>
  );
}