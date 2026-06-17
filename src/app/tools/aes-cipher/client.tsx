"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type AesMode = "AES-CBC" | "AES-GCM";
type AesKeySize = 128 | 192 | 256;

export default function AesCipherClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["aes-cipher"] || {};

  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [aesMode, setAesMode] = useState<AesMode>("AES-CBC");
  const [keySize, setKeySize] = useState<AesKeySize>(256);
  const [secretKey, setSecretKey] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [iv, setIv] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<"base64" | "hex">("base64");

  const process = useCallback(async () => {
    setError("");
    setOutput("");
    if (!input || !secretKey) return;

    try {
      const enc = new TextEncoder();
      const keyBytes = enc.encode(secretKey.padEnd(keySize / 8, " ").slice(0, keySize / 8));
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: aesMode, length: keySize }, false, mode === "encrypt" ? ["encrypt"] : ["decrypt"]);

      if (mode === "encrypt") {
        const ivBytes = crypto.getRandomValues(new Uint8Array(aesMode === "AES-GCM" ? 12 : 16));
        const data = enc.encode(input);
        const encrypted = await crypto.subtle.encrypt({ name: aesMode, iv: ivBytes }, cryptoKey, data);
        const combined = new Uint8Array(ivBytes.length + encrypted.byteLength);
        combined.set(ivBytes);
        combined.set(new Uint8Array(encrypted), ivBytes.length);
        const result = format === "hex" ? Array.from(combined).map(b => b.toString(16).padStart(2, "0")).join("") : btoa(String.fromCharCode(...combined));
        setOutput(result);
        setIv(format === "hex" ? Array.from(ivBytes).map(b => b.toString(16).padStart(2, "0")).join("") : btoa(String.fromCharCode(...ivBytes)));
      } else {
        const raw = format === "hex" ? new Uint8Array(input.match(/.{1,2}/g)!.map(b => parseInt(b, 16))) : new Uint8Array(atob(input).split("").map(c => c.charCodeAt(0)));
        const ivLen = aesMode === "AES-GCM" ? 12 : 16;
        const ivBytes = raw.slice(0, ivLen);
        const ctBytes = raw.slice(ivLen);
        const decrypted = await crypto.subtle.decrypt({ name: aesMode, iv: ivBytes }, cryptoKey, ctBytes);
        setOutput(new TextDecoder().decode(decrypted));
      }
    } catch (e: any) {
      setError(e.message || "Operation failed");
    }
  }, [mode, aesMode, keySize, secretKey, input, format]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encryptLabel = tk.encrypt || "Encrypt";
  const decryptLabel = tk.decrypt || "Decrypt";
  const secretKeyLabel = tk.secretKey || "Secret Key";
  const keySizeLabel = tk.keySize || "Key Size";
  const inputLabel = tk.input || "Input";
  const outputLabel = tk.output || "Output";
  const formatLabel = tk.format || "Format";
  const copyLabel = tk.copy || "Copy";
  const copiedLabel = tk.copied || "Copied!";
  const processLabel = mode === "encrypt" ? encryptLabel : decryptLabel;

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button onClick={() => { setMode("encrypt"); setOutput(""); setError(""); }} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "encrypt" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{encryptLabel}</button>
          <button onClick={() => { setMode("decrypt"); setOutput(""); setError(""); }} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "decrypt" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{decryptLabel}</button>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button onClick={() => setAesMode("AES-CBC")} className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${aesMode === "AES-CBC" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>CBC</button>
          <button onClick={() => setAesMode("AES-GCM")} className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${aesMode === "AES-GCM" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>GCM</button>
        </div>
        <select value={keySize} onChange={(e) => setKeySize(Number(e.target.value) as AesKeySize)} className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
          <option value={128}>128-bit</option>
          <option value={192}>192-bit</option>
          <option value={256}>256-bit</option>
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value as "base64" | "hex")} className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
          <option value="base64">Base64</option>
          <option value="hex">Hex</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{secretKeyLabel} ({keySizeLabel}: {keySize} bits = {keySize / 8} chars)</label>
        <input
          type="text" value={secretKey} onChange={(e) => setSecretKey(e.target.value)}
          placeholder={tk.keyPlaceholder || `Enter ${keySize / 8}-character key...`}
          className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-[200px]">
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{inputLabel}</label>
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-h-[150px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{outputLabel}</label>
            {output && <button onClick={copyAll} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">{copied ? copiedLabel : copyLabel}</button>}
          </div>
          <textarea value={output} readOnly className="flex-1 min-h-[150px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y" spellCheck={false} />
        </div>
      </div>

      <button onClick={process} disabled={!input || !secretKey} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-fit">{processLabel}</button>

      {error && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}