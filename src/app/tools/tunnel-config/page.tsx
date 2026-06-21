import ToolLayout from "@/components/ToolLayout";
import TunnelConfigClient from "./client";

export const metadata = {
  title: "frp Tunnel Config Generator - Online Developer Tool",
  description: "Generate frpc.ini files for HTTP and TCP tunnels. Supports multiple tunnels, copy, and download. Runs fully in your browser.",
  keywords: ["frp config", "frpc ini", "tunnel config", "内网穿透", "frp 配置生成器"],
  alternates: {
    canonical: "/tools/tunnel-config",
  },
  openGraph: {
    url: "/tools/tunnel-config",
    siteName: "CodeTools",
    title: "frp Tunnel Config Generator - CodeTools",
    description: "Build frpc.ini files for HTTP and TCP tunnels without reading the frp docs every time.",
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
    title: "frp Tunnel Config Generator - Online Developer Tool",
    description: "Generate frpc.ini files for HTTP and TCP tunnels. Supports multiple tunnels, copy, and download. Runs fully in your browser.",
    images: ["/og-image.png"],
  },
};

export default function TunnelConfigPage() {
  return (
    <ToolLayout
      toolKey="tunnel-config"
      title="frp Tunnel Config Generator"
      description="Generate frpc.ini files for HTTP and TCP tunnels. Copy the config or download it as a file."
    >
      <TunnelConfigClient />
    </ToolLayout>
  );
}
