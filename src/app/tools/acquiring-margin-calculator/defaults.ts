import { CalculatorState, CurrencyCode, FxConfig, MerchantInput, PaymentRow, VolumeInput } from "./types";

export const VERSION = "v2.0";

export const CURRENCIES: CurrencyCode[] = ["HKD", "USD", "CNY", "EUR", "GBP", "JPY", "KRW", "SGD"];

export const COUNTRIES = ["HK", "CN", "US", "GB", "DE", "FR", "JP", "KR", "SG"];

export const METHODS = ["Visa", "Mastercard", "Amex", "Alipay", "WeChat Pay", "Klarna", "NaverPay", "AlipayHK", "Other"];

export const TRANSACTION_TYPES = ["Domestic", "Cross-border", "Wallet", "BNPL", "Alternative payment"];

export const DEFAULT_MERCHANT: MerchantInput = {
  merchantName: "Hongkong OnlineStore",
  date: new Date().toISOString().slice(0, 10),
  country: "HK",
  settlementCurrency: "HKD",
  mcc: "E-comm",
  notes: "",
};

export const DEFAULT_VOLUME: VolumeInput = {
  mode: "ticketAndTxn",
  avgTicket: 1000,
  txnPerDay: 1000,
  billingDays: 30,
  monthlyGmv: 30000000,
  monthlyTxnCount: 30000,
};

export const DEFAULT_PAYMENTS: PaymentRow[] = [
  { id: "visa-domestic", enabled: true, method: "Visa", transactionType: "Domestic", userRegion: "HK", gmvSharePercent: 25, txnSharePercent: null, quoteVariablePercent: 3.3, quoteFixedFee: 0.3, quoteFixedCurrency: "USD", costVariablePercent: 2.25, costFixedFee: 0.12, costFixedCurrency: "USD", costNotes: "Card scheme domestic baseline" },
  { id: "visa-cross-border", enabled: true, method: "Visa", transactionType: "Cross-border", userRegion: "Global", gmvSharePercent: 20, txnSharePercent: null, quoteVariablePercent: 3.9, quoteFixedFee: 0.3, quoteFixedCurrency: "USD", costVariablePercent: 2.65, costFixedFee: 0.12, costFixedCurrency: "USD", costNotes: "Card scheme cross-border baseline" },
  { id: "mastercard-domestic", enabled: true, method: "Mastercard", transactionType: "Domestic", userRegion: "HK", gmvSharePercent: 20, txnSharePercent: null, quoteVariablePercent: 3.3, quoteFixedFee: 0.3, quoteFixedCurrency: "USD", costVariablePercent: 2.3, costFixedFee: 0.12, costFixedCurrency: "USD", costNotes: "Card scheme domestic baseline" },
  { id: "mastercard-cross-border", enabled: true, method: "Mastercard", transactionType: "Cross-border", userRegion: "Global", gmvSharePercent: 15, txnSharePercent: null, quoteVariablePercent: 3.9, quoteFixedFee: 0.3, quoteFixedCurrency: "USD", costVariablePercent: 2.7, costFixedFee: 0.12, costFixedCurrency: "USD", costNotes: "Card scheme cross-border baseline" },
  { id: "klarna-ge", enabled: true, method: "Klarna", transactionType: "BNPL", userRegion: "DE", gmvSharePercent: 8, txnSharePercent: null, quoteVariablePercent: 2.79, quoteFixedFee: 0.3, quoteFixedCurrency: "USD", costVariablePercent: 2.25, costFixedFee: 0.1, costFixedCurrency: "USD", costNotes: "BNPL blended estimate" },
  { id: "naverpay-kr", enabled: true, method: "NaverPay", transactionType: "Wallet", userRegion: "KR", gmvSharePercent: 7, txnSharePercent: null, quoteVariablePercent: 3.4, quoteFixedFee: 0, quoteFixedCurrency: "USD", costVariablePercent: 2.6, costFixedFee: 0, costFixedCurrency: "USD", costNotes: "Wallet estimate" },
  { id: "alipayhk-china", enabled: true, method: "AlipayHK", transactionType: "Wallet", userRegion: "CN", gmvSharePercent: 5, txnSharePercent: null, quoteVariablePercent: 1.9, quoteFixedFee: 0, quoteFixedCurrency: "USD", costVariablePercent: 1.15, costFixedFee: 0, costFixedCurrency: "USD", costNotes: "Wallet estimate" },
];

export const DEFAULT_FX: FxConfig = {
  orderCurrency: "USD",
  settlementCurrency: "HKD",
  markupPercent: 1.2,
  channelCostPercent: 0.25,
  internalCostPercent: 0.15,
  eligibleGmvPercent: 60,
};

export const DEFAULT_EXCHANGE_RATES = {
  HKD: 1,
  USD: 7.8,
  CNY: 1.08,
  EUR: 8.45,
  GBP: 9.9,
  JPY: 0.052,
  KRW: 0.0057,
  SGD: 5.78,
} satisfies Record<CurrencyCode, number>;

export const DEFAULT_STATE: CalculatorState = {
  version: VERSION,
  merchant: DEFAULT_MERCHANT,
  volume: DEFAULT_VOLUME,
  payments: DEFAULT_PAYMENTS,
  fx: DEFAULT_FX,
  exchangeRates: DEFAULT_EXCHANGE_RATES,
};
