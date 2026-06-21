import ToolLayout from "@/components/ToolLayout";
import TimestampClient from "./client";

export const metadata = {
  title: "Unix Timestamp Converter - Online Developer Tool",
  description: "Free online Unix timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Supports milliseconds, timezone offset. Client-side.",
  keywords: ["timestamp converter", "unix timestamp", "epoch converter", "date to timestamp", "online timestamp tool"],
  alternates: {
    canonical: "/tools/timestamp",
  },
  openGraph: {
    url: "/tools/timestamp",
    siteName: "CodeTools",
    title: "Unix Timestamp Converter - Free Online Tool",
    description: "Convert Unix timestamps to dates and back instantly. No server upload.",
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
    title: "Unix Timestamp Converter - Online Developer Tool",
    description: "Free online Unix timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Supports milliseconds, timezone offset. Client-side.",
    images: ["/og-image.png"],
  },
};

export default function TimestampPage() {
  return (
    <ToolLayout toolKey="timestamp" title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates. Supports seconds, milliseconds, and timezone offset.">
      <TimestampClient />
    </ToolLayout>
  );
}