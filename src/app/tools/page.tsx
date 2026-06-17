"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const tools = [
  { name: "Git Command Builder", slug: "git-command", desc: "Build Git commands visually. Generate clone, commit, push, branch, merge, rebase commands with options.", icon: "🔀" },
  { name: "Docker Command Builder", slug: "docker-command", desc: "Build Docker commands visually. Generate docker run, build, exec, and more commands with options.", icon: "🐳" },
  { name: ".env Generator", slug: "env-generator", desc: "Generate and manage .env files. Add variables, validate format, and export for different environments.", icon: "⚙️" },
  { name: "SSH Key Generator", slug: "ssh-key-generator", desc: "Generate SSH key pairs (Ed25519, RSA) directly in your browser. Download keys in PEM format.", icon: "🔑" },
  { name: "Random Data Generator", slug: "random-data-generator", desc: "Generate random mock data for testing. Create datasets with names, emails, dates, and custom fields.", icon: "🎲" },
  { name: "Base64 File Converter", slug: "base64-file", desc: "Convert files to Base64 data URIs and decode Base64 back to editable files. Supports images, PDFs.", icon: "📁" },
  { name: "Text Diff", slug: "text-diff", desc: "Compare two texts line by line with color-coded diff highlighting. Unified and split view.", icon: "🔍" },
  { name: "Bcrypt Hash & Verify", slug: "bcrypt", desc: "Generate bcrypt password hashes and verify passwords. Adjustable cost factor.", icon: "🔒" },
  { name: "AES Encryption", slug: "aes-cipher", desc: "Encrypt and decrypt text using AES-CBC and AES-GCM with 128/192/256-bit keys.", icon: "🔐" },
  { name: "User-Agent Parser", slug: "user-agent", desc: "Parse any User-Agent string to identify browser, OS, device, and engine.", icon: "🖥" },
  { name: "Chmod Calculator", slug: "chmod-calc", desc: "Calculate Linux file permissions. Toggle r/w/x and see octal and symbolic notation.", icon: "🔢" },
  { name: "IP Address Tools", slug: "ip-tools", desc: "Subnet calculator, CIDR notation, and IP-to-integer converter. IPv4 support.", icon: "🌐" },
  { name: "JSONPath Tester", slug: "jsonpath-tester", desc: "Test JSONPath expressions against JSON data. Supports filters, slices, recursive descent.", icon: "🔎" },
  { name: "Lorem Ipsum Generator", slug: "lorem-ipsum", desc: "Generate Lorem Ipsum placeholder text. Configurable paragraphs, sentences, and words.", icon: "📝" },
  { name: "Signature Verification", slug: "sign-verify", desc: "Verify payment and API signatures. Compare computed HMAC/RSA signatures with received values.", icon: "✓" },
  { name: "Webhook Receiver", slug: "webhook-receiver", desc: "Create a temporary webhook endpoint to receive and inspect real-time payment callbacks.", icon: "📡" },
  { name: "Payment API Debugger", slug: "payment-debug", desc: "Construct, sign, send, and inspect payment API requests. Full debugging workflow.", icon: "🐛" },
  { name: "HTTP Status Codes", slug: "http-status", desc: "Complete reference of all HTTP status codes. Browse 1xx–5xx with descriptions.", icon: "🌐" },
  { name: "ULID Generator", slug: "ulid-generator", desc: "Generate time-ordered, sortable ULIDs. URL-safe, 26 chars, batch generation.", icon: "🆔" },
  { name: "JSON to Code", slug: "json-to-code", desc: "Convert JSON to typed code in 8 languages. TypeScript, Go, Python, Java, and more.", icon: "🔧" },
  { name: "JWT Decoder", slug: "jwt-decoder", desc: "Decode and inspect JWT tokens. View header and payload claims in a readable JSON tree.", icon: "🔐" },
  { name: "JSON Diff", slug: "json-diff", desc: "Compare two JSON objects side by side with visual diff highlighting.", icon: "🔍" },
  { name: "JSON ↔ CSV", slug: "json-csv", desc: "Convert between JSON arrays and CSV format. Supports JSONL format.", icon: "📊" },
  { name: "JSON ↔ YAML", slug: "json-yaml", desc: "Convert between JSON and YAML. Perfect for config files and API specs.", icon: "📝" },
  { name: "SQL Formatter", slug: "sql-formatter", desc: "Format and beautify SQL queries. Supports MySQL, PostgreSQL, SQLite, and more.", icon: "🗄" },
  { name: "Case Converter", slug: "case-converter", desc: "Convert text between camelCase, snake_case, kebab-case, and 10+ other styles.", icon: "Aa" },
  { name: "HTML Entities", slug: "html-entities", desc: "Encode or decode HTML entities. Convert special characters to HTML entities and back.", icon: "🌐" },
  { name: "XML Formatter", slug: "xml-formatter", desc: "Format, validate, and compress XML documents with adjustable indentation.", icon: "📋" },
  { name: "Base64 Encode/Decode", slug: "base64", desc: "Encode and decode Base64 text, or convert files to Base64 data URIs.", icon: "🔐" },
  { name: "Hash Generator", slug: "hash-generator", desc: "Generate MD5, SHA1, SHA256, SHA384, and SHA512 hashes instantly.", icon: "🔑" },
  { name: "Timestamp Converter", slug: "timestamp", desc: "Convert between Unix timestamps and human-readable dates in any timezone.", icon: "⏰" },
  { name: "URL Encode/Decode", slug: "url-encode", desc: "Encode or decode URL strings with encodeURIComponent support.", icon: "🔗" },
  { name: "UUID Generator", slug: "uuid", desc: "Generate UUID v4 and v7, single or in batches, with one-click copy.", icon: "🆔" },
  { name: "Password Generator", slug: "password", desc: "Create strong random passwords with customizable length, character types, and strength meter.", icon: "🔑" },
  { name: "QR Code Generator", slug: "qr-code", desc: "Generate QR codes from any text, URL, or data. Download as high-quality PNG.", icon: "〰️" },
  { name: "Currency Converter", slug: "currency-converter", desc: "Convert between 50+ currencies with real-time exchange rates and popular pair shortcuts.", icon: "💱" },
  { name: "Acquiring Margin Calculator", slug: "acquiring-margin-calculator", desc: "Calculate processing fee revenue, channel cost, FX margin, and total acquiring gross margin.", icon: "📈" },
  { name: "HMAC Generator", slug: "hmac-generator", desc: "Generate HMAC-MD5, SHA1, SHA256, SHA384, SHA512 signatures for API auth and payment verification.", icon: "🔏" },
  { name: "Word Counter", slug: "word-counter", desc: "Count characters, words, lines, sentences, paragraphs, reading time, and more in real-time.", icon: "📊" },
  { name: "Color Converter", slug: "color-converter", desc: "Convert between HEX, RGB, HSL, HSV, and CMYK with live color preview swatch.", icon: "🎨" },
  { name: "Regex Tester", slug: "regex-tester", desc: "Test regular expressions in real-time with match highlighting and presets.", icon: "🔍" },
  { name: "Payment Webhook Simulator", slug: "payment-webhook", desc: "Simulate Alipay, WeChat Pay, and Stripe payment callbacks for testing.", icon: "🔔" },
  { name: "RSA Key Generator", slug: "rsa-key-generator", desc: "Generate 2048/4096 bit RSA key pairs in PEM format using Web Crypto API.", icon: "🔐" },
  { name: "Cron Expression", slug: "cron", desc: "Build cron expressions visually and calculate next 10 execution times.", icon: "⏰" },
  { name: "frp Tunnel Config", slug: "tunnel-config", desc: "Generate frpc.ini files for HTTP and TCP tunnels with copy and download actions.", icon: "FRP" },
  { name: "Markdown Preview", slug: "markdown-preview", desc: "Write Markdown with real-time split-pane preview supporting GFM.", icon: "📝" },
  { name: "JSON Formatter", slug: "json-formatter", desc: "Format, validate, compress JSON with tree view and error detection.", icon: "📋" },
];

export default function ToolsPage() {
  const { t } = useI18n();
  const ttools = (t as any).tools || {};
  const tp = ttools.page || {};

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-2">
          <Link href="/" className="hover:text-blue-500 transition-colors">{tp.home || "Home"}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{tp.toolsHome || "Tools"}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tp.title || "Developer Tools"}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {tp.description || "Free online tools for developers."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const toolText = ttools[tool.slug] || {};
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
          {tp.footer || "JSON2Code Toolbox - Free online developer tools."}
        </p>
      </div>
    </div>
  );
}
