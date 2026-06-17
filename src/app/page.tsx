"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const tools = [
  { name: "Git Command Builder", slug: "git-command", icon: "🔀" },
  { name: "Docker Command Builder", slug: "docker-command", icon: "🐳" },
  { name: ".env Generator", slug: "env-generator", icon: "⚙️" },
  { name: "SSH Key Generator", slug: "ssh-key-generator", icon: "🔑" },
  { name: "Random Data Generator", slug: "random-data-generator", icon: "🎲" },
  { name: "Base64 File Converter", slug: "base64-file", icon: "📁" },
  { name: "Text Diff", slug: "text-diff", icon: "🔍" },
  { name: "Bcrypt Hash & Verify", slug: "bcrypt", icon: "🔒" },
  { name: "AES Encryption", slug: "aes-cipher", icon: "🔐" },
  { name: "User-Agent Parser", slug: "user-agent", icon: "🖥" },
  { name: "Chmod Calculator", slug: "chmod-calc", icon: "🔢" },
  { name: "IP Address Tools", slug: "ip-tools", icon: "🌐" },
  { name: "JSONPath Tester", slug: "jsonpath-tester", icon: "🔎" },
  { name: "Lorem Ipsum Generator", slug: "lorem-ipsum", icon: "📝" },
  { name: "Signature Verification", slug: "sign-verify", icon: "✓" },
  { name: "Webhook Receiver", slug: "webhook-receiver", icon: "📡" },
  { name: "Payment API Debugger", slug: "payment-debug", icon: "🐛" },
  { name: "HTTP Status Codes", slug: "http-status", icon: "🌐" },
  { name: "ULID Generator", slug: "ulid-generator", icon: "🆔" },
  { name: "JSON to Code", slug: "json-to-code", icon: "🔧" },
  { name: "JWT Decoder", slug: "jwt-decoder", icon: "🔐" },
  { name: "JSON Diff", slug: "json-diff", icon: "🔍" },
  { name: "JSON ↔ CSV", slug: "json-csv", icon: "📊" },
  { name: "JSON ↔ YAML", slug: "json-yaml", icon: "📝" },
  { name: "SQL Formatter", slug: "sql-formatter", icon: "🗄" },
  { name: "Case Converter", slug: "case-converter", icon: "Aa" },
  { name: "HTML Entities", slug: "html-entities", icon: "🌐" },
  { name: "XML Formatter", slug: "xml-formatter", icon: "📋" },
  { name: "Base64 Encode/Decode", slug: "base64", icon: "🔐" },
  { name: "Hash Generator", slug: "hash-generator", icon: "🔑" },
  { name: "Timestamp Converter", slug: "timestamp", icon: "⏰" },
  { name: "URL Encode/Decode", slug: "url-encode", icon: "🔗" },
  { name: "UUID Generator", slug: "uuid", icon: "🆔" },
  { name: "Password Generator", slug: "password", icon: "🔑" },
  { name: "QR Code Generator", slug: "qr-code", icon: "〰️" },
  { name: "Currency Converter", slug: "currency-converter", icon: "💱" },
  { name: "HMAC Generator", slug: "hmac-generator", icon: "🔏" },
  { name: "Word Counter", slug: "word-counter", icon: "📊" },
  { name: "Color Converter", slug: "color-converter", icon: "🎨" },
  { name: "Regex Tester", slug: "regex-tester", icon: "🔍" },
  { name: "Payment Webhook Simulator", slug: "payment-webhook", icon: "🔔" },
  { name: "RSA Key Generator", slug: "rsa-key-generator", icon: "🔐" },
  { name: "Cron Expression", slug: "cron", icon: "⏰" },
  { name: "Markdown Preview", slug: "markdown-preview", icon: "📝" },
  { name: "JSON Formatter", slug: "json-formatter", icon: "📋" },
  { name: "Acquiring Margin Calculator", slug: "acquiring-margin-calculator", icon: "📈" },
  { name: "frp Tunnel Config", slug: "tunnel-config", icon: "🔌" },
];

const categories = [
  {
    title: "Payment & Finance",
    titleZh: "支付与金融",
    tools: ["payment-webhook", "acquiring-margin-calculator", "sign-verify", "webhook-receiver", "payment-debug"],
  },
  {
    title: "Encoding & Hashing",
    titleZh: "编码与哈希",
    tools: ["base64", "base64-file", "hash-generator", "hmac-generator", "url-encode", "html-entities", "jwt-decoder", "bcrypt", "aes-cipher", "ssh-key-generator"],
  },
  {
    title: "Formatters",
    titleZh: "格式化",
    tools: ["json-formatter", "sql-formatter", "xml-formatter", "json-diff", "text-diff", "word-counter", "color-converter", "regex-tester", "jsonpath-tester"],
  },
  {
    title: "Converters",
    titleZh: "数据转换",
    tools: ["json-csv", "json-yaml", "case-converter", "timestamp", "currency-converter", "json-to-code", "user-agent", "ip-tools"],
  },
  {
    title: "Generators",
    titleZh: "生成器",
    tools: ["uuid", "password", "qr-code", "rsa-key-generator", "cron", "markdown-preview", "ulid-generator", "lorem-ipsum", "git-command", "docker-command", "env-generator", "random-data-generator"],
  },
  {
    title: "Network & Reference",
    titleZh: "网络与参考",
    tools: ["tunnel-config", "http-status", "chmod-calc"],
  },
];

export default function HomePage() {
  const { t, locale } = useI18n();
  const isZh = locale === "zh";
  const tt = (t as any).tools || {};
  const tp = tt.page || {};
  const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t]));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    tools: cat.tools.filter((slug) => {
      const tool = toolMap[slug];
      const tdata = tt[slug];
      const searchable = `${tool?.name} ${tdata?.title || ""} ${slug}`.toLowerCase();
      return searchable.includes(searchQuery.toLowerCase());
    }),
  })).filter((cat) => cat.tools.length > 0);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {isZh ? "免费在线开发者工具" : "Free Online Developer Tools"}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isZh
              ? "47 款开发者工具，全部在浏览器中运行。无需上传数据，无需注册，即开即用。"
              : "47 developer tools that run entirely in your browser. No data uploads, no signup required."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="px-6 py-3 text-sm font-semibold rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
            >
              {isZh ? "浏览全部工具 →" : "Browse All Tools →"}
            </Link>
          </div>
          <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
            {isZh
              ? `✅ 47 个工具 · 纯前端计算 · 支持中英文切换 · ${tp?.tagline || ""}`
              : `✅ 47 tools · Client-side only · ${tp?.tagline || ""} · No server upload`}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isZh ? "搜索工具..." : "Search tools..."}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Tool Grid by Category */}
      <section className="max-w-6xl mx-auto px-4 py-12 w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {isZh ? "所有工具" : "All Tools"}
        </h2>
        <div className="space-y-10">
          {filteredCategories.map((cat) => (
            <div key={cat.title}>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                {isZh ? cat.titleZh : cat.title}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cat.tools.map((slug) => {
                  const tool = toolMap[slug];
                  const tdata = tt[slug];
                  return (
                    <Link
                      key={slug}
                      href={`/tools/${slug}`}
                      className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="text-xl mb-2">{tool?.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tdata?.title || tool?.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            {isZh ? "为什么用 CodeTools？" : "Why CodeTools?"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "🔒",
                title: isZh ? "100% 隐私" : "100% Private",
                desc: isZh
                  ? "所有工具在浏览器中运行，不会向任何服务器发送数据。你的数据只属于你。"
                  : "All tools run in your browser. Nothing is sent to any server. Your data stays yours.",
              },
              {
                icon: "🌐",
                title: isZh ? "中英文双语" : "English & Chinese",
                desc: isZh
                  ? "所有工具页面和标签都支持中英文切换，点击右上角按钮一键切换。"
                  : "Full Chinese/English support. Toggle with one click in the top-right corner.",
              },
              {
                icon: "⚡",
                title: isZh ? "无需注册" : "No Signup",
                desc: isZh
                  ? "打开即用，无需创建账号，没有使用限制。为开发者而生。"
                  : "Open and use. No accounts, no limits. Built for developers.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="text-2xl mb-3">{feat.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isZh ? "开始使用" : "Get Started"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          {isZh
            ? "选择一个工具，立即开始。全部免费，无需注册。"
            : "Pick a tool and start using it instantly. All free, no signup needed."}
        </p>
        <Link
          href="/tools"
          className="inline-block px-6 py-3 text-sm font-semibold rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
        >
          {isZh ? "浏览全部工具 →" : "Browse All Tools →"}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 text-center text-[10px] text-gray-400 dark:text-gray-500">
        CodeTools — {isZh ? "免费在线开发者工具" : "Free online developer tools"}
      </footer>
    </div>
  );
}
