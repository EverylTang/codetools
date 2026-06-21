import ToolLayout from "@/components/ToolLayout";
import PasswordClient from "./client";

export const metadata = {
  title: "Password Generator - Online Developer Tool",
  description: "Free online password generator. Create strong, secure passwords with customizable length, uppercase, lowercase, numbers, and symbols. Visual strength meter. Client-side.",
  keywords: ["password generator", "strong password", "random password", "secure password", "online password tool"],
  alternates: {
    canonical: "/tools/password",
  },
  openGraph: {
    url: "/tools/password",
    siteName: "CodeTools",
    title: "Password Generator - Free Online Tool",
    description: "Generate strong random passwords instantly. Customizable, with strength meter. 100% client-side.",
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
    title: "Password Generator - Online Developer Tool",
    description: "Free online password generator. Create strong, secure passwords with customizable length, uppercase, lowercase, numbers, and symbols. Visual strength meter. Client-side.",
    images: ["/og-image.png"],
  },
};

export default function PasswordPage() {
  return (
    <ToolLayout toolKey="password" title="Password Generator" description="Create strong, random passwords with full control over length and character types. Includes a visual strength meter.">
      <PasswordClient />
    </ToolLayout>
  );
}