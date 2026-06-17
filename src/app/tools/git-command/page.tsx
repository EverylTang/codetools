import ToolLayout from "@/components/ToolLayout";
import GitCommandClient from "./client";

export const metadata = {
  title: "Git Command Builder - Online Developer Tool",
  description: "Build Git commands visually. Generate clone, commit, push, branch, merge, rebase, and more commands with options.",
  keywords: ["git command", "git builder", "git generator", "git cheat sheet", "online git tool"],
  openGraph: {
    title: "Git Command Builder - Free Online Tool",
    description: "Build Git commands visually with options. Perfect for learning Git or generating complex commands.",
    type: "website",
  },
};

export default function GitCommandPage() {
  return (
    <ToolLayout toolKey="git-command" title="Git Command Builder" description="Build Git commands visually. Select operation type, add options, and generate the command. Perfect for learning Git or generating complex commands.">
      <GitCommandClient />
    </ToolLayout>
  );
}
