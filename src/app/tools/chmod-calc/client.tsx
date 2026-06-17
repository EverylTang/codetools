"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const PERM_GROUPS = [
  { key: "owner", label: "Owner (u)" },
  { key: "group", label: "Group (g)" },
  { key: "others", label: "Others (o)" },
] as const;

const PERM_BITS = [
  { key: "r", label: "Read (r)", value: 4 },
  { key: "w", label: "Write (w)", value: 2 },
  { key: "x", label: "Execute (x)", value: 1 },
] as const;

export default function ChmodCalcClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["chmod-calc"] || {};

  const [perms, setPerms] = useState<Record<string, string[]>>({
    owner: ["r", "w", "x"],
    group: ["r", "x"],
    others: ["r", "x"],
  });

  const toggle = (group: string, bit: string) => {
    setPerms(prev => {
      const current = prev[group] || [];
      const next = current.includes(bit) ? current.filter(b => b !== bit) : [...current, bit];
      return { ...prev, [group]: next };
    });
  };

  const result = useMemo(() => {
    let octal = "";
    let symbolic = "";
    for (const g of PERM_GROUPS) {
      let val = 0;
      let sym = "";
      if (perms[g.key].includes("r")) { val += 4; sym += "r"; } else sym += "-";
      if (perms[g.key].includes("w")) { val += 2; sym += "w"; } else sym += "-";
      if (perms[g.key].includes("x")) { val += 1; sym += "x"; } else sym += "-";
      octal += val;
      symbolic += sym;
    }
    return { octal, symbolic, cmd: `chmod ${octal} file` };
  }, [perms]);

  const octalLabel = tk.octal || "Octal";
  const symbolicLabel = tk.symbolic || "Symbolic";
  const commandLabel = tk.command || "Command";
  const copyLabel = tk.copy || "Copy";
  const copiedLabel = tk.copied || "Copied!";

  return (
    <div className="flex flex-col flex-1 gap-4 max-w-lg mx-auto">
      <div className="grid gap-4">
        {PERM_GROUPS.map((group) => (
          <div key={group.key}>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{group.label}</div>
            <div className="flex gap-2">
              {PERM_BITS.map((bit) => {
                const active = perms[group.key]?.includes(bit.key);
                return (
                  <button
                    key={bit.key}
                    onClick={() => toggle(group.key, bit.key)}
                    className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      active
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {bit.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
          <div className="text-[10px] text-gray-400 uppercase mb-1">{octalLabel}</div>
          <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">{result.octal}</div>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
          <div className="text-[10px] text-gray-400 uppercase mb-1">{symbolicLabel}</div>
          <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">{result.symbolic}</div>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
          <div className="text-[10px] text-gray-400 uppercase mb-1">{commandLabel}</div>
          <div className="text-sm font-mono text-gray-900 dark:text-gray-100">{result.cmd}</div>
        </div>
      </div>

      <div className="text-[10px] text-gray-400 dark:text-gray-500">
        4 = read, 2 = write, 1 = execute. Common: 755 (dirs), 644 (files), 600 (private), 777 (public).
      </div>
    </div>
  );
}