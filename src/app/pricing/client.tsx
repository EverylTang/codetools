"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const copy = {
  en: {
    breadcrumbHome: "Home",
    title: "CodeTools API",
    subtitle: "19+ developer tools, one API key, $12 per month.",
    body: "Stop opening web pages to copy and paste utility results. Call the same tools from scripts, CI jobs, and backend workflows.",
    primaryCta: "View API docs",
    secondaryCta: "Browse tools",
    freeTitle: "Free",
    freePrice: "$0",
    freePeriod: "forever",
    freeDesc: "All web tools stay free and run in your browser.",
    apiTitle: "API Plan",
    apiPrice: "$12",
    apiPeriod: "per month",
    apiDesc: "One subscription for every CodeTools REST API.",
    planned: "Planned",
    startSoon: "Checkout will open after the API backend is live.",
    includedTitle: "What the API plan includes",
    useCasesTitle: "Built for automation",
    examplesTitle: "One key, simple calls",
    compareTitle: "Why this price is easy to justify",
    freeFeatures: ["19+ browser tools", "No account required", "Client-side processing", "Ad-supported"],
    apiFeatures: ["19+ REST APIs", "10,000 calls per month", "Shared quota across all tools", "API key access", "No ads while signed in"],
    included: ["Hash and HMAC", "Base64 and URL encoding", "UUID and password generation", "QR code generation", "Currency conversion", "JSON and timestamp tools", "Color conversion", "RSA key generation", "frp tunnel config generation"],
    useCases: [
      ["CI/CD signatures", "Generate HMAC signatures inside deployment scripts."],
      ["Test data", "Create UUIDs, passwords, and QR codes for automated tests."],
      ["Webhook debugging", "Build signed payment callback payloads without manual copy-paste."],
    ],
    compare: [
      ["Postman", "$14/mo", "API debugging"],
      ["ngrok", "$8/mo", "Tunnel service"],
      ["CodeTools API", "$12/mo", "17+ utility APIs"],
    ],
  },
  zh: {
    breadcrumbHome: "首页",
    title: "CodeTools API",
    subtitle: "19+ 个开发者工具，一个 API Key，每月 $12。",
    body: "不用再打开网页复制粘贴。把同一批工具接进脚本、CI 流水线和后端工作流。",
    primaryCta: "查看 API 文档",
    secondaryCta: "浏览工具",
    freeTitle: "Free",
    freePrice: "$0",
    freePeriod: "长期免费",
    freeDesc: "网页版工具继续免费，计算在浏览器中完成。",
    apiTitle: "API Plan",
    apiPrice: "$12",
    apiPeriod: "每月",
    apiDesc: "一个订阅，使用全部 CodeTools REST API。",
    planned: "待上线",
    startSoon: "API 后端上线后会开放购买入口。",
    includedTitle: "API Plan 包含什么",
    useCasesTitle: "为自动化而设计",
    examplesTitle: "一个 Key，直接调用",
    compareTitle: "为什么 $12 合理",
    freeFeatures: ["19+ 个网页版工具", "无需账号", "客户端本地处理", "广告支持"],
    apiFeatures: ["19+ 个 REST API", "每月 10,000 次调用", "所有工具共享额度", "API Key 访问", "登录后无广告"],
    included: ["Hash 和 HMAC", "Base64 和 URL 编解码", "UUID 和密码生成", "二维码生成", "汇率换算", "JSON 和时间戳工具", "颜色格式转换", "RSA 密钥生成", "frp 隧道配置生成"],
    useCases: [
      ["CI/CD 签名", "在部署脚本里直接生成 HMAC 签名。"],
      ["测试数据", "为自动化测试生成 UUID、密码和二维码。"],
      ["Webhook 调试", "生成带签名的支付回调载荷，不再手动复制粘贴。"],
    ],
    compare: [
      ["Postman", "$14/月", "API 调试"],
      ["ngrok", "$8/月", "隧道服务"],
      ["CodeTools API", "$12/月", "17+ 个工具 API"],
    ],
  },
} as const;

const curlExample = `curl -X POST https://api.codetools.cc/sign \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"algorithm":"HMAC-SHA256","key":"sk_test_xxx","message":"order=123&amount=99.99"}'`;

export default function PricingClient() {
  const { locale, t } = useI18n();
  const c = copy[locale];

  return (
    <div className="flex-1 bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-blue-500 transition-colors">{c.breadcrumbHome}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{t.pricing}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              {c.planned}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              {c.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-gray-700 dark:text-gray-300">{c.subtitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{c.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/docs/api"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:translate-y-px dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                {c.primaryCta}
              </Link>
              <Link
                href="/tools"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 active:translate-y-px dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900"
              >
                {c.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
            <pre className="overflow-x-auto rounded-md bg-gray-950 p-4 font-mono text-xs leading-relaxed text-gray-100">
              {curlExample}
            </pre>
            <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{c.startSoon}</p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-2">
          <PlanCard
            title={c.freeTitle}
            price={c.freePrice}
            period={c.freePeriod}
            description={c.freeDesc}
            features={c.freeFeatures}
          />
          <PlanCard
            featured
            title={c.apiTitle}
            price={c.apiPrice}
            period={c.apiPeriod}
            description={c.apiDesc}
            features={c.apiFeatures}
          />
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h2 className="text-lg font-semibold">{c.includedTitle}</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {c.included.map((item) => (
                <div key={item} className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h2 className="text-lg font-semibold">{c.useCasesTitle}</h2>
            <div className="mt-5 grid gap-3">
              {c.useCases.map(([title, description]) => (
                <div key={title} className="grid gap-1 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-gray-200 p-5 dark:border-gray-800">
          <h2 className="text-lg font-semibold">{c.compareTitle}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {c.compare.map(([name, price, value]) => (
              <div
                key={name}
                className={`rounded-md p-4 ${
                  name === "CodeTools API"
                    ? "bg-blue-50 text-blue-950 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-100 dark:ring-blue-900"
                    : "bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                }`}
              >
                <p className="text-sm font-semibold">{name}</p>
                <p className="mt-2 font-mono text-xl font-bold">{price}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  description,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        featured
          ? "border-blue-300 bg-blue-50/70 shadow-sm dark:border-blue-900 dark:bg-blue-950/30"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold">{price}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{period}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        {features.map((feature) => (
          <p key={feature} className="rounded-md bg-white px-3 py-2 text-sm text-gray-700 ring-1 ring-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:ring-gray-800">
            {feature}
          </p>
        ))}
      </div>
    </div>
  );
}
