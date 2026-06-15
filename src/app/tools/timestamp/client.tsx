"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export default function TimestampClient() {
  const { t, locale } = useI18n();
  const tk = t.tools.timestamp;
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [copiedTs, setCopiedTs] = useState(false);
  const [copiedDate, setCopiedDate] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [precision, setPrecision] = useState<"seconds" | "milliseconds">("seconds");

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnixChange = (val: string) => {
    setUnixInput(val);
    const num = parseInt(val, 10);
    if (isNaN(num)) { setDateInput(""); return; }
    const ms = precision === "milliseconds" ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) { setDateInput(""); return; }
    try {
      setDateInput(date.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    } catch {
      setDateInput(date.toISOString().replace("T", " ").substring(0, 19));
    }
  };

  const handleDateChange = (val: string) => {
    setDateInput(val);
    if (!val) { setUnixInput(""); return; }
    const date = new Date(val);
    if (isNaN(date.getTime())) { setUnixInput(""); return; }
    const ts = precision === "milliseconds" ? date.getTime() : Math.floor(date.getTime() / 1000);
    setUnixInput(ts.toString());
  };

  const fillNow = () => {
    const ts = precision === "milliseconds" ? Date.now() : Math.floor(Date.now() / 1000);
    setUnixInput(ts.toString());
    handleUnixChange(ts.toString());
  };

  const copyUnix = async () => {
    await navigator.clipboard.writeText(unixInput);
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 2000);
  };

  const copyDate = async () => {
    await navigator.clipboard.writeText(dateInput);
    setCopiedDate(true);
    setTimeout(() => setCopiedDate(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Current Time */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{tk.currentUnixTime}</div>
        <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">{now}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{tk.updatesEverySecond}</div>
      </div>

      {/* Precision */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">{tk.precision}:</span>
        <button
          onClick={() => { setPrecision("seconds"); setUnixInput(""); setDateInput(""); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            precision === "seconds"
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          {tk.seconds}
        </button>
        <button
          onClick={() => { setPrecision("milliseconds"); setUnixInput(""); setDateInput(""); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            precision === "milliseconds"
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          {tk.milliseconds}
        </button>
        <button onClick={fillNow} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {tk.now}
        </button>
      </div>

      {/* Unix → Date */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.unixTimestamp}</label>
          {unixInput && (
            <button onClick={copyUnix} className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {copiedTs ? t.copied : t.copy}
            </button>
          )}
        </div>
        <input
          type="text"
          value={unixInput}
          onChange={(e) => handleUnixChange(e.target.value)}
          placeholder={`${tk.unixTimestamp} (${precision === "seconds" ? tk.seconds : tk.milliseconds})`}
          className="w-full p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Arrow */}
      <div className="flex justify-center text-gray-400 dark:text-gray-500 text-xl">↓ ↑</div>

      {/* Date → Unix */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.humanDate}</label>
          {dateInput && (
            <button onClick={copyDate} className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {copiedDate ? t.copied : t.copy}
            </button>
          )}
        </div>
        <input
          type="text"
          value={dateInput}
          onChange={(e) => handleDateChange(e.target.value)}
          placeholder="2026-06-16T12:00:00"
          className="w-full p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Timezone */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.timezone}</label>
        <select
          value={timezone}
          onChange={(e) => { setTimezone(e.target.value); if (unixInput) handleUnixChange(unixInput); }}
          className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      {/* Examples */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.quickExamples}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Now - 1h", fn: () => Math.floor((Date.now() - 3600000) / 1000).toString() },
            { label: "Today 00:00", fn: () => { const d = new Date(); d.setHours(0,0,0,0); return Math.floor(d.getTime() / 1000).toString(); } },
            { label: "2026-01-01", fn: () => Math.floor(new Date("2026-01-01").getTime() / 1000).toString() },
            { label: "2038-01-19", fn: () => Math.floor(new Date("2038-01-19").getTime() / 1000).toString() },
          ].map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleUnixChange(ex.fn())}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
