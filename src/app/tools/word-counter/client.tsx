"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function WordCounterClient() {
  const { t } = useI18n();
  const tk = t.tools["word-counter"];
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paras = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const digits = (text.match(/\d/g) || []).length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 150));

    return { chars, charsNoSpace, words, lines, sentences, paras, digits, letters, chinese, spaces, readingTime, speakingTime };
  }, [text]);

  const readingLevel = useMemo(() => {
    if (!text.trim()) return "";
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length || 1;
    const words = text.trim().split(/\s+/).length || 1;
    const syllables = text.toLowerCase().split(/[aeiou]/g).length - 1;
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    if (score >= 90) return tk.readingVeryEasy || "Very Easy";
    if (score >= 80) return tk.readingEasy || "Easy";
    if (score >= 70) return tk.readingFairlyEasy || "Fairly Easy";
    if (score >= 60) return tk.readingStandard || "Standard";
    if (score >= 50) return tk.readingFairlyDifficult || "Fairly Difficult";
    if (score >= 30) return tk.readingDifficult || "Difficult";
    return tk.readingVeryDifficult || "Very Difficult";
  }, [text, tk]);

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Text Input */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.enterText}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={tk.startTyping}
          className="flex-1 min-h-[150px] p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: tk.characters, value: stats.chars.toLocaleString(), color: "text-blue-600 dark:text-blue-400" },
          { label: tk.charsNoSpace, value: stats.charsNoSpace.toLocaleString(), color: "text-cyan-600 dark:text-cyan-400" },
          { label: tk.words, value: stats.words.toLocaleString(), color: "text-green-600 dark:text-green-400" },
          { label: tk.lines, value: stats.lines.toLocaleString(), color: "text-purple-600 dark:text-purple-400" },
          { label: tk.sentences, value: stats.sentences.toLocaleString(), color: "text-orange-600 dark:text-orange-400" },
          { label: tk.paragraphs, value: stats.paras.toLocaleString(), color: "text-pink-600 dark:text-pink-400" },
          { label: tk.digits, value: stats.digits.toLocaleString(), color: "text-yellow-600 dark:text-yellow-400" },
          { label: tk.letters, value: stats.letters.toLocaleString(), color: "text-indigo-600 dark:text-indigo-400" },
          { label: tk.chinese, value: stats.chinese.toLocaleString(), color: "text-red-600 dark:text-red-400" },
          { label: tk.spaces, value: stats.spaces.toLocaleString(), color: "text-gray-600 dark:text-gray-400" },
          { label: tk.readingTime, value: `${stats.readingTime} ${t.common.min}`, color: "text-teal-600 dark:text-teal-400" },
          { label: tk.speakingTime, value: `${stats.speakingTime} ${t.common.min}`, color: "text-violet-600 dark:text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">{s.label}</div>
            <div className={`text-lg font-bold ${s.color} ${s.label === tk.readingTime || s.label === tk.speakingTime ? "" : "font-mono"}`}>
              {stats.chars === 0 && s.label !== tk.characters ? "0" : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Readability */}
      {text.trim() && (
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.readability}</div>
          <div className="text-sm text-gray-900 dark:text-gray-100">{readingLevel}</div>
        </div>
      )}

      {/* Character frequency */}
      {text.trim() && (
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.topChars}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              text.toLowerCase().split("").reduce((acc: Record<string, number>, c) => {
                if (c.trim()) acc[c] = (acc[c] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15)
              .map(([char, count]) => (
                <div key={char} className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono">
                  <span className="text-gray-900 dark:text-gray-100">{char}</span>
                  <span className="text-gray-400 dark:text-gray-500 ml-1">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!text && (
        <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
          {tk.startTyping}
        </div>
      )}
    </div>
  );
}
