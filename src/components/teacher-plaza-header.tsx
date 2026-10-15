"use client";

import { useEffect, useState } from "react";
import { WorkbenchAccountMenu } from "@/components/workbench-account-menu";
import { localizedPath, type Locale } from "@/lib/i18n";
import { WORKBENCH_URL } from "@/lib/content";

function PlazaReturnLink({ locale }: { locale: Locale }) {
  const [target, setTarget] = useState<{ href: string; label: string } | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
    try {
      const workbench = new URL(WORKBENCH_URL, location.origin);
      const valid = (value: string | null) => {
        if (!value) return null;
        const url = new URL(value, location.origin);
        if (url.origin !== location.origin && url.origin !== workbench.origin) return null;
        if (/\/teacher-ecosystem\/?$/.test(url.pathname)) return null;
        if (url.origin === workbench.origin && url.origin !== location.origin && !url.pathname.startsWith(workbench.pathname)) return null;
        return url;
      };
      const source = valid(new URLSearchParams(location.search).get("returnTo"))
        || valid(sessionStorage.getItem("teacher-plaza-return")) || valid(document.referrer);
      if (!source) { setTarget(null); return; }
      const path = source.origin === workbench.origin && source.pathname.startsWith(workbench.pathname)
        ? `/${source.pathname.slice(workbench.pathname.length)}`.replace(/\/+$/, "") || "/"
        : source.pathname.replace(/\/+$/, "") || "/";
      const names: Record<string, string[]> = {
        "/history": ["我的作品", "My works", "我的作品"],
        "/assets": ["素材库", "Asset library", "素材庫"],
        "/my-assets": ["我的资产", "My assets", "我的資產"],
        "/recharge": ["创作套餐", "Plans", "創作套餐"],
        "/admin": ["平台管理", "Administration", "平台管理"],
      };
      const index = locale === "en" ? 1 : locale === "zh-Hant" ? 2 : 0;
      const name = names[path]?.[index] || (path.startsWith("/jobs/")
        ? ["作品工作台", "Workbench", "作品工作臺"][index]
        : source.searchParams.get("workspace") === "1"
        ? ["创作入口", "Create", "創作入口"][index]
        : ["首页", "Home", "首頁"][index]);
      setTarget({ href: source.href, label: locale === "en" ? `Back to ${name}` : `返回${name}` });
      sessionStorage.setItem("teacher-plaza-return", source.href);
    } catch { setTarget(null); }
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);
  const label = target?.label || (locale === "en" ? "Back to Home" : locale === "zh-Hant" ? "返回首頁" : "返回首页");
  return <a className="plaza-return-link" href={target?.href || localizedPath(locale)} aria-label={label}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg><span>{label}</span></a>;
}

export default function TeacherPlazaHeader({ locale }: { locale: Locale }) {
  const title = locale === "en" ? "Teacher Resource Plaza" : locale === "zh-Hant" ? "教師資源廣場" : "教师资源广场";
  return <header className="plaza-workbench-header">
    <a className="plaza-workbench-brand" href={localizedPath(locale)}><span className="plaza-workbench-seal"><img src="/icon.png" alt="" /></span><span><strong>{locale === "en" ? title : `临场 · ${title}`}</strong><small>TEACHER RESOURCE PLAZA</small></span></a>
    <nav className="plaza-workbench-actions" aria-label="广场导航"><PlazaReturnLink locale={locale} /><WorkbenchAccountMenu /></nav>
  </header>;
}
