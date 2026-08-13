import { teamRoles } from "@/lib/content";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { SectionLabel, SealMark } from "@/components/decorations";

export default function Team() {
  return (
    <section id="team" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-16 px-5 md:px-[6vw] lg:grid-cols-[0.82fr_1.18fr] lg:gap-[6vw]">
        <Reveal>
          <SectionLabel>TEAM INTRODUCTION</SectionLabel>
          <SplitHeading
            lines={["让教育、叙事与技术，", "在同一张桌上工作。"]}
            className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[3.4rem]"
          />
          <p className="mt-6 max-w-[490px] text-[13px] leading-[2] text-ink-muted">
            NarrativeOS
            是一支由教育研究者、叙事设计师与 AI
            工程师组成的跨学科团队。我们希望借助生成式 AI，把抽象知识转化为学生可以进入、选择和反思的课堂体验。
          </p>
          <div className="mt-9 flex items-center gap-4 border-t border-line pt-6">
            <SealMark char="叙" />
            <div>
              <strong className="block font-serif text-base text-ink">
                NarrativeOS 创作团队
              </strong>
              <small className="mt-1 block text-[9px] tracking-[0.12em] text-ink-muted">
                团队标语：EDUCATION × NARRATIVE × AI
              </small>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
          {teamRoles.map((role, index) => (
            <Reveal
              key={role.num}
              delay={index * 80}
              className="group relative min-h-[240px] border-b border-r border-line bg-paper-soft p-6 transition-colors duration-300 hover:bg-paper"
            >
              <span className="font-serif text-[10px] tracking-wider text-cinnabar">
                {role.num}
              </span>
              <i
                className="absolute right-6 top-6 h-7 w-7 rounded-full border border-gold/45 transition-transform duration-500 group-hover:rotate-90"
                aria-hidden
              >
                <i className="absolute inset-2 rounded-full bg-gold/80" />
              </i>
              <h3 className="mt-8 font-serif text-xl font-semibold text-ink">
                {role.role}
              </h3>
              <span className="mt-1.5 block text-[10px] font-medium tracking-wide text-gold">
                {role.member}
              </span>
              <p className="mt-3 text-xs leading-[1.85] text-ink-muted">
                {role.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
