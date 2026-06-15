"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type HashAlgo = "MD5" | "SHA1" | "SHA256" | "SHA384" | "SHA512";

const ALGOS: { key: HashAlgo; label: string; subtle: string }[] = [
  { key: "MD5", label: "MD5", subtle: "" },    // MD5 not in SubtleCrypto, needs custom impl
  { key: "SHA1", label: "SHA-1", subtle: "SHA-1" },
  { key: "SHA256", label: "SHA-256", subtle: "SHA-256" },
  { key: "SHA384", label: "SHA-384", subtle: "SHA-384" },
  { key: "SHA512", label: "SHA-512", subtle: "SHA-512" },
];

// MD5 implementation (pure JS, since SubtleCrypto doesn't support MD5)
function md5(input: string): string {
  function rotateLeft(x: number, n: number) { return (x << n) | (x >>> (32 - n)); }
  function toHex(n: number): string {
    let s = "", v: number;
    for (let i = 0; i < 4; i++) {
      s += "0123456789abcdef".charAt((v = (n >>> (i * 8)) & 0xff) >>> 4 & 0x0f)
        + "0123456789abcdef".charAt(v & 0x0f);
    }
    return s;
  }
  
  const utf8 = unescape(encodeURIComponent(input));
  const msg = utf8.split("").map(c => c.charCodeAt(0));
  const len = msg.length * 8;
  
  msg.push(0x80);
  while ((msg.length * 8) % 512 !== 448) msg.push(0);
  
  for (let i = 0; i < 8; i++) msg.push((len >>> (i * 8)) & 0xff);
  
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  
  for (let i = 0; i < msg.length; i += 16) {
    const M = msg.slice(i, i + 16);
    let A = a0, B = b0, C = c0, D = d0;
    
    const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    const K = [];
    for (let j = 0; j < 64; j++) K[j] = Math.floor(Math.abs(Math.sin(j + 1)) * 0x100000000);
    
    for (let j = 0; j < 64; j++) {
      const g = j < 16 ? j : j < 32 ? (5 * j + 1) % 16 : j < 48 ? (3 * j + 5) % 16 : (7 * j) % 16;
      const f = j < 16 ? (B & C) | (~B & D)
        : j < 32 ? (D & B) | (~D & C)
        : j < 48 ? B ^ C ^ D
        : C ^ (B | ~D);
      const temp = D;
      D = C;
      C = B;
      B = B + rotateLeft((A + f + K[j] + M[g]), S[j % 4 + (j >> 4 << 2)]);
      A = temp;
    }
    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }
  
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

async function sha(hash: string, input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const buf = await crypto.subtle.digest(hash, data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashClient() {
  const { t } = useI18n();
  const tk = t.tools["hash-generator"];
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<HashAlgo, string>>({} as any);
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgo>("SHA256");
  const [copied, setCopied] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const compute = useCallback(async (text: string) => {
    if (!text) { setResults({} as any); return; }
    setProcessing(true);
    const r: any = {};
    // Compute selected algo first for instant feedback
    const selected = ALGOS.find(a => a.key === selectedAlgo)!;
    r[selected.key] = selected.key === "MD5" ? md5(text) : await sha(selected.subtle, text);
    setResults(r);
    // Compute rest in background
    for (const algo of ALGOS) {
      if (algo.key === selectedAlgo) continue;
      r[algo.key] = algo.key === "MD5" ? md5(text) : await sha(algo.subtle, text);
    }
    setResults({ ...r });
    setProcessing(false);
  }, [selectedAlgo]);

  const handleInput = (val: string) => {
    setInput(val);
    compute(val);
  };

  const handleAlgoSelect = (algo: HashAlgo) => {
    setSelectedAlgo(algo);
    if (input) compute(input);
  };

  const handleCopy = async (algo: HashAlgo) => {
    const val = results[algo];
    if (val) {
      await navigator.clipboard.writeText(val);
      setCopied(algo);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    const lines = Object.entries(results).map(([algo, hash]) => `${algo}: ${hash}`).join("\n");
    await navigator.clipboard.writeText(lines + "\n");
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Input */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.inputText}</label>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={tk.placeholder}
          className="flex-1 min-h-[100px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap gap-2">
        {["hello", "Hello World", "123456", "password123"].map((ex) => (
          <button
            key={ex}
            onClick={() => handleInput(ex)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Results */}
      {input && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.hashes}</label>
            {Object.keys(results).length > 0 && (
              <button
                onClick={handleCopyAll}
                className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {copied === "all" ? t.common.copiedAll : tk.copyAll}
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
            {ALGOS.map((algo) => {
              const hash = results[algo.key] || (processing && algo.key === selectedAlgo ? "..." : "");
              return (
                <div
                  key={algo.key}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    algo.key === selectedAlgo
                      ? "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-bold w-14 shrink-0 ${algo.key === selectedAlgo ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {algo.key}
                    </span>
                    <code className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate select-all block">
                      {hash || (algo.key === selectedAlgo && !processing ? "" : "") || (processing && algo.key === selectedAlgo ? "..." : "")}
                      {!hash && algo.key !== selectedAlgo && !processing && 
                        <span className="text-gray-300 dark:text-gray-600">{tk.computing}</span>
                      }
                    </code>
                  </div>
                  {hash && (
                    <button
                      onClick={() => handleCopy(algo.key)}
                      className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0 ml-2"
                    >
                      {copied === algo.key ? "✓" : "📋"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toolbar - put algo selector below results for less movement */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">{tk.quickSelect}:</span>
            {ALGOS.map((algo) => (
              <button
                key={algo.key}
                onClick={() => handleAlgoSelect(algo.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedAlgo === algo.key
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!input && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🔐</div>
            <p>{tk.emptyState}</p>
            <p className="text-xs mt-1">{tk.exampleHint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
