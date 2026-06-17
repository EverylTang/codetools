"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { diffLines, Change } from "diff";

const DEFAULT_LEFT = `function hello() {
  console.log("Hello World");
  return true;
}

const version = "1.0.0";
const author = "Alice";`;

const DEFAULT_RIGHT = `function hello() {
  console.log("Hello, World!");
  return false;
}

const version = "2.0.0";
const author = "Bob";
const license = "MIT";`;

export default function TextDiffClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["text-diff"] || {};

  const [left, setLeft] = useState(DEFAULT_LEFT);
  const [right, setRight] = useState(DEFAULT_RIGHT);
  const [viewMode, setViewMode] = useState<"unified" | "split">("split");

  const diffs = useMemo(() => {
    if (!left.trim() && !right.trim()) return [];
    return diffLines(left, right);
  }, [left, right]);

  const stats = useMemo(() => {
    let added = 0, removed = 0, unchanged = 0;
    for (const d of diffs) {
      if (d.added) added += d.count || 0;
      else if (d.removed) removed += d.count || 0;
      else unchanged += d.count || 0;
    }
    return { added, removed, unchanged };
  }, [diffs]);

  const swap = () => { setLeft(right); setRight(left); };

  const leftLabel = tk.leftText || "Left Text";
  const rightLabel = tk.rightText || "Right Text";
  const pasteLeft = tk.pasteLeft || "Paste left text...";
  const pasteRight = tk.pasteRight || "Paste right text...";
  const swapLabel = tk.swap || "Swap";
  const unifiedLabel = tk.unified || "Unified";
  const splitLabel = tk.split || "Split";
  const addedLabel = tk.added || "added";
  const removedLabel = tk.removed || "removed";
  const unchangedLabel = tk.unchanged || "unchanged";
  const noDiffLabel = tk.noDifferences || "No differences found. The two texts are identical.";

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "split" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >{splitLabel}</button>
          <button
            onClick={() => setViewMode("unified")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "unified" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >{unifiedLabel}</button>
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="text-green-600 dark:text-green-400">+{stats.added} {addedLabel}</span>
          <span className="text-red-600 dark:text-red-400">-{stats.removed} {removedLabel}</span>
          <span className="text-gray-400">{stats.unchanged} {unchangedLabel}</span>
        </div>
      </div>

      {viewMode === "split" ? (
        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-[300px]">
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{leftLabel}</label>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              placeholder={pasteLeft}
              className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              spellCheck={false}
            />
          </div>
          <div className="flex items-center justify-center">
            <button onClick={swap} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800" title={swapLabel}>⇄</button>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{rightLabel}</label>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              placeholder={pasteRight}
              className="flex-1 min-h-[200px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              spellCheck={false}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row gap-4 min-h-[300px]">
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{leftLabel}</label>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              placeholder={pasteLeft}
              className="flex-1 min-h-[100px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              spellCheck={false}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{rightLabel}</label>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              placeholder={pasteRight}
              className="flex-1 min-h-[100px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Diff view */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-auto font-mono text-xs">
          {diffs.length === 0 && left && right ? (
            <div className="p-4 text-center text-gray-400">{noDiffLabel}</div>
          ) : (
            <div className={viewMode === "unified" ? "" : "flex"}>
              <div className={`${viewMode === "split" ? "w-1/2 border-r border-gray-200 dark:border-gray-700" : "w-full"}`}>
                {diffs.map((part, i) => (
                  <div
                    key={i}
                    className={`px-3 py-0.5 whitespace-pre-wrap ${
                      part.added ? "bg-green-100 dark:bg-green-900/20" : part.removed ? "bg-red-100 dark:bg-red-900/20" : ""
                    }`}
                  >
                    {part.value.split("\n").map((line, j) => {
                      if (j === part.value.split("\n").length - 1 && line === "") return null;
                      return (
                        <div key={j} className="flex">
                          <span className="w-8 text-gray-400 shrink-0 select-none text-right mr-2">
                            {part.added ? "+" : part.removed ? "-" : " "}
                          </span>
                          <span className={part.added ? "text-green-700 dark:text-green-300" : part.removed ? "text-red-700 dark:text-red-300" : "text-gray-900 dark:text-gray-100"}>
                            {line}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {viewMode === "split" && (
                <div className="w-1/2">
                  {diffs.map((part, i) => (
                    <div
                      key={i}
                      className={`px-3 py-0.5 whitespace-pre-wrap ${part.added ? "bg-green-100 dark:bg-green-900/20" : ""}`}
                    >
                      {part.value.split("\n").map((line, j) => {
                        if (j === part.value.split("\n").length - 1 && line === "") return null;
                        return (
                          <div key={j} className="flex">
                            <span className="w-8 text-gray-400 shrink-0 select-none text-right mr-2">
                              {part.added ? "+" : " "}
                            </span>
                            <span className={part.added ? "text-green-700 dark:text-green-300" : part.removed ? "opacity-0" : "text-gray-900 dark:text-gray-100"}>
                              {part.removed ? "" : line}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}