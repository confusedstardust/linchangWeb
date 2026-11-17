"use client";

import { useRef, type ReactNode } from "react";
import { BookOpen, FolderOpen, Users } from "lucide-react";
import { useBrowserOrigin, useWorkspaceSidebar, WorkspaceSidebar } from "@narrativeos/ui/workspace-sidebar";
import { WorkspaceFrame, WorkspaceHeader } from "@narrativeos/ui/workspace-chrome";
import { workbenchHref } from "@narrativeos/ui/app-links";
import { accountMessages } from "@narrativeos/ui/i18n";
import { WorkbenchAccountMenu } from "@/components/workbench-account-menu";
import { localizedPath, teacherEcosystemPath, type Locale } from "@/lib/i18n";
import BrandLogo from "./brand-logo";
import PlazaInviteDialog from "./plaza-invite-dialog";
import PortalFooter from "./site-footer";

export default function PortalWorkspace({ locale, title, subtitle, plaza = false, favoritesOnly = false, actions, children }: {
  locale: Locale; title: string; subtitle?: string; plaza?: boolean; favoritesOnly?: boolean;
  actions?: ReactNode; children: ReactNode;
}) {
  const origin = useBrowserOrigin();
  const { desktop, expanded: showSidebar, setOpen: setSidebarOpen } = useWorkspaceSidebar();
  const inviteDialog = useRef<HTMLDialogElement>(null);
  const copy = {
    "zh-CN": ["欢迎来到 NarrativeOS", "登录，开启你的创作旅程", "创造新的知识互动体验", "创作小指南", "邀请我的同行", "好灵感，一起分享", "邀请同行加入，让更多课堂生动起来", "广场菜单"],
    "zh-Hant": ["歡迎來到 NarrativeOS", "登入，開啟你的創作旅程", "創造新的知識互動體驗", "創作小指南", "邀請我的同行", "好靈感，一起分享", "邀請同行加入，讓更多課堂生動起來", "廣場選單"],
    en: ["Welcome to NarrativeOS", "Sign in to start creating", "Create new ways to learn", "Creator guide", "Invite colleagues", "Share a good idea", "Invite colleagues to bring more lessons to life", "Plaza menu"],
  }[locale];
  const [welcome, login, tagline, guide, invite, inviteTitle, inviteText, menu] = copy;
  const base = teacherEcosystemPath(locale);
  const workbench = workbenchHref("/", origin, process.env.NEXT_PUBLIC_WORKBENCH_URL);
  const navLabel = locale === "en" ? "Workspace navigation" : locale === "zh-Hant" ? "工作台導覽" : "工作台导航";
  const collapseLabel = locale === "en" ? "Collapse sidebar" : locale === "zh-Hant" ? "收起側欄" : "收起侧栏";
  const expandLabel = locale === "en" ? "Expand sidebar" : locale === "zh-Hant" ? "展開側欄" : "展开侧栏";
  const backLabel = locale === "en" ? "Back" : locale === "zh-Hant" ? "返回上一頁" : "返回上一页";
  return <>
    <WorkspaceFrame sidebar={<WorkspaceSidebar
      expanded={showSidebar}
      onToggle={() => setSidebarOpen(!showSidebar)} toggleLabel={showSidebar ? collapseLabel : expandLabel} ariaLabel={plaza ? menu : navLabel}
      brandHref={localizedPath(locale)} tagline={tagline}
      logo={size => <BrandLogo size={size} rounded={size === 64} />}
      locale={locale}
      links={{
        discover: { href: plaza && !favoritesOnly ? "#resources" : base, current: plaza, onClick: () => { if (!desktop) setSidebarOpen(false); } },
        create: { href: workbenchHref("/practice", origin, process.env.NEXT_PUBLIC_WORKBENCH_URL) },
        works: { href: workbenchHref("/history", origin, process.env.NEXT_PUBLIC_WORKBENCH_URL) },
        assets: { href: workbenchHref("/assets", origin, process.env.NEXT_PUBLIC_WORKBENCH_URL) },
      }}
      secondaryLinks={[
        { label: accountMessages[locale].myAssets, icon: <FolderOpen aria-hidden="true" />, href: workbenchHref("/my-assets", origin, process.env.NEXT_PUBLIC_WORKBENCH_URL) },
        ...(!plaza ? [] : [{ label: guide, icon: <BookOpen aria-hidden="true" />, disabled: true },
        { label: invite, icon: <Users aria-hidden="true" />, onClick: () => inviteDialog.current?.showModal() }]),
      ]}
      promo={plaza ? { title: inviteTitle, description: inviteText, onClick: () => inviteDialog.current?.showModal() } : undefined}
      footer={<WorkbenchAccountMenu locale={locale} dock={{ loginLabel: login, loginContent: <>
        <span className="account-trigger-avatar" aria-hidden="true"><BrandLogo size={28} rounded /></span>
        <span className="min-w-0"><strong className="block text-xs">{welcome}</strong><small className="block text-[10px]">{login}</small></span>
        <span aria-hidden="true">↗</span>
      </> }} />}
    />}
      header={<WorkspaceHeader title={title} subtitle={subtitle} logo={<BrandLogo size={34} rounded={false} />}
        back={plaza ? undefined : { fallback: base, siblingApp: workbench, label: backLabel, ready: Boolean(origin) }} actions={actions} />}
      footer={<PortalFooter locale={locale} />}
    >{children}</WorkspaceFrame>
    {plaza && <PlazaInviteDialog locale={locale} dialog={inviteDialog} />}
  </>;
}
