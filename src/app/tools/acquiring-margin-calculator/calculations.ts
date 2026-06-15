import { CalculatorState, CurrencyCode, DetailRow, MarginResult, PaymentRow } from "./types";

const round = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const activePayments = (state: CalculatorState) => state.payments.filter((row) => row.enabled);

export function deriveVolume(state: CalculatorState) {
  if (state.volume.mode === "monthlyDirect") {
    const monthlyGmv = state.volume.monthlyGmv;
    const monthlyTxnCount = state.volume.monthlyTxnCount;
    return {
      avgTicket: monthlyTxnCount > 0 ? monthlyGmv / monthlyTxnCount : 0,
      monthlyGmv,
      monthlyTxnCount,
    };
  }

  const monthlyTxnCount = state.volume.txnPerDay * state.volume.billingDays;
  const monthlyGmv = state.volume.avgTicket * monthlyTxnCount;

  return {
    avgTicket: state.volume.avgTicket,
    monthlyGmv,
    monthlyTxnCount,
  };
}

export function convertToSettlement(amount: number, currency: CurrencyCode, state: CalculatorState): number {
  if (currency === state.merchant.settlementCurrency) return amount;
  return amount * (state.exchangeRates[currency] || 0);
}

export function validateState(state: CalculatorState): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rows = activePayments(state);
  const volume = deriveVolume(state);
  const gmvShareTotal = rows.reduce((sum, row) => sum + Number(row.gmvSharePercent || 0), 0);
  const usesIndependentTxnShare = rows.some((row) => row.txnSharePercent !== null);
  const txnShareTotal = rows.reduce((sum, row) => sum + Number(row.txnSharePercent ?? row.gmvSharePercent ?? 0), 0);

  if (!state.merchant.merchantName.trim()) errors.push("Merchant name is required before exporting.");
  if (!state.merchant.settlementCurrency) errors.push("Settlement currency is required.");
  if (volume.monthlyGmv <= 0) errors.push("Monthly GMV must be greater than 0.");
  if (volume.monthlyTxnCount <= 0) errors.push("Monthly transaction count must be greater than 0.");
  if (state.volume.mode === "ticketAndTxn" && (state.volume.billingDays < 1 || state.volume.billingDays > 31)) errors.push("Billing days must be between 1 and 31.");
  if (Math.abs(gmvShareTotal - 100) > 0.01) errors.push(`Enabled GMV share must equal 100%. Current total is ${round(gmvShareTotal)}%.`);
  if (usesIndependentTxnShare && Math.abs(txnShareTotal - 100) > 0.01) errors.push(`Enabled txn share must equal 100%. Current total is ${round(txnShareTotal)}%.`);

  for (const row of rows) {
    if (row.gmvSharePercent === 0) warnings.push(`${row.method} ${row.transactionType} has 0% GMV share.`);
    if (row.quoteVariablePercent < 0 || row.quoteFixedFee < 0) errors.push(`${row.method} ${row.transactionType} quote values cannot be negative.`);
    if (row.costVariablePercent < 0 || row.costFixedFee < 0) errors.push(`${row.method} ${row.transactionType} cost values cannot be negative.`);
    if (row.gmvSharePercent < 0 || (row.txnSharePercent ?? row.gmvSharePercent) < 0) errors.push(`${row.method} ${row.transactionType} shares cannot be negative.`);
    if (row.quoteFixedFee > 0 && !state.exchangeRates[row.quoteFixedCurrency]) errors.push(`Missing exchange rate for ${row.quoteFixedCurrency}.`);
    if (row.costFixedFee > 0 && !state.exchangeRates[row.costFixedCurrency]) errors.push(`Missing exchange rate for ${row.costFixedCurrency}.`);
    if (!row.costNotes.trim()) warnings.push(`${row.method} ${row.transactionType} has no cost note.`);
    if (row.quoteFixedCurrency !== state.merchant.settlementCurrency || row.costFixedCurrency !== state.merchant.settlementCurrency) {
      warnings.push(`${row.method} ${row.transactionType} uses non-settlement fixed fee currency.`);
    }
  }

  if (state.fx.markupPercent < 0 || state.fx.channelCostPercent < 0 || state.fx.internalCostPercent < 0 || state.fx.eligibleGmvPercent < 0) {
    errors.push("FX values cannot be negative.");
  }
  if (state.fx.eligibleGmvPercent > 100) errors.push("FX eligible GMV cannot exceed 100%.");
  if (state.fx.markupPercent < state.fx.channelCostPercent + state.fx.internalCostPercent) warnings.push("FX markup is lower than total FX cost.");

  for (const [currency, rate] of Object.entries(state.exchangeRates) as Array<[CurrencyCode, number]>) {
    if (currency !== state.merchant.settlementCurrency && rate <= 0) errors.push(`Exchange rate for ${currency} must be greater than 0.`);
  }

  return { errors, warnings };
}

function calculatePaymentRow(row: PaymentRow, state: CalculatorState, monthlyGmv: number, monthlyTxnCount: number): DetailRow {
  const txnShare = row.txnSharePercent ?? row.gmvSharePercent;
  const gmv = monthlyGmv * (row.gmvSharePercent / 100);
  const txnCount = monthlyTxnCount * (txnShare / 100);
  const fixedRevenue = convertToSettlement(row.quoteFixedFee, row.quoteFixedCurrency, state) * txnCount;
  const revenue = gmv * (row.quoteVariablePercent / 100) + fixedRevenue;
  const fixedCost = convertToSettlement(row.costFixedFee, row.costFixedCurrency, state) * txnCount;
  const variableCost = gmv * (row.costVariablePercent / 100);
  const cost = variableCost + fixedCost;
  const margin = revenue - cost;

  return {
    id: row.id,
    method: row.method,
    transactionType: row.transactionType,
    userRegion: row.userRegion,
    gmvSharePercent: row.gmvSharePercent,
    txnSharePercent: txnShare,
    gmv: round(gmv),
    txnCount: round(txnCount),
    revenue: round(revenue),
    cost: round(cost),
    margin: round(margin),
    marginRate: gmv > 0 ? round((margin / gmv) * 100, 4) : 0,
  };
}

export function calculateMargin(state: CalculatorState): MarginResult {
  const { errors, warnings } = validateState(state);
  const volume = deriveVolume(state);
  const detailRows = activePayments(state).map((row) => calculatePaymentRow(row, state, volume.monthlyGmv, volume.monthlyTxnCount));
  const processingRevenue = detailRows.reduce((sum, row) => sum + row.revenue, 0);
  const processingCost = detailRows.reduce((sum, row) => sum + row.cost, 0);
  const processingMargin = processingRevenue - processingCost;
  const fxEnabled = state.fx.orderCurrency !== state.fx.settlementCurrency && state.fx.eligibleGmvPercent > 0;
  const fxGmv = fxEnabled ? volume.monthlyGmv * (state.fx.eligibleGmvPercent / 100) : 0;
  const fxRevenue = fxGmv * (state.fx.markupPercent / 100);
  const fxCost = fxGmv * ((state.fx.channelCostPercent + state.fx.internalCostPercent) / 100);
  const fxMargin = fxRevenue - fxCost;
  const totalRevenue = processingRevenue + fxRevenue;
  const totalCost = processingCost + fxCost;
  const totalGrossMargin = processingMargin + fxMargin;

  if (totalGrossMargin < 0) warnings.push("Total gross margin is negative.");

  return {
    avgTicket: round(volume.avgTicket),
    monthlyGmv: round(volume.monthlyGmv),
    monthlyTxnCount: round(volume.monthlyTxnCount),
    processingRevenue: round(processingRevenue),
    processingCost: round(processingCost),
    processingMargin: round(processingMargin),
    fxRevenue: round(fxRevenue),
    fxCost: round(fxCost),
    fxMargin: round(fxMargin),
    totalRevenue: round(totalRevenue),
    totalCost: round(totalCost),
    totalGrossMargin: round(totalGrossMargin),
    marginRate: volume.monthlyGmv > 0 ? round((totalGrossMargin / volume.monthlyGmv) * 100, 4) : 0,
    detailRows,
    errors,
    warnings,
  };
}
