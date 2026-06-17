"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Base64FileClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["base64-file"] || {};

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setFileType(file.type);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setOutput(reader.result as string);
    };
    reader.onerror = () => setError(tk.fileReadError || "Failed to read file");
    reader.readAsDataURL(file);
  }, [tk.fileReadError]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleBase64Decode = useCallback(() => {
    setError("");
    try {
      const base64 = output.replace(/^data:.*?;base64,/, "").trim();
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      // Detect MIME type from data URI or magic bytes
      let mime = "application/octet-stream";
      const dataUriMatch = output.match(/^data:([^;]+);/);
      if (dataUriMatch) mime = dataUriMatch[1];
      else if (bytes[0] === 0xFF && bytes[1] === 0xD8) mime = "image/jpeg";
      else if (bytes[0] === 0x89 && bytes[1] === 0x50) mime = "image/png";
      else if (bytes[0] === 0x25 && bytes[1] === 0x50) mime = "application/pdf";

      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      const ext = mime.split("/")[1] || "bin";
      setFileName(`decoded.${ext}`);
    } catch {
      setError(tk.invalidBase64 || "Invalid Base64 string");
    }
  }, [output, tk.invalidBase64]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodeLabel = tk.encode || "Encode";
  const decodeLabel = tk.decode || "Decode";
  const dropLabel = tk.dropFile || "Drop a file here or click to browse";
  const outputLabel = mode === "encode" ? (tk.base64Output || "Base64 Output") : (tk.base64Input || "Base64 Input");
  const copyLabel = tk.copy || "Copy";
  const copiedLabel = tk.copied || "Copied!";
  const decodeBtnLabel = tk.decodeBase64 || "Decode & Download";
  const downloadLabel = tk.download || "Download File";

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 w-fit">
        <button
          onClick={() => { setMode("encode"); setOutput(""); setError(""); setDownloadUrl(""); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "encode" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{encodeLabel}</button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); setError(""); setDownloadUrl(""); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "decode" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
        >{decodeLabel}</button>
      </div>

      {mode === "encode" ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("base64-file-input")?.click()}
          className="flex-1 flex flex-col items-center justify-center gap-3 p-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all min-h-[200px]"
        >
          <div className="text-4xl">{fileName ? "📄" : "📁"}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {fileName ? fileName : dropLabel}
          </div>
          {fileType && <div className="text-[10px] text-gray-400">{fileType}</div>}
          <input id="base64-file-input" type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{outputLabel}</label>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder={tk.pasteBase64 || "Paste Base64 string or data URI..."}
            className="flex-1 min-h-[150px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
          <button onClick={handleBase64Decode} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors w-fit">
            {decodeBtnLabel}
          </button>
          {downloadUrl && (
            <a href={downloadUrl} download={fileName} className="px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors w-fit">
              {downloadLabel} ({fileName})
            </a>
          )}
        </div>
      )}

      {output && mode === "encode" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{outputLabel}</label>
            <button onClick={copyAll} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              {copied ? copiedLabel : copyLabel}
            </button>
          </div>
          <textarea
            value={output.slice(0, 5000)}
            readOnly
            className="p-3 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px] resize-y"
            spellCheck={false}
          />
          {output.length > 5000 && (
            <div className="text-[10px] text-gray-400">{tk.truncated || "Showing first 5000 chars"}. {output.length.toLocaleString()} total.</div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}