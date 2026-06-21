import ToolLayout from "@/components/ToolLayout";
import SSHKeyClient from "./client";

export const metadata = {
  title: "SSH Key Generator - Online Developer Tool",
  description: "Generate SSH key pairs (Ed25519, RSA) directly in your browser. Download keys in PEM format.",
  keywords: ["ssh key generator", "ssh key pair", "ed25519", "rsa ssh", "ssh keygen", "generate ssh keys"],
  alternates: {
    canonical: "/tools/ssh-key-generator",
  },
  openGraph: {
    url: "/tools/ssh-key-generator",
    siteName: "CodeTools",
    title: "SSH Key Generator - Free Online Tool",
    description: "Generate SSH key pairs securely in your browser.",
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
    title: "SSH Key Generator - Online Developer Tool",
    description: "Generate SSH key pairs (Ed25519, RSA) directly in your browser. Download keys in PEM format.",
    images: ["/og-image.png"],
  },
};

export default function SSHKeyPage() {
  return (
    <ToolLayout toolKey="ssh-key-generator" title="SSH Key Generator" description="Generate SSH key pairs (Ed25519, RSA 4096) directly in your browser using Web Crypto API. Your keys never leave your device.">
      <SSHKeyClient />
    </ToolLayout>
  );
}
