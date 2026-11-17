"use client";

import { WorkspaceFooter, workspaceContactHref } from "@narrativeos/ui/workspace-chrome";
import { localizedPath, teacherEcosystemPath, type Locale } from "@/lib/i18n";
import { navLinks } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import { usePortalSupport } from "./portal-support";
import BrandLogo from "./brand-logo";

const contactLabels = { "zh-CN": "联系我们", "zh-Hant": "聯絡我們", en: "Contact us" } as const;

export default function PortalFooter({ locale }: { locale: Locale }) {
  const support = usePortalSupport(locale);
  const copy = {
    "zh-CN": { brand: "临场", nav: "页脚导航", cases: "优质案例" },
    "zh-Hant": { brand: "臨場", nav: "頁尾導覽", cases: "優質案例" },
    en: { brand: "Linchang", nav: "Footer navigation", cases: "Featured examples" },
  }[locale];
  const plaza = teacherEcosystemPath(locale);
  return <><WorkspaceFooter brand={copy.brand} logo={<BrandLogo size={34} />} homeHref={localizedPath(locale)}
    navLabel={copy.nav} cases={{ href: plaza, label: copy.cases }}
    community={support.openQuestions} contactLabel={contactLabels[locale]}
    announcements={{ onClick: support.openAnnouncements, label: support.announcementsLabel }} />{support.popup}</>;
}

export function HomeFooter() {
  const { locale, messages } = useI18n();
  const support = usePortalSupport(locale);
  const copy = messages.ui.footer;
  const brand = locale === "en" ? "Linchang" : locale === "zh-Hant" ? "臨場" : "临场";
  return (
    <footer className="border-t border-line bg-paper-soft px-5 pb-10 pt-14 text-ink md:px-[6vw] md:pt-16">
      <div className="mx-auto flex max-w-[1320px] flex-row items-start justify-between gap-5 md:gap-8">
        <div className="flex flex-col items-start gap-3">
          <a href="#top" className="flex items-center gap-3" aria-label={copy.backToTop}>
            <BrandLogo size={34} />
            <span className="flex flex-col gap-0.5">
              <strong className="font-serif text-base">{brand}</strong>
              <small className="text-[8px] tracking-[0.2em] text-ink-muted">
                NARRATIVEOS
              </small>
            </span>
          </a>
          <p className="ml-[46px] hidden text-[11px] text-ink-muted sm:block">
            {copy.slogan}
          </p>
        </div>

        <div className="flex min-w-0 flex-col items-end gap-3">
          <nav className="hidden flex-wrap gap-6 sm:flex" aria-label={copy.nav}>
            {navLinks.slice(0, 4).map((link, index) => (
              <a
                key={link.href}
                href={link.href === "#cases" ? teacherEcosystemPath(locale) : link.href}
                className="text-[11px] text-ink-soft transition-colors hover:text-cinnabar"
              >
                {messages.ui.header.nav[index]}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-[11px] text-ink-soft">
            <button type="button" className="hover:text-cinnabar" onClick={support.openQuestions}>Q&amp;A</button>
            <button type="button" className="hover:text-cinnabar" onClick={support.openAnnouncements}>{support.announcementsLabel}</button>
            <a href={workspaceContactHref} className="hover:text-cinnabar">{contactLabels[locale]}</a>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[9px]">
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 tracking-[0.08em] text-ink-muted transition-colors hover:border-cinnabar/50 hover:text-cinnabar"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cinnabar/75" aria-hidden />
              津ICP备2025028636号-2
            </a>
            <small className="text-[10px] text-ink-muted">© 2026 NarrativeOS</small>
          </div>
        </div>
      </div>
      {support.popup}
    </footer>
  );
}
