"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const gitOperations = [
  { value: "clone", label: "Clone", description: "Clone a repository" },
  { value: "commit", label: "Commit", description: "Commit changes" },
  { value: "push", label: "Push", description: "Push to remote" },
  { value: "pull", label: "Pull", description: "Pull from remote" },
  { value: "branch", label: "Branch", description: "Create/list branches" },
  { value: "merge", label: "Merge", description: "Merge branches" },
  { value: "rebase", label: "Rebase", description: "Rebase branch" },
  { value: "checkout", label: "Checkout", description: "Switch branches" },
  { value: "reset", label: "Reset", description: "Reset to commit" },
  { value: "revert", label: "Revert", description: "Revert commit" },
  { value: "tag", label: "Tag", description: "Create tags" },
  { value: "cherry-pick", label: "Cherry-pick", description: "Apply commit" },
];

const commonOptions = {
  clone: ["--depth 1", "--single-branch", "--branch <name>"],
  commit: ["-m <message>", "-a", "--amend", "--no-verify"],
  push: ["-u origin <branch>", "--force", "--dry-run", "--tags"],
  pull: ["--rebase", "--ff-only", "--no-commit"],
  branch: ["-d <branch>", "-D <branch>", "-m <new-name>", "-a"],
  merge: ["--no-ff", "--squash", "--abort", "--continue"],
  rebase: ["-i <commit>", "--abort", "--continue", "--skip"],
  checkout: ["-b <branch>", "-t origin/<branch>", "--"],
  reset: ["--soft HEAD~1", "--hard HEAD~1", "--mixed <commit>"],
  revert: ["-n", "--no-edit", "<commit>"],
  tag: ["-a <name>", "-d <name>", "<name> <commit>"],
  "cherry-pick": ["-n", "-x", "-e", "<commit>"],
};

export default function GitCommandClient() {
  const { t } = useI18n();
  const ttools = (t as any).tools?.["git-command"] || {};

  const [operation, setOperation] = useState("clone");
  const [options, setOptions] = useState<string[]>([]);
  const [customArgs, setCustomArgs] = useState({
    repo: "",
    branch: "",
    message: "",
    remote: "origin",
    source: "",
    target: "",
    commit: "",
  });

  const generateCommand = () => {
    let cmd = `git ${operation}`;
    const opts = commonOptions[operation as keyof typeof commonOptions] || [];
    const selectedOpts = opts.filter((_, i) => options.includes(String(i)));

    switch (operation) {
      case "clone":
        if (customArgs.repo) cmd += ` ${customArgs.repo}`;
        if (customArgs.branch) cmd += ` -b ${customArgs.branch}`;
        break;
      case "commit":
        if (customArgs.message) cmd += ` -m "${customArgs.message}"`;
        break;
      case "push":
        cmd += ` ${customArgs.remote || "origin"}`;
        if (customArgs.branch) cmd += ` ${customArgs.branch}`;
        break;
      case "pull":
        cmd += ` ${customArgs.remote || "origin"}`;
        if (customArgs.branch) cmd += ` ${customArgs.branch}`;
        break;
      case "branch":
        if (customArgs.target) cmd += ` ${customArgs.target}`;
        break;
      case "merge":
        if (customArgs.source) cmd += ` ${customArgs.source}`;
        break;
      case "rebase":
        if (customArgs.source) cmd += ` ${customArgs.source}`;
        break;
      case "checkout":
        if (customArgs.target) cmd += ` ${customArgs.target}`;
        break;
      case "reset":
        if (customArgs.commit) cmd += ` ${customArgs.commit}`;
        break;
      case "revert":
        if (customArgs.commit) cmd += ` ${customArgs.commit}`;
        break;
      case "tag":
        if (customArgs.target) cmd += ` ${customArgs.target}`;
        if (customArgs.commit) cmd += ` ${customArgs.commit}`;
        break;
      case "cherry-pick":
        if (customArgs.commit) cmd += ` ${customArgs.commit}`;
        break;
    }

    selectedOpts.forEach((opt) => {
      cmd += ` ${opt}`;
    });

    return cmd;
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(generateCommand());
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const toggleOption = (index: number) => {
    const idx = String(index);
    setOptions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const opts = commonOptions[operation as keyof typeof commonOptions] || [];

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {ttools.title || "Git Command Builder"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {ttools.description || "Build Git commands visually with options."}
        </p>
      </div>

      <div className="space-y-6">
        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Operation Type
          </label>
          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setOptions([]);
            }}
            className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            {gitOperations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label} - {op.description}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Arguments */}
        <div className="grid gap-4 sm:grid-cols-2">
          {(operation === "clone" || operation === "push" || operation === "pull") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Repository / Remote
              </label>
              <input
                type="text"
                value={operation === "clone" ? customArgs.repo : customArgs.remote}
                onChange={(e) =>
                  setCustomArgs((prev) => ({
                    ...prev,
                    [operation === "clone" ? "repo" : "remote"]: e.target.value,
                  }))
                }
                placeholder={operation === "clone" ? "https://github.com/user/repo.git" : "origin"}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {(operation === "commit" || operation === "tag") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message / Tag Name
              </label>
              <input
                type="text"
                value={operation === "commit" ? customArgs.message : customArgs.target}
                onChange={(e) =>
                  setCustomArgs((prev) => ({
                    ...prev,
                    [operation === "commit" ? "message" : "target"]: e.target.value,
                  }))
                }
                placeholder={operation === "commit" ? "Fix bug" : "v1.0.0"}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {(operation === "branch" || operation === "checkout" || operation === "merge" || operation === "rebase") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Branch Name
              </label>
              <input
                type="text"
                value={customArgs.target || customArgs.source}
                onChange={(e) =>
                  setCustomArgs((prev) => ({
                    ...prev,
                    target: e.target.value,
                    source: e.target.value,
                  }))
                }
                placeholder="feature/new-feature"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {(operation === "reset" || operation === "revert" || operation === "cherry-pick") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Commit
              </label>
              <input
                type="text"
                value={customArgs.commit}
                onChange={(e) =>
                  setCustomArgs((prev) => ({ ...prev, commit: e.target.value }))
                }
                placeholder="HEAD~1 or abc123"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Options
          </label>
          <div className="flex flex-wrap gap-2">
            {opts.map((opt, index) => (
              <button
                key={index}
                onClick={() => toggleOption(index)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  options.includes(String(index))
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Command */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generated Command
          </label>
          <div className="relative">
            <pre className="w-full p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
              {generateCommand()}
            </pre>
            <button
              onClick={copyCommand}
              className="absolute top-2 right-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Quick Examples */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Examples
          </label>
          <div className="space-y-2">
            {[
              "git clone --depth 1 https://github.com/user/repo.git",
              "git commit -am \"Fix critical bug\"",
              "git push -u origin main --force",
              "git checkout -b feature/new-feature",
              "git merge --no-ff develop",
            ].map((example, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-mono cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => navigator.clipboard.writeText(example)}
              >
                {example}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
