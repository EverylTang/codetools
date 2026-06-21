import ToolLayout from "@/components/ToolLayout";
import BcryptClient from "./client";

export const metadata = {
  title: "Bcrypt Hash Generator & Verifier - Online Bcrypt Tool",
  description: "Generate bcrypt password hashes and verify passwords against bcrypt hashes. Adjustable cost factor (rounds). All client-side using bcryptjs.",
  keywords: ["bcrypt", "bcrypt hash", "bcrypt generator", "bcrypt verify", "password hash", "bcrypt checker", "bcrypt加密", "密码哈希"],
  alternates: {
    canonical: "/tools/bcrypt",
  },
  openGraph: {
    url: "/tools/bcrypt",
    siteName: "CodeTools",
    title: "Bcrypt Hash Generator & Verifier - Free Online Tool",
    description: "Generate bcrypt hashes and verify passwords. Adjustable cost factor. All client-side.",
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
    title: "Bcrypt Hash Generator & Verifier - Online Bcrypt Tool",
    description: "Generate bcrypt password hashes and verify passwords against bcrypt hashes. Adjustable cost factor (rounds). All client-side using bcryptjs.",
    images: ["/og-image.png"],
  },
};

export default function BcryptPage() {
  return (
    <ToolLayout toolKey="bcrypt" title="Bcrypt Hash & Verify" description="Generate bcrypt password hashes and verify passwords against existing bcrypt hashes. Adjustable cost factor (rounds) for security tuning.">
      <BcryptClient />
    </ToolLayout>
  );
}