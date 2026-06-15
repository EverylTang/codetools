import assert from "node:assert/strict";
import test from "node:test";

import { calculateFxMargin, calculateMargin, convertToSettlement, deriveVolume, validateState } from "../src/app/tools/acquiring-margin-calculator/calculations.ts";
import { DEFAULT_STATE, DEFAULT_EXCHANGE_RATES } from "../src/app/tools/acquiring-margin-calculator/defaults.ts";
import type { CalculatorState } from "../src/app/tools/acquiring-margin-calculator/types.ts";

test("deriveVolume mode A (ticketAndTxn)", () => {
  const result = deriveVolume(DEFAULT_STATE);
  assert.equal(result.avgTicket, 1000);
  assert.equal(result.monthlyGmv, 30_000_000);
  assert.equal(result.monthlyTxnCount, 30_000);
});

test("deriveVolume mode B (monthlyDirect)", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    volume: {
      mode: "monthlyDirect",
      avgTicket: 0,
      txnPerDay: 0,
      billingDays: 30,
      monthlyGmv: 1_000_000,
      monthlyTxnCount: 5_000,
    },
  };
  const result = deriveVolume(state);
  assert.equal(result.avgTicket, 200);
  assert.equal(result.monthlyGmv, 1_000_000);
  assert.equal(result.monthlyTxnCount, 5_000);
});

test("deriveVolume returns 0 avgTicket when mode B txnCount is 0", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    volume: {
      ...DEFAULT_STATE.volume,
      mode: "monthlyDirect",
      monthlyGmv: 1000,
      monthlyTxnCount: 0,
    },
  };
  const result = deriveVolume(state);
  assert.equal(result.avgTicket, 0);
});

test("validateState passes with default state", () => {
  const { errors, warnings } = validateState(DEFAULT_STATE);
  assert.equal(errors.length, 0);
  assert.ok(warnings.length > 0, "Should have non-blocking warnings (non-settlement fee currencies)");
});

test("validateState fails when GMV share != 100%", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    payments: [
      {
        ...DEFAULT_STATE.payments[0],
        enabled: true,
        gmvSharePercent: 50,
        txnSharePercent: null,
        costNotes: "test",
        quoteFixedFee: 0,
        costFixedFee: 0,
      },
    ],
  };
  const { errors } = validateState(state);
  assert.ok(errors.some((e) => e.includes("GMV share must equal 100%")));
});

test("validateState fails when monthly GMV is 0", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    volume: { ...DEFAULT_STATE.volume, avgTicket: 0 },
  };
  const { errors } = validateState(state);
  assert.ok(errors.some((e) => e.includes("GMV must be greater than 0")));
});

test("validateState fails when billing days out of range", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    volume: { ...DEFAULT_STATE.volume, billingDays: 35 },
  };
  const { errors } = validateState(state);
  assert.ok(errors.some((e) => e.includes("Billing days must be between")));
});

test("validateState fails on negative quote values", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    payments: [
      { ...DEFAULT_STATE.payments[0], quoteVariablePercent: -1, costFixedFee: 0, quoteFixedFee: 0, costNotes: "test" },
    ],
  };
  const { errors } = validateState(state);
  assert.ok(errors.some((e) => e.includes("quote values cannot be negative")));
});

test("validateState fails on negative FX values", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    fx: { ...DEFAULT_STATE.fx, markupPercent: -1 },
  };
  const { errors } = validateState(state);
  assert.ok(errors.some((e) => e.includes("FX values cannot be negative")));
});

test("convertToSettlement returns same amount for same currency", () => {
  const result = convertToSettlement(100, "HKD", DEFAULT_STATE);
  assert.equal(result, 100);
});

test("convertToSettlement multiplies by exchange rate for different currency", () => {
  const result = convertToSettlement(100, "USD", DEFAULT_STATE);
  assert.equal(result, 780);
});

test("convertToSettlement returns 0 for missing exchange rate", () => {
  const state = {
    ...DEFAULT_STATE,
    merchant: { ...DEFAULT_STATE.merchant, settlementCurrency: "HKD" as const },
    exchangeRates: { ...DEFAULT_EXCHANGE_RATES, USD: 0 },
  };
  const result = convertToSettlement(100, "USD", state);
  assert.equal(result, 0);
});

test("calculateMargin returns correct structure and values for default state", () => {
  const result = calculateMargin(DEFAULT_STATE);

  assert.equal(typeof result.monthlyGmv, "number");
  assert.equal(typeof result.marginRate, "number");
  assert.ok(result.monthlyGmv > 0);
  assert.ok(result.detailRows.length > 0);
  assert.ok(Array.isArray(result.errors));

  // With all 7 payment rows enabled at 100% total GMV share, processing revenue should be positive
  assert.ok(result.processingRevenue > 0);
  assert.ok(result.totalRevenue > result.totalCost, "Total revenue should exceed total cost for default profitable scenario");
  assert.ok(result.marginRate > 0, "Margin rate should be positive");
});

test("calculateMargin returns correct detail row structure", () => {
  const result = calculateMargin(DEFAULT_STATE);
  const row = result.detailRows[0];

  assert.ok(row.id);
  assert.equal(typeof row.method, "string");
  assert.equal(typeof row.gmv, "number");
  assert.equal(typeof row.revenue, "number");
  assert.equal(typeof row.cost, "number");
  assert.equal(typeof row.margin, "number");
  assert.equal(typeof row.marginRate, "number");
  assert.ok(row.gmv > 0);
});

test("calculateMargin returns errors for invalid state", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    volume: { ...DEFAULT_STATE.volume, avgTicket: 0, txnPerDay: 0 },
  };
  const result = calculateMargin(state);
  assert.ok(result.errors.length > 0);
});

test("calculateFxMargin returns 0 when order currency equals settlement currency", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    fx: { ...DEFAULT_STATE.fx, orderCurrency: "HKD", settlementCurrency: "HKD", eligibleGmvPercent: 100, markupPercent: 1, channelCostPercent: 0.2, internalCostPercent: 0.1 },
  };
  const result = calculateFxMargin(state, 1_000_000);
  assert.equal(result.fxRevenue, 0);
  assert.equal(result.fxCost, 0);
  assert.equal(result.fxMargin, 0);
});

test("calculateFxMargin returns correct values when FX is enabled", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    fx: { orderCurrency: "USD", settlementCurrency: "HKD", eligibleGmvPercent: 60, markupPercent: 1.2, channelCostPercent: 0.25, internalCostPercent: 0.15 },
  };
  const result = calculateFxMargin(state, 30_000_000);
  const fxGmv = 30_000_000 * 0.6;
  assert.equal(result.fxRevenue, fxGmv * 0.012);
  assert.equal(result.fxCost, fxGmv * 0.004);
  assert.equal(result.fxMargin, fxGmv * 0.008);
});

test("calculateMargin respects minFee clamping", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    payments: [
      {
        ...DEFAULT_STATE.payments[0],
        gmvSharePercent: 100,
        txnSharePercent: null,
        quoteVariablePercent: 0,
        quoteFixedFee: 0,
        quoteFixedCurrency: "HKD" as const,
        costVariablePercent: 0,
        costFixedFee: 0,
        costFixedCurrency: "HKD" as const,
        costNotes: "test",
        minFee: 5,
      },
    ],
    volume: {
      ...DEFAULT_STATE.volume,
      mode: "monthlyDirect",
      avgTicket: 0,
      txnPerDay: 0,
      billingDays: 30,
      monthlyGmv: 100_000,
      monthlyTxnCount: 1_000,
    },
  };
  // With 0% variable and 0 fixed fee, normal revenue = 0.
  // minFee = 5 means revenue = 5 * 1000 = 5000
  const result = calculateMargin(state);
  assert.equal(result.detailRows[0].revenue, 5_000);
});

test("calculateMargin respects maxFee clamping", () => {
  const state: CalculatorState = {
    ...DEFAULT_STATE,
    payments: [
      {
        ...DEFAULT_STATE.payments[0],
        gmvSharePercent: 100,
        txnSharePercent: null,
        quoteVariablePercent: 10, // 10% of GMV = 10,000 revenue
        quoteFixedFee: 0,
        quoteFixedCurrency: "HKD" as const,
        costVariablePercent: 0,
        costFixedFee: 0,
        costFixedCurrency: "HKD" as const,
        costNotes: "test",
        maxFee: 2, // cap at 2 per txn = 2 * 1000 = 2000
      },
    ],
    volume: {
      ...DEFAULT_STATE.volume,
      mode: "monthlyDirect",
      avgTicket: 0,
      txnPerDay: 0,
      billingDays: 30,
      monthlyGmv: 100_000,
      monthlyTxnCount: 1_000,
    },
  };
  const result = calculateMargin(state);
  // Revenue should be capped at maxFee * txnCount = 2 * 1000 = 2000
  assert.equal(result.detailRows[0].revenue, 2_000);
});