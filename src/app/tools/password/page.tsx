import ToolLayout from "@/components/ToolLayout";
import PasswordClient from "./client";

export const metadata = {
  title: "Password Generator - Online Developer Tool",
  description: "Free online password generator. Create strong, secure passwords with customizable length, uppercase, lowercase, numbers, and symbols. Visual strength meter. Client-side.",
  keywords: ["password generator", "strong password", "random password", "secure password", "online password tool"],
  openGraph: {
    title: "Password Generator - Free Online Tool",
    description: "Generate strong random passwords instantly. Customizable, with strength meter. 100% client-side.",
    type: "website",
  },
};

export default function PasswordPage() {
  return (
    <ToolLayout toolKey="password" title="Password Generator" description="Create strong, random passwords with full control over length and character types. Includes a visual strength meter.">
      <PasswordClient />
    </ToolLayout>
  );
}