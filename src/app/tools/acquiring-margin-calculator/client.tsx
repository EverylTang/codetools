"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { calculateMargin } from "./calculations";
import { buildExcelHtml, downloadText } from "./exportExcel";
import { COUNTRIES, CURRENCIES, DEFAULT_EXCHANGE_RATES, DEFAULT_STATE, METHODS, TRANSACTION_TYPES, VERSION } from "./defaults";
import { CalculatorState, CurrencyCode, FxConfig, MerchantInput, PaymentRow, VolumeInput } from "./types";

const cloneDefaultState = (): CalculatorState => JSON.parse(JSON.stringify(DEFAULT_STATE));

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (value: number, currency: CurrencyCode, locale: string) =>
  `${value.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits: 2 })} ${currency}`;

const formatNumber = (value: number, locale: string) =>
  value.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits: 2 });

const safeFilename = (name: string) => name.trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-").replace(/^-|-$/g, "") || "merchant";

const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500";
const smallInputClass = "w-full min-w-[76px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500";

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
        <div className="text-[10px] uppercase tracking-wide text-blue-500 font-semibold">{label}</div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function NumberInput({ value, onChange, step = "0.01", disabled = false }: { value: number; onChange: (value: number) => void; step?: string; disabled?: boolean }) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      disabled={disabled}
      onChange={(event) => onChange(toNumber(event.target.value))}
      className={`${smallInputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800`}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className={smallInputClass}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function makePaymentId(method: string) {
  return `${method.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function AcquiringMarginClient() {
  const { t, locale } = useI18n();
  const tk = t.tools["acquiring-margin-calculator"];
  const [state, setState] = useState<CalculatorState>(() => cloneDefaultState());
  const [notice, setNotice] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const result = useMemo(() => calculateMargin(state), [state]);
  const ccy = state.merchant.settlementCurrency;

  const updateMerchant = <K extends keyof MerchantInput>(key: K, value: MerchantInput[K]) => {
    setState((current) => ({
      ...current,
      merchant: { ...current.merchant, [key]: value },
      fx: key === "settlementCurrency" ? { ...current.fx, settlementCurrency: value as CurrencyCode } : current.fx,
    }));
  };

  const updateVolume = <K extends keyof VolumeInput>(key: K, value: VolumeInput[K]) => {
    setState((current) => ({ ...current, volume: { ...current.volume, [key]: value } }));
  };

  const updatePayment = <K extends keyof PaymentRow>(id: string, key: K, value: PaymentRow[K]) => {
    setState((current) => ({
      ...current,
      payments: current.payments.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    }));
  };

  const addPayment = () => {
    setState((current) => ({
      ...current,
      payments: [
        ...current.payments,
        {
          id: makePaymentId("other"),
          enabled: true,
          method: "Other",
          transactionType: "Alternative payment",
          userRegion: current.merchant.country,
          gmvSharePercent: 0,
          txnSharePercent: null,
          quoteVariablePercent: 0,
          quoteFixedFee: 0,
          quoteFixedCurrency: current.merchant.settlementCurrency,
          costVariablePercent: 0,
          costFixedFee: 0,
          costFixedCurrency: current.merchant.settlementCurrency,
          costNotes: "",
        },
      ],
    }));
  };

  const copyPayment = (row: PaymentRow) => {
    setState((current) => ({
      ...current,
      payments: [...current.payments, { ...row, id: makePaymentId(row.method), gmvSharePercent: 0, txnSharePercent: row.txnSharePercent === null ? null : 0 }],
    }));
  };

  const deletePayment = (id: string) => {
    setState((current) => ({ ...current, payments: current.payments.filter((row) => row.id !== id) }));
  };

  const updateFx = <K extends keyof FxConfig>(key: K, value: FxConfig[K]) => {
    setState((current) => ({ ...current, fx: { ...current.fx, [key]: value } }));
  };

  const updateRate = (currency: CurrencyCode, value: number) => {
    setState((current) => ({ ...current, exchangeRates: { ...current.exchangeRates, [currency]: value } }));
  };

  const dateStr = () => {
    const d = new Date(state.merchant.date || Date.now());
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const saveJson = () => {
    const filename = `acquiring-margin-${safeFilename(state.merchant.merchantName)}-${dateStr()}.json`;
    downloadText(filename, JSON.stringify({ ...state, result, savedAt: new Date().toISOString() }, null, 2), "application/json;charset=utf-8");
    setNotice(tk.saved || "JSON saved.");
  };

  const exportExcel = () => {
    if (result.errors.length) {
      setNotice(tk.fixErrors || "Fix validation errors before exporting.");
      return;
    }
    const filename = `acquiring-margin-${safeFilename(state.merchant.merchantName)}-${dateStr()}.xls`;
    downloadText(filename, buildExcelHtml(state, result), "application/vnd.ms-excel;charset=utf-8");
    setNotice(tk.exported || "Excel file exported.");
  };

  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Partial<CalculatorState>;
      if (!data.merchant || !data.payments || !data.fx) throw new Error("Invalid calculator file");
      setState({
        version: data.version || VERSION,
        merchant: { ...DEFAULT_STATE.merchant, ...data.merchant },
        volume: { ...DEFAULT_STATE.volume, ...data.volume },
        payments: data.payments,
        fx: { ...DEFAULT_STATE.fx, ...data.fx },
        exchangeRates: { ...DEFAULT_EXCHANGE_RATES, ...data.exchangeRates },
      });
      setNotice(tk.imported || "JSON imported.");
    } catch {
      setNotice(tk.importFailed || "Import failed.");
    } finally {
      event.target.value = "";
    }
  };

  const reset = () => {
    setState(cloneDefaultState());
    setNotice(tk.resetDone || "Calculator reset.");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{tk.importJson}</button>
        <button onClick={saveJson} className="px-3 py-2 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">{tk.saveJson}</button>
        <button onClick={exportExcel} className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{tk.exportExcel}</button>
        <button onClick={reset} className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{tk.reset}</button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={importJson} className="hidden" />
        {notice && <span className="text-xs text-blue-500">{notice}</span>}
      </div>

      <Section label="01" title={tk.merchantInputs}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {tk.merchantName}
            <input value={state.merchant.merchantName} onChange={(event) => updateMerchant("merchantName", event.target.value)} className={`mt-1 ${inputClass}`} />
          </label>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {tk.date}
            <input type="date" value={state.merchant.date} onChange={(event) => updateMerchant("date", event.target.value)} className={`mt-1 ${inputClass}`} />
          </label>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {tk.country}
            <select value={state.merchant.country} onChange={(event) => updateMerchant("country", event.target.value)} className={`mt-1 ${inputClass}`}>
              {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
          </label>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {tk.settlementCurrency}
            <select value={state.merchant.settlementCurrency} onChange={(event) => updateMerchant("settlementCurrency", event.target.value as CurrencyCode)} className={`mt-1 ${inputClass}`}>
              {CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
            </select>
          </label>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {tk.mcc}
            <input value={state.merchant.mcc} onChange={(event) => updateMerchant("mcc", event.target.value)} className={`mt-1 ${inputClass}`} />
          </label>
          <label className="text-xs text-gray-500 dark:text-gray-400 sm:col-span-2">
            {tk.notes || "Notes"}
            <textarea value={state.merchant.notes} onChange={(event) => updateMerchant("notes", event.target.value)} rows={3} className={`mt-1 ${inputClass}`} />
          </label>
        </div>
      </Section>

      <Section label="02" title={tk.volume || "Volume"}>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            ["ticketAndTxn", tk.ticketMode || "Avg ticket + txn/day"],
            ["monthlyDirect", tk.monthlyMode || "Monthly GMV + txns"],
          ].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => updateVolume("mode", mode as VolumeInput["mode"])}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${state.volume.mode === mode ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {state.volume.mode === "ticketAndTxn" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.avgTicket}<div className="mt-1"><NumberInput value={state.volume.avgTicket} onChange={(value) => updateVolume("avgTicket", value)} /></div></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.txnPerDay}<div className="mt-1"><NumberInput value={state.volume.txnPerDay} onChange={(value) => updateVolume("txnPerDay", value)} step="1" /></div></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.billingDays}<div className="mt-1"><NumberInput value={state.volume.billingDays} onChange={(value) => updateVolume("billingDays", value)} step="1" /></div></label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.monthlyGmv}<div className="mt-1"><NumberInput value={state.volume.monthlyGmv} onChange={(value) => updateVolume("monthlyGmv", value)} /></div></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.monthlyTxn}<div className="mt-1"><NumberInput value={state.volume.monthlyTxnCount} onChange={(value) => updateVolume("monthlyTxnCount", value)} step="1" /></div></label>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-gray-500 dark:text-gray-400">
          <div>{tk.monthlyGmv}: <span className="text-gray-900 dark:text-gray-100">{formatMoney(result.monthlyGmv, ccy, locale)}</span></div>
          <div>{tk.monthlyTxn}: <span className="text-gray-900 dark:text-gray-100">{formatNumber(result.monthlyTxnCount, locale)}</span></div>
          <div>{tk.avgTicket}: <span className="text-gray-900 dark:text-gray-100">{formatMoney(result.avgTicket, ccy, locale)}</span></div>
        </div>
      </Section>

      <Section label="03" title={tk.paymentStructure || "Payment Structure, Quote & Cost"}>
        <div className="flex justify-between items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">{tk.mixHint}</p>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer select-none" onClick={() => setShowAdvanced((prev) => !prev)}>
                <span className={`inline-block w-3 h-3 rounded border ${showAdvanced ? "bg-blue-500 border-blue-500" : "border-gray-400 dark:border-gray-500"}`}>
                  {showAdvanced && <span className="flex items-center justify-center text-white text-[8px] font-bold">✓</span>}
                </span>
                {tk.advanced || "Advanced"}
              </label>
            </div>
            <button onClick={addPayment} className="shrink-0 px-3 py-2 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">{tk.addRow || "Add row"}</button>
          </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] text-left text-xs">
            <thead className="text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-2 pr-3">{tk.enabled || "Enabled"}</th>
                <th className="py-2 pr-3">{tk.method}</th>
                <th className="py-2 pr-3">{tk.type}</th>
                <th className="py-2 pr-3">{tk.userRegion || "User region"}</th>
                <th className="py-2 pr-3">{tk.gmvShare || "GMV share %"}</th>
                <th className="py-2 pr-3">{tk.txnShare || "Txn share %"}</th>
                {showAdvanced && <th className="py-2 pr-3">{tk.minFee || "Min fee"}</th>}
                {showAdvanced && <th className="py-2 pr-3">{tk.maxFee || "Max fee"}</th>}
                <th className="py-2 pr-3">{tk.variablePercent}</th>
                <th className="py-2 pr-3">{tk.fixed}</th>
                <th className="py-2 pr-3">{tk.fixedCurrency}</th>
                <th className="py-2 pr-3">{tk.costVariable}</th>
                <th className="py-2 pr-3">{tk.costFixed}</th>
                <th className="py-2 pr-3">{tk.costNotes || "Cost notes"}</th>
                <th className="py-2 pr-3">{tk.actions || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {state.payments.map((row) => (
                <tr key={row.id} className={!row.enabled ? "opacity-50" : ""}>
                  <td className="py-2 pr-3"><input type="checkbox" checked={row.enabled} onChange={(event) => updatePayment(row.id, "enabled", event.target.checked)} /></td>
                  <td className="py-2 pr-3"><Select value={row.method} onChange={(value) => updatePayment(row.id, "method", value)} options={METHODS} /></td>
                  <td className="py-2 pr-3"><Select value={row.transactionType} onChange={(value) => updatePayment(row.id, "transactionType", value)} options={TRANSACTION_TYPES} /></td>
                  <td className="py-2 pr-3"><input value={row.userRegion} onChange={(event) => updatePayment(row.id, "userRegion", event.target.value)} className={smallInputClass} /></td>
                  <td className="py-2 pr-3"><NumberInput value={row.gmvSharePercent} onChange={(value) => updatePayment(row.id, "gmvSharePercent", value)} /></td>
                  <td className="py-2 pr-3"><NumberInput value={row.txnSharePercent ?? row.gmvSharePercent} onChange={(value) => updatePayment(row.id, "txnSharePercent", value)} /></td>
                  {showAdvanced && <td className="py-2 pr-3"><NumberInput value={row.minFee ?? 0} onChange={(value) => updatePayment(row.id, "minFee", value)} /></td>}
                  {showAdvanced && <td className="py-2 pr-3"><NumberInput value={row.maxFee ?? 0} onChange={(value) => updatePayment(row.id, "maxFee", value)} /></td>}
                  <td className="py-2 pr-3"><NumberInput value={row.quoteVariablePercent} onChange={(value) => updatePayment(row.id, "quoteVariablePercent", value)} /></td>
                  <td className="py-2 pr-3"><NumberInput value={row.quoteFixedFee} onChange={(value) => updatePayment(row.id, "quoteFixedFee", value)} /></td>
                  <td className="py-2 pr-3"><Select value={row.quoteFixedCurrency} onChange={(value) => updatePayment(row.id, "quoteFixedCurrency", value as CurrencyCode)} options={CURRENCIES} /></td>
                  <td className="py-2 pr-3"><NumberInput value={row.costVariablePercent} onChange={(value) => updatePayment(row.id, "costVariablePercent", value)} /></td>
                  <td className="py-2 pr-3"><NumberInput value={row.costFixedFee} onChange={(value) => updatePayment(row.id, "costFixedFee", value)} /></td>
                  <td className="py-2 pr-3"><input value={row.costNotes} onChange={(event) => updatePayment(row.id, "costNotes", event.target.value)} className={smallInputClass} /></td>
                  <td className="py-2 pr-3">
                    <div className="flex gap-2">
                      <button onClick={() => copyPayment(row)} className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">{tk.copyRow || "Copy"}</button>
                      <button onClick={() => deletePayment(row.id)} className="px-2 py-1 rounded-md border border-red-200 text-red-600 dark:border-red-900/60 dark:text-red-300">{tk.deleteRow || "Delete"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="04" title={tk.costFx}>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.orderCurrency}<Select value={state.fx.orderCurrency} onChange={(value) => updateFx("orderCurrency", value as CurrencyCode)} options={CURRENCIES} /></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.fxEligible}<NumberInput value={state.fx.eligibleGmvPercent} onChange={(value) => updateFx("eligibleGmvPercent", value)} /></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.fxMarkup}<NumberInput value={state.fx.markupPercent} onChange={(value) => updateFx("markupPercent", value)} /></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.channelFxCost}<NumberInput value={state.fx.channelCostPercent} onChange={(value) => updateFx("channelCostPercent", value)} /></label>
            <label className="text-xs text-gray-500 dark:text-gray-400">{tk.internalFxCost || "Internal FX cost %"}<NumberInput value={state.fx.internalCostPercent} onChange={(value) => updateFx("internalCostPercent", value)} /></label>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{tk.exchangeRates}</div>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.filter((currency) => currency !== ccy).map((currency) => (
                <label key={currency} className="text-[10px] text-gray-500 dark:text-gray-400">
                  1 {currency} = ? {ccy}
                  <NumberInput value={state.exchangeRates[currency]} onChange={(value) => updateRate(currency, value)} />
                </label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section label="05" title={tk.results}>
        {result.errors.length > 0 && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-600 dark:text-red-300">
            {result.errors.map((error) => <div key={error}>{error}</div>)}
          </div>
        )}
        {result.warnings.length > 0 && (
          <div className="mb-4 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            {result.warnings.map((warning) => <div key={warning}>{warning}</div>)}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [tk.monthlyGmv, formatMoney(result.monthlyGmv, ccy, locale)],
            [tk.totalRevenue, formatMoney(result.totalRevenue, ccy, locale)],
            [tk.totalCost || "Total cost", formatMoney(result.totalCost, ccy, locale)],
            [tk.totalGrossMargin, formatMoney(result.totalGrossMargin, ccy, locale)],
            [tk.marginRate, `${result.marginRate.toFixed(4)}%`],
            [tk.processingMargin, formatMoney(result.processingMargin, ccy, locale)],
            [tk.fxMargin, formatMoney(result.fxMargin, ccy, locale)],
            [tk.monthlyTxn, formatNumber(result.monthlyTxnCount, locale)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-2 pr-3">{tk.method}</th>
                <th className="py-2 pr-3">{tk.type}</th>
                <th className="py-2 pr-3">{tk.userRegion || "User region"}</th>
                <th className="py-2 pr-3">GMV</th>
                <th className="py-2 pr-3">{tk.monthlyTxn}</th>
                <th className="py-2 pr-3">{tk.revenue}</th>
                <th className="py-2 pr-3">{tk.cost}</th>
                <th className="py-2 pr-3">{tk.margin}</th>
                <th className="py-2 pr-3">{tk.marginRate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {result.detailRows.map((row) => (
                <tr key={row.id}>
                  <td className="py-2 pr-3 font-medium text-gray-900 dark:text-gray-100">{row.method}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{row.transactionType}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{row.userRegion}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{formatMoney(row.gmv, ccy, locale)}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{formatNumber(row.txnCount, locale)}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{formatMoney(row.revenue, ccy, locale)}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{formatMoney(row.cost, ccy, locale)}</td>
                  <td className="py-2 pr-3 text-gray-900 dark:text-gray-100">{formatMoney(row.margin, ccy, locale)}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">{row.marginRate.toFixed(4)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="06" title={tk.formulas || "Formula Notes"}>
        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <p>{tk.formulaVolume || "Monthly GMV = average ticket * daily transactions * billing days, or directly from monthly input mode."}</p>
          <p>{tk.formulaRevenue || "Quote revenue = GMV * quote variable % + transaction count * quote fixed fee."}</p>
          <p>{tk.formulaCost || "Processing cost = GMV * cost variable % + transaction count * cost fixed fee."}</p>
          <p>{tk.formulaMargin || "Total gross margin = processing margin + FX margin; margin rate = total gross margin / monthly GMV."}</p>
        </div>
      </Section>
    </div>
  );
}
