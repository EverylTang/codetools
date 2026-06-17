"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_TEXT = "hello world example";

type CaseStyle = {
  key: string;
  label: string;
  example: string;
  fn: (words: string[]) => string;
};

const CASE_STYLES: CaseStyle[] = [
  { key: "camel", label: "camelCase", example: "helloWorld", fn: (w) => w[0].toLowerCase() + w.slice(1).map((s, i) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join("") },
  { key: "pascal", label: "PascalCase", example: "HelloWorld", fn: (w) => w.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join("") },
  { key: "snake", label: "snake_case", example: "hello_world", fn: (w) => w.join("_").toLowerCase() },
  { key: "screaming_snake", label: "CONSTANT_CASE", example: "HELLO_WORLD", fn: (w) => w.join("_").toUpperCase() },
  { key: "kebab", label: "kebab-case", example: "hello-world", fn: (w) => w.join("-").toLowerCase() },
  { key: "screaming_kebab", label: "SCREAMING-KEBAB", example: "HELLO-WORLD", fn: (w) => w.join("-").toUpperCase() },
  { key: "dot", label: "dot.case", example: "hello.world", fn: (w) => w.join(".").toLowerCase() },
  { key: "train", label: "Train-Case", example: "Hello-World", fn: (w) => w.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("-") },
  { key: "title", label: "Title Case", example: "Hello World", fn: (w) => w.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") },
  { key: "lower", label: "lower case", example: "hello world", fn: (w) => w.join(" ").toLowerCase() },
  { key: "upper", label: "UPPER CASE", example: "HELLO WORLD", fn: (w) => w.join(" ").toUpperCase() },
  { key: "sentence", label: "Sentence case", example: "Hello world", fn: (w) => w[0].charAt(0).toUpperCase() + w[0].slice(1).toLowerCase() + " " + w.slice(1).join(" ").toLowerCase() },
  { key: "path", label: "path/case", example: "hello/world", fn: (w) => w.join("/").toLowerCase() },
];

function splitWords(text: string): string[] {
  // Handle camelCase, PascalCase, snake_case, kebab-case, etc.
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export default function CaseConverterClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["case-converter"] || {};
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const words = useMemo(() => splitWords(input), [input]);

  const results = useMemo(() => {
    if (words.length === 0) return {};
    const r: Record<string, string> = {};
    for (const style of CASE_STYLES) {
      r[style.key] = style.fn(words);
    }
    return r;
  }, [words]);

  const copyResult = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Input */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Input Text</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          className="p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CASE_STYLES.map((style) => (
          <div
            key={style.key}
            className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-gray-400 dark:text-gray-500">{style.label}</div>
              <div className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                {results[style.key] || "—"}
              </div>
            </div>
            <button
              onClick={() => copyResult(style.key, results[style.key] || "")}
              disabled={!results[style.key]}
              className="ml-2 text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 flex-shrink-0"
            >
              {copied[style.key] ? "✓" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}