"use client";

import { WORKBENCH_URL } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import Reveal from "@/components/reveal";
import Magnetic from "@/components/magnetic";

export default function FinalCta() {
  const { messages } = useI18n();
  const copy = messages.ui.finalCta;
  return (
    <section className="relative flex min-h-[360px] items-center bg-cinnabar px-5 py-12 text-paper-soft md:px-[8vw] md:py-20">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start justify-between gap-12 md:flex-row md:items-center">
        <Reveal>
          <small className="text-[9px] tracking-[0.2em] text-gold-soft">
            READY TO BEGIN?
          </small>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.3] sm:text-5xl md:text-[4.1rem]">
            {copy.title[0]}
            <br />
            {copy.title[1]}
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <Magnetic strength={0.4}>
            <a
              href={WORKBENCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[58px] min-w-[168px] items-center justify-between gap-8 rounded-md border border-white/55 px-6 font-serif text-sm transition-all duration-500 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-cinnabar hover:shadow-[0_18px_44px_rgba(0,0,0,0.2)] md:min-h-[64px] md:min-w-[190px] md:px-7"
            >
              {copy.start}
              <span className="text-lg transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
