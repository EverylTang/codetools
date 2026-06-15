import { CalculatorState, MarginResult } from "./types";

const escapeHtml = (value: unknown) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const sheet = (title: string, rows: unknown[][]) => `
  <h2>${escapeHtml(title)}</h2>
  <table border="1">
    ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
  </table>
`;

export function buildExcelHtml(state: CalculatorState, result: MarginResult): string {
  const summaryRows = [
    ["Merchant", state.merchant.merchantName],
    ["Date", state.merchant.date],
    ["Country", state.merchant.country],
    ["MCC", state.merchant.mcc],
    ["Settlement currency", state.merchant.settlementCurrency],
    ["Average ticket", result.avgTicket],
    ["Monthly GMV", result.monthlyGmv],
    ["Monthly transactions", result.monthlyTxnCount],
    ["Total revenue", result.totalRevenue],
    ["Total cost", result.totalCost],
    ["Processing revenue", result.processingRevenue],
    ["Processing cost", result.processingCost],
    ["Processing margin", result.processingMargin],
    ["FX revenue", result.fxRevenue],
    ["FX cost", result.fxCost],
    ["FX margin", result.fxMargin],
    ["Total gross margin", result.totalGrossMargin],
    ["Margin rate", `${result.marginRate}%`],
    ["Notes", state.merchant.notes],
    ["Disclaimer", "For estimation only. Actual settlement and channel costs prevail."],
  ];

  const merchantRows = [
    ["Field", "Value"],
    ["Merchant", state.merchant.merchantName],
    ["Country", state.merchant.country],
    ["MCC", state.merchant.mcc],
    ["Date", state.merchant.date],
    ["Settlement currency", state.merchant.settlementCurrency],
    ["Notes", state.merchant.notes],
  ];

  const volumeRows = [
    ["Field", "Value"],
    ["Mode", state.volume.mode],
    ["Average ticket", state.volume.avgTicket],
    ["Txn/day", state.volume.txnPerDay],
    ["Billing days", state.volume.billingDays],
    ["Monthly GMV input", state.volume.monthlyGmv],
    ["Monthly txn count input", state.volume.monthlyTxnCount],
    ["Derived monthly GMV", result.monthlyGmv],
    ["Derived monthly txn count", result.monthlyTxnCount],
    ["Derived average ticket", result.avgTicket],
  ];

  const mixRows = [
    ["Enabled", "Method", "Type", "User region", "GMV share %", "Txn share %", "Quote variable %", "Quote fixed", "Quote fixed ccy", "Cost variable %", "Cost fixed", "Cost fixed ccy", "Cost notes"],
    ...state.payments.map((row) => [
      row.enabled ? "Yes" : "No",
      row.method,
      row.transactionType,
      row.userRegion,
      row.gmvSharePercent,
      row.txnSharePercent ?? row.gmvSharePercent,
      row.quoteVariablePercent,
      row.quoteFixedFee,
      row.quoteFixedCurrency,
      row.costVariablePercent,
      row.costFixedFee,
      row.costFixedCurrency,
      row.costNotes,
    ]),
  ];

  const detailRows = [
    ["Method", "Type", "User region", "GMV share %", "Txn share %", "GMV", "Txn count", "Revenue", "Cost", "Margin", "Margin rate %"],
    ...result.detailRows.map((row) => [row.method, row.transactionType, row.userRegion, row.gmvSharePercent, row.txnSharePercent, row.gmv, row.txnCount, row.revenue, row.cost, row.margin, row.marginRate]),
  ];

  const fxRows = [
    ["Order currency", state.fx.orderCurrency],
    ["Settlement currency", state.fx.settlementCurrency],
    ["FX markup %", state.fx.markupPercent],
    ["Channel FX cost %", state.fx.channelCostPercent],
    ["Internal FX cost %", state.fx.internalCostPercent],
    ["Eligible GMV %", state.fx.eligibleGmvPercent],
    ["FX revenue", result.fxRevenue],
    ["FX cost", result.fxCost],
    ["FX margin", result.fxMargin],
  ];

  const rateRows = [
    ["From", "To", "Rate", "Source"],
    ...Object.entries(state.exchangeRates).map(([currency, rate]) => [currency, state.merchant.settlementCurrency, rate, "Manual"]),
  ];

  return `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        ${sheet("Summary", summaryRows)}
        ${sheet("Merchant", merchantRows)}
        ${sheet("Volume", volumeRows)}
        ${sheet("Payment Mix", mixRows)}
        ${sheet("FX", fxRows)}
        ${sheet("Exchange Rates", rateRows)}
        ${sheet("Details", detailRows)}
      </body>
    </html>
  `;
}

export function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  window.setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 1000);
}
