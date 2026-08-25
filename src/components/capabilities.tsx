"use client";

import { useEffect, useRef } from "react";
import { WORKBENCH_URL } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

export default function Capabilities() {
  const gridRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<number | null>(null);
  const { messages } = useI18n();
  const copy = messages.ui.capabilities;
  const localizedFeatures = messages.content.features;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".capability-card"));
    if (!cards.length) return;

    const CYCLE = 2400;
    let elapsed = 0;
    let last = performance.now();
    let frame = 0;

    const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.min(1, Math.max(0, t)) * Math.PI);

    const liftOf = (phase: number) => {
      if (phase < 0.28) return ease(phase / 0.28);
      if (phase < 0.62) return 1;
      return 1 - ease((phase - 0.62) / 0.38);
    };

    const paint = (index: number, lift: number) => {
      const card = cards[index];
      const y = -16 * lift;
      const scale = 1 + 0.045 * lift;
      card.style.transform = `translateY(${y}px) scale(${scale})`;
      card.style.zIndex = String(1 + Math.round(lift * 8));
      card.style.boxShadow = `0 ${14 + lift * 22}px ${34 + lift * 28}px rgba(56,44,31,${0.1 + lift * 0.12})`;
    };

    const tick = (now: number) => {
      elapsed += Math.min(64, now - last);
      last = now;

      const hover = hoverRef.current;
      if (hover === null) {
        const active = Math.floor(elapsed / CYCLE) % cards.length;
        const phase = (elapsed % CYCLE) / CYCLE;
        cards.forEach((_, index) => {
          paint(index, index === active ? liftOf(phase) : 0);
        });
      } else {
        cards.forEach((_, index) => {
          paint(index, index === hover ? 1 : 0);
        });
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [localizedFeatures]);

  return (
    <section id="capabilities" className="relative overflow-hidden py-10 md:py-32">
      <InkBlob className="right-[-8rem] top-24 h-96 w-96" color="rgba(156,51,64,0.08)" />

      <div className="relative mx-auto max-w-[1320px] px-5 md:px-[6vw]">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <SectionLabel>{copy.label}</SectionLabel>
            <SplitHeading
              lines={copy.title}
              className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[2.8rem] lg:text-[2.8rem]"
            />
          </div>
          <p className="max-w-[390px] text-[13px] leading-[1.9] text-ink-muted md:mb-2">
            {copy.description}
          </p>
        </Reveal>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {localizedFeatures.map((feature, index) => (
            <Reveal key={feature.num} delay={index * 90}>
              <article
                className="capability-card group relative flex min-h-[350px] flex-col rounded-xl border border-line bg-paper-soft p-6 will-change-transform md:p-7"
                onPointerEnter={() => {
                  hoverRef.current = index;
                }}
                onPointerLeave={() => {
                  hoverRef.current = null;
                }}
              >
                <span className="font-serif text-[10px] tracking-wider text-cinnabar">
                  {feature.num}
                </span>
                <div
                  className="my-5 flex h-28 items-center justify-center"
                  aria-hidden
                >
                  <span className="flex items-center">
                    <i className="h-3.5 w-3.5 rounded-full bg-gold/70 transition-transform duration-500 group-hover:-translate-x-1" />
                    <i className="mx-1.5 h-9 w-9 rounded-full bg-cinnabar shadow-[0_0_0_12px_rgba(156,51,64,0.08)] transition-transform duration-500 group-hover:scale-110" />
                    <i className="h-3.5 w-3.5 rounded-full bg-gold/70 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-xs leading-[1.85] text-ink-muted">
                  {feature.description}
                </p>
                <a
                  href={WORKBENCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-line text-cinnabar transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cinnabar group-hover:bg-cinnabar group-hover:text-paper-soft"
                  aria-label={`${copy.learn} 「${feature.title}」`}
                >
                  →
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
