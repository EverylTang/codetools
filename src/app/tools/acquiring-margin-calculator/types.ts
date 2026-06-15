export type CurrencyCode = "HKD" | "USD" | "CNY" | "EUR" | "GBP" | "JPY" | "KRW" | "SGD";

export type VolumeMode = "ticketAndTxn" | "monthlyDirect";

export type MerchantInput = {
  merchantName: string;
  date: string;
  country: string;
  settlementCurrency: CurrencyCode;
  mcc: string;
  notes: string;
};

export type VolumeInput = {
  mode: VolumeMode;
  avgTicket: number;
  txnPerDay: number;
  billingDays: number;
  monthlyGmv: number;
  monthlyTxnCount: number;
};

export type PaymentRow = {
  id: string;
  enabled: boolean;
  method: string;
  transactionType: string;
  userRegion: string;
  gmvSharePercent: number;
  txnSharePercent: number | null;
  quoteVariablePercent: number;
  quoteFixedFee: number;
  quoteFixedCurrency: CurrencyCode;
  costVariablePercent: number;
  costFixedFee: number;
  costFixedCurrency: CurrencyCode;
  costNotes: string;
  minFee?: number;
  maxFee?: number;
};

export type FxConfig = {
  orderCurrency: CurrencyCode;
  settlementCurrency: CurrencyCode;
  markupPercent: number;
  channelCostPercent: number;
  internalCostPercent: number;
  eligibleGmvPercent: number;
};

export type ExchangeRate = {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  source: "manual" | "api";
  updatedAt: string;
};

export type ExchangeRates = Record<CurrencyCode, number>;

export type DetailRow = {
  id: string;
  method: string;
  transactionType: string;
  userRegion: string;
  gmvSharePercent: number;
  txnSharePercent: number;
  gmv: number;
  txnCount: number;
  revenue: number;
  cost: number;
  margin: number;
  marginRate: number;
};

export type MarginResult = {
  avgTicket: number;
  monthlyGmv: number;
  monthlyTxnCount: number;
  processingRevenue: number;
  processingCost: number;
  processingMargin: number;
  fxRevenue: number;
  fxCost: number;
  fxMargin: number;
  totalRevenue: number;
  totalCost: number;
  totalGrossMargin: number;
  marginRate: number;
  detailRows: DetailRow[];
  errors: string[];
  warnings: string[];
};

export type CalculatorState = {
  version: string;
  merchant: MerchantInput;
  volume: VolumeInput;
  payments: PaymentRow[];
  fx: FxConfig;
  exchangeRates: ExchangeRates;
};
