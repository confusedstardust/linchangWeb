"use client";

import { WORKBENCH_URL } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

export default function Workflow() {
  const { locale, messages } = useI18n();
  const copy = messages.ui.workflow;
  const localizedSteps = messages.content.steps;
  return (
    <section className="relative overflow-hidden border-t border-line py-10 md:py-32">
      <InkBlob className="-left-24 top-1/3 h-96 w-96" color="rgba(177,140,69,0.12)" />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-14 px-5 md:px-[6vw] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-[7vw]">
        <Reveal className="min-w-0">
          <SectionLabel>{copy.label}</SectionLabel>
          <SplitHeading
            lines={copy.title}
            className={cn(
              "mt-5 font-serif font-medium leading-[1.35] text-ink",
              locale === "en"
                ? "whitespace-nowrap text-[1.7rem] sm:text-[1.9rem] md:text-[2.15rem] lg:text-[2.25rem]"
                : "text-[2.15rem] sm:text-4xl md:text-[2.8rem] lg:text-[2.8rem]",
            )}
          />
          <p className="mt-6 max-w-[420px] text-[13px] leading-[1.9] text-ink-muted">
            {copy.description}
          </p>
          <a
            href={WORKBENCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex min-h-[48px] items-center justify-center gap-10 rounded-md border border-ink px-6 text-[13px] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper-soft"
          >
            {copy.start}
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </Reveal>

        <Reveal delay={120} className="min-w-0 border-t border-line">
          {localizedSteps.map((step, index) => (
            <div
              key={step.num}
              className="group grid min-h-[112px] grid-cols-[42px_1fr_24px] items-center gap-5 border-b border-line transition-colors duration-300 hover:bg-paper-soft"
            >
              <span className="font-serif text-[10px] tracking-wider text-cinnabar">
                {step.num}
              </span>
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-1 text-[11px] text-ink-muted">{step.description}</p>
              </div>
              <b
                className="text-right text-gold transition-transform duration-300 group-hover:translate-y-1"
                aria-hidden
              >
                {index === localizedSteps.length - 1 ? "↗" : "↓"}
              </b>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
