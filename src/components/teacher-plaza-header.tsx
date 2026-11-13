"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WorkbenchAccountMenu } from "@/components/workbench-account-menu";
import { getMessages, localizedPath, teacherEcosystemPath, type Locale } from "@/lib/i18n";
import { plazaFavoritesCopy } from "@/lib/teacher-plaza-copy";
import { WORKBENCH_URL } from "@/lib/content";
import BrandLogo from "@/components/brand-logo";
import type { ReactNode } from "react";
import { BookOpen, Grid2X2, Menu, PanelLeft, PenLine, Star, Users } from "lucide-react";
import { workbenchHref } from "@/lib/workbench-account";
import PlazaInviteDialog from "./plaza-invite-dialog";

const sidebarBreakpoint = "(min-width: 801px)";
function subscribeToSidebarBreakpoint(onChange: () => void) {
  const query = window.matchMedia(sidebarBreakpoint);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

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

export function WorkbenchPageHeader({ locale = "zh-CN", title, subtitle, returnLink, showAccount = true }: {
  locale?: Locale; title: string; subtitle: string; returnLink: ReactNode; showAccount?: boolean;
}) {
  return <header className="plaza-workbench-header">
    <a className="plaza-workbench-brand" href={localizedPath(locale)}><span className="plaza-workbench-seal"><BrandLogo size={36} className="h-full w-full" rounded={false} /></span><span><strong>{title}</strong><small>{subtitle}</small></span></a>
    <nav className="plaza-workbench-actions" aria-label="页面导航">{returnLink}{showAccount && <WorkbenchAccountMenu locale={locale} />}</nav>
  </header>;
}

export default function TeacherPlazaHeader({ locale, favoritesOnly }: { locale: Locale; favoritesOnly: boolean }) {
  const desktop = useSyncExternalStore(subscribeToSidebarBreakpoint, () => window.matchMedia(sidebarBreakpoint).matches, () => true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>();
  const showSidebar = sidebarOpen ?? desktop;
  const inviteDialog = useRef<HTMLDialogElement>(null);
  const copy = {
    "zh-CN": ["欢迎来到 NarrativeOS", "登录，开启你的创作旅程", "让课堂灵感，生动发生", "发现灵感", "我的创作", "创作小指南", "邀请我的同行", "好灵感，一起分享", "邀请同行加入，让更多课堂生动起来", "广场菜单"],
    "zh-Hant": ["歡迎來到 NarrativeOS", "登入，開啟你的創作旅程", "讓課堂靈感，生動發生", "發現靈感", "我的創作", "創作小指南", "邀請我的同行", "好靈感，一起分享", "邀請同行加入，讓更多課堂生動起來", "廣場選單"],
    en: ["Welcome to NarrativeOS", "Sign in to start creating", "Bring classroom ideas to life", "Discover", "My creations", "Creator guide", "Invite colleagues", "Share a good idea", "Invite colleagues to bring more lessons to life", "Plaza menu"],
  }[locale];
  const [welcome, login, tagline, discover, creations, guide, invite, inviteTitle, inviteText, menu] = copy;
  const favorites = plazaFavoritesCopy[locale].title;
  const base = teacherEcosystemPath(locale);
  return <>
    <WorkbenchPageHeader locale={locale} title={getMessages(locale).ui.plaza.brandTitle} subtitle="TEACHER RESOURCE PLAZA" returnLink={<PlazaReturnLink locale={locale} />} showAccount={false} />
    <aside id="plaza-navigation" className="plaza-navigation" data-open={showSidebar} aria-label={menu}>
      <div className="plaza-navigation-heading">
        <a className="plaza-navigation-brand" href={localizedPath(locale)} aria-label="NarrativeOS"><BrandLogo size={34} rounded={false} /><span>NarrativeOS<small>{tagline}</small></span></a>
        <button type="button" className="plaza-sidebar-toggle" aria-label={menu} title={menu} aria-expanded={showSidebar} aria-controls="plaza-navigation" onClick={() => setSidebarOpen(!showSidebar)}>
          {showSidebar ? <PanelLeft aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav className="plaza-navigation-links" aria-label={menu}>
        <a href={favoritesOnly ? `${base}#resources` : "#resources"} aria-current={favoritesOnly ? undefined : "page"} aria-label={discover} title={discover} onClick={() => { if (!desktop) setSidebarOpen(false); }}><Grid2X2 aria-hidden="true" /><span>{discover}</span></a>
        <a href={workbenchHref("/history")} aria-label={creations} title={creations}><PenLine aria-hidden="true" /><span>{creations}</span></a>
        <a href={`${base}?view=favorites`} aria-current={favoritesOnly ? "page" : undefined} aria-label={favorites} title={favorites}><Star aria-hidden="true" /><span>{favorites}</span></a>
      </nav>
      <div className="plaza-navigation-links plaza-navigation-secondary">
        <button type="button" disabled aria-label={guide} title={guide}><BookOpen aria-hidden="true" /><span>{guide}</span></button>
        <button type="button" aria-label={invite} title={invite} onClick={() => inviteDialog.current?.showModal()}><Users aria-hidden="true" /><span>{invite}</span></button>
      </div>
      <div className="plaza-navigation-bottom">
        <button type="button" className="plaza-navigation-invite" onClick={() => inviteDialog.current?.showModal()}><strong>{inviteTitle}</strong><span>{inviteText}</span><BrandLogo size={64} /></button>
        <div className="plaza-account-dock">
          <WorkbenchAccountMenu locale={locale} dock={{ loginLabel: login, loginContent: <>
            <span className="account-trigger-avatar" aria-hidden="true"><BrandLogo size={28} rounded /></span>
            <span className="plaza-account-welcome"><strong>{welcome}</strong><small>{login}</small></span>
            <span aria-hidden="true">↗</span>
          </> }} />
        </div>
      </div>
    </aside>
    <PlazaInviteDialog locale={locale} dialog={inviteDialog} />
  </>;
}
