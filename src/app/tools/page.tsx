"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getToolsPageTranslations, getToolTranslations, ToolKey } from "@/lib/i18n/toolTranslations";

const tools = [
  { name: "Base64 Encode/Decode", slug: "base64", desc: "Encode and decode Base64 text, or convert files to Base64 data URIs.", icon: "🔐" },
  { name: "Hash Generator", slug: "hash-generator", desc: "Generate MD5, SHA1, SHA256, SHA384, and SHA512 hashes instantly.", icon: "🔑" },
  { name: "Timestamp Converter", slug: "timestamp", desc: "Convert between Unix timestamps and human-readable dates in any timezone.", icon: "⏰" },
  { name: "URL Encode/Decode", slug: "url-encode", desc: "Encode or decode URL strings with encodeURIComponent support.", icon: "🔗" },
  { name: "UUID Generator", slug: "uuid", desc: "Generate UUID v4 and v7, single or in batches, with one-click copy.", icon: "🆔" },
  { name: "Password Generator", slug: "password", desc: "Create strong random passwords with customizable length, character types, and strength meter.", icon: "🔑" },
  { name: "QR Code Generator", slug: "qr-code", desc: "Generate QR codes from any text, URL, or data. Download as high-quality PNG.", icon: "〰️" },
  { name: "Currency Converter", slug: "currency-converter", desc: "Convert between 50+ currencies with real-time exchange rates and popular pair shortcuts.", icon: "💱" },
  { name: "HMAC Generator", slug: "hmac-generator", desc: "Generate HMAC-MD5, SHA1, SHA256, SHA384, SHA512 signatures for API auth and payment verification.", icon: "🔏" },
  { name: "Word Counter", slug: "word-counter", desc: "Count characters, words, lines, sentences, paragraphs, reading time, and more in real-time.", icon: "📊" },
  { name: "Color Converter", slug: "color-converter", desc: "Convert between HEX, RGB, HSL, HSV, and CMYK with live color preview swatch.", icon: "🎨" },
  { name: "Regex Tester", slug: "regex-tester", desc: "Test regular expressions in real-time with match highlighting and presets.", icon: "🔍" },
  { name: "Payment Webhook Simulator", slug: "payment-webhook", desc: "Simulate Alipay, WeChat Pay, and Stripe payment callbacks for testing.", icon: "🔔" },
  { name: "RSA Key Generator", slug: "rsa-key-generator", desc: "Generate 2048/4096 bit RSA key pairs in PEM format using Web Crypto API.", icon: "🔐" },
  { name: "Cron Expression", slug: "cron", desc: "Build cron expressions visually and calculate next 10 execution times.", icon: "⏰" },
  { name: "Markdown Preview", slug: "markdown-preview", desc: "Write Markdown with real-time split-pane preview supporting GFM.", icon: "📝" },
  { name: "JSON Formatter", slug: "json-formatter", desc: "Format, validate, compress JSON with tree view and error detection.", icon: "📋" },
];

export default function ToolsPage() {
  const { t } = useI18n();
  const tp = getToolsPageTranslations(t);

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-2">
          <Link href="/" className="hover:text-blue-500 transition-colors">{tp.home}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{tp.toolsHome}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tp.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {tp.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const toolText = getToolTranslations(t, tool.slug as ToolKey);

          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-3">{tool.icon}</div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {toolText.title || tool.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {toolText.description || tool.desc}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          {tp.footer}
        </p>
      </div>
    </div>
  );
}
