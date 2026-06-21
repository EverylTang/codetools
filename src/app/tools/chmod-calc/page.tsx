import ToolLayout from "@/components/ToolLayout";
import ChmodCalcClient from "./client";

export const metadata = {
  title: "Chmod Calculator - Calculate Linux File Permissions",
  description: "Calculate chmod file permissions visually. Toggle read/write/execute for owner, group, and others. See octal and symbolic notation.",
  keywords: ["chmod calculator", "chmod", "file permissions", "linux permissions", "unix permissions", "chmod converter", "chmod计算器", "文件权限"],
  alternates: {
    canonical: "/tools/chmod-calc",
  },
  openGraph: {
    url: "/tools/chmod-calc",
    siteName: "CodeTools",
    title: "Chmod Calculator - Free Online File Permission Calculator",
    description: "Calculate Linux file permissions. Toggle read/write/execute and see octal and symbolic notation.",
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
    title: "Chmod Calculator - Calculate Linux File Permissions",
    description: "Calculate chmod file permissions visually. Toggle read/write/execute for owner, group, and others. See octal and symbolic notation.",
    images: ["/og-image.png"],
  },
};

export default function ChmodCalcPage() {
  return (
    <ToolLayout toolKey="chmod-calc" title="Chmod Calculator" description="Calculate Linux file permissions visually. Toggle Read/Write/Execute for Owner, Group, and Others. See octal and symbolic notation.">
      <ChmodCalcClient />
    </ToolLayout>
  );
}