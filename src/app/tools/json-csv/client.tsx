"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_JSON = `[{"name":"Alice","age":30,"city":"NYC"},{"name":"Bob","age":25,"city":"LA"},{"name":"Charlie","age":35,"city":"SF"}]`;
const DEFAULT_CSV = `name,age,city\nAlice,30,NYC\nBob,25,LA\nCharlie,35,SF`;

function jsonToCsv(json: any[]): string {
  if (!Array.isArray(json) || json.length === 0) return "";
  const keys = Object.keys(json[0]);
  const header = keys.join(",");
  const rows = json.map(item => keys.map(k => {
    const v = item[k];
    if (v === null || v === undefined) return "";
    const str = String(v);
    return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g, '""')}"` : str;
  }).join(","));
  return [header, ...rows].join("\n");
}

function csvToJson(csv: string): any[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    // Simple CSV parser (handles quoted fields)
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
}

export default function JsonCsvClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["json-csv"] || {};
  const [mode, setMode] = useState<"json2csv" | "csv2json">("json2csv");
  const [input, setInput] = useState(DEFAULT_JSON);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      if (mode === "json2csv") {
        const parsed = JSON.parse(input);
        const output = jsonToCsv(parsed);
        return { output, error: null, parsed };
      } else {
        const parsed = csvToJson(input);
        const output = JSON.stringify(parsed, null, 2);
        return { output, error: null, parsed };
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

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Mode switch */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 w-fit">
        <button
          onClick={() => { setMode("json2csv"); setInput(DEFAULT_JSON); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "json2csv" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >JSON → CSV</button>
        <button
          onClick={() => { setMode("csv2json"); setInput(DEFAULT_CSV); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "csv2json" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >CSV → JSON</button>
      </div>

      {/* Input / Output */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4 min-h-[300px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {mode === "json2csv" ? "JSON Input" : "CSV Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "json2csv" ? "Paste JSON array..." : "Paste CSV data..."}
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {mode === "json2csv" ? "CSV Output" : "JSON Output"}
            </label>
            {result.output && (
              <button onClick={handleCopy} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                {copied ? "✓" : "Copy"}
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
        <div className="flex gap-3 text-[10px] text-gray-400 dark:text-gray-500">
          <span>{mode === "json2csv" ? (
            Array.isArray(result.parsed) ? `${result.parsed.length} rows` : "Not an array"
          ) : `${result.parsed?.length || 0} rows`}</span>
          <span>·</span>
          <span>{result.output.length} chars</span>
        </div>
      )}
    </div>
  );
}