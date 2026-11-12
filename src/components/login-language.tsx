"use client";

import { Globe } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";

export default function LoginLanguage() {
  const { locale, switchLocale } = useI18n();
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[#e8ded1] bg-[#fffdf8] py-2 pl-3 pr-2 text-xs text-[#51493e]">
      <Globe size={15} aria-hidden />
      <select
        aria-label={locale === "en" ? "Language" : locale === "zh-Hant" ? "語言" : "语言"}
        value={locale}
        onChange={(event) => switchLocale(event.target.value as Locale)}
        className="bg-transparent pr-1"
      >
        <option value="zh-CN">简体中文</option>
        <option value="zh-Hant">繁體中文</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
