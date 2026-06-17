import ToolLayout from "@/components/ToolLayout";
import IpToolsClient from "./client";

export const metadata = {
  title: "IP Address Tools - Subnet Calculator & IP Converter",
  description: "Calculate subnet ranges, CIDR notation, and convert between IP formats. Supports IPv4 subnet calculation and IP-to-integer conversion.",
  keywords: ["ip calculator", "subnet calculator", "ip address", "cidr", "ip tools", "ip range", "ip地址", "子网计算"],
  openGraph: {
    title: "IP Address Tools - Free Online Subnet Calculator",
    description: "Calculate subnet ranges, CIDR notation, and convert between IP formats.",
    type: "website",
  },
};

export default function IpToolsPage() {
  return (
    <ToolLayout toolKey="ip-tools" title="IP Address Tools" description="Calculate subnet ranges, CIDR notation, and convert between IP formats. Supports IPv4 subnet calculation.">
      <IpToolsClient />
    </ToolLayout>
  );
}