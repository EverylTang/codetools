"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

// Common currency codes with their symbols and names
const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: "$", name: "US Dollar" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  KRW: { symbol: "₩", name: "South Korean Won" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  TWD: { symbol: "NT$", name: "Taiwan Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  CHF: { symbol: "Fr", name: "Swiss Franc" },
  THB: { symbol: "฿", name: "Thai Baht" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit" },
  PHP: { symbol: "₱", name: "Philippine Peso" },
  VND: { symbol: "₫", name: "Vietnamese Dong" },
  SEK: { symbol: "kr", name: "Swedish Krona" },
  NOK: { symbol: "kr", name: "Norwegian Krone" },
  DKK: { symbol: "kr", name: "Danish Krone" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar" },
  MXN: { symbol: "Mex$", name: "Mexican Peso" },
  BRL: { symbol: "R$", name: "Brazilian Real" },
  ZAR: { symbol: "R", name: "South African Rand" },
  RUB: { symbol: "₽", name: "Russian Ruble" },
  TRY: { symbol: "₺", name: "Turkish Lira" },
  SAR: { symbol: "﷼", name: "Saudi Riyal" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  PLN: { symbol: "zł", name: "Polish Zloty" },
};

const PRESET_AMOUNTS = [1, 10, 100, 1000, 10000, 100000];

// Free API: https://open.er-api.com has no API key needed
// Fallback: https://api.exchangerate-api.com/v4/latest/USD
const API_URL = "https://api.exchangerate-api.com/v4/latest/";

export default function CurrencyClient() {
  const { t, locale } = useI18n();
  const tk = t.tools["currency-converter"];
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("CNY");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchRates = useCallback(async (base: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}${base}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRates(data.rates || {});
      setLastUpdated(new Date(data.time_last_updated * 1000).toLocaleString(locale === "zh" ? "zh-CN" : "en-US", { timeZone: "Asia/Shanghai" }));
    } catch {
      setError(tk.fetchError || "Failed to fetch exchange rates.");
    } finally {
      setLoading(false);
    }
  }, [locale, tk]);

  useEffect(() => {
    fetchRates(from);
  }, [from, fetchRates]);

  const result = useCallback(() => {
    if (!amount || isNaN(Number(amount)) || !rates[to]) return null;
    const val = Number(amount) * rates[to];
    return val;
  }, [amount, rates, to]);

  const swapCurrencies = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const converted = result();

  const codeList = Object.keys(CURRENCIES);

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Converter Card */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {/* From */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.amount}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-3 text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[90px]"
            >
              {codeList.map((c) => (
                <option key={c} value={c}>{c} {CURRENCIES[c]?.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-3">
          <button
            onClick={swapCurrencies}
            className="p-2 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
            title={tk.swap}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.convertedTo}</label>
          <div className="flex gap-2 items-center">
            <div className="flex-1 p-3 text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 min-h-[48px] flex items-center">
              {converted !== null ? (
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {converted.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 text-sm">{loading ? (tk.loading || "Loading...") : tk.amount}</span>
              )}
              <span className="text-gray-400 dark:text-gray-500 ml-2">{CURRENCIES[to]?.symbol}</span>
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[90px]"
            >
              {codeList.map((c) => (
                <option key={c} value={c}>{c} {CURRENCIES[c]?.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Rate Display */}
        {rates[to] && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>1 {from} = {rates[to].toFixed(6)} {to}</span>
            <span>·</span>
            <span>1 {to} = {(1 / rates[to]).toFixed(6)} {from}</span>
            {loading && <span className="text-blue-500 animate-pulse">{tk.updating || "updating..."}</span>}
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
            {tk.ratesUpdated || "Rates updated"}: {lastUpdated}
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Preset Amounts */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.quickAmounts}</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a.toString())}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                Number(amount) === a
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {CURRENCIES[from]?.symbol}{a.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Pairs */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">{tk.popularPairs}</label>
        <div className="flex flex-wrap gap-2">
          {[
            ["USD", "CNY"],
            ["USD", "EUR"],
            ["USD", "JPY"],
            ["USD", "GBP"],
            ["USD", "KRW"],
            ["USD", "HKD"],
            ["CNY", "USD"],
            ["CNY", "JPY"],
            ["CNY", "HKD"],
            ["EUR", "GBP"],
            ["EUR", "USD"],
            ["GBP", "USD"],
            ["USD", "SGD"],
            ["USD", "THB"],
            ["USD", "VND"],
            ["USD", "TWD"],
          ].map(([f, t]) => (
            <button
              key={`${f}-${t}`}
              onClick={() => { setFrom(f); setTo(t); setAmount("1"); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                from === f && to === t
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {f} → {t}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
        <p>Exchange rates provided by the ExchangeRate-API free tier. Updated daily. Rates may differ from actual market rates.</p>
        <p className="mt-1">For cross-border payment calculations, always confirm with your payment provider&apos;s settlement rate.</p>
      </div>
    </div>
  );
}
