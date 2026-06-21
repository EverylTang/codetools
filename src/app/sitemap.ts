import { MetadataRoute } from "next";

const tools = [
  "acquiring-margin-calculator",
  "aes-cipher",
  "base64",
  "base64-file",
  "bcrypt",
  "case-converter",
  "chmod-calc",
  "color-converter",
  "cron",
  "currency-converter",
  "docker-command",
  "env-generator",
  "git-command",
  "hash-generator",
  "hmac-generator",
  "html-entities",
  "http-status",
  "ip-tools",
  "json-csv",
  "json-diff",
  "json-formatter",
  "json-to-code",
  "json-yaml",
  "jsonpath-tester",
  "jwt-decoder",
  "lorem-ipsum",
  "markdown-preview",
  "password",
  "payment-debug",
  "payment-webhook",
  "qr-code",
  "random-data-generator",
  "regex-tester",
  "rsa-key-generator",
  "sign-verify",
  "sql-formatter",
  "ssh-key-generator",
  "text-diff",
  "timestamp",
  "tunnel-config",
  "ulid-generator",
  "url-encode",
  "user-agent",
  "uuid",
  "webhook-receiver",
  "word-counter",
  "xml-formatter",
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
  ];

  const toolPages = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}