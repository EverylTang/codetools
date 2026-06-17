"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type SignAlgo = "HMAC-MD5" | "HMAC-SHA1" | "HMAC-SHA256" | "HMAC-SHA384" | "HMAC-SHA512" | "RSA-SHA256" | "RSA-SHA1";

const ALGOS: { key: SignAlgo; label: string; category: "HMAC" | "RSA" }[] = [
  { key: "HMAC-MD5", label: "HMAC-MD5", category: "HMAC" },
  { key: "HMAC-SHA1", label: "HMAC-SHA1", category: "HMAC" },
  { key: "HMAC-SHA256", label: "HMAC-SHA256", category: "HMAC" },
  { key: "HMAC-SHA384", label: "HMAC-SHA384", category: "HMAC" },
  { key: "HMAC-SHA512", label: "HMAC-SHA512", category: "HMAC" },
  { key: "RSA-SHA256", label: "RSA-SHA256", category: "RSA" },
  { key: "RSA-SHA1", label: "RSA-SHA1", category: "RSA" },
];

function hmacMd5(key: string, message: string): string {
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
      const K: number[] = [];
      for (let j = 0; j < 64; j++) K[j] = Math.floor(Math.abs(Math.sin(j + 1)) * 0x100000000);
      for (let j = 0; j < 64; j++) {
        const g = j < 16 ? j : j < 32 ? (5 * j + 1) % 16 : j < 48 ? (3 * j + 5) % 16 : (7 * j) % 16;
        const f = j < 16 ? (B & C) | (~B & D) : j < 32 ? (D & B) | (~D & C) : j < 48 ? B ^ C ^ D : C ^ (B | ~D);
        const temp = D; D = C; C = B;
        B = B + rotateLeft((A + f + K[j] + M[g]), S[j % 4 + (j >> 4 << 2)]);
        A = temp;
      }
      a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
    }
    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
  }
  const blockSize = 64;
  const enc = unescape(encodeURIComponent(key));
  let k = enc.split("").map(c => c.charCodeAt(0));
  if (k.length > blockSize) {
    const hash = md5(key);
    k = [];
    for (let i = 0; i < hash.length; i += 2) k.push(parseInt(hash.substring(i, i + 2), 16));
  }
  while (k.length < blockSize) k.push(0);
  const oKeyPad = k.map(b => b ^ 0x5c);
  const iKeyPad = k.map(b => b ^ 0x36);
  return md5(oKeyPad.map(b => String.fromCharCode(b)).join("") + md5(iKeyPad.map(b => String.fromCharCode(b)).join("") + message));
}

async function hmacSha(algo: string, key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: algo }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function rsaVerify(algo: string, publicKeyPem: string, message: string, signature: string): Promise<boolean> {
  try {
    const pem = publicKeyPem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
    const binary = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey("spki", binary, { name: "RSASSA-PKCS1-v1_5", hash: algo }, false, ["verify"]);
    const sigBytes = Uint8Array.from(atob(signature.replace(/\s/g, "").replace(/-----[A-Z ]+-----/g, "")), c => c.charCodeAt(0));
    const enc = new TextEncoder();
    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sigBytes, enc.encode(message));
  } catch {
    return false;
  }
}

export default function SignVerifyClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["sign-verify"] || {};
  const [algo, setAlgo] = useState<SignAlgo>("HMAC-SHA256");
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [receivedSig, setReceivedSig] = useState("");
  const [sigFormat, setSigFormat] = useState<"hex" | "base64">("hex");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{ match: boolean | null; computed: string; error: string | null }>({ match: null, computed: "", error: null });

  const isRsa = algo.startsWith("RSA");

  const verify = useCallback(async () => {
    if (!message || (!isRsa && !secretKey) || (isRsa && !publicKey) || !receivedSig) {
      setResult({ match: null, computed: "", error: null });
      return;
    }
    setVerifying(true);
    try {
      let computed: string;
      let match: boolean;
      if (isRsa) {
        const hashAlgo = algo === "RSA-SHA256" ? "SHA-256" : "SHA-1";
        match = await rsaVerify(hashAlgo, publicKey, message, receivedSig);
        computed = "[RSA verification — cannot compute signature from public key alone]";
      } else {
        const hashAlgo = algo.replace("HMAC-", "");
        computed = algo === "HMAC-MD5" ? hmacMd5(secretKey, message) : await hmacSha(hashAlgo === "SHA1" ? "SHA-1" : hashAlgo, secretKey, message);
        match = computed.toLowerCase() === receivedSig.toLowerCase().trim();
      }
      setResult({ match, computed, error: null });
    } catch (e: any) {
      setResult({ match: null, computed: "", error: e.message });
    } finally {
      setVerifying(false);
    }
  }, [algo, message, secretKey, publicKey, receivedSig]);

  useMemo(() => { verify(); }, [verify]);

  const PRESETS = [
    { label: "Alipay Callback", message: "gmt_create=2024-06-15 12:00:00&charset=utf-8&seller_email=test@example.com&subject=Test&sign_type=RSA2&out_trade_no=OUT20240615&total_fee=0.01", key: "your_secret_key_here", algo: "HMAC-SHA256" as SignAlgo },
    { label: "WeChat Pay", message: "appid=wx888&mch_id=1900000109&nonce_str=5K8264ILTK&out_trade_no=OUT20240615&total_fee=1", key: "mysecretkey123", algo: "HMAC-SHA256" as SignAlgo },
    { label: "Stripe Webhook", message: '{"id":"evt_123","type":"payment_intent.succeeded","data":{"object":{"id":"pi_123","amount":1000}}}', key: "whsec_abc123", algo: "HMAC-SHA256" as SignAlgo },
  ];

  const algoLabel = tk.algorithm || "Algorithm";
  const msgLabel = tk.message || "Message / Original Text";
  const msgPlaceholder = tk.messagePlaceholder || "Enter the original message or callback data...";
  const secretKeyLabel = tk.secretKey || "Secret Key";
  const secretKeyPlaceholder = tk.secretKeyPlaceholder || "Enter your secret key...";
  const publicKeyLabel = tk.publicKey || "Public Key (PEM)";
  const publicKeyPlaceholder = tk.publicKeyPlaceholder || "-----BEGIN PUBLIC KEY-----...";
  const receivedSigLabel = tk.receivedSignature || "Received Signature";
  const sigPlaceholder = tk.signaturePlaceholder || "Paste the signature you received from the payment gateway...";
  const computedSigLabel = tk.computedSignature || "Computed Signature";
  const matchLabel = tk.match || "Signature Matches!";
  const noMatchLabel = tk.noMatch || "Signature Does NOT Match";
  const enterDataLabel = tk.enterData || "Enter data to verify";
  const presetsLabel = tk.presets || "Quick Examples";

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Presets */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-400">{presetsLabel}</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setAlgo(p.algo); setMessage(p.message); setSecretKey(p.key); setReceivedSig(""); }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >{p.label}</button>
          ))}
        </div>
      </div>

      {/* Algorithm selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{algoLabel}</label>
        <div className="flex flex-wrap gap-1">
          <div className="w-full text-[10px] text-gray-400 mb-1">HMAC</div>
          {ALGOS.filter(a => a.category === "HMAC").map(a => (
            <button key={a.key} onClick={() => setAlgo(a.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${algo === a.key ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            >{a.label}</button>
          ))}
          <div className="w-full text-[10px] text-gray-400 mt-1 mb-1">RSA</div>
          {ALGOS.filter(a => a.category === "RSA").map(a => (
            <button key={a.key} onClick={() => setAlgo(a.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${algo === a.key ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            >{a.label}</button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{msgLabel}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={msgPlaceholder}
            className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-y"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {isRsa ? publicKeyLabel : secretKeyLabel}
          </label>
          <textarea
            value={isRsa ? publicKey : secretKey}
            onChange={(e) => isRsa ? setPublicKey(e.target.value) : setSecretKey(e.target.value)}
            placeholder={isRsa ? publicKeyPlaceholder : secretKeyPlaceholder}
            className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Received signature */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{receivedSigLabel}</label>
        <input
          type="text"
          value={receivedSig}
          onChange={(e) => setReceivedSig(e.target.value)}
          placeholder={sigPlaceholder}
          className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Verification Result */}
      <div className="p-4 rounded-xl border-2 transition-all"
        style={{
          borderColor: result.match === true ? "#22c55e" : result.match === false ? "#ef4444" : "#d1d5db",
          backgroundColor: result.match === true ? "rgba(34,197,94,0.05)" : result.match === false ? "rgba(239,68,68,0.05)" : "transparent"
        }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">
            {result.match === true ? "✅" : result.match === false ? "❌" : "⏳"}
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: result.match === true ? "#16a34a" : result.match === false ? "#dc2626" : "#6b7280" }}>
              {result.match === true ? matchLabel : result.match === false ? noMatchLabel : enterDataLabel}
            </div>
            {result.match === false && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                The computed signature differs from the received signature. Check your key, message format, or algorithm.
              </div>
            )}
          </div>
        </div>

        {result.computed && (
          <div className="space-y-2">
            <div className="p-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-[10px] text-gray-400 mb-1">{computedSigLabel}</div>
              <code className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">{result.computed}</code>
            </div>
            {receivedSig && (
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] text-gray-400 mb-1">{receivedSigLabel}</div>
                <code className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">{receivedSig}</code>
              </div>
            )}
          </div>
        )}

        {result.error && (
          <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <code className="text-xs text-red-600 dark:text-red-400">{result.error}</code>
          </div>
        )}
      </div>

      {/* Tips */}
      <details className="group">
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none">
          Common Payment Signature Rules
        </summary>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p><strong>Alipay:</strong> Sort params by key, concatenate with &amp;, append key, then sign with MD5 or RSA2 (SHA256).</p>
          <p><strong>WeChat Pay:</strong> Sort params by ASCII, concatenate with &amp;key=, then sign with HMAC-SHA256 or MD5.</p>
          <p><strong>Stripe:</strong> Use HMAC-SHA256 with the signing secret. Compare using timing-safe equals.</p>
          <p className="mt-2 text-gray-400">Tip: Paste the raw parameter string (before signing) as the message. The signature should be computed on exactly this string.</p>
        </div>
      </details>
    </div>
  );
}