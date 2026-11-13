"use client";

import { navLinks, WORKBENCH_URL } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import BrandLogo from "@/components/brand-logo";

export function PlazaSiteFooter({ locale }: { locale: Locale }) {
  const copy = {
    "zh-CN": { brand: "临场", nav: "页脚导航", cases: "优质案例", announcements: "公告" },
    "zh-Hant": { brand: "臨場", nav: "頁尾導覽", cases: "優質案例", announcements: "公告" },
    en: { brand: "Linchang", nav: "Footer navigation", cases: "Featured examples", announcements: "Announcements" },
  }[locale];
  const home = localizedPath(locale);
  const workbench = WORKBENCH_URL.replace(/\/$/, "");
  return (
    <footer className="border-t border-line bg-paper-soft px-5 py-[5px] text-ink-muted sm:px-[6vw]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-1.5">
        <a href={home} className="flex w-fit shrink-0 items-center gap-3 text-ink-soft">
          <BrandLogo size={34} className="opacity-70" />
          <span className="flex flex-col gap-1">
            <strong className="font-serif text-base font-normal">{copy.brand}</strong>
            <small className="text-[8px] tracking-[0.2em]">NARRATIVEOS</small>
          </span>
        </a>
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1.5 sm:justify-end">
          <nav aria-label={copy.nav} className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:gap-x-6 [&_a:hover]:text-cinnabar">
            <a href={`${home}#cases`}>{copy.cases}</a>
            <a href={`${workbench}/#community`}>Q&amp;A</a>
            <a href={`${workbench}/?announcement=1`}>{copy.announcements}</a>
          </nav>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[9px] hover:text-cinnabar">
              <span aria-hidden className="size-[5px] rounded-full bg-cinnabar/65" />
              津ICP备2025028636号-2
            </a>
            <small className="text-[10px]">© 2026 NarrativeOS</small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function SiteFooter() {
  const { locale, messages } = useI18n();
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
                href={link.href}
                className="text-[11px] text-ink-soft transition-colors hover:text-cinnabar"
              >
                {messages.ui.header.nav[index]}
              </a>
            ))}
          </nav>
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
    </footer>
  );
}
