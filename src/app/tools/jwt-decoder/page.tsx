import ToolLayout from "@/components/ToolLayout";
import JwtDecoderClient from "./client";

export const metadata = {
  title: "JWT Decoder - Decode JWT Tokens Online",
  description: "Decode JWT header and payload online. Inspect claims, verify structure, and debug JSON Web Tokens. All client-side, no data leaves your browser.",
  keywords: ["jwt decoder", "jwt parser", "decode jwt", "jwt token", "jwt inspector", "json web token", "JWT解析"],
  openGraph: {
    title: "JWT Decoder - Free Online JWT Token Decoder",
    description: "Decode and inspect JWT tokens in your browser. View header, payload, and signature. Perfect for debugging API authentication.",
    type: "website",
  },
};

export default function JwtDecoderPage() {
  return (
    <ToolLayout toolKey="jwt-decoder" title="JWT Decoder" description="Decode and inspect JWT tokens. Paste a JWT token to view its header and payload claims in a readable JSON tree.">
      <JwtDecoderClient />
    </ToolLayout>
  );
}