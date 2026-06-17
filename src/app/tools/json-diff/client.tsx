"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_LEFT = `{"name":"Alice","age":30,"address":{"city":"NYC","zip":"10001"},"tags":["admin","user"]}`;
const DEFAULT_RIGHT = `{"name":"Alice","age":31,"address":{"city":"LA","zip":"90001"},"tags":["admin","moderator"]}`;

type DiffResult = { key: string; type: "same" | "added" | "removed" | "changed"; left?: any; right?: any };

function deepDiff(obj1: any, obj2: any, prefix = ""): DiffResult[] {
  const results: DiffResult[] = [];
  const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
  for (const key of keys) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const v1 = obj1?.[key];
    const v2 = obj2?.[key];
    if (typeof v1 === "object" && v1 !== null && typeof v2 === "object" && v2 !== null && !Array.isArray(v1) && !Array.isArray(v2)) {
      results.push(...deepDiff(v1, v2, fullKey));
    } else if (JSON.stringify(v1) === JSON.stringify(v2)) {
      results.push({ key: fullKey, type: "same", left: v1, right: v2 });
    } else if (v1 === undefined) {
      results.push({ key: fullKey, type: "added", right: v2 });
    } else if (v2 === undefined) {
      results.push({ key: fullKey, type: "removed", left: v1 });
    } else {
      results.push({ key: fullKey, type: "changed", left: v1, right: v2 });
    }
  }
  return results;
}

export default function JsonDiffClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["json-diff"] || {};
  const [left, setLeft] = useState(DEFAULT_LEFT);
  const [right, setRight] = useState(DEFAULT_RIGHT);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const parsed = useMemo(() => {
    try {
      const l = JSON.parse(left);
      const r = JSON.parse(right);
      return { left: l, right: r, error: null };
    } catch (e: any) {
      return { left: null, right: null, error: e.message };
    }
  }, [left, right]);

  const diffs = useMemo(() => {
    if (!parsed.left || !parsed.right) return [];
    return deepDiff(parsed.left, parsed.right);
  }, [parsed.left, parsed.right]);

  const swap = useCallback(() => {
    setLeft(right);
    setRight(left);
  }, [left, right]);

  const stats = useMemo(() => {
    const same = diffs.filter(d => d.type === "same").length;
    const added = diffs.filter(d => d.type === "added").length;
    const removed = diffs.filter(d => d.type === "removed").length;
    const changed = diffs.filter(d => d.type === "changed").length;
    return { same, added, removed, changed };
  }, [diffs]);

  const labelSame = tk.same || "same";
  const labelChanged = tk.changed || "changed";
  const labelAdded = tk.added || "added";
  const labelRemoved = tk.removed || "removed";

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Input area */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.leftJson || "Left JSON"}</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder={tk.pasteLeft || "Paste left JSON..."}
            className="flex-1 min-h-[180px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={swap}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title={tk.swap || "Swap"}
          >
            ⇄
          </button>
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.rightJson || "Right JSON"}</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder={tk.pasteRight || "Paste right JSON..."}
            className="flex-1 min-h-[180px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {parsed.error && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-red-600 dark:text-red-400 font-mono">{parsed.error}</p>
        </div>
      )}

      {/* Stats */}
      {diffs.length > 0 && (
        <div className="flex gap-3 text-xs">
          <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">{stats.same} {labelSame}</span>
          <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">{stats.changed} {labelChanged}</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">{stats.added} {labelAdded}</span>
          <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">{stats.removed} {labelRemoved}</span>
        </div>
      )}

      {/* Diff table */}
      {diffs.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-0 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-4">Key</div>
            <div className="col-span-4">Left</div>
            <div className="col-span-4">Right</div>
          </div>
          <div className="max-h-[400px] overflow-auto">
            {diffs.map((d) => (
              <div
                key={d.key}
                className={`grid grid-cols-12 gap-0 text-xs font-mono px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 ${
                  d.type === "added" ? "bg-blue-50 dark:bg-blue-900/10" :
                  d.type === "removed" ? "bg-orange-50 dark:bg-orange-900/10" :
                  d.type === "changed" ? "bg-red-50 dark:bg-red-900/10" : ""
                }`}
              >
                <div className="col-span-4 text-gray-600 dark:text-gray-400 truncate">{d.key}</div>
                <div className={`col-span-4 truncate ${d.type === "removed" ? "text-red-500 line-through" : d.type === "changed" ? "text-red-500" : "text-gray-500"}`}>
                  {d.left !== undefined ? JSON.stringify(d.left) : "-"}
                </div>
                <div className={`col-span-4 truncate ${d.type === "added" ? "text-blue-500" : d.type === "changed" ? "text-green-500" : "text-gray-500"}`}>
                  {d.right !== undefined ? JSON.stringify(d.right) : "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}