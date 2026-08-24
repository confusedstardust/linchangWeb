"use client";

import { WORKBENCH_URL } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

export default function Workflow() {
  const { messages } = useI18n();
  const copy = messages.ui.workflow;
  const localizedSteps = messages.content.steps;
  return (
    <section className="relative overflow-hidden py-10 md:py-32">
      <InkBlob className="-left-24 top-1/3 h-96 w-96" color="rgba(177,140,69,0.12)" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-16 px-5 md:px-[8vw] lg:grid-cols-[0.85fr_1.15fr] lg:gap-[8vw]">
        <Reveal>
          <SectionLabel>{copy.label}</SectionLabel>
          <SplitHeading
            lines={copy.title}
            className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[2.8rem] lg:text-[2.8rem]"
          />
          <p className="mt-6 max-w-[390px] text-[13px] leading-[1.9] text-ink-muted">
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

        <Reveal delay={120} className="border-t border-line">
          {localizedSteps.map((step, index) => (
            <div
              key={step.num}
              className="group grid min-h-[112px] grid-cols-[42px_1fr_24px] items-center gap-5 border-b border-line px-2 transition-colors duration-300 hover:bg-paper-soft"
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
