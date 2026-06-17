"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?><root><person id="1"><name>Alice</name><email>alice@example.com</email><tags><tag>admin</tag><tag>user</tag></tags></person><person id="2"><name>Bob</name><email>bob@example.com</email></person></root>`;

function formatXml(xml: string, indent: number): string {
  let formatted = "";
  let pad = 0;
  const indentStr = " ".repeat(indent);

  // Remove whitespace between tags
  xml = xml.replace(/>\s*</g, "><");
  // Tokenize
  const tokens = xml.split(/(<[^>]+>)/g).filter(Boolean);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith("<?") || token.startsWith("<!")) {
      // Processing instruction / doctype
      formatted += indentStr.repeat(pad) + token + "\n";
    } else if (token.startsWith("</")) {
      // Closing tag
      pad = Math.max(0, pad - 1);
      formatted += indentStr.repeat(pad) + token + "\n";
    } else if (token.startsWith("<")) {
      // Opening tag
      const isSelfClosing = token.endsWith("/>");
      formatted += indentStr.repeat(pad) + token + "\n";
      if (!isSelfClosing) {
        pad++;
      }
    } else {
      // Text content
      const trimmed = token.trim();
      if (trimmed) {
        formatted += indentStr.repeat(pad) + trimmed + "\n";
      }
    }
  }

  return formatted.trim();
}

function compressXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
}

function validateXml(xml: string): { valid: boolean; error: string | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      return { valid: false, error: parseError.textContent || "Invalid XML" };
    }
    return { valid: true, error: null };
  } catch (e: any) {
    return { valid: false, error: e.message };
  }
}

export default function XmlFormatterClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["xml-formatter"] || {};
  const [input, setInput] = useState(DEFAULT_XML);
  const [view, setView] = useState<"formatted" | "minified">("formatted");
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => {
    if (!input.trim()) return { valid: true, error: null };
    return validateXml(input);
  }, [input]);

  const result = useMemo(() => {
    if (!input.trim()) return "";
    try {
      if (view === "formatted") {
        return formatXml(input, indentSize);
      } else {
        return compressXml(input);
      }
    } catch {
      return "";
    }
  }, [input, view, indentSize]);

  const handleCopy = useCallback(async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            onClick={() => setView("formatted")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === "formatted" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >Format</button>
          <button
            onClick={() => setView("minified")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === "minified" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >Compress</button>
        </div>

        <div className="flex items-center gap-2">
          {view === "formatted" && (
            <div className="flex items-center gap-1.5">
              <label className="text-[10px] text-gray-500 dark:text-gray-400">Indent</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              >
                {[2, 4, 8].map(n => (
                  <option key={n} value={n}>{n} spaces</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleCopy}
            disabled={!result}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button
            onClick={() => setInput("")}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >Clear</button>
        </div>
      </div>

      {/* Validation status */}
      {input.trim() && (
        <div className={`text-[10px] font-medium px-2 py-1 rounded w-fit ${validation.valid ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
          {validation.valid ? "✓ Valid XML" : "✗ Invalid XML"}
        </div>
      )}

      {/* Input / Output */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4 min-h-[300px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">XML Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your XML here..."
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {view === "formatted" ? "Formatted XML" : "Compressed XML"}
          </label>
          <textarea
            value={result}
            readOnly
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
            spellCheck={false}
          />
          {validation.error && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{validation.error}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      {input.trim() && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500 flex gap-3">
          <span>{input.length} chars input</span>
          <span>·</span>
          <span>{result.length} chars output</span>
        </div>
      )}
    </div>
  );
}