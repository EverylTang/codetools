"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { format } from "sql-formatter";

const DIALECTS = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "tsql", label: "T-SQL" },
  { value: "plsql", label: "PL/SQL" },
  { value: "redshift", label: "Redshift" },
];

const DEFAULT_SQL = `SELECT u.id, u.name, u.email, o.order_date, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.total > 100 ORDER BY o.order_date DESC LIMIT 50;`;

export default function SqlFormatterClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["sql-formatter"] || {};
  const [input, setInput] = useState(DEFAULT_SQL);
  const [dialect, setDialect] = useState("sql");
  const [tabWidth, setTabWidth] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [linesBetween, setLinesBetween] = useState(1);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      const output = format(input, {
        language: dialect as any,
        tabWidth,
        keywordCase: uppercase ? "upper" : "lower",
        linesBetweenQueries: linesBetween,
      });
      return { output, error: null };
    } catch (e: any) {
      return { output: "", error: e.message };
    }
  }, [input, dialect, tabWidth, uppercase, linesBetween]);

  const handleCopy = useCallback(async () => {
    if (result.output) {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result.output]);

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-gray-500 dark:text-gray-400">Dialect</label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            {DIALECTS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-gray-500 dark:text-gray-400">Indent</label>
          <select
            value={tabWidth}
            onChange={(e) => setTabWidth(Number(e.target.value))}
            className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            {[2, 4, 8].map(n => (
              <option key={n} value={n}>{n} spaces</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded"
          />
          Uppercase keywords
        </label>
        <label className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={linesBetween > 0}
            onChange={(e) => setLinesBetween(e.target.checked ? 1 : 0)}
            className="rounded"
          />
          Lines between queries
        </label>
      </div>

      {/* Input / Output */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4 min-h-[300px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SQL Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL here..."
            className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Formatted SQL</label>
            <div className="flex gap-1">
              <button
                onClick={handleCopy}
                disabled={!result.output}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {copied ? "✓" : "Copy"}
              </button>
              <button
                onClick={() => setInput("")}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
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
    </div>
  );
}