"use client";

import { useState, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_MD = `# Hello Markdown! 🎉

## Text Formatting

**Bold text**, *italic text*, ~~strikethrough~~, \`inline code\`

## Code Block

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Table

| Feature | Status | Version |
|---------|--------|---------|
| Headings | ✅ | 1.0 |
| Lists | ✅ | 1.0 |
| Code Blocks | ✅ | 1.0 |
| Tables | ✅ | 1.0 |
| Task Lists | ✅ | 1.0 |

## Task List

- [x] Create project structure
- [x] Implement core features
- [ ] Add authentication
- [ ] Write documentation
- [ ] Deploy to production

## Blockquote

> Markdown is a lightweight markup language for creating formatted text.
> — John Gruber

## Links & Images

Visit [GitHub](https://github.com)

## Lists

### Ordered
1. First item
2. Second item
3. Third item

### Unordered
- Item A
- Item B
- Item C
`;

export default function MarkdownPreviewClient() {
  const { t } = useI18n();
  const tk = t.tools["markdown-preview"];
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [wordWrap, setWordWrap] = useState(true);
  const [syncing, setSyncing] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInput = (val: string) => {
    setMarkdown(val);
  };

  const scrollSync = () => {
    if (!syncing) return;
  };

  const wordCount = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const chars = markdown.length;
    const lines = markdown.split("\n").length;
    return { words, chars, lines };
  }, [markdown]);

  return (
    <div className="flex flex-col flex-1 gap-0 -mx-4 sm:mx-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{wordCount.chars} {tk.chars || "chars"}</span>
          <span>·</span>
          <span>{wordCount.words} {tk.words || "words"}</span>
          <span>·</span>
          <span>{wordCount.lines} {tk.lines || "lines"}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={syncing}
              onChange={(e) => setSyncing(e.target.checked)}
              className="rounded border-gray-300"
            />
            {tk.syncScroll}
          </label>
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              wordWrap
                ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400"
            }`}
          >
            {wordWrap ? tk.wrap : tk.noWrap}
          </button>
          <button
            onClick={() => setMarkdown(DEFAULT_MD)}
            className="px-2 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {tk.reset}
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 min-h-[400px] flex-col sm:flex-row">
        {/* Editor */}
        <div className="flex-1 border-r-0 sm:border-r border-gray-200 dark:border-gray-700">
          <div className="text-[10px] text-gray-400 dark:text-gray-500 px-4 py-1 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
            {tk.markdown}
          </div>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => handleInput(e.target.value)}
            onScroll={scrollSync}
            className="w-full h-full min-h-[300px] p-4 text-sm font-mono border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
            style={{ overflow: "auto", whiteSpace: wordWrap ? "pre-wrap" : "pre", wordBreak: wordWrap ? "break-word" : "normal" }}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="flex-1">
          <div className="text-[10px] text-gray-400 dark:text-gray-500 px-4 py-1 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
            {tk.preview}
          </div>
          <div
            ref={previewRef}
            onScroll={scrollSync}
            className="h-full min-h-[300px] p-4 overflow-auto bg-white dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-green-400"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
