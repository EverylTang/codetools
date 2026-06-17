"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const DEFAULT_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjJ9.abc123def456";

function decodeBase64Url(str: string): string {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice(0, (4 - (base64.length % 4)) % 4);
    return decodeURIComponent(atob(padded).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  } catch {
    return "";
  }
}

export default function JwtDecoderClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["jwt-decoder"] || {};
  const [token, setToken] = useState(DEFAULT_JWT);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const result = useMemo(() => {
    if (!token.trim()) return { parts: [], parsed: null, error: null };
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { parts, parsed: null, error: tk.invalidJwt || "Invalid JWT: expected 3 parts (header.payload.signature)" };
    }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      return {
        parts,
        parsed: { header, payload },
        error: null,
        headerRaw: decodeBase64Url(parts[0]),
        payloadRaw: decodeBase64Url(parts[1]),
      };
    } catch {
      return { parts, parsed: null, error: tk.failedDecode || "Failed to decode JWT. Check that the token is valid." };
    }
  }, [token, tk.invalidJwt, tk.failedDecode]);

  const copyJson = (label: string, data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied({ ...copied, [label]: true });
    setTimeout(() => setCopied({ ...copied, [label]: false }), 2000);
  };

  const copyLabel = tk.copy || "Copy";

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Input */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{tk.jwtToken || "JWT Token"}</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={tk.pasteJwt || "Paste your JWT token here..."}
          className="p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-y"
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {result.error && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-red-600 dark:text-red-400 font-mono">{result.error}</p>
        </div>
      )}

      {/* JWT parts */}
      {result.parts.length === 3 && (
        <div className="flex gap-2">
          <div className="flex-1 p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mb-1">{tk.header || "HEADER"}</div>
            <div className="text-[10px] font-mono text-blue-500 dark:text-blue-300 break-all">{result.parts[0]}</div>
          </div>
          <div className="flex-1 p-2 rounded bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 mb-1">{tk.payload || "PAYLOAD"}</div>
            <div className="text-[10px] font-mono text-purple-500 dark:text-purple-300 break-all">{result.parts[1]}</div>
          </div>
          <div className="flex-1 p-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{tk.signature || "SIGNATURE"}</div>
            <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 break-all">{result.parts[2].slice(0, 20)}...</div>
          </div>
        </div>
      )}

      {/* Decoded JSON */}
      {result.parsed && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Header */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.decodedHeader || "Header"}</label>
              <button
                onClick={() => copyJson("header", result.parsed!.header)}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {copied["header"] ? "✓" : copyLabel}
              </button>
            </div>
            <pre className="flex-1 p-3 text-xs font-mono border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-auto max-h-[300px]">
              {JSON.stringify(result.parsed.header, null, 2)}
            </pre>
          </div>
          {/* Payload */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.decodedPayload || "Payload"}</label>
              <button
                onClick={() => copyJson("payload", result.parsed!.payload)}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {copied["payload"] ? "✓" : copyLabel}
              </button>
            </div>
            <pre className="flex-1 p-3 text-xs font-mono border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-auto max-h-[300px]">
              {JSON.stringify(result.parsed.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Claims Info */}
      {result.parsed && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: tk.algorithm || "Algorithm", value: result.parsed.header?.alg || "N/A" },
            { label: tk.tokenType || "Type", value: result.parsed.header?.typ || "JWT" },
            { label: tk.issuedAt || "Issued At", value: result.parsed.payload?.iat ? new Date(result.parsed.payload.iat * 1000).toISOString() : "N/A" },
            { label: tk.expiresAt || "Expires", value: result.parsed.payload?.exp ? new Date(result.parsed.payload.exp * 1000).toISOString() : "N/A" },
            { label: tk.subject || "Subject", value: result.parsed.payload?.sub || "N/A" },
            { label: "Issuer", value: result.parsed.payload?.iss || "N/A" },
            { label: "Audience", value: result.parsed.payload?.aud || "N/A" },
            { label: "JWT ID", value: result.parsed.payload?.jti || "N/A" },
          ].map((claim) => (
            <div key={claim.label} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="text-[10px] text-gray-400 dark:text-gray-500">{claim.label}</div>
              <div className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">{claim.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}