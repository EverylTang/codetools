"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const s = max === 0 ? 0 : (max - min) / max;
  const v = max;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const cr = r / 255, cg = g / 255, cb = b / 255;
  const k = 1 - Math.max(cr, cg, cb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = ((1 - cr - k) / (1 - k)) * 100;
  const m = ((1 - cg - k) / (1 - k)) * 100;
  const y = ((1 - cb - k) / (1 - k)) * 100;
  return { c: Math.round(c), m: Math.round(m), y: Math.round(y), k: Math.round(k * 100) };
}

const PRESET_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
  "#FF4757", "#2ED573", "#1E90FF", "#FFA502", "#A29BFE", "#FD79A8",
  "#2c3e50", "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6",
  "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#0a0a0a", "#ffffff",
];

export default function ColorConverterClient() {
  const { t } = useI18n();
  const tk = t.tools["color-converter"];
  const [hexInput, setHexInput] = useState("#4ECDC4");

  const rgb = useMemo(() => hexToRgb(hexInput), [hexInput]);
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb]);
  const hsv = useMemo(() => rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null, [rgb]);
  const cmyk = useMemo(() => rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null, [rgb]);

  const handleHexInput = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith("#")) clean = "#" + clean;
    setHexInput(clean);
  };

  const handleRgbInput = (r: number, g: number, b: number) => {
    const cr = Math.max(0, Math.min(255, r));
    const cg = Math.max(0, Math.min(255, g));
    const cb = Math.max(0, Math.min(255, b));
    setHexInput(rgbToHex(cr, cg, cb));
  };

  const handleHslInput = (h: number, s: number, l: number) => {
    const ch = Math.max(0, Math.min(360, h));
    const cs = Math.max(0, Math.min(100, s));
    const cl = Math.max(0, Math.min(100, l));
    const { r, g, b } = hslToRgb(ch, cs, cl);
    setHexInput(rgbToHex(r, g, b));
  };

  const copyToClipboard = async (val: string) => {
    await navigator.clipboard.writeText(val);
  };

  const isValid = rgb !== null;
  const isLight = rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 128 : true;

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Color Preview */}
      <div
        className="h-32 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: isValid ? hexInput : "#cccccc" }}
      >
        <div className={`text-lg font-bold font-mono ${isLight ? "text-gray-900" : "text-white"} ${isValid ? "" : "text-gray-500"}`}>
          {isValid ? hexInput.toUpperCase() : t.common.invalidInput}
        </div>
      </div>

      {/* HEX Input */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">HEX</label>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexInput(e.target.value)}
          placeholder="#000000"
          className="w-full p-3 text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Converted Values */}
      <div className="grid gap-3">
        {/* RGB */}
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">RGB</div>
          <div className="flex items-center gap-2">
            {rgb ? (
              <>
                <input type="number" value={rgb.r} onChange={(e) => handleRgbInput(parseInt(e.target.value) || 0, rgb.g, rgb.b)} className="w-16 p-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" min={0} max={255} />
                <input type="number" value={rgb.g} onChange={(e) => handleRgbInput(rgb.r, parseInt(e.target.value) || 0, rgb.b)} className="w-16 p-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" min={0} max={255} />
                <input type="number" value={rgb.b} onChange={(e) => handleRgbInput(rgb.r, rgb.g, parseInt(e.target.value) || 0)} className="w-16 p-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" min={0} max={255} />
                <span className="text-[10px] text-gray-400 ml-1">R G B</span>
                <button
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="ml-auto px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  📋
                </button>
              </>
            ) : <span className="text-sm text-gray-400">—</span>}
          </div>
        </div>

        {/* HSL */}
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">HSL</div>
          <div className="flex items-center gap-2">
            {hsl ? (
              <>
                <input type="number" value={hsl.h} onChange={(e) => handleHslInput(parseInt(e.target.value) || 0, hsl.s, hsl.l)} className="w-16 p-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" min={0} max={360} />
                <input type="number" value={hsl.s} onChange={(e) => handleHslInput(hsl.h, parseInt(e.target.value) || 0, hsl.l)} className="w-16 p-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" min={0} max={100} />
                <input type="number" value={hsl.l} onChange={(e) => handleHslInput(hsl.h, hsl.s, parseInt(e.target.value) || 0)} className="w-16 p-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" min={0} max={100} />
                <span className="text-[10px] text-gray-400 ml-1">H° S% L%</span>
                <button
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                  className="ml-auto px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  📋
                </button>
              </>
            ) : <span className="text-sm text-gray-400">—</span>}
          </div>
        </div>

        {/* HSV */}
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">HSV</div>
          <div className="flex items-center">
            {hsv ? (
              <>
                <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{hsv.h}° {hsv.s}% {hsv.v}%</span>
                <button
                  onClick={() => copyToClipboard(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`)}
                  className="ml-auto px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  📋
                </button>
              </>
            ) : <span className="text-sm text-gray-400">—</span>}
          </div>
        </div>

        {/* CMYK */}
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">CMYK</div>
          <div className="flex items-center">
            {cmyk ? (
              <>
                <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{cmyk.c}% {cmyk.m}% {cmyk.y}% {cmyk.k}%</span>
                <button
                  onClick={() => copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)}
                  className="ml-auto px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  📋
                </button>
              </>
            ) : <span className="text-sm text-gray-400">—</span>}
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.presetColors}</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setHexInput(c)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                hexInput.toLowerCase() === c.toLowerCase()
                  ? "border-blue-500 scale-110 shadow-md"
                  : "border-gray-300 dark:border-gray-600 hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500">
        RGB: 0-255 · HSL: H° 0-360, S% 0-100, L% 0-100 · All values are editable — change any value to see the color update in real-time.
      </div>
    </div>
  );
}
