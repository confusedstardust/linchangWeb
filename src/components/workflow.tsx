import { steps, WORKBENCH_URL } from "@/lib/content";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

export default function Workflow() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <InkBlob className="-left-24 top-1/3 h-96 w-96" color="rgba(177,140,69,0.12)" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-16 px-5 md:px-[8vw] lg:grid-cols-[0.85fr_1.15fr] lg:gap-[8vw]">
        <Reveal>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <SplitHeading
            lines={["四步，让课堂", "从文本走向现场。"]}
            className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[3.4rem]"
          />
          <p className="mt-6 max-w-[390px] text-[13px] leading-[1.9] text-ink-muted">
            不必学习复杂工具。保持你原本备课的方式，把叙事编排交给
            NarrativeOS。
          </p>
          <a
            href={WORKBENCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex min-h-[48px] items-center justify-center gap-10 rounded-md border border-ink px-6 text-[13px] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper-soft"
          >
            现在开始创作
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </Reveal>

        <Reveal delay={120} className="border-t border-line">
          {steps.map((step, index) => (
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
                {index === steps.length - 1 ? "↗" : "↓"}
              </b>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
