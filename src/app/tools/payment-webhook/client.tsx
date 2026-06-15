"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Platform = "alipay" | "wechat" | "stripe";

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: "alipay", label: "Alipay (支付宝)", icon: "💙" },
  { key: "wechat", label: "WeChat Pay (微信支付)", icon: "💚" },
  { key: "stripe", label: "Stripe", icon: "🟣" },
];

const STATUS_OPTIONS: Record<Platform, string[]> = {
  alipay: ["TRADE_SUCCESS", "TRADE_FINISHED", "TRADE_CLOSED", "WAIT_BUYER_PAY"],
  wechat: ["SUCCESS", "REFUND", "NOTPAY", "CLOSED"],
  stripe: ["payment_intent.succeeded", "payment_intent.payment_failed", "charge.refunded", "checkout.session.completed"],
};

interface PaymentParams {
  outTradeNo: string;
  totalAmount: string;
  subject: string;
  tradeNo: string;
  status: string;
  signType: string;
}

function generateOrderNo(prefix: string): string {
  const now = new Date();
  const date = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${date}${random}`;
}

const EXAMPLE_URL = "https://your-domain.com/api/payment/webhook";

export default function PaymentWebhookClient() {
  const { t } = useI18n();
  const tk = t.tools["payment-webhook"];
  const [platform, setPlatform] = useState<Platform>("alipay");
  const [webhookUrl, setWebhookUrl] = useState(EXAMPLE_URL);
  const [secretKey, setSecretKey] = useState("your_sign_key_here");
  const [params, setParams] = useState<PaymentParams>({
    outTradeNo: generateOrderNo("OUT"),
    totalAmount: "99.99",
    subject: "VIP Membership",
    tradeNo: generateOrderNo("T"),
    status: "TRADE_SUCCESS",
    signType: "HMAC-SHA256",
  });
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  const updateParam = <K extends keyof PaymentParams>(key: K, value: PaymentParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const regenerateOrderNo = () => {
    updateParam("outTradeNo", generateOrderNo("OUT"));
    updateParam("tradeNo", generateOrderNo("T"));
  };

  const platformStatuses = STATUS_OPTIONS[platform];

  // Generate the callback payload
  const payload = useMemo((): Record<string, string> => {
    if (platform === "stripe") {
      return { type: params.status, trade_no: params.tradeNo, amount: params.totalAmount, subject: params.subject, order_id: params.outTradeNo };
    }

    return {
      out_trade_no: params.outTradeNo,
      total_amount: params.totalAmount,
      subject: params.subject,
      trade_no: params.tradeNo,
      trade_status: params.status,
      timestamp: new Date().toISOString(),
      sign_type: params.signType,
      sign: "[calculated using HMAC Generator]",
    };
  }, [params, platform]);

  const curlCommand = useMemo(() => {
    return `curl -X POST "${webhookUrl}" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d '${Object.entries(payload).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")}'`;
  }, [webhookUrl, payload]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendTest = async () => {
    setSending(true);
    setSendStatus(null);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: Object.entries(payload).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&"),
      });
      const text = await res.text();
      setSendStatus({ ok: res.ok, text: text.slice(0, 500) });
    } catch (e) {
      const message = e instanceof Error ? e.message : t.common.error;
      setSendStatus({ ok: false, text: `${t.common.error}: ${message}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Platform Selector */}
      <div className="flex items-center gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            onClick={() => { setPlatform(p.key); updateParam("status", STATUS_OPTIONS[p.key][0]); }}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              platform === p.key
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Target URL */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{tk.webhookUrl}</label>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://your-domain.com/api/webhook"
          className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Parameters */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.callbackParams}</span>
          <button onClick={regenerateOrderNo} className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {tk.regenerate}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">Out Trade No</label>
            <input type="text" value={params.outTradeNo} onChange={(e) => updateParam("outTradeNo", e.target.value)}
              className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">Trade No (Platform)</label>
            <input type="text" value={params.tradeNo} onChange={(e) => updateParam("tradeNo", e.target.value)}
              className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">{tk.amount || "Amount"} ({platform === "stripe" ? "USD" : "CNY"})</label>
            <input type="text" value={params.totalAmount} onChange={(e) => updateParam("totalAmount", e.target.value)}
              className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">Subject</label>
            <input type="text" value={params.subject} onChange={(e) => updateParam("subject", e.target.value)}
              className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">Status</label>
            <select value={params.status} onChange={(e) => updateParam("status", e.target.value)}
              className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500">
              {platformStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">{tk.secretKey}</label>
            <input type="text" value={secretKey} onChange={(e) => setSecretKey(e.target.value)}
              className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* cURL Command */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{tk.curlCmd}</label>
          <button onClick={handleCopy} className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <pre className="p-3 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 overflow-x-auto whitespace-pre-wrap">
          {curlCommand}
        </pre>
      </div>

      {/* Send Test */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSendTest}
          disabled={sending || !webhookUrl || webhookUrl === EXAMPLE_URL}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {sending ? (tk.sending || "Sending...") : tk.sendTest}
        </button>
        {webhookUrl === EXAMPLE_URL && (
          <span className="text-xs text-orange-500">{tk.replaceUrl}</span>
        )}
      </div>

      {/* Response */}
      {sendStatus && (
        <div className={`p-3 rounded-lg border text-xs font-mono ${
          sendStatus.ok
            ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
        }`}>
          <div className="font-semibold mb-1">{sendStatus.ok ? (tk.responseReceived || "Response received") : t.common.error}</div>
          {sendStatus.text}
        </div>
      )}

      {/* Info */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
        <p>{tk.infoPrefix || "This tool generates sample payment callback payloads for testing."} <Link href="/tools/hmac-generator" className="text-blue-500 hover:underline">{t.tools["hmac-generator"].title}</Link>.</p>
        <p className="mt-1">{tk.infoSend || "The send test feature sends the generated payload to your endpoint."}</p>
      </div>
    </div>
  );
}
