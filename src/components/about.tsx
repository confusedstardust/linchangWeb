"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import { SectionLabel } from "@/components/decorations";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!Number.isFinite(target) || reducedMotion) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const duration = 1300;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, reducedMotion]);

  return (
    <span ref={ref}>
      {Number.isFinite(target) ? (reducedMotion ? target : value) : "∞"}
      {suffix}
    </span>
  );
}

export default function About() {
  const { locale, messages } = useI18n();
  const copy = messages.ui.about;
  const localizedStats = messages.content.stats;
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-night py-10 text-paper-soft md:py-24"
    >
      <div
        className="paper-grain absolute inset-0 opacity-[0.06] mix-blend-overlay"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-8 -top-16 select-none font-serif text-[26rem] italic leading-none text-gold-soft/[0.06] md:text-[34rem]"
        aria-hidden
      >
        N
      </span>

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-5 md:px-[8vw] lg:grid-cols-[0.42fr_1.55fr_0.62fr] lg:gap-[5vw]">
        <Reveal className="hidden lg:block">
          <span className="font-serif text-[19rem] italic leading-none text-gold-soft/10">
            N
          </span>
        </Reveal>

        <Reveal className="min-w-0" delay={80}>
          <SectionLabel className="text-gold-soft" dark>
            {copy.label}
          </SectionLabel>
          <blockquote
            className={cn(
              "mt-6 max-w-[680px] font-serif text-[1.9rem] font-medium leading-[1.5]",
              locale === "en"
                ? "sm:text-[2.35rem] md:text-[2.7rem] lg:text-[2.25rem] xl:text-[2.35rem]"
                : "sm:text-4xl md:text-[3.25rem] lg:text-[2.7rem] xl:text-[3.25rem]",
            )}
          >
            <span className={cn("block", locale !== "en" && "lg:whitespace-nowrap")}>
              {copy.quoteFirst}
            </span>
            <span className={cn("block", locale !== "en" && "lg:whitespace-nowrap")}>
              <em className="font-brush font-normal text-gold-soft not-italic">
                {copy.quoteEmphasis}
              </em>
              {copy.quoteLast}
            </span>
          </blockquote>
          <p className="mt-5 text-xs leading-relaxed text-[#9e968d]">
            {copy.description}
          </p>
        </Reveal>

        <Reveal
          delay={160}
          className="border-l border-white/15 lg:translate-x-[4vw] lg:justify-self-end"
        >
          {localizedStats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 px-5 py-5 lg:px-6"
              style={{
                borderBottom:
                  index === localizedStats.length - 1 ? "none" : "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <strong className="font-serif text-3xl font-medium text-gold-soft">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </strong>
              <span className="text-[10px] tracking-wider text-[#9e968d]">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
