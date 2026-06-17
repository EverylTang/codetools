"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { JSONPath } from "jsonpath-plus";

const DEFAULT_JSON = `{
  "store": {
    "book": [
      { "title": "The Hobbit", "author": "Tolkien", "price": 12.99 },
      { "title": "Dune", "author": "Herbert", "price": 15.99 },
      { "title": "1984", "author": "Orwell", "price": 9.99 }
    ],
    "bicycle": { "color": "red", "price": 199.99 }
  }
}`;

const EXAMPLE_PATHS = [
  "$.store.book[*].title",
  "$.store.book[?(@.price < 15)].title",
  "$.store.book[0]",
  "$.store..price",
  "$.store.book.length",
];

export default function JsonpathTesterClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["jsonpath-tester"] || {};

  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [expression, setExpression] = useState("$.store.book[*].title");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!jsonInput.trim() || !expression.trim()) return { matches: [], error: null };
    try {
      const parsed = JSON.parse(jsonInput);
      const matches = JSONPath({ path: expression, json: parsed });
      return { matches, error: null, parsed };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [jsonInput, expression]);

  const copyResult = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result.matches, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLabel = tk.jsonInput || "JSON Input";
  const expressionLabel = tk.expression || "JSONPath Expression";
  const resultLabel = tk.result || "Result";
  const examplesLabel = tk.examples || "Examples";
  const copyLabel = tk.copy || "Copy";
  const copiedLabel = tk.copied || "Copied!";
  const noMatchLabel = tk.noMatch || "No matches found";
  const matchCountLabel = tk.matchCount || "matches";

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-[300px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{jsonLabel}</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{expressionLabel}</label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="$.store.book[*].title"
              className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              spellCheck={false}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{resultLabel}</label>
              {result.matches.length > 0 && (
                <button onClick={copyResult} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                  {copied ? copiedLabel : copyLabel}
                </button>
              )}
            </div>
            <div className="flex-1 min-h-[150px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-auto">
              {result.error ? (
                <div className="text-xs text-red-500 dark:text-red-400 font-mono">{result.error}</div>
              ) : result.matches.length === 0 ? (
                <div className="text-xs text-gray-400">{noMatchLabel}</div>
              ) : (
                <div className="space-y-1">
                  {result.matches.map((match: any, i: number) => (
                    <div key={i} className="text-sm font-mono bg-white dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-400 mr-2">[{i}]</span>
                      <span className="text-gray-900 dark:text-gray-100">{JSON.stringify(match)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {result.matches.length > 0 && (
              <div className="text-[10px] text-gray-400 mt-1">{result.matches.length} {matchCountLabel}</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] text-gray-400 mb-1 block">{examplesLabel}</label>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PATHS.map((p) => (
            <button
              key={p}
              onClick={() => setExpression(p)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${expression === p ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}