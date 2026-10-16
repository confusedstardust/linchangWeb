"use client";

import { useEffect, useState } from "react";
import { WorkbenchAccountMenu } from "@/components/workbench-account-menu";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { WORKBENCH_URL } from "@/lib/content";
import BrandLogo from "@/components/brand-logo";

function PlazaReturnLink({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).ui.plaza;
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
      const name = copy.returnNames[path] || (path.startsWith('/jobs/')
        ? copy.returnNames.job
        : source.searchParams.get('workspace') === '1'
        ? copy.returnNames.workspace
        : copy.returnNames['/']);
      setTarget({ href: source.href, label: copy.returnTo.replace('{name}', name) });
      sessionStorage.setItem("teacher-plaza-return", source.href);
    } catch { setTarget(null); }
    });
    return () => cancelAnimationFrame(frame);
  }, [copy]);
  const label = target?.label || copy.returnTo.replace('{name}', copy.returnNames['/']);
  return <a className="plaza-return-link" href={target?.href || localizedPath(locale)} aria-label={label}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg><span>{label}</span></a>;
}

export default function TeacherPlazaHeader({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).ui.plaza;
  return <header className="plaza-workbench-header">
    <a className="plaza-workbench-brand" href={localizedPath(locale)}><span className="plaza-workbench-seal"><BrandLogo size={36} className="h-full w-full" rounded={false} /></span><span><strong>{copy.brandTitle}</strong><small>TEACHER RESOURCE PLAZA</small></span></a>
    <nav className="plaza-workbench-actions" aria-label="广场导航"><PlazaReturnLink locale={locale} /><WorkbenchAccountMenu locale={locale} /></nav>
  </header>;
}
