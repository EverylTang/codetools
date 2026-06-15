"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_JSON = `{
  "name": "JSON2Code",
  "version": "1.0.0",
  "description": "A powerful JSON to code converter",
  "features": [
    "format",
    "validate",
    "compress"
  ],
  "config": {
    "theme": "dark",
    "language": "typescript",
    "options": {
      "nullable": true,
      "useType": false
    }
  },
  "users": 10000
}`;

export default function JsonFormatterClient() {
  const { t } = useI18n();
  const tk = t.tools["json-formatter"];

  const [input, setInput] = useState(DEFAULT_JSON);
  const [view, setView] = useState<"formatted" | "minified" | "tree">("formatted");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { formatted: "", minified: "", error: null, valid: false, parsed: null };

    try {
      const parsed = JSON.parse(input);

      const formatted = JSON.stringify(parsed, null, 2);
      const minified = JSON.stringify(parsed);

      return { formatted, minified, error: null, valid: true, parsed };
    } catch (e: any) {
      // Parse error with position info
      const msg = e.message || "Invalid JSON";
      let line: number | null = null;
      let column: number | null = null;

      const posMatch = msg.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const lines = input.substring(0, pos).split("\n");
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }

      const lineColMatch = msg.match(/line (\d+) column (\d+)/);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1]);
        column = parseInt(lineColMatch[2]);
      }

      return { formatted: "", minified: "", error: { message: msg, line, column }, valid: false, parsed: null };
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    const text = view === "minified" ? result.minified : result.formatted;
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [view, result]);

  const formatJson = () => {
    if (result.valid) setInput(result.formatted);
  };

  const compressJson = () => {
    if (result.valid) setInput(result.minified);
  };

  // Build tree view from parsed JSON
  const TreeView = ({ data, depth = 0 }: { data: any; depth?: number }) => {
    const indent = "  ".repeat(depth);
    if (data === null) return <span className="text-gray-400">null</span>;
    if (typeof data === "string") return <span className="text-green-600 dark:text-green-400">&quot;{data}&quot;</span>;
    if (typeof data === "number") return <span className="text-blue-600 dark:text-blue-400">{data}</span>;
    if (typeof data === "boolean") return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>;
    if (Array.isArray(data)) {
      if (data.length === 0) return <span className="text-gray-400">[]</span>;
      return (
        <div>
          <span className="text-gray-500">[</span>
          {data.map((item, i) => (
            <div key={i} className={`ml-4 ${i < data.length - 1 ? "" : ""}`}>
              <span className="text-gray-400">{indent}  </span>
              <TreeView data={item} depth={depth + 1} />
              {i < data.length - 1 && <span className="text-gray-500">,</span>}
            </div>
          ))}
          <div><span className="text-gray-500">{indent}]</span></div>
        </div>
      );
    }
    if (typeof data === "object") {
      const keys = Object.keys(data);
      if (keys.length === 0) return <span className="text-gray-400">{'{}'}</span>;
      return (
        <div>
          <span className="text-gray-500">{'{'}</span>
          {keys.map((key, i) => (
            <div key={key} className="ml-4">
              <span className="text-red-600 dark:text-red-400">&quot;{key}&quot;</span>
              <span className="text-gray-500">: </span>
              <TreeView data={data[key]} depth={depth + 1} />
              {i < keys.length - 1 && <span className="text-gray-500">,</span>}
            </div>
          ))}
          <div><span className="text-gray-500">{indent}{'}'}</span></div>
        </div>
      );
    }
    return <span>{String(data)}</span>;
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            onClick={() => setView("formatted")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "formatted"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tk.format}
          </button>
          <button
            onClick={() => setView("minified")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "minified"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tk.compress}
          </button>
          <button
            onClick={() => setView("tree")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "tree"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tk.treeView}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={formatJson}
            disabled={!result.valid}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {tk.format}
          </button>
          <button
            onClick={compressJson}
            disabled={!result.valid}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {tk.compress}
          </button>
          <button
            onClick={() => setInput("")}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t.clear}
          </button>
        </div>
      </div>

      {/* Input/Output split */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4 min-h-[300px]">
        {/* Input */}
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.input}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tk.pasteHere}
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.output}</label>
            <div className="flex items-center gap-1">
              {/* Validation status */}
              {input.trim() && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  result.valid ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}>
	                  {result.valid ? tk.validJson : tk.invalidJson}
                </span>
              )}
              {result.formatted && (
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
	                  {copied ? "✓" : tk.copy}
                </button>
              )}
            </div>
          </div>

          {view === "tree" && result.valid ? (
            <div className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 overflow-auto">
              <TreeView data={result.parsed} />
            </div>
          ) : (
            <textarea
              value={view === "minified" ? result.minified : result.formatted}
              readOnly
	              placeholder={`${tk.output}...`}
              className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
              spellCheck={false}
            />
          )}

          {/* Error display */}
          {result.error && (
            <div className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-2">
              <span>{result.error.message}</span>
              {result.error.line && (
                <span className="text-red-400">
	                  · {t.line} {result.error.line}, {t.column} {result.error.column}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick examples */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
	          {t.common.quickExamples}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Simple", value: '{"name":"test","value":42}' },
            { label: "Nested", value: '{"user":{"name":"Alice","address":{"city":"NYC","zip":"10001"},"tags":["admin","user"]}}' },
            { label: "Array", value: '[{"id":1,"name":"A"},{"id":2,"name":"B"},{"id":3,"name":"C"}]' },
            { label: "Empty", value: "{}" },
          ].map((ex) => (
            <button
              key={ex.label}
              onClick={() => setInput(ex.value)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {input.trim() && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500 flex gap-3">
          <span>{input.length} chars input</span>
          <span>·</span>
          <span>{result.formatted.length} chars formatted</span>
          <span>·</span>
          <span>{result.minified.length} chars minified</span>
          {result.valid && result.parsed && (
            <>
              <span>·</span>
              <span>Compression: {Math.round((1 - result.minified.length / result.formatted.length) * 100)}%</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
