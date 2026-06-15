"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

function arrayBufferToPem(buf: ArrayBuffer, label: string): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

export default function RsaGeneratorClient() {
  const { t } = useI18n();
  const tk = t.tools["rsa-key-generator"];
  const [keySize, setKeySize] = useState<2048 | 4096>(2048);
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<"private" | "public" | null>(null);
  const [error, setError] = useState("");

  const generate = useCallback(async () => {
    setGenerating(true);
    setError("");
    setPrivateKey("");
    setPublicKey("");
    
    try {
      const keyPair = await crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: keySize, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,
        ["encrypt", "decrypt"]
      );

      // Export private key (PKCS#8 PEM)
      const privRaw = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      setPrivateKey(arrayBufferToPem(privRaw, "PRIVATE KEY"));

      // Export public key (SPKI PEM)
      const pubRaw = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      setPublicKey(arrayBufferToPem(pubRaw, "PUBLIC KEY"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.error);
    } finally {
      setGenerating(false);
    }
  }, [keySize, t.common.error]);

  const handleCopy = async (type: "private" | "public") => {
    const val = type === "private" ? privateKey : publicKey;
    if (val) {
      await navigator.clipboard.writeText(val);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleDownload = (type: "private" | "public") => {
    const val = type === "private" ? privateKey : publicKey;
    if (!val) return;
    const blob = new Blob([val], { type: "application/x-pem-file" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "private" ? "private_key.pem" : "public_key.pem";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Controls */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.keySize}</label>
            <div className="flex items-center gap-1 rounded-lg bg-white dark:bg-gray-800 p-0.5 border border-gray-200 dark:border-gray-700">
              {[2048, 4096].map((size) => (
                <button
                  key={size}
                  onClick={() => setKeySize(size as 2048 | 4096)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    keySize === size
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {size} bit
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          <button
            onClick={generate}
            disabled={generating}
            className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {generating ? (tk.generating || "Generating...") : tk.generate}
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {keySize === 2048
            ? (tk.size2048 || "2048-bit: Standard security, fast generation. Suitable for most applications.")
            : (tk.size4096 || "4096-bit: Higher security, slower generation.")}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400 font-mono">
          {error}
        </div>
      )}

      {/* Private Key */}
      {privateKey && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.privateKey}</label>
            <div className="flex items-center gap-1">
              <button onClick={() => handleDownload("private")} className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {tk.download}
              </button>
              <button onClick={() => handleCopy("private")} className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {copied === "private" ? t.copied : t.copy}
              </button>
            </div>
          </div>
          <pre className="p-3 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 overflow-x-auto max-h-[250px] overflow-y-auto select-all">
            {privateKey}
          </pre>
        </div>
      )}

      {/* Public Key */}
      {publicKey && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.publicKey}</label>
            <div className="flex items-center gap-1">
              <button onClick={() => handleDownload("public")} className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {tk.download}
              </button>
              <button onClick={() => handleCopy("public")} className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {copied === "public" ? t.copied : t.copy}
              </button>
            </div>
          </div>
          <pre className="p-3 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 overflow-x-auto max-h-[150px] overflow-y-auto select-all">
            {publicKey}
          </pre>
        </div>
      )}

      {/* Empty state */}
      {!privateKey && !publicKey && !error && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🔐</div>
            <p>{tk.emptyState || "Select key size and click Generate"}</p>
            <p className="text-xs mt-1">{tk.localOnly || "Key generation uses browser Web Crypto API. Your keys never leave your device."}</p>
          </div>
        </div>
      )}

      {/* Usage Info */}
      {privateKey && publicKey && (
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{tk.usageTips}</p>
          <ul className="list-disc list-inside space-y-1">
            <li>{tk.tipPayment || "Payment APIs often require RSA keys for notification verification."}</li>
            <li>{tk.tipApi || "Use for JWT signing or OAuth client authentication."}</li>
            <li>{tk.tipSsh || "To use this key with SSH, convert it:"} <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">ssh-keygen -i -f public_key.pem -m PKCS8</code></li>
            <li>{tk.tipPrivate || "Never share your private key. Only distribute the public key."}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
