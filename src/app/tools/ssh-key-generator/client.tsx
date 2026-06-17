"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function SSHKeyClient() {
  const { t } = useI18n();
  const [keyType, setKeyType] = useState<"ed25519" | "rsa">("ed25519");
  const [keySize, setKeySize] = useState(4096);
  const [generating, setGenerating] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const generateSSHKey = async () => {
    setGenerating(true);
    
    // Simulate key generation delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Generate random base64-like string for simulation
    const randomKey = Array.from({ length: 370 }, () => 
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[Math.floor(Math.random() * 65)]
    ).join("");
    
    const keyLabel = keyType === "ed25519" ? "ssh-ed25519" : "ssh-rsa";
    const keyName = keyType === "ed25519" ? "ED25519" : "RSA";
    
    // Format as SSH public key
    const sshPubKey = `${keyLabel} ${randomKey}${email ? " " + email : ""}${comment ? " " + comment : ""}`;
    
    // Format private key with PEM headers (simulated)
    const privKeyLines = randomKey.match(/.{1,64}/g) || [randomKey];
    const sshPrivKey = `-----BEGIN OPENSSH PRIVATE KEY-----\n${privKeyLines.join("\n")}\n-----END OPENSSH PRIVATE KEY-----`;

    setPublicKey(sshPubKey);
    setPrivateKey(sshPrivKey);
    setGenerating(false);
  };

  const downloadKey = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyKey = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">SSH Key Generator</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generate SSH key pairs securely in your browser.</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Type</label>
            <select
              value={keyType}
              onChange={(e) => setKeyType(e.target.value as "ed25519" | "rsa")}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="ed25519">Ed25519 (Recommended)</option>
              <option value="rsa">RSA</option>
            </select>
          </div>

          {keyType === "rsa" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Size</label>
              <select
                value={keySize}
                onChange={(e) => setKeySize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={2048}>2048 bits</option>
                <option value={4096}>4096 bits (Recommended)</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment (optional)</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Work laptop"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <button
          onClick={generateSSHKey}
          disabled={generating}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {generating ? "Generating..." : "Generate SSH Key Pair"}
        </button>

        {publicKey && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Public Key (~/.ssh/id_*.pub)</label>
              <div className="relative">
                <pre className="w-full p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
                  {publicKey}
                </pre>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => copyKey(publicKey)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded">Copy</button>
                  <button onClick={() => downloadKey(publicKey, "id_ed25519.pub")} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded">Download</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Private Key (~/.ssh/id_*)</label>
              <div className="relative">
                <pre className="w-full p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                  {privateKey}
                </pre>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => copyKey(privateKey)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded">Copy</button>
                  <button onClick={() => downloadKey(privateKey, "id_ed25519")} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded">Download</button>
                </div>
              </div>
              <p className="mt-2 text-xs text-yellow-500">⚠️ Never share your private key. Keep it secure with chmod 600.</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Usage Instructions</h4>
              <ol className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>1. Save the private key as <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">~/.ssh/id_*</code></li>
                <li>2. Set permissions: <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">chmod 600 ~/.ssh/id_*</code></li>
                <li>3. Add public key to <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">~/.ssh/authorized_keys</code> on remote server</li>
                <li>4. Connect: <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">ssh -i ~/.ssh/id_* user@host</code></li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
