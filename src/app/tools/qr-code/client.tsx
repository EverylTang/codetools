"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useI18n } from "@/lib/i18n/I18nProvider";

const PRESETS = [
  { label: "Your URL", icon: "🌐", value: "https://json2code-rosy.vercel.app" },
  { label: "WiFi Login", icon: "📶", value: "WIFI:S:MyWiFi;T:WPA;P:password123;;" },
  { label: "vCard", icon: "📇", value: "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD" },
  { label: "Email", icon: "📧", value: "mailto:hello@example.com?subject=Hello" },
  { label: "SMS", icon: "💬", value: "smsto:+1234567890:Hello!" },
];

export default function QrClient() {
  const { t } = useI18n();
  const tk = t.tools["qr-code"];
  const [input, setInput] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloadSize, setDownloadSize] = useState<number>(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) { setDataUrl(""); setError(""); return; }
    try {
      setError("");
      // Generate on canvas for best quality
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: downloadSize,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });
      }
      // Also generate data URL for download
      const url = await QRCode.toDataURL(text, {
        width: downloadSize * 2, // 2x for retina
        margin: 2,
      });
      setDataUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.error);
    }
  }, [downloadSize, t.common.error]);

  useEffect(() => {
    if (input) generate(input);
  }, [input, generate]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-${input.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_") || "code"}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current || !dataUrl) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve));
      if (blob && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setError("");
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Fall back to copying the data URL as text below.
    }

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(dataUrl);
      setCopied(true);
      setError("");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setError(tk.copyDenied);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Input */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.content}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tk.placeholder || "Enter text or URL to encode..."}
          rows={3}
          className="w-full p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Presets */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.quickExamples}</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setInput(p.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-gray-500 dark:text-gray-400">{tk.size}:</label>
        <input
          type="range"
          min={150}
          max={600}
          value={downloadSize}
          onChange={(e) => setDownloadSize(parseInt(e.target.value))}
          className="flex-1 max-w-[200px] accent-blue-500"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">{downloadSize}px</span>
      </div>

      {/* QR Display */}
      <div className="flex flex-col items-center">
        {input ? (
          <div className="p-4 rounded-xl bg-white border border-gray-200 dark:border-gray-700 inline-block">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-64 h-64 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">〰️</div>
              <p>{tk.emptyState || "Enter content to generate QR code"}</p>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        {/* Actions */}
        {dataUrl && (
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
            >
              {tk.download}
            </button>
            <button
              onClick={handleCopyImage}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? t.copied : tk.copyImage}
            </button>
          </div>
        )}
      </div>

      {/* Character count */}
      {input && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          {input.length} {tk.characters || "characters"}
        </p>
      )}
    </div>
  );
}
