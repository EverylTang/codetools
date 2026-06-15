"use client";

import { useMemo, useState } from "react";
import { generateFrpcConfig, type TunnelEntry, type TunnelFormState, type TunnelProtocol } from "@/lib/tunnelConfig";
import { useI18n } from "@/lib/i18n/I18nProvider";

const initialTunnel: TunnelEntry = {
  id: "web",
  name: "web",
  protocol: "http",
  localIp: "127.0.0.1",
  localPort: "3000",
  customDomain: "myapp.example.com",
  remotePort: "8080",
};

const initialState: TunnelFormState = {
  serverAddress: "123.123.123.123",
  serverPort: "7000",
  token: "token123",
  tunnels: [initialTunnel],
};

function createTunnel(index: number): TunnelEntry {
  return {
    id: `tunnel-${Date.now()}-${index}`,
    name: `service-${index}`,
    protocol: "tcp",
    localIp: "127.0.0.1",
    localPort: "8080",
    customDomain: "",
    remotePort: String(8000 + index),
  };
}

export default function TunnelConfigClient() {
  const { t } = useI18n();
  const tk = (t.tools as any)["tunnel-config"];
  const [state, setState] = useState<TunnelFormState>(initialState);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => generateFrpcConfig(state), [state]);

  const updateRoot = (key: keyof Omit<TunnelFormState, "tunnels">, value: string) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const updateTunnel = (id: string, key: keyof TunnelEntry, value: string) => {
    setState((current) => ({
      ...current,
      tunnels: current.tunnels.map((tunnel) => (tunnel.id === id ? { ...tunnel, [key]: value } : tunnel)),
    }));
  };

  const setProtocol = (id: string, protocol: TunnelProtocol) => {
    setState((current) => ({
      ...current,
      tunnels: current.tunnels.map((tunnel) => (tunnel.id === id ? { ...tunnel, protocol } : tunnel)),
    }));
  };

  const addTunnel = () => {
    setState((current) => ({
      ...current,
      tunnels: [...current.tunnels, createTunnel(current.tunnels.length + 1)],
    }));
  };

  const removeTunnel = (id: string) => {
    setState((current) => ({
      ...current,
      tunnels: current.tunnels.length === 1 ? current.tunnels : current.tunnels.filter((tunnel) => tunnel.id !== id),
    }));
  };

  const copyConfig = async () => {
    if (!result.config) return;
    await navigator.clipboard.writeText(result.config);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadConfig = () => {
    if (!result.config) return;
    const blob = new Blob([result.config], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "frpc.ini";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
      <div className="space-y-5">
        <section className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tk.serverSettings}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{tk.serverHint}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>{tk.serverAddress}</span>
              <input
                value={state.serverAddress}
                onChange={(event) => updateRoot("serverAddress", event.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
              />
            </label>
            <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>{tk.serverPort}</span>
              <input
                value={state.serverPort}
                onChange={(event) => updateRoot("serverPort", event.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
              />
            </label>
            <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 sm:col-span-2">
              <span>{tk.token}</span>
              <input
                value={state.token}
                onChange={(event) => updateRoot("token", event.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
              />
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tk.tunnels}</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tk.tunnelsHint}</p>
            </div>
            <button
              onClick={addTunnel}
              className="shrink-0 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:translate-y-px dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {tk.addTunnel}
            </button>
          </div>

          {state.tunnels.map((tunnel, index) => (
            <div key={tunnel.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tunnel.name || tk.unnamedTunnel}</h3>
                </div>
                <button
                  onClick={() => removeTunnel(tunnel.id)}
                  disabled={state.tunnels.length === 1}
                  className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  {tk.remove}
                </button>
              </div>

              <div className="mb-3 flex w-fit rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
                {(["http", "tcp"] as TunnelProtocol[]).map((protocol) => (
                  <button
                    key={protocol}
                    onClick={() => setProtocol(tunnel.id, protocol)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      tunnel.protocol === protocol
                        ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    }`}
                  >
                    {protocol.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>{tk.tunnelName}</span>
                  <input
                    value={tunnel.name}
                    onChange={(event) => updateTunnel(tunnel.id, "name", event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
                  />
                </label>
                <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>{tk.localIp}</span>
                  <input
                    value={tunnel.localIp}
                    onChange={(event) => updateTunnel(tunnel.id, "localIp", event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
                  />
                </label>
                <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>{tk.localPort}</span>
                  <input
                    value={tunnel.localPort}
                    onChange={(event) => updateTunnel(tunnel.id, "localPort", event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
                  />
                </label>
                {tunnel.protocol === "http" ? (
                  <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <span>{tk.customDomain}</span>
                    <input
                      value={tunnel.customDomain}
                      onChange={(event) => updateTunnel(tunnel.id, "customDomain", event.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
                    />
                  </label>
                ) : (
                  <label className="space-y-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <span>{tk.remotePort}</span>
                    <input
                      value={tunnel.remotePort}
                      onChange={(event) => updateTunnel(tunnel.id, "remotePort", event.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 text-gray-100 shadow-sm dark:border-gray-800">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">{tk.output}</h2>
              <p className="mt-1 text-xs text-gray-400">{tk.outputHint}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyConfig}
                disabled={!result.config}
                className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-950 transition hover:bg-gray-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? tk.copied : tk.copy}
              </button>
              <button
                onClick={downloadConfig}
                disabled={!result.config}
                className="rounded-md border border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-100 transition hover:border-gray-500 hover:bg-gray-900 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tk.download}
              </button>
            </div>
          </div>

          {result.errors.length > 0 ? (
            <div className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-xs leading-relaxed text-red-100">
              {result.errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : (
            <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-black/40 p-3 font-mono text-xs leading-relaxed text-gray-100">
              {result.config}
            </pre>
          )}
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-100">
          <h3 className="font-semibold">{tk.noteTitle}</h3>
          <p className="mt-2 text-xs leading-relaxed text-blue-900 dark:text-blue-200">{tk.noteBody}</p>
        </div>
      </aside>
    </div>
  );
}
