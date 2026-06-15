"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Mode = "encodeComponent" | "encode" | "decode";

const MODE_LABELS: Record<Mode, string> = {
  encodeComponent: "encodeURIComponent",
  encode: "encodeURI",
  decode: "decodeURIComponent",
};

export default function UrlEncodeClient() {
  const { t } = useI18n();
  const tk = t.tools["url-encode"];
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encodeComponent");
  const [copied, setCopied] = useState(false);

  const process = (val: string, m: Mode) => {
    if (!val) { setOutput(""); return; }
    try {
      switch (m) {
        case "encodeComponent":
          setOutput(encodeURIComponent(val));
          break;
        case "encode":
          setOutput(encodeURI(val));
          break;
        case "decode":
          setOutput(decodeURIComponent(val));
          break;
      }
    } catch {
      setOutput(`${t.common.error}: ${t.common.invalidInput}`);
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    process(val, mode);
  };

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    if (input) process(input, m);
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
        {(["encodeComponent", "encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === m
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {mode === "encodeComponent" && (tk.encodeComponentDescription || "Encodes a URI component by escaping special characters.")}
        {mode === "encode" && (tk.encodeUriDescription || "Encodes a complete URI while preserving URI separators.")}
        {mode === "decode" && (tk.decodeDescription || "Decodes a percent-encoded URI component.")}
      </p>

      {/* Input */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.input}</label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={mode === "decode" ? (tk.decodePlaceholder || "Enter percent-encoded string...") : (tk.encodePlaceholder || "Enter text to encode...")}
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
      </div>

      {/* Examples */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.quickExamples}</label>
        <div className="flex flex-wrap gap-2">
          {["hello world", "a & b = c?", "中文测试 €", "https://example.com/?name=John&age=30"].map((ex) => (
            <button
              key={ex}
              onClick={() => handleInputChange(ex)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors max-w-[200px] truncate"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
