"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function intToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");
}

function getSubnetMask(cidr: number): string {
  return intToIp(~((1 << (32 - cidr)) - 1));
}

function getNetworkAddress(ip: string, cidr: number): string {
  const mask = ~((1 << (32 - cidr)) - 1);
  return intToIp(ipToInt(ip) & mask);
}

function getBroadcastAddress(ip: string, cidr: number): string {
  const mask = ~((1 << (32 - cidr)) - 1);
  return intToIp((ipToInt(ip) & mask) | ~mask);
}

function getHostCount(cidr: number): number {
  return Math.pow(2, 32 - cidr) - 2;
}

export default function IpToolsClient() {
  const { t } = useI18n();
  const tk = (t as any).tools?.["ip-tools"] || {};

  const [tab, setTab] = useState<"subnet" | "convert">("subnet");
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [ipInput, setIpInput] = useState("192.168.1.1");
  const [intInput, setIntInput] = useState("");

  const subnetResult = useMemo(() => {
    if (!ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) return null;
    try {
      const mask = getSubnetMask(cidr);
      const network = getNetworkAddress(ip, cidr);
      const broadcast = getBroadcastAddress(ip, cidr);
      const hosts = getHostCount(cidr);
      const networkInt = ipToInt(network);
      const broadcastInt = ipToInt(broadcast);
      const firstHost = intToIp(networkInt + 1);
      const lastHost = intToIp(broadcastInt - 1);
      return { mask, network, broadcast, hosts, firstHost, lastHost, cidr };
    } catch { return null; }
  }, [ip, cidr]);

  const convertResult = useMemo(() => {
    if (!ipInput.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) return null;
    try {
      const intVal = ipToInt(ipInput);
      const hex = "0x" + intVal.toString(16).padStart(8, "0").toUpperCase();
      const binary = intVal.toString(2).padStart(32, "0");
      return { intVal, hex, binary };
    } catch { return null; }
  }, [ipInput]);

  const subnetLabel = tk.subnetCalc || "Subnet Calculator";
  const convertLabel = tk.convert || "IP Converter";
  const ipLabel = tk.ipAddress || "IP Address";
  const cidrLabel = tk.cidr || "CIDR";
  const maskLabel = tk.mask || "Subnet Mask";
  const networkLabel = tk.network || "Network";
  const broadcastLabel = tk.broadcast || "Broadcast";
  const hostCountLabel = tk.hostCount || "Host Count";
  const firstHostLabel = tk.firstHost || "First Host";
  const lastHostLabel = tk.lastHost || "Last Host";
  const intLabel = tk.integer || "Integer";
  const hexLabel = tk.hex || "Hex";
  const binaryLabel = tk.binary || "Binary";

  return (
    <div className="flex flex-col flex-1 gap-4 max-w-lg mx-auto">
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 w-fit">
        <button onClick={() => setTab("subnet")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === "subnet" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{subnetLabel}</button>
        <button onClick={() => setTab("convert")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === "convert" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>{convertLabel}</button>
      </div>

      {tab === "subnet" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{ipLabel}</label>
              <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{cidrLabel}</label>
              <select value={cidr} onChange={(e) => setCidr(Number(e.target.value))} className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {Array.from({ length: 33 }, (_, i) => i).map(n => (
                  <option key={n} value={n}>/{n}</option>
                ))}
              </select>
            </div>
          </div>
          {subnetResult && (
            <div className="grid grid-cols-2 gap-2">
              {[
                [maskLabel, subnetResult.mask],
                [networkLabel, subnetResult.network],
                [broadcastLabel, subnetResult.broadcast],
                [hostCountLabel, subnetResult.hosts.toLocaleString()],
                [firstHostLabel, subnetResult.firstHost],
                [lastHostLabel, subnetResult.lastHost],
              ].map(([label, value]) => (
                <div key={label} className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="text-[10px] text-gray-400">{label}</div>
                  <div className="text-sm font-mono text-gray-900 dark:text-gray-100">{value}</div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{ipLabel}</label>
            <input type="text" value={ipInput} onChange={(e) => setIpInput(e.target.value)} className="w-full p-2.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          {convertResult && (
            <div className="space-y-2">
              {[
                [intLabel, convertResult.intVal.toString()],
                [hexLabel, convertResult.hex],
                [binaryLabel, convertResult.binary],
              ].map(([label, value]) => (
                <div key={label} className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="text-[10px] text-gray-400">{label}</div>
                  <div className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">{value}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}