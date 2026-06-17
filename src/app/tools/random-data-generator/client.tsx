"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const fieldTypes = [
  { value: "name", label: "Full Name" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "email", label: "Email" },
  { value: "username", label: "Username" },
  { value: "phone", label: "Phone" },
  { value: "company", label: "Company" },
  { value: "address", label: "Address" },
  { value: "city", label: "City" },
  { value: "country", label: "Country" },
  { value: "date", label: "Date" },
  { value: "timestamp", label: "Timestamp" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "uuid", label: "UUID" },
];

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const companies = ["Acme Corp", "TechStart", "GlobalInc", "DataFlow", "CloudNine", "ByteCode", "PixelPerfect", "DevTools", "InnovateLab", "FutureTech"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
const countries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "China", "India", "Brazil"];

function generateValue(type: string): string | number | boolean {
  switch (type) {
    case "name":
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    case "firstName":
      return firstNames[Math.floor(Math.random() * firstNames.length)];
    case "lastName":
      return lastNames[Math.floor(Math.random() * lastNames.length)];
    case "email":
      return `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}@example.com`;
    case "username":
      return `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}_${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}${Math.floor(Math.random() * 100)}`;
    case "phone":
      return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    case "company":
      return companies[Math.floor(Math.random() * companies.length)];
    case "address":
      return `${Math.floor(Math.random() * 9999) + 1} ${["Main", "Oak", "Maple", "Cedar", "Pine"][Math.floor(Math.random() * 5)]} St`;
    case "city":
      return cities[Math.floor(Math.random() * cities.length)];
    case "country":
      return countries[Math.floor(Math.random() * countries.length)];
    case "date":
      return new Date(Date.now() - Math.random() * 31536000000).toISOString().split("T")[0];
    case "timestamp":
      return new Date(Date.now() - Math.random() * 31536000000).toISOString();
    case "number":
      return Math.floor(Math.random() * 10000);
    case "boolean":
      return Math.random() > 0.5;
    case "uuid":
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
      });
    default:
      return "";
  }
}

export default function RandomDataClient() {
  const { t } = useI18n();
  const [fields, setFields] = useState([{ type: "name" }, { type: "email" }, { type: "company" }]);
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [generated, setGenerated] = useState<any[]>([]);

  const addField = () => {
    setFields([...fields, { type: "email" }]);
  };

  const updateField = (index: number, type: string) => {
    const updated = [...fields];
    updated[index] = { type };
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const generate = () => {
    const data = Array.from({ length: count }, () => {
      const obj: any = {};
      fields.forEach((field, i) => {
        obj[field.type] = generateValue(field.type);
      });
      return obj;
    });
    setGenerated(data);
  };

  const getOutput = () => {
    if (format === "json") {
      return JSON.stringify(generated, null, 2);
    } else {
      if (generated.length === 0) return "";
      const headers = fields.map((f) => f.type).join(",");
      const rows = generated.map((row) => fields.map((f) => String(row[f.type])).join(","));
      return [headers, ...rows].join("\n");
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(getOutput());
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const downloadFile = () => {
    const ext = format === "json" ? "json" : "csv";
    const blob = new Blob([getOutput()], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Random Data Generator</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generate mock data for testing.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fields</label>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={field.type}
                  onChange={(e) => updateField(i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {fieldTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <button onClick={() => removeField(i)} className="px-2 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded">✕</button>
              </div>
            ))}
          </div>
          <button onClick={addField} className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
            + Add Field
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Record Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as "json" | "csv")}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <button onClick={generate} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
          Generate {count} Records
        </button>

        {generated.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Data</label>
            <div className="relative">
              <pre className="w-full p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                {getOutput()}
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={copyOutput} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded">Copy</button>
                <button onClick={downloadFile} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded">Download</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
