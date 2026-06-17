"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import bcrypt from "bcryptjs";

export default function BcryptClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["bcrypt"] || {};

  const [mode, setMode] = useState<"hash" | "verify">("hash");
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [rounds, setRounds] = useState(10);
  const [result, setResult] = useState("");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const generateHash = useCallback(async () => {
    if (!password) return;
    setProcessing(true);
    try {
      const salt = bcrypt.genSaltSync(rounds);
      const h = bcrypt.hashSync(password, salt);
      setResult(h);
      setVerified(null);
    } catch {
      setResult(tk.hashError || "Hash generation failed");
    }
    setProcessing(false);
  }, [password, rounds, tk.hashError]);

  const verifyHash = useCallback(() => {
    if (!password || !hash) return;
    try {
      const ok = bcrypt.compareSync(password, hash);
      setVerified(ok);
    } catch {
      setVerified(null);
    }
  }, [password, hash]);

  const copyHash = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hashLabel = tk.hash || "Hash";
  const verifyLabel = tk.verify || "Verify";
  const passwordLabel = tk.password || "Password";
  const roundsLabel = tk.rounds || "Rounds";
  const hashInputLabel = tk.hashInput || "Bcrypt Hash";
  const generatedHashLabel = tk.generatedHash || "Generated Hash";
  const generateLabel = tk.generate || "Generate";
  const verifyBtnLabel = tk.verifyBtn || "Verify";
  const copyLabel = tk.copy || "Copy";
  const copiedLabel = tk.copied || "Copied!";
  const matchLabel = tk.match || "Password matches!";
  const noMatchLabel = tk.noMatch || "Password does NOT match";
  const processingLabel = tk.processing || "Processing...";

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 w-fit">
        <button
          onClick={() => { setMode("hash"); setVerified(null); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "hash" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{hashLabel}</button>
        <button
          onClick={() => { setMode("verify"); setVerified(null); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "verify" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{verifyLabel}</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{passwordLabel}</label>
          <input
            type="text"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (mode === "verify") setVerified(null); }}
            placeholder={tk.passwordPlaceholder || "Enter password..."}
            className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
        {mode === "hash" ? (
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{roundsLabel}</label>
            <select
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(n => (
                <option key={n} value={n}>{n} rounds (2^{n})</option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">{tk.roundsHint || "Higher = more secure but slower. 10 is standard."}</div>
          </div>
        ) : (
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{hashInputLabel}</label>
            <input
              type="text"
              value={hash}
              onChange={(e) => { setHash(e.target.value); setVerified(null); }}
              placeholder={tk.hashPlaceholder || "$2a$10$..."}
              className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {mode === "hash" ? (
        <button
          onClick={generateHash}
          disabled={!password || processing}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-fit"
        >{processing ? processingLabel : generateLabel}</button>
      ) : (
        <button
          onClick={verifyHash}
          disabled={!password || !hash}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-fit"
        >{verifyBtnLabel}</button>
      )}

      {result && mode === "hash" && (
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{generatedHashLabel}</span>
            <button onClick={copyHash} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">
              {copied ? copiedLabel : copyLabel}
            </button>
          </div>
          <code className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">{result}</code>
        </div>
      )}

      {verified !== null && (
        <div className={`p-3 rounded-lg border ${verified ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{verified ? "✅" : "❌"}</span>
            <span className={`text-sm font-semibold ${verified ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-400"}`}>
              {verified ? matchLabel : noMatchLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}