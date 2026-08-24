"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WORKBENCH_URL, type Story } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { SectionLabel, SealMark } from "@/components/decorations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function HorizontalStory({ story }: { story: Story }) {
  const { messages } = useI18n();
  return (
    <article className="group relative h-[68vh] w-[42vw] shrink-0 overflow-hidden border border-line bg-paper xl:w-[34vw]">
      <div className={`absolute inset-0 ${story.visualClass}`}>
        <div className="paper-grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
        <span className="absolute left-7 top-7 z-10 text-[9px] tracking-[0.16em] text-paper-soft/90">
          {story.category}
        </span>
        <strong
          className="absolute -right-2 top-1/2 z-[1] -translate-y-1/2 font-brush text-[19rem] font-normal leading-none text-paper-soft/15 transition-transform duration-700 ease-out group-hover:-translate-x-5 group-hover:-rotate-3 xl:text-[22rem]"
          aria-hidden
        >
          {story.char}
        </strong>
        <i
          className="absolute bottom-36 right-16 z-[1] h-28 w-28 rounded-full border border-white/35 transition-transform duration-700 group-hover:rotate-[32deg] group-hover:scale-125"
          aria-hidden
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/95 via-night/55 to-transparent p-8 pb-9">
        <small className="text-[9px] tracking-[0.16em] text-gold-soft">
          {story.meta}
        </small>
        <h3 className="mt-2 font-serif text-3xl font-medium text-paper-soft">
          {story.title}
        </h3>
        <p className="mt-2 max-w-[88%] text-xs leading-[1.8] text-paper-soft/75">
          {story.description}
        </p>
        <a
          href={WORKBENCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-[11px] text-paper-soft transition-colors hover:text-gold-soft"
        >
          {messages.ui.stories.templates}
          <span className="text-gold-soft transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </div>
    </article>
  );
}

function VerticalStory({ story, index }: { story: Story; index: number }) {
  const { messages } = useI18n();
  return (
    <Reveal key={story.title} delay={index * 100}>
      <article className="group h-full border border-line bg-paper transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_52px_rgba(55,43,31,0.13)]">
        <div
          className={`relative h-[210px] overflow-hidden p-5 text-paper-soft ${story.visualClass}`}
        >
          <span className="relative z-10 text-[9px] tracking-[0.14em]">
            {story.category}
          </span>
          <strong
            className="absolute -bottom-12 right-2 font-brush text-[210px] font-normal leading-none opacity-[0.13] transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:-rotate-3 group-hover:opacity-25"
            aria-hidden
          >
            {story.char}
          </strong>
          <i
            className="absolute bottom-7 right-7 h-20 w-20 rounded-full border border-white/40 transition-transform duration-700 group-hover:rotate-[32deg] group-hover:scale-125"
            aria-hidden
          />
        </div>
        <div className="relative flex min-h-[225px] flex-col p-6">
          <small className="text-[9px] tracking-wider text-gold">{story.meta}</small>
          <h3 className="mt-2.5 font-serif text-2xl font-medium text-ink">
            {story.title}
          </h3>
          <p className="mt-2 text-xs leading-[1.85] text-ink-muted">
            {story.description}
          </p>
          <a
            href={WORKBENCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-6 bottom-6 flex items-center justify-between border-t border-line pt-4 text-[11px] text-ink transition-colors hover:text-cinnabar"
          >
            {messages.ui.stories.templates}
            <span className="text-cinnabar transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Stories() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { locale, messages } = useI18n();
  const copy = messages.ui.stories;
  const localizedStories = messages.content.stories;
  const desktopTitle = locale === "en" ? ["Fresh", "classroom", "inspiration"] : copy.title;

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="relative border-t border-line bg-paper-soft lg:h-screen lg:overflow-hidden"
    >
      {/* 移动端 / 平板：纵向布局 */}
      <div className="py-10 md:py-32 lg:hidden">
        <div className="mx-auto max-w-[1320px] px-5 md:px-[6vw]">
          <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>{copy.label}</SectionLabel>
              <SplitHeading
                lines={[copy.title.join("")]}
                className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[2.8rem]"
              />
            </div>
            <a
              href={WORKBENCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-6 text-xs text-ink transition-colors hover:text-cinnabar md:mb-2"
            >
              {copy.templates}
              <span className="text-cinnabar">→</span>
            </a>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {localizedStories.map((story, index) => (
              <VerticalStory key={story.title} story={story} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* 桌面端：横向滚动画廊 */}
      <div className="hidden lg:block">
        <div className="flex h-screen items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max items-center gap-[6vw] pl-[7vw] pr-[8vw] will-change-transform"
          >
            <div
              className={cn(
                "shrink-0",
                locale === "en" ? "w-[34vw] xl:w-[34vw]" : "w-[32vw] xl:w-[28vw]",
              )}
            >
              <SectionLabel>{copy.label}</SectionLabel>
              <SplitHeading
                lines={desktopTitle}
                className={cn(
                  "mt-7 font-serif text-[2.8rem] font-medium leading-[1.12] text-ink",
                )}
              />
              <p className="mt-8 max-w-[24rem] text-[13px] leading-[1.9] text-ink-muted">
                {copy.description}
              </p>
              <a
                href={WORKBENCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex items-center gap-6 text-xs text-ink transition-colors hover:text-cinnabar"
              >
                {copy.templates}
                <span className="text-cinnabar">→</span>
              </a>
              <div className="mt-12 flex items-center gap-4">
                <SealMark char="录" />
                <span className="font-brush text-sm text-ink-muted">
                  {copy.lesson}
                </span>
              </div>
            </div>

            {localizedStories.map((story) => (
              <HorizontalStory key={story.title} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
