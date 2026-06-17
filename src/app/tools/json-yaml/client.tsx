"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import * as yaml from "js-yaml";

const DEFAULT_JSON = `{
  "name": "my-app",
  "version": "1.0.0",
  "config": {
    "port": 3000,
    "host": "0.0.0.0",
    "debug": true
  },
  "dependencies": [
    "react",
    "next",
    "tailwindcss"
  ],
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`;

const DEFAULT_YAML = `name: my-app
version: 1.0.0
config:
  port: 3000
  host: 0.0.0.0
  debug: true
dependencies:
  - react
  - next
  - tailwindcss
scripts:
  dev: next dev
  build: next build`;

export default function JsonYamlClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["json-yaml"] || {};
  const [mode, setMode] = useState<"json2yaml" | "yaml2json">("json2yaml");
  const [input, setInput] = useState(DEFAULT_JSON);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      if (mode === "json2yaml") {
        const parsed = JSON.parse(input);
        const output = yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true });
        return { output, error: null };
      } else {
        const parsed = yaml.load(input);
        const output = JSON.stringify(parsed, null, 2);
        return { output, error: null };
      }
    } catch (e: any) {
      return { output: "", error: e.message };
    }
  }, [input, mode]);

  const handleCopy = useCallback(async () => {
    if (result.output) {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result.output]);

  const copyLabel = tk.copy || "Copy";

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Mode switch */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 w-fit">
        <button
          onClick={() => { setMode("json2yaml"); setInput(DEFAULT_JSON); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "json2yaml" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{tk.jsonToYaml || "JSON → YAML"}</button>
        <button
          onClick={() => { setMode("yaml2json"); setInput(DEFAULT_YAML); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "yaml2json" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{tk.yamlToJson || "YAML → JSON"}</button>
      </div>

      {/* Input / Output */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4 min-h-[300px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {mode === "json2yaml" ? (tk.jsonInput || "JSON Input") : (tk.yamlInput || "YAML Input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "json2yaml" ? (tk.pasteJson || "Paste JSON here...") : (tk.pasteYaml || "Paste YAML here...")}
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {mode === "json2yaml" ? (tk.yamlOutput || "YAML Output") : (tk.jsonOutput || "JSON Output")}
            </label>
            {result.output && (
              <button onClick={handleCopy} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                {copied ? "✓" : copyLabel}
              </button>
            )}
          </div>
          <textarea
            value={result.output}
            readOnly
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
            spellCheck={false}
          />
          {result.error && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{result.error}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      {result.output && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500">
          {result.output.length} chars
        </div>
      )}
    </div>
  );
}