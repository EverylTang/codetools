import ToolLayout from "@/components/ToolLayout";
import DockerCommandClient from "./client";

export const metadata = {
  title: "Docker Command Builder - Online Developer Tool",
  description: "Build Docker commands visually. Generate docker run, build, exec, and more commands with options.",
  keywords: ["docker command", "docker builder", "docker generator", "docker run", "online docker tool"],
  alternates: {
    canonical: "/tools/docker-command",
  },
  openGraph: {
    url: "/tools/docker-command",
    siteName: "CodeTools",
    title: "Docker Command Builder - Free Online Tool",
    description: "Build Docker commands visually with options.",
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
    title: "Docker Command Builder - Online Developer Tool",
    description: "Build Docker commands visually. Generate docker run, build, exec, and more commands with options.",
    images: ["/og-image.png"],
  },
};

export default function DockerCommandPage() {
  return (
    <ToolLayout toolKey="docker-command" title="Docker Command Builder" description="Build Docker commands visually. Select operation type, configure options, and generate the command.">
      <DockerCommandClient />
    </ToolLayout>
  );
}
