"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { navLinks, WORKBENCH_URL } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/brand-logo";
import WeChatCommunity from "@/components/wechat-community";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const { locale, messages, switchLocale } = useI18n();
  const languageOptions: Array<{ locale: Locale; label: string; title: string }> = [
    { locale: "zh-CN", label: "简", title: "简体中文" },
    { locale: "en", label: "EN", title: "English" },
    { locale: "zh-Hant", label: "繁", title: "繁體中文" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    setOpen(false);

    if (href === "#top") {
      if (lenis) lenis.scrollTo(0, { duration: 1.3 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    const currentScroll = lenis?.scroll ?? window.scrollY;
    const targetTop = target.getBoundingClientRect().top + currentScroll;
    const topOffset = href === "#about" ? 148 : 82;
    const destination = Math.max(0, targetTop - topOffset);

    if (lenis) lenis.scrollTo(destination, { duration: 1.3 });
    else window.scrollTo({ top: destination, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-[height,box-shadow,background-color] duration-300",
        scrolled
          ? "glass-paper h-16 shadow-[0_10px_36px_rgba(53,42,30,0.12)]"
          : "h-[72px] bg-paper/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-[4.5vw]">
        <a
          href="#top"
          onClick={(event) => goToSection(event, "#top")}
          className="group flex items-center gap-3"
          aria-label={messages.ui.header.backToTop}
        >
          <BrandLogo className="transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105" />
          <span className="flex flex-col gap-0.5">
            <strong className="font-serif text-[15px] font-semibold leading-none text-ink">
              {messages.ui.header.brand}
            </strong>
            <small className="text-[9px] tracking-[0.2em] text-ink-muted">
              NARRATIVEOS
            </small>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={messages.ui.header.mainNav}>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => goToSection(event, link.href)}
              className="group relative py-2 text-xs text-ink-soft transition-colors hover:text-cinnabar"
            >
              {messages.ui.header.nav[index]}
              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cinnabar transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
            </a>
          ))}
          <WeChatCommunity />
          <div className="flex items-center gap-0.5 rounded-full border border-line p-0.5" role="group" aria-label={messages.ui.header.language}>
            {languageOptions.map((option) => (
              <button
                key={option.locale}
                type="button"
                title={option.title}
                aria-label={option.title}
                aria-pressed={locale === option.locale}
                onClick={() => switchLocale(option.locale)}
                className={cn(
                  "rounded-full px-2 py-1 text-[9px] tracking-wide transition-colors",
                  locale === option.locale ? "bg-ink text-paper-soft" : "text-ink-muted hover:text-ink",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <a
            href={WORKBENCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-4 py-2.5 text-xs text-ink transition-all hover:-translate-y-0.5 hover:border-cinnabar/50 hover:text-cinnabar"
          >
            {messages.ui.header.enterWorkbench}
            <span aria-hidden className="text-cinnabar">→</span>
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <WeChatCommunity compact />
          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[7px]"
            aria-label={open ? messages.ui.header.closeNav : messages.ui.header.openNav}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={cn(
                "h-px w-6 bg-ink transition-all duration-300",
                open && "translate-y-1 rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-ink transition-all duration-300",
                open && "-translate-y-1 -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      <div
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100svh-72px)] origin-top overflow-y-auto border-b border-line bg-paper px-5 pb-7 pt-2 shadow-[0_24px_50px_rgba(53,42,30,0.14)] transition-all duration-300 lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0",
        )}
      >
        <nav className="flex flex-col" aria-label={messages.ui.header.mobileNav}>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => goToSection(event, link.href)}
              className="flex items-center justify-between border-b border-line/70 py-3.5 font-serif text-[15px] text-ink"
            >
              {messages.ui.header.nav[index]}
              <span className="text-[10px] text-gold" aria-hidden>
                {String(navLinks.indexOf(link) + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
          <a
            href={WORKBENCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-between rounded-md bg-cinnabar px-5 py-3.5 text-sm text-paper-soft shadow-[0_12px_28px_rgba(112,34,46,0.25)]"
          >
            {messages.ui.header.enterWorkbench}
            <span aria-hidden>→</span>
          </a>
          <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-4" role="group" aria-label={messages.ui.header.language}>
            <span className="text-[10px] tracking-[0.16em] text-ink-muted">{messages.ui.header.language}</span>
            <div className="flex items-center gap-1">
              {languageOptions.map((option) => (
                <button
                  key={option.locale}
                  type="button"
                  title={option.title}
                  aria-label={option.title}
                  aria-pressed={locale === option.locale}
                  onClick={() => switchLocale(option.locale)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[10px] transition-colors",
                    locale === option.locale ? "border-ink bg-ink text-paper-soft" : "border-line text-ink-muted hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
