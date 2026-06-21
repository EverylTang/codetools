import ToolLayout from "@/components/ToolLayout";
import IpToolsClient from "./client";

export const metadata = {
  title: "IP Address Tools - Subnet Calculator & IP Converter",
  description: "Calculate subnet ranges, CIDR notation, and convert between IP formats. Supports IPv4 subnet calculation and IP-to-integer conversion.",
  keywords: ["ip calculator", "subnet calculator", "ip address", "cidr", "ip tools", "ip range", "ip地址", "子网计算"],
  alternates: {
    canonical: "/tools/ip-tools",
  },
  openGraph: {
    url: "/tools/ip-tools",
    siteName: "CodeTools",
    title: "IP Address Tools - Free Online Subnet Calculator",
    description: "Calculate subnet ranges, CIDR notation, and convert between IP formats.",
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
    title: "IP Address Tools - Subnet Calculator & IP Converter",
    description: "Calculate subnet ranges, CIDR notation, and convert between IP formats. Supports IPv4 subnet calculation and IP-to-integer conversion.",
    images: ["/og-image.png"],
  },
};

export default function IpToolsPage() {
  return (
    <ToolLayout toolKey="ip-tools" title="IP Address Tools" description="Calculate subnet ranges, CIDR notation, and convert between IP formats. Supports IPv4 subnet calculation.">
      <IpToolsClient />
    </ToolLayout>
  );
}