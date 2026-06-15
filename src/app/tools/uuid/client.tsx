"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Version = "v4" | "v7";

function generateUuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function generateUuidV7(): string {
  const now = Date.now();
  const hex = now.toString(16).padStart(12, "0");
  const rest = "xxxxxxxx-xxxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7${rest.slice(0, 3)}-${((Math.random() * 4 + 8) | 0).toString(16)}${rest.slice(3, 7)}-${rest.slice(7)}`;
}

export default function UuidClient() {
  const { t } = useI18n();
  const tk = t.tools.uuid;
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const fn = version === "v4" ? generateUuidV4 : generateUuidV7;
    const generated = Array.from({ length: count }, () => fn());
    setUuids(generated);
    setCopiedIndex(-1);
    setCopiedAll(false);
  };

  const copySingle = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            onClick={() => setVersion("v4")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              version === "v4"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tk.v4}
          </button>
          <button
            onClick={() => setVersion("v7")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              version === "v7"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tk.v7}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">{tk.count}:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={generate}
          className="px-4 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
        >
          {tk.generate}
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {version === "v4"
          ? (tk.v4Description || "UUID v4 is randomly generated. Suitable for most uniqueness use cases.")
          : (tk.v7Description || "UUID v7 is time-ordered. Useful for database indexes.")}
      </p>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {tk.generated || "Generated UUIDs"} ({uuids.length})
            </label>
            {uuids.length > 1 && (
              <button
                onClick={copyAll}
                className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {copiedAll ? t.common.copiedAll : tk.copyAll}
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {uuids.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 group hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100 select-all">{uuid}</code>
                <button
                  onClick={() => copySingle(uuid, i)}
                  className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  {copiedIndex === i ? "✓" : "📋"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {uuids.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🆔</div>
            <p>{tk.emptyState || "Click Generate to create UUIDs"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
