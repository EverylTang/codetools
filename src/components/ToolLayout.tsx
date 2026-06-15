"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getToolsPageTranslations, getToolTranslations, ToolKey } from "@/lib/i18n/toolTranslations";

interface ToolLayoutProps {
  title?: string;
  description?: string;
  toolKey: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, toolKey, children }: ToolLayoutProps) {
  const { t } = useI18n();
  const toolData = getToolTranslations(t, toolKey as ToolKey);
  const displayTitle = toolData.title || title || "";
  const displayDesc = toolData.description || description || "";
  const pageData = getToolsPageTranslations(t);

  return (
    <div className="flex flex-col flex-1 h-full max-w-4xl mx-auto w-full px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-2">
          <Link href="/" className="hover:text-blue-500 transition-colors">{pageData.home}</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-blue-500 transition-colors">{pageData.toolsHome}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{displayTitle}</span>
        </div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {pageData.toolsHome}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayTitle}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{displayDesc}</p>
      </div>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          {displayTitle} - {pageData.footer}
        </p>
      </div>
    </div>
  );
}
