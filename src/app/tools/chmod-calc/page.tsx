import ToolLayout from "@/components/ToolLayout";
import ChmodCalcClient from "./client";

export const metadata = {
  title: "Chmod Calculator - Calculate Linux File Permissions",
  description: "Calculate chmod file permissions visually. Toggle read/write/execute for owner, group, and others. See octal and symbolic notation.",
  keywords: ["chmod calculator", "chmod", "file permissions", "linux permissions", "unix permissions", "chmod converter", "chmod计算器", "文件权限"],
  openGraph: {
    title: "Chmod Calculator - Free Online File Permission Calculator",
    description: "Calculate Linux file permissions. Toggle read/write/execute and see octal and symbolic notation.",
    type: "website",
  },
};

export default function ChmodCalcPage() {
  return (
    <ToolLayout toolKey="chmod-calc" title="Chmod Calculator" description="Calculate Linux file permissions visually. Toggle Read/Write/Execute for Owner, Group, and Others. See octal and symbolic notation.">
      <ChmodCalcClient />
    </ToolLayout>
  );
}