"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

// Standard cron fields: minute hour day-of-month month day-of-week
// Supports: * , - / numeric
// Standard 5-field cron (no seconds)

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

const PRESETS: { key: keyof typeof import("@/lib/i18n/translations").translations.en.tools.cron.presetsList; desc: string; cron: string }[] = [
  { key: "everyMinute", desc: "* * * * *", cron: "* * * * *" },
  { key: "every5Minutes", desc: "*/5 * * * *", cron: "*/5 * * * *" },
  { key: "everyHour", desc: "0 * * * *", cron: "0 * * * *" },
  { key: "dailyMidnight", desc: "0 0 * * *", cron: "0 0 * * *" },
  { key: "daily9am", desc: "0 9 * * *", cron: "0 9 * * *" },
  { key: "weekdays9am", desc: "0 9 * * 1-5", cron: "0 9 * * 1-5" },
  { key: "everyMonday", desc: "0 0 * * 1", cron: "0 0 * * 1" },
  { key: "monthly1st", desc: "0 0 1 * *", cron: "0 0 1 * *" },
  { key: "every30min", desc: "*/30 * * * *", cron: "*/30 * * * *" },
  { key: "workHours10min", desc: "*/10 9-17 * * 1-5", cron: "*/10 9-17 * * 1-5" },
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Parse & validate cron expression fields
const FIELD_RANGES: Record<string, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 }, // 0 and 7 = Sun
};

function parseCronField(field: string, range: { min: number; max: number }): number[] | null {
  const values = new Set<number>();
  const parts = field.split(",");
  
  for (const part of parts) {
    if (part === "*") {
      for (let i = range.min; i <= range.max; i++) values.add(i);
      continue;
    }
    
    const stepMatch = part.match(/^(\d+|\*)-(\d+|\*)\/(\d+)$/);
    if (stepMatch) {
      const start = stepMatch[1] === "*" ? range.min : parseInt(stepMatch[1]);
      const end = stepMatch[2] === "*" ? range.max : parseInt(stepMatch[2]);
      const step = parseInt(stepMatch[3]);
      for (let i = start; i <= end; i += step) values.add(i);
      continue;
    }
    
    const slashMatch = part.match(/^\*\/(\d+)$/);
    if (slashMatch) {
      const step = parseInt(slashMatch[1]);
      for (let i = range.min; i <= range.max; i += step) values.add(i);
      continue;
    }
    
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      for (let i = start; i <= end; i++) values.add(i);
      continue;
    }
    
    const num = parseInt(part);
    if (!isNaN(num) && num >= range.min && num <= range.max) {
      values.add(num);
    }
  }
  
  return values.size > 0 ? Array.from(values).sort((a, b) => a - b) : null;
}

function matchesDayOfWeek(dayOfWeek: number, dowField: number[]): boolean {
  return dowField.includes(dayOfWeek) || dowField.includes(7); // 7 = Sun
}

function getNextRuns(cronExpr: string, count: number = 10): Date[] {
  try {
    const parts = cronExpr.trim().split(/\s+/);
    if (parts.length !== 5) return [];

    const [minuteF, hourF, domF, monthF, dowF] = parts;
    const minutes = parseCronField(minuteF, FIELD_RANGES.minute);
    const hours = parseCronField(hourF, FIELD_RANGES.hour);
    const doms = parseCronField(domF, FIELD_RANGES.dayOfMonth);
    const months = parseCronField(monthF, FIELD_RANGES.month);
    const dows = parseCronField(dowF, FIELD_RANGES.dayOfWeek);

    if (!minutes || !hours || !doms || !months || !dows) return [];

    const results: Date[] = [];
    const now = new Date();
    // Start from next minute
    const current = new Date(now);
    current.setSeconds(0, 0);
    current.setMinutes(current.getMinutes() + 1);

    const maxIterations = 525600; // 1 year in minutes
    let iterations = 0;

    while (results.length < count && iterations < maxIterations) {
      const month = current.getMonth() + 1; // 1-indexed
      const day = current.getDate();
      const hour = current.getHours();
      const minute = current.getMinutes();
      const dayOfWeek = current.getDay();

      const monthMatch = months.includes(month);
      const domMatch = doms.includes(day);
      const dowMatch = matchesDayOfWeek(dayOfWeek, dows);
      
      // If both dom and dow are not *, either can match (OR logic)
      const isWildcardDom = domF === "*";
      const isWildcardDow = dowF === "*";
      
      let dayMatch: boolean;
      if (isWildcardDom && isWildcardDow) {
        dayMatch = true;
      } else if (!isWildcardDom && !isWildcardDow) {
        dayMatch = domMatch || dowMatch; // OR logic when both specified
      } else if (!isWildcardDom) {
        dayMatch = domMatch;
      } else {
        dayMatch = dowMatch;
      }

      if (monthMatch && dayMatch && hours.includes(hour) && minutes.includes(minute)) {
        results.push(new Date(current));
      }

      // Advance by 1 minute
      current.setMinutes(current.getMinutes() + 1);
      iterations++;
    }

    return results;
  } catch {
    return [];
  }
}

function formatDate(d: Date, locale: "en" | "zh"): string {
  if (locale === "zh") {
    return d.toLocaleString("zh-CN", {
      month: "short",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  const dow = DAY_NAMES[d.getDay()];
  const mon = MONTH_NAMES[d.getMonth()];
  const day = d.getDate().toString().padStart(2, "0");
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${dow} ${mon} ${day} ${h}:${m}`;
}

export default function CronClient() {
  const { t, locale } = useI18n();
  const tk = t.tools.cron;
  const [cronInput, setCronInput] = useState("*/5 * * * *");

  const nextRuns = useMemo(() => {
    return getNextRuns(cronInput, 10);
  }, [cronInput]);

  const error = nextRuns.length === 0 && cronInput.trim()
    ? t.common.invalidInput
    : "";

  const parts = useMemo((): CronParts | null => {
    const p = cronInput.trim().split(/\s+/);
    if (p.length !== 5) return null;
    return { minute: p[0], hour: p[1], dayOfMonth: p[2], month: p[3], dayOfWeek: p[4] };
  }, [cronInput]);

  const handlePreset = (cron: string) => {
    setCronInput(cron);
  };

  const updateField = (field: keyof CronParts, value: string) => {
    if (!parts) return;
    const newParts = { ...parts, [field]: value };
    setCronInput(`${newParts.minute} ${newParts.hour} ${newParts.dayOfMonth} ${newParts.month} ${newParts.dayOfWeek}`);
  };

  // Human readable description
  const description = useMemo(() => {
    if (!parts) return "";
    const m = parts.minute, h = parts.hour, dom = parts.dayOfMonth, mon = parts.month, dow = parts.dayOfWeek;
    
    if (m === "*" && h === "*" && dom === "*" && mon === "*" && dow === "*") return "Every minute";
    if (m === "0" && h === "*" && dom === "*" && mon === "*" && dow === "*") return "Every hour";
    if (m === "0" && h === "0" && dom === "*" && mon === "*" && dow === "*") return "Daily at midnight";
    if (m === "0" && h === "9" && dom === "*" && mon === "*" && dow === "*") return "Daily at 09:00";
    if (dow === "1-5" && h === "0" && m === "0" && dom === "*" && mon === "*") return "Weekdays at midnight";
    if (dom === "1" && h === "0" && m === "0" && mon === "*" && dow === "*") return "First day of every month at midnight";
    
    return "";
  }, [parts]);

  // Quick select options for each field
  const minuteOptions = useMemo(() => {
    const opts: { label: string; value: string }[] = [{ label: t.common.every, value: "*" }];
    for (let i = 0; i <= 59; i += 5) opts.push({ label: `:${i.toString().padStart(2, "0")}`, value: i.toString() });
    return opts;
  }, [t.common.every]);

  const hourOptions = useMemo(() => {
    const opts: { label: string; value: string }[] = [{ label: t.common.every, value: "*" }];
    for (let i = 0; i <= 23; i++) opts.push({ label: `${i.toString().padStart(2, "0")}:00`, value: i.toString() });
    return opts;
  }, [t.common.every]);

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePreset(p.cron)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
              cronInput === p.cron
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {tk.presetsList[p.key]}
            <span className="ml-1 opacity-60">{p.desc}</span>
          </button>
        ))}
      </div>

      {/* Cron Expression Input */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.expression}</label>
        <div className="flex gap-1">
          <input
            type="text"
            value={cronInput}
            onChange={(e) => setCronInput(e.target.value)}
            placeholder="* * * * *"
            className="flex-1 p-2.5 text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center tracking-wider"
            spellCheck={false}
          />
          <button
            onClick={() => setCronInput("* * * * *")}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {tk.clear}
          </button>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-400 dark:text-gray-500 px-1">
          <span>{tk.minute}</span>
          <span>{tk.hour}</span>
          <span>{tk.dayOfMonth}</span>
          <span>{tk.month}</span>
          <span>{tk.dayOfWeek}</span>
        </div>
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}

      {/* Field Labels + Description */}
      {parts && (
        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {description || `${tk.minute}: ${parts.minute} · ${tk.hour}: ${parts.hour} · ${tk.dayOfMonth}: ${parts.dayOfMonth} · ${tk.month}: ${parts.month} · ${tk.dayOfWeek}: ${parts.dayOfWeek}`}
          </div>
        </div>
      )}

      {/* Quick Reference: Field Selectors */}
      <details className="group" open>
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none font-medium">
          {tk.visualEditor}
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
          {/* Minute */}
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">{tk.minute}</label>
            <select
              value={parts?.minute || "*"}
              onChange={(e) => updateField("minute", e.target.value)}
              className="w-full p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {minuteOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {/* Hour */}
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">{tk.hour}</label>
            <select
              value={parts?.hour || "*"}
              onChange={(e) => updateField("hour", e.target.value)}
              className="w-full p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {hourOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {/* Day of Month */}
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">{tk.dayOfMonth}</label>
            <select
              value={parts?.dayOfMonth || "*"}
              onChange={(e) => updateField("dayOfMonth", e.target.value)}
              className="w-full p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="*">{t.common.every}</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d.toString()}>{d}</option>
              ))}
            </select>
          </div>
          {/* Month */}
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">{tk.month}</label>
            <select
              value={parts?.month || "*"}
              onChange={(e) => updateField("month", e.target.value)}
              className="w-full p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="*">{t.common.every}</option>
              {tk.monthNames.map((name, i) => (
                <option key={i + 1} value={(i + 1).toString()}>{name}</option>
              ))}
            </select>
          </div>
          {/* Day of Week */}
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">{tk.dayOfWeek}</label>
            <select
              value={parts?.dayOfWeek || "*"}
              onChange={(e) => updateField("dayOfWeek", e.target.value)}
              className="w-full p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="*">{t.common.every}</option>
              <option value="1-5">{tk.weekdays}</option>
              <option value="0,6">{tk.weekends}</option>
              <option value="1">{tk.monday}</option>
              <option value="2">{tk.tuesday}</option>
              <option value="3">{tk.wednesday}</option>
              <option value="4">{tk.thursday}</option>
              <option value="5">{tk.friday}</option>
              <option value="6">{tk.saturday}</option>
              <option value="0">{tk.sunday}</option>
            </select>
          </div>
        </div>
      </details>

      {/* Next Runs */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.nextRuns}</label>
          {nextRuns.length > 0 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {tk.basedOnCurrentTime}
            </span>
          )}
        </div>
        {nextRuns.length > 0 ? (
          <div className="space-y-1">
            {nextRuns.map((date, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-2 rounded-lg border ${
                  i === 0
                    ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                <span className="text-[10px] font-mono text-gray-400 w-5 text-right">{i + 1}.</span>
                <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{formatDate(date, locale)}</span>
                {i === 0 && (
                  <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 ml-auto">{t.common.next}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <div className="text-3xl mb-2">⏰</div>
              <p>{t.common.invalidInput}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
        <p>{t.common.format}: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">minute hour day-of-month month day-of-week</code></p>
        <p className="mt-1">{t.common.supports}: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">*</code>, <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">,</code>, <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">-</code>, <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">/</code>, <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">*/5</code></p>
      </div>
    </div>
  );
}
