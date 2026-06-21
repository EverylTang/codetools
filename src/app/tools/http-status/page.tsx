import ToolLayout from "@/components/ToolLayout";
import HttpStatusClient from "./client";

export const metadata = {
  title: "HTTP Status Codes - Complete Reference Guide",
  description: "Complete reference of all HTTP status codes. Browse 1xx, 2xx, 3xx, 4xx, 5xx codes with descriptions. Search by code or keyword.",
  keywords: ["http status codes", "http codes", "status code reference", "http 404", "http 500", "http response codes", "HTTP状态码"],
  alternates: {
    canonical: "/tools/http-status",
  },
  openGraph: {
    url: "/tools/http-status",
    siteName: "CodeTools",
    title: "HTTP Status Codes - Complete Reference",
    description: "Complete reference of all HTTP status codes. Search and browse by category.",
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
    title: "HTTP Status Codes - Complete Reference Guide",
    description: "Complete reference of all HTTP status codes. Browse 1xx, 2xx, 3xx, 4xx, 5xx codes with descriptions. Search by code or keyword.",
    images: ["/og-image.png"],
  },
};

export default function HttpStatusPage() {
  return (
    <ToolLayout toolKey="http-status" title="HTTP Status Codes" description="Complete reference of all HTTP status codes. Browse by category (1xx–5xx), search by code or keyword, and copy descriptions.">
      <HttpStatusClient />
    </ToolLayout>
  );
}