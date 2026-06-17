"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const dockerOperations = [
  { value: "run", label: "Run", description: "Run a container" },
  { value: "build", label: "Build", description: "Build an image" },
  { value: "exec", label: "Exec", description: "Execute in container" },
  { value: "stop", label: "Stop", description: "Stop a container" },
  { value: "rm", label: "Remove", description: "Remove container/image" },
  { value: "logs", label: "Logs", description: "View container logs" },
  { value: "inspect", label: "Inspect", description: "Show details" },
  { value: "ps", label: "PS", description: "List containers" },
];

export default function DockerCommandClient() {
  const { t } = useI18n();
  const [operation, setOperation] = useState("run");
  const [imageName, setImageName] = useState("nginx:latest");
  const [containerName, setContainerName] = useState("");
  const [port, setPort] = useState("");
  const [volume, setVolume] = useState("");
  const [env, setEnv] = useState("");
  const [detach, setDetach] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const [tty, setTty] = useState(false);
  const [rm, setRm] = useState(false);

  const generateCommand = () => {
    let cmd = `docker ${operation}`;
    
    if (operation === "run") {
      if (detach) cmd += " -d";
      if (rm) cmd += " --rm";
      if (interactive) cmd += " -i";
      if (tty) cmd += " -t";
      if (containerName) cmd += ` --name ${containerName}`;
      if (port) cmd += ` -p ${port}`;
      if (volume) cmd += ` -v ${volume}`;
      if (env) cmd += ` -e ${env}`;
      cmd += ` ${imageName}`;
    } else if (operation === "build") {
      if (imageName !== "nginx:latest") cmd += ` -t ${imageName}`;
      cmd += " .";
    } else if (operation === "exec") {
      if (interactive) cmd += " -i";
      if (tty) cmd += " -t";
      cmd += ` ${containerName || "container_name"} /bin/bash`;
    } else {
      cmd += ` ${containerName || "container_name"}`;
    }
    
    return cmd;
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(generateCommand());
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Docker Command Builder</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Build Docker commands visually.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {dockerOperations.map((op) => (
              <option key={op.value} value={op.value}>{op.label} - {op.description}</option>
            ))}
          </select>
        </div>

        {operation !== "build" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Container Name</label>
            <input
              type="text"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              placeholder="my-container"
              className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        {operation === "run" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Name</label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="nginx:latest"
                className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port Mapping</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="8080:80"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volume</label>
                <input
                  type="text"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="./data:/app/data"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={detach} onChange={(e) => setDetach(e.target.checked)} className="rounded" />
                -d (Detach)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={rm} onChange={(e) => setRm(e.target.checked)} className="rounded" />
                --rm (Auto-remove)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={interactive} onChange={(e) => setInteractive(e.target.checked)} className="rounded" />
                -i (Interactive)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={tty} onChange={(e) => setTty(e.target.checked)} className="rounded" />
                -t (TTY)
              </label>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Command</label>
          <div className="relative">
            <pre className="w-full p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
              {generateCommand()}
            </pre>
            <button onClick={copyCommand} className="absolute top-2 right-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
