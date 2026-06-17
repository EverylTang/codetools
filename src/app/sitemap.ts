import { MetadataRoute } from "next";

const tools = [
  "base64-file",
  "text-diff",
  "bcrypt",
  "aes-cipher",
  "user-agent",
  "chmod-calc",
  "ip-tools",
  "jsonpath-tester",
  "lorem-ipsum",
  "sign-verify",
  "webhook-receiver",
  "payment-debug",
  "http-status",
  "ulid-generator",
  "json-to-code",
  "jwt-decoder",
  "json-diff",
  "json-csv",
  "json-yaml",
  "sql-formatter",
  "case-converter",
  "html-entities",
  "xml-formatter",
  "base64",
  "hash-generator",
  "timestamp",
  "url-encode",
  "uuid",
  "password",
  "qr-code",
  "currency-converter",
  "acquiring-margin-calculator",
  "hmac-generator",
  "word-counter",
  "color-converter",
  "regex-tester",
  "payment-webhook",
  "rsa-key-generator",
  "cron",
  "tunnel-config",
  "markdown-preview",
  "json-formatter",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://codetools.cc";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  const toolPages = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}