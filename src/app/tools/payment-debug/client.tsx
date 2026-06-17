"use client";

import { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Platform = "alipay" | "wechat" | "stripe";

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: "alipay", label: "Alipay (支付宝)", icon: "💙" },
  { key: "wechat", label: "WeChat Pay (微信)", icon: "💚" },
  { key: "stripe", label: "Stripe", icon: "🟣" },
];

const API_ACTIONS: Record<Platform, { key: string; label: string; method: string; path: string }[]> = {
  alipay: [
    { key: "unified_order", label: "Unified Order (统一下单)", method: "POST", path: "/gateway.do" },
    { key: "query_order", label: "Query Order (查询订单)", method: "POST", path: "/gateway.do" },
    { key: "refund", label: "Refund (退款)", method: "POST", path: "/gateway.do" },
    { key: "close_order", label: "Close Order (关闭订单)", method: "POST", path: "/gateway.do" },
  ],
  wechat: [
    { key: "jsapi", label: "JSAPI Pay (JSAPI下单)", method: "POST", path: "/v3/pay/transactions/jsapi" },
    { key: "native", label: "Native Pay (Native下单)", method: "POST", path: "/v3/pay/transactions/native" },
    { key: "query_order", label: "Query Order (查询订单)", method: "GET", path: "/v3/pay/transactions/out-trade-no/{out_trade_no}" },
    { key: "refund", label: "Refund (退款)", method: "POST", path: "/v3/refund/domestic/refunds" },
  ],
  stripe: [
    { key: "payment_intent", label: "Create Payment Intent", method: "POST", path: "/v1/payment_intents" },
    { key: "retrieve", label: "Retrieve Payment Intent", method: "GET", path: "/v1/payment_intents/{id}" },
    { key: "refund", label: "Create Refund", method: "POST", path: "/v1/refunds" },
    { key: "checkout", label: "Create Checkout Session", method: "POST", path: "/v1/checkout/sessions" },
  ],
};

export default function PaymentDebugClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["payment-debug"] || {};
  const [platform, setPlatform] = useState<Platform>("alipay");
  const [selectedAction, setSelectedAction] = useState(API_ACTIONS.alipay[0].key);
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [requestBody, setRequestBody] = useState(`{\n  "out_trade_no": "ORDER-${Date.now()}",\n  "total_amount": "0.01",\n  "subject": "Test Order",\n  "currency": "CNY"\n}`);
  const [response, setResponse] = useState<{ status: number; body: string; time: number } | null>(null);
  const [sending, setSending] = useState(false);

  const action = API_ACTIONS[platform].find(a => a.key === selectedAction)!;

  const curlCommand = useMemo(() => {
    const headers = platform === "stripe"
      ? `-H "Authorization: Bearer ${apiKey || 'sk_xxx'}"`
      : `-H "Authorization: ${apiKey || 'your_api_key'}"`;
    return `curl -X ${action.method} "${endpoint || 'https://' + (platform === 'alipay' ? 'openapi.alipay.com' : platform === 'wechat' ? 'api.mch.weixin.qq.com' : 'api.stripe.com')}${action.path}" \\\n  ${headers} \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/\n/g, "\\n")}'`;
  }, [platform, action, endpoint, apiKey, requestBody]);

  const sendRequest = useCallback(async () => {
    if (!endpoint) return;
    setSending(true);
    const start = Date.now();
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (platform === "stripe") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else {
        headers["Authorization"] = apiKey;
      }
      const res = await fetch(endpoint + action.path, {
        method: action.method,
        headers,
        body: action.method === "GET" ? undefined : requestBody,
      });
      const body = await res.text();
      const time = Date.now() - start;
      setResponse({ status: res.status, body, time });
    } catch (e: any) {
      setResponse({ status: 0, body: `Error: ${e.message}`, time: Date.now() - start });
    } finally {
      setSending(false);
    }
  }, [endpoint, action, platform, apiKey, requestBody]);

  const apiActionLabel = tk.apiAction || "API Action";
  const baseUrlLabel = tk.baseUrl || "Base URL";
  const baseUrlPlaceholder = tk.baseUrlPlaceholder || "https://api.example.com";
  const apiKeyLabel = tk.apiKey || "API Key";
  const apiKeyPlaceholder = tk.apiKeyPlaceholder || "Enter your API key...";
  const secretKeyLabel = tk.secretKey || "Secret Key";
  const secretKeyPlaceholder = tk.secretKeyPlaceholder || "Enter secret key for signing...";
  const requestBodyLabel = tk.requestBody || "Request Body";
  const responseLabel = tk.response || "Response";
  const curlCommandLabel = tk.curlCommand || "cURL Command";
  const sendRequestLabel = tk.sendRequest || "Send Request";
  const sendingLabel = tk.sending || "Sending...";
  const copyCurlLabel = tk.copyCurl || "Copy cURL";
  const statusLabel = tk.status || "Status";
  const timeLabel = tk.time || "Time";
  const msLabel = tk.ms || "ms";

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Platform + Action */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              onClick={() => { setPlatform(p.key); setSelectedAction(API_ACTIONS[p.key][0].key); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${platform === p.key ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
            >{p.icon} {p.label}</button>
          ))}
        </div>
      </div>

      {/* API Action */}
      <div className="flex flex-wrap gap-1.5">
        <label className="text-[10px] text-gray-400 w-full">{apiActionLabel}</label>
        {API_ACTIONS[platform].map((a) => (
          <button
            key={a.key}
            onClick={() => setSelectedAction(a.key)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${selectedAction === a.key ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            <span className="text-[10px] text-gray-400 mr-1">{a.method}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* Endpoint + Keys */}
      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <label className="text-[10px] text-gray-400 mb-0.5 block">{baseUrlLabel}</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder={baseUrlPlaceholder}
            className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 mb-0.5 block">{platform === "stripe" ? secretKeyLabel : apiKeyLabel}</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={platform === "stripe" ? "sk_live_xxx" : apiKeyPlaceholder}
            className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 mb-0.5 block">{secretKeyLabel}</label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={secretKeyPlaceholder}
            className="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Request Body */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{requestBodyLabel}</label>
        <textarea
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
          className="min-h-[120px] p-3 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* cURL preview */}
      <details>
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">{curlCommandLabel}</summary>
        <pre className="mt-2 p-3 text-xs font-mono bg-gray-900 text-green-400 rounded-lg overflow-x-auto whitespace-pre-wrap">{curlCommand}</pre>
      </details>

      {/* Send */}
      <button
        onClick={sendRequest}
        disabled={sending || !endpoint}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-fit"
      >
        {sending ? sendingLabel : sendRequestLabel}
      </button>

      {/* Response */}
      {response && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${response.status >= 200 && response.status < 300 ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-red-100 dark:bg-red-900/30 text-red-700"}`}>
                {response.status || "ERR"}
              </span>
              <span className="text-[10px] text-gray-400">{response.time}{msLabel}</span>
            </div>
          </div>
          <pre className="p-3 text-xs font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap max-h-[300px] overflow-auto">
            {response.body}
          </pre>
        </div>
      )}

      {/* Quick links to other tools */}
      <div className="text-[10px] text-gray-400 dark:text-gray-500 flex gap-3">
        <span>Related tools:</span>
        <a href="/tools/sign-verify" className="text-blue-500 hover:underline">Sign Verify</a>
        <a href="/tools/webhook-receiver" className="text-blue-500 hover:underline">Webhook Receiver</a>
        <a href="/tools/payment-webhook" className="text-blue-500 hover:underline">Webhook Simulator</a>
      </div>
    </div>
  );
}