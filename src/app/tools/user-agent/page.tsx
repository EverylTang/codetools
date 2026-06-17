import ToolLayout from "@/components/ToolLayout";
import UserAgentClient from "./client";

export const metadata = {
  title: "User-Agent Parser - Parse User Agent Strings Online",
  description: "Parse any User-Agent string to identify browser, OS, device, engine, and more. Also shows your current browser's UA string.",
  keywords: ["user agent parser", "ua parser", "user agent analyzer", "browser detection", "parse user agent", "useragent工具", "UA解析"],
  openGraph: {
    title: "User-Agent Parser - Free Online User Agent Analyzer",
    description: "Parse User-Agent strings to identify browser, OS, device, and engine details.",
    type: "website",
  },
};

export default function UserAgentPage() {
  return (
    <ToolLayout toolKey="user-agent" title="User-Agent Parser" description="Parse any User-Agent string to identify browser, operating system, device type, and rendering engine. Also shows your current browser's UA string.">
      <UserAgentClient />
    </ToolLayout>
  );
}