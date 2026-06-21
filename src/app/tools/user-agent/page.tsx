import ToolLayout from "@/components/ToolLayout";
import UserAgentClient from "./client";

export const metadata = {
  title: "User-Agent Parser - Parse User Agent Strings Online",
  description: "Parse any User-Agent string to identify browser, OS, device, engine, and more. Also shows your current browser's UA string.",
  keywords: ["user agent parser", "ua parser", "user agent analyzer", "browser detection", "parse user agent", "useragent工具", "UA解析"],
  alternates: {
    canonical: "/tools/user-agent",
  },
  openGraph: {
    url: "/tools/user-agent",
    siteName: "CodeTools",
    title: "User-Agent Parser - Free Online User Agent Analyzer",
    description: "Parse User-Agent strings to identify browser, OS, device, and engine details.",
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
    title: "User-Agent Parser - Parse User Agent Strings Online",
    description: "Parse any User-Agent string to identify browser, OS, device, engine, and more. Also shows your current browser's UA string.",
    images: ["/og-image.png"],
  },
};

export default function UserAgentPage() {
  return (
    <ToolLayout toolKey="user-agent" title="User-Agent Parser" description="Parse any User-Agent string to identify browser, operating system, device type, and rendering engine. Also shows your current browser's UA string.">
      <UserAgentClient />
    </ToolLayout>
  );
}