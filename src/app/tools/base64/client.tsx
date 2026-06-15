"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Mode = "encode" | "decode";

export default function Base64Client() {
  const { t } = useI18n();
  const tk = t.tools.base64;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const process = (val: string, m: Mode) => {
    setError("");
    if (!val) { setOutput(""); return; }
    try {
      if (m === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(val))));
      } else {
        setOutput(decodeURIComponent(escape(atob(val))));
      }
    } catch {
      setError(m === "encode" ? t.common.invalidInput : t.common.invalidInput);
      setOutput("");
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    process(val, mode);
  };

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    setError("");
    if (input) process(input, m);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setInput(`[File: ${file.name}]`);
      setOutput(result);
      setMode("encode");
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleModeSwitch("encode")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === "encode"
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {tk.encode}
        </button>
        <button
          onClick={() => handleModeSwitch("decode")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === "decode"
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {tk.decode}
        </button>
        <label className="ml-auto px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
          {t.common.file} to Base64
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Input */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.input}</label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={mode === "encode" ? tk.enterText : tk.enterBase64}
          className="flex-1 min-h-[120px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Output */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.output}</label>
          {output && (
            <button
              onClick={handleCopy}
              className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? t.copied : t.copy}
            </button>
          )}
        </div>
        <textarea
          value={output}
          readOnly
          placeholder={t.common.resultPlaceholder}
          className="flex-1 min-h-[120px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
          spellCheck={false}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
