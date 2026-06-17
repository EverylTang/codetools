"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_TEXT = `<div class="container">
  <h1>Hello & Welcome!</h1>
  <p>This is a "test" with 'quotes' & special chars</p>
</div>`;

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
  "¢": "&cent;",
  "£": "&pound;",
  "¥": "&yen;",
  "€": "&euro;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "♠": "&spades;",
  "♣": "&clubs;",
  "♥": "&hearts;",
  "♦": "&diams;",
};

const DECODE_MAP: Record<string, string> = {};
for (const [char, entity] of Object.entries(HTML_ENTITIES)) {
  DECODE_MAP[entity] = char;
}

function encodeHtml(text: string): string {
  let result = text;
  for (const [char, entity] of Object.entries(HTML_ENTITIES)) {
    result = result.split(char).join(entity);
  }
  return result;
}

function decodeHtml(text: string): string {
  let result = text;
  for (const [entity, char] of Object.entries(DECODE_MAP)) {
    result = result.split(entity).join(char);
  }
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const textarea = document.createElement("textarea");
  textarea.innerHTML = result;
  return textarea.value;
}

export default function HtmlEntitiesClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["html-entities"] || {};
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeHtml(input) : decodeHtml(input);
    } catch {
      return "";
    }
  }, [input, mode]);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const copyLabel = tk.copy || "Copy";
  const encodeLabel = tk.encode || "Encode";
  const decodeLabel = tk.decode || "Decode";

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Mode switch */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 w-fit">
        <button
          onClick={() => { setMode("encode"); setInput(DEFAULT_TEXT); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "encode" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{encodeLabel}</button>
        <button
          onClick={() => { setMode("decode"); setInput(encodeHtml(DEFAULT_TEXT)); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "decode" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{decodeLabel}</button>
      </div>

      {/* Input / Output */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4 min-h-[300px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {mode === "encode" ? (tk.textInput || "Text Input") : (tk.htmlEntitiesInput || "HTML Entities Input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? (tk.pasteHtml || "Paste HTML or text...") : (tk.pasteEntities || "Paste HTML entities...")}
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {mode === "encode" ? (tk.htmlEntitiesOutput || "HTML Entities") : (tk.textOutput || "Decoded Text")}
            </label>
            {output && (
              <button onClick={handleCopy} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                {copied ? "✓" : copyLabel}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Common entities reference */}
      <details className="group">
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none">
          Common HTML Entities Reference
        </summary>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 mt-2">
          {Object.entries(HTML_ENTITIES).map(([char, entity]) => (
            <div key={char} className="flex items-center gap-2 p-1.5 rounded text-xs font-mono border border-gray-100 dark:border-gray-800">
              <span className="text-gray-700 dark:text-gray-300 w-6 text-center">{char}</span>
              <span className="text-gray-400">{entity}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}