import { WORKBENCH_URL } from "@/lib/content";
import Reveal from "@/components/reveal";
import Magnetic from "@/components/magnetic";

export default function FinalCta() {
  return (
    <section className="relative flex min-h-[360px] items-center bg-cinnabar px-5 py-20 text-paper-soft md:px-[8vw]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start justify-between gap-12 md:flex-row md:items-center">
        <Reveal>
          <small className="text-[9px] tracking-[0.2em] text-gold-soft">
            READY TO BEGIN?
          </small>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.3] sm:text-5xl md:text-[4.1rem]">
            下一堂课，
            <br />
            从一个故事开始。
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <Magnetic strength={0.4}>
            <a
              href={WORKBENCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full border border-white/50 font-serif text-sm transition-all duration-500 hover:rotate-6 hover:border-white hover:bg-white/10 hover:shadow-[0_18px_44px_rgba(0,0,0,0.2)]"
            >
              免费创建
              <span className="mt-2 text-lg transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
