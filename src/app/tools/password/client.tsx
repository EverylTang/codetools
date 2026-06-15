"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?~";

function getStrength(password: string, labels?: { weak?: string; fair?: string; good?: string; strong?: string; veryStrong?: string }): { label: string; color: string; score: number } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: labels?.weak || "Weak", color: "bg-red-500", score: 20 };
  if (score <= 4) return { label: labels?.fair || "Fair", color: "bg-orange-500", score: 40 };
  if (score <= 5) return { label: labels?.good || "Good", color: "bg-yellow-500", score: 60 };
  if (score <= 6) return { label: labels?.strong || "Strong", color: "bg-blue-500", score: 80 };
  return { label: labels?.veryStrong || "Very Strong", color: "bg-green-500", score: 100 };
}

function generatePassword(opts: Options): string {
  let chars = "";
  if (opts.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (opts.numbers) chars += "0123456789";
  if (opts.symbols) chars += SYMBOLS;
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

  return Array.from({ length: opts.length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function PasswordClient() {
  const { t } = useI18n();
  const tk = t.tools.password;
  const [options, setOptions] = useState<Options>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [multiple, setMultiple] = useState<string[]>([]);
  const [multipleCount, setMultipleCount] = useState(5);

  const generate = (opts: Options) => {
    const pwd = generatePassword(opts);
    setPassword(pwd);
    setCopied(false);

    // Generate multiple
    const batch = Array.from({ length: multipleCount }, () => generatePassword(opts));
    setMultiple(batch);
  };

  const handleGenerate = () => {
    generate(options);
  };

  const updateOption = <K extends keyof Options>(key: K, value: Options[K]) => {
    const newOpts = { ...options, [key]: value };
    setOptions(newOpts);
    if (password) generate(newOpts);
  };

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyMultiple = async () => {
    await navigator.clipboard.writeText(multiple.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password ? getStrength(password, tk.strength) : null;

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Options */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Length */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              {tk.length}: <span className="text-gray-900 dark:text-gray-100">{options.length}</span>
            </label>
            <input
              type="range"
              min={4}
              max={64}
              value={options.length}
              onChange={(e) => updateOption("length", parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Batch count */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              {tk.batchCount}: <span className="text-gray-900 dark:text-gray-100">{multipleCount}</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={multipleCount}
              onChange={(e) => setMultipleCount(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
              <span>1</span>
              <span>20</span>
            </div>
          </div>
        </div>

        {/* Character Types */}
        <div className="flex flex-wrap gap-4 mt-4">
          {[
            { key: "uppercase" as const, label: tk.uppercase },
            { key: "lowercase" as const, label: tk.lowercase },
            { key: "numbers" as const, label: tk.numbers },
            { key: "symbols" as const, label: tk.symbols },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={(e) => updateOption(opt.key, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="px-6 py-3 text-sm font-semibold rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
      >
        {tk.generate}{multipleCount > 1 ? ` (${multipleCount})` : ""}
      </button>

      {/* Result */}
      {password && (
        <div className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{tk.generated || "Generated Password"}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <code className="block text-lg font-mono font-bold text-gray-900 dark:text-gray-100 break-all select-all">
            {password}
          </code>

          {/* Strength Meter */}
          {strength && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[70px] text-right">
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                <span>{password.length} {tk.chars || "chars"}</span>
                <span>·</span>
                <span>{password.replace(/[^a-z]/g, "").length} {tk.lowercase}</span>
                <span>·</span>
                <span>{password.replace(/[^A-Z]/g, "").length} {tk.uppercase}</span>
                <span>·</span>
                <span>{password.replace(/[^0-9]/g, "").length} {tk.numbers}</span>
                <span>·</span>
                <span>{password.replace(/[a-zA-Z0-9]/g, "").length} {tk.symbols}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Results */}
      {multiple.length > 1 && password && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {tk.batch || "Batch"} ({multiple.length})
            </label>
            <button
              onClick={handleCopyMultiple}
              className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {tk.copyAll}
            </button>
          </div>
          <div className="space-y-1 max-h-[250px] overflow-y-auto">
            {multiple.map((pwd, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 w-4">{i + 1}.</span>
                  <code className="text-sm font-mono text-gray-900 dark:text-gray-100 select-all">{pwd}</code>
                </div>
                <span className={`text-[10px] font-medium ${getStrength(pwd, tk.strength).score >= 60 ? "text-green-500" : "text-red-500"}`}>
                  {getStrength(pwd, tk.strength).label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!password && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🔑</div>
            <p>Configure options and click Generate</p>
          </div>
        </div>
      )}
    </div>
  );
}
