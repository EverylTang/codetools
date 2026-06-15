"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const PRESET_PATTERNS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g", text: "Contact: john@example.com or support@test.org" },
  { label: "URL", pattern: "https?://[\\w.-]+(:\\d+)?(/[\\w./%-]*)?", flags: "g", text: "Visit https://example.com/path?q=1 or http://test.io" },
  { label: "Phone CN", pattern: "1[3-9]\\d{9}", flags: "g", text: "Phone: 13800138000, 15912345678" },
  { label: "Chinese", pattern: "[\\u4e00-\\u9fff]+", flags: "g", text: "Hello 你好 World 世界！测试中文提取。" },
  { label: "IP Address", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", flags: "g", text: "Server: 192.168.1.1, Gateway: 10.0.0.1" },
  { label: "Date", pattern: "\\d{4}[-/]\\d{2}[-/]\\d{2}", flags: "g", text: "Dates: 2026-06-16, 2024/12/25" },
  { label: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", flags: "g", text: "Colors: #ff0000, #abc, 336699" },
];

// JS regex literal shortcuts
const QUICK_REF = [
  { syntax: ".", desc: "Any character except newline" },
  { syntax: "\\d", desc: "Digit [0-9]" },
  { syntax: "\\w", desc: "Word char [a-zA-Z0-9_]" },
  { syntax: "\\s", desc: "Whitespace" },
  { syntax: "*", desc: "Zero or more" },
  { syntax: "+", desc: "One or more" },
  { syntax: "?", desc: "Zero or one (optional)" },
  { syntax: "{n,m}", desc: "Between n and m" },
  { syntax: "[abc]", desc: "Any of a, b, or c" },
  { syntax: "(x|y)", desc: "Either x or y" },
  { syntax: "^", desc: "Start of string" },
  { syntax: "$", desc: "End of string" },
];

export default function RegexTesterClient() {
  const { t } = useI18n();
  const tk = t.tools["regex-tester"];
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("Contact: john@example.com or support@test.org");

  const result = useMemo(() => {
    if (!pattern.trim()) return { matches: [], error: null, textParts: [{ text: testText, match: false }] };
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { value: string; index: number; groups?: string[] }[] = [];
      let m;
      
      if (flags.includes("g")) {
        while ((m = regex.exec(testText)) !== null) {
          matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testText);
        if (m) matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
      }

      // Build highlighted text parts
      if (matches.length === 0) {
        return { matches, error: null, textParts: [{ text: testText, match: false }] };
      }

      const textParts: { text: string; match: boolean }[] = [];
      let lastIndex = 0;
      
      for (const match of matches) {
        if (match.index > lastIndex) {
          textParts.push({ text: testText.slice(lastIndex, match.index), match: false });
        }
        textParts.push({ text: match.value, match: true });
        lastIndex = match.index + match.value.length;
      }
      if (lastIndex < testText.length) {
        textParts.push({ text: testText.slice(lastIndex), match: false });
      }

      return { matches, error: null, textParts };
    } catch (e: any) {
      return { matches: [], error: e.message, textParts: [{ text: testText, match: false }] };
    }
  }, [pattern, flags, testText]);

  const handlePreset = (p: typeof PRESET_PATTERNS[0]) => {
    setPattern(p.pattern);
    setFlags(p.flags);
    setTestText(p.text);
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_PATTERNS.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p)}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Pattern + Flags */}
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.pattern}</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={tk.patternPlaceholder || "Enter regex pattern..."}
            className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
        <div className="w-24">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.flags}</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            placeholder="gimsu"
            maxLength={6}
            className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Test Text */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.testText}</label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder={tk.testTextPlaceholder || "Enter text to test against..."}
          className="flex-1 min-h-[120px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Matches Info */}
      {result.error ? (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-red-600 dark:text-red-400 font-mono">{result.error}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{result.matches.length} {tk.matches}</span>
          {result.matches.length > 0 && (
            <>
              <span>·</span>
              <span>
                {result.matches.slice(0, 5).map((m, i) => (
                  <span key={i} className="inline-block mr-2">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                      &ldquo;{m.value.length > 20 ? m.value.slice(0, 20) + "..." : m.value}&rdquo;
                    </code>
                    @{tk.position || "pos"} {m.index}
                  </span>
                ))}
                {result.matches.length > 5 && <span>+{result.matches.length - 5} {tk.more || "more"}</span>}
              </span>
            </>
          )}
        </div>
      )}

      {/* Highlighted Text */}
      <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[80px]">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.highlighted}</label>
        <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
          {result.textParts.map((part, i) =>
            part.match ? (
              <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-gray-100 rounded-sm px-0.5">
                {part.text}
              </mark>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <details className="group">
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none">
          {tk.quickReference}
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {QUICK_REF.map((item) => (
            <button
              key={item.syntax}
              onClick={() => {/* just reference */}}
              className="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 text-left"
            >
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400 min-w-[40px]">{item.syntax}</code>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.desc}</span>
            </button>
          ))}
        </div>
      </details>

      {/* Error State */}
      {!pattern && (
        <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
          {tk.emptyState || "Enter a pattern and text to test regex matching"}
        </div>
      )}
    </div>
  );
}
