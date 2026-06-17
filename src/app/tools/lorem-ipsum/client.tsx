"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: { max: 8, min: 4 },
  wordsPerSentence: { max: 16, min: 4 },
});

export default function LoremIpsumClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["lorem-ipsum"] || {};

  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let text = "";
    switch (type) {
      case "paragraphs": text = lorem.generateParagraphs(count); break;
      case "sentences": text = lorem.generateSentences(count); break;
      case "words": text = lorem.generateWords(count); break;
    }
    setOutput(text);
  }, [type, count]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paragraphsLabel = tk.paragraphs || "Paragraphs";
  const sentencesLabel = tk.sentences || "Sentences";
  const wordsLabel = tk.words || "Words";
  const countLabel = tk.count || "Count";
  const generateLabel = tk.generate || "Generate";
  const copyLabel = tk.copy || "Copy";
  const copiedLabel = tk.copied || "Copied!";
  const outputLabel = tk.output || "Output";

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button onClick={() => setType("paragraphs")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${type === "paragraphs" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{paragraphsLabel}</button>
          <button onClick={() => setType("sentences")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${type === "sentences" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{sentencesLabel}</button>
          <button onClick={() => setType("words")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${type === "words" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{wordsLabel}</button>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-gray-500 dark:text-gray-400">{countLabel}</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
            {[1, 2, 3, 5, 10, 15, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button onClick={generate} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">{generateLabel}</button>
      </div>

      {output ? (
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{outputLabel}</label>
            <button onClick={copyAll} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              {copied ? copiedLabel : copyLabel}
            </button>
          </div>
          <div className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 leading-relaxed overflow-auto max-h-[400px]">
            {output.split("\n").map((line, i) => (
              <p key={i} className="mb-2 last:mb-0">{line}</p>
            ))}
          </div>
          <div className="text-[10px] text-gray-400">
            {output.length.toLocaleString()} chars · {output.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          {tk.emptyState || "Click Generate to create Lorem Ipsum text"}
        </div>
      )}
    </div>
  );
}