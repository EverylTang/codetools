import ToolLayout from "@/components/ToolLayout";
import MarkdownPreviewClient from "./client";

export const metadata = {
  title: "Markdown Preview - Online Markdown Editor & Viewer",
  description: "Free online Markdown preview and editor. Write Markdown in a split-pane editor with real-time HTML preview. Supports headings, lists, code blocks, tables, images, links, and more via GFM (GitHub Flavored Markdown).",
  keywords: ["markdown preview", "markdown editor", "markdown viewer", "markdown to html", "md editor", "online markdown", "GFM", "GitHub Flavored Markdown"],
  alternates: {
    canonical: "/tools/markdown-preview",
  },
  openGraph: {
    url: "/tools/markdown-preview",
    siteName: "CodeTools",
    title: "Markdown Preview - Free Online Markdown Editor & Viewer",
    description: "Write Markdown with real-time preview. Supports GFM tables, code blocks, task lists, and more.",
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
    title: "Markdown Preview - Online Markdown Editor & Viewer",
    description: "Free online Markdown preview and editor. Write Markdown in a split-pane editor with real-time HTML preview. Supports headings, lists, code blocks, tables, images, links, and more via GFM (GitHub Flavored Markdown).",
    images: ["/og-image.png"],
  },
};

export default function MarkdownPreviewPage() {
  return (
    <ToolLayout toolKey="markdown-preview" title="Markdown Preview" description="Write Markdown with real-time HTML preview. Supports GitHub Flavored Markdown (GFM) including tables, code blocks with syntax highlighting, task lists, and more. All processing happens client-side.">
      <MarkdownPreviewClient />
    </ToolLayout>
  );
}