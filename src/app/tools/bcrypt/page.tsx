import ToolLayout from "@/components/ToolLayout";
import BcryptClient from "./client";

export const metadata = {
  title: "Bcrypt Hash Generator & Verifier - Online Bcrypt Tool",
  description: "Generate bcrypt password hashes and verify passwords against bcrypt hashes. Adjustable cost factor (rounds). All client-side using bcryptjs.",
  keywords: ["bcrypt", "bcrypt hash", "bcrypt generator", "bcrypt verify", "password hash", "bcrypt checker", "bcrypt加密", "密码哈希"],
  openGraph: {
    title: "Bcrypt Hash Generator & Verifier - Free Online Tool",
    description: "Generate bcrypt hashes and verify passwords. Adjustable cost factor. All client-side.",
    type: "website",
  },
};

export default function BcryptPage() {
  return (
    <ToolLayout toolKey="bcrypt" title="Bcrypt Hash & Verify" description="Generate bcrypt password hashes and verify passwords against existing bcrypt hashes. Adjustable cost factor (rounds) for security tuning.">
      <BcryptClient />
    </ToolLayout>
  );
}