"use client";

import { useState, useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { UAParser } from "ua-parser-js";

export default function UserAgentClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["user-agent"] || {};

  const [input, setInput] = useState("");
  const [myUa, setMyUa] = useState("");

  useEffect(() => { setMyUa(navigator.userAgent); }, []);

  const result = useMemo(() => {
    if (!input) return null;
    try {
      const parser = new UAParser(input);
      return parser.getResult();
    } catch {
      return null;
    }
  }, [input]);

  const parseLabel = tk.parse || "Parse";
  const yourUaLabel = tk.yourUa || "Your User-Agent";
  const pasteUaLabel = tk.pasteUa || "Paste a User-Agent string to parse...";
  const browserLabel = tk.browser || "Browser";
  const osLabel = tk.os || "Operating System";
  const deviceLabel = tk.device || "Device";
  const engineLabel = tk.engine || "Engine";
  const cpuLabel = tk.cpu || "CPU";
  const useMyUaLabel = tk.useMyUa || "Use My UA";

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setInput(myUa)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >{useMyUaLabel}</button>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{parseLabel}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={pasteUaLabel}
          className="w-full p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-y"
          spellCheck={false}
        />
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{browserLabel}</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.browser.name || "—"}</div>
            <div className="text-xs text-gray-500">{result.browser.version || ""}</div>
          </div>
          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{osLabel}</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.os.name || "—"}</div>
            <div className="text-xs text-gray-500">{result.os.version || ""}</div>
          </div>
          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{deviceLabel}</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.device.model || result.device.type || "Desktop"}</div>
            <div className="text-xs text-gray-500">{result.device.vendor || ""}</div>
          </div>
          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{engineLabel}</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.engine.name || "—"}</div>
            <div className="text-xs text-gray-500">{result.engine.version || ""}</div>
          </div>
        </div>
      )}

      {myUa && (
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{yourUaLabel}</div>
          <code className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{myUa}</code>
        </div>
      )}
    </div>
  );
}