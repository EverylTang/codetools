import ToolLayout from "@/components/ToolLayout";
import TunnelConfigClient from "./client";

export const metadata = {
  title: "frp Tunnel Config Generator - Online Developer Tool",
  description: "Generate frpc.ini files for HTTP and TCP tunnels. Supports multiple tunnels, copy, and download. Runs fully in your browser.",
  keywords: ["frp config", "frpc ini", "tunnel config", "内网穿透", "frp 配置生成器"],
  openGraph: {
    title: "frp Tunnel Config Generator - CodeTools",
    description: "Build frpc.ini files for HTTP and TCP tunnels without reading the frp docs every time.",
    type: "website",
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
