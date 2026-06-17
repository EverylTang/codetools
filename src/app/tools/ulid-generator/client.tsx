"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ulid, monotonicFactory } from "ulid";

const ulidMonotonic = monotonicFactory();

export default function UlidGeneratorClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["ulid-generator"] || {};
  const [count, setCount] = useState(1);
  const [ulids, setUlids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"standard" | "monotonic">("standard");

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
      results.push(mode === "monotonic" ? ulidMonotonic() : ulid());
    }
    setUlids(results);
  }, [count, mode]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(ulids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOne = async (text: string, i: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Decode a ULID to show its timestamp
  const decodeUlid = (id: string) => {
    try {
      const CrockfordBase32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
      let timestamp = 0;
      for (let i = 0; i < 10; i++) {
        timestamp = timestamp * 32 + CrockfordBase32.indexOf(id[i]);
      }
      return new Date(timestamp).toISOString();
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-gray-500 dark:text-gray-400">Count</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            {[1, 5, 10, 20, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            onClick={() => setMode("standard")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "standard" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >Standard</button>
          <button
            onClick={() => setMode("monotonic")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "monotonic" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >Monotonic</button>
        </div>
        <button
          onClick={generate}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >Generate</button>
        {ulids.length > 0 && (
          <button onClick={copyAll} className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {copied ? "✓" : "Copy All"}
          </button>
        )}
      </div>

      {/* Generated ULIDs */}
      {ulids.length > 0 ? (
        <div className="space-y-1.5">
          {ulids.map((id, i) => {
            const timestamp = decodeUlid(id);
            return (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <span className="text-[10px] text-gray-400 w-8">{i + 1}.</span>
                <code className="flex-1 text-sm font-mono text-gray-900 dark:text-gray-100">{id}</code>
                {timestamp && (
                  <span className="text-[10px] text-gray-400 hidden sm:inline">{timestamp}</span>
                )}
                <button
                  onClick={() => copyOne(id, i)}
                  className="px-2 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {copiedIndex === i ? "✓" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          Click Generate to create ULIDs
        </div>
      )}

      {/* Info */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 space-y-1">
        <p><strong>ULID</strong> = 26-char, Crockford Base32 encoded, 128-bit. 10 chars timestamp + 16 chars randomness.</p>
        <p><strong>Standard</strong>: Fully random suffix. <strong>Monotonic</strong>: Incrementing suffix within the same millisecond (better for DB indexes).</p>
        <p>Comparison: UUID v4: 36 chars · UUID v7: 36 chars · ULID: 26 chars. ULID is URL-safe and case-insensitive.</p>
      </div>
    </div>
  );
}