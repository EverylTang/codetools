"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface EnvVar {
  key: string;
  value: string;
  comment?: string;
}

const templates = {
  nodejs: [
    { key: "NODE_ENV", value: "development", comment: "Environment" },
    { key: "PORT", value: "3000", comment: "Server port" },
    { key: "DATABASE_URL", value: "postgresql://user:pass@localhost:5432/db", comment: "Database connection" },
    { key: "REDIS_URL", value: "redis://localhost:6379", comment: "Redis connection" },
    { key: "JWT_SECRET", value: "your-secret-key", comment: "JWT signing secret" },
  ],
  nextjs: [
    { key: "NEXT_PUBLIC_API_URL", value: "http://localhost:3000/api", comment: "API URL" },
    { key: "DATABASE_URL", value: "postgresql://user:pass@localhost:5432/db", comment: "Database" },
    { key: "NEXTAUTH_SECRET", value: "your-auth-secret", comment: "NextAuth secret" },
    { key: "NEXTAUTH_URL", value: "http://localhost:3000", comment: "Auth callback URL" },
  ],
  django: [
    { key: "DEBUG", value: "True", comment: "Debug mode" },
    { key: "SECRET_KEY", value: "your-secret-key", comment: "Django secret key" },
    { key: "ALLOWED_HOSTS", value: "localhost,127.0.0.1", comment: "Allowed hosts" },
    { key: "DATABASE_URL", value: "postgresql://user:pass@localhost:5432/db", comment: "Database" },
  ],
};

export default function EnvGeneratorClient() {
  const { t } = useI18n();
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [envName, setEnvName] = useState(".env");

  const addVar = () => {
    setEnvVars([...envVars, { key: "", value: "", comment: "" }]);
  };

  const updateVar = (index: number, field: keyof EnvVar, value: string) => {
    const updated = [...envVars];
    updated[index] = { ...updated[index], [field]: value };
    setEnvVars(updated);
  };

  const removeVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const loadTemplate = (template: keyof typeof templates) => {
    setEnvVars(templates[template].map((v) => ({ ...v })));
  };

  const generateContent = () => {
    return envVars
      .map((v) => {
        if (!v.key) return "";
        let line = v.comment ? `# ${v.comment}\n` : "";
        line += `${v.key}=${v.value}`;
        return line;
      })
      .filter(Boolean)
      .join("\n");
  };

  const downloadFile = () => {
    const content = generateContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = envName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(generateContent());
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">.env Generator</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generate and manage environment variable files.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Load Template</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(templates).map((t) => (
              <button
                key={t}
                onClick={() => loadTemplate(t as keyof typeof templates)}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {envVars.map((v, i) => (
            <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <input
                type="text"
                value={v.key}
                onChange={(e) => updateVar(i, "key", e.target.value)}
                placeholder="VAR_NAME"
                className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono"
              />
              <span className="text-gray-400">=</span>
              <input
                type="text"
                value={v.value}
                onChange={(e) => updateVar(i, "value", e.target.value)}
                placeholder="value"
                className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono"
              />
              <input
                type="text"
                value={v.comment}
                onChange={(e) => updateVar(i, "comment", e.target.value)}
                placeholder="comment (optional)"
                className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
              <button
                onClick={() => removeVar(i)}
                className="px-2 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addVar}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          + Add Variable
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated .env</label>
          <div className="relative">
            <pre className="w-full p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {generateContent() || "# Add variables to see output"}
            </pre>
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={copyContent} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded">
                Copy
              </button>
              <button onClick={downloadFile} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
