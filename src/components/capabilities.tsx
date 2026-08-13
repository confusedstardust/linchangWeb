"use client";

import { useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { features, WORKBENCH_URL } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

gsap.registerPlugin(useGSAP, CustomEase);

const FRONT = {
  z: 60,
  scale: 1.06,
  y: -12,
  rotationX: 0,
  rotationY: 0,
  opacity: 1,
  filter: "blur(0px)",
  boxShadow:
    "0 30px 60px rgba(56,44,31,0.22), 0 6px 14px rgba(56,44,31,0.10)",
};

const BACK = {
  z: -36,
  scale: 0.95,
  y: 10,
  rotationX: 4,
  rotationY: 8,
  opacity: 0.8,
  filter: "blur(1.2px)",
  boxShadow: "0 10px 22px rgba(56,44,31,0.10)",
};

type CardHandlers = {
  pause: (index: number) => void;
  resume: () => void;
};

export default function Capabilities() {
  const gridRef = useRef<HTMLDivElement>(null);
  const handlersRef = useRef<CardHandlers>({ pause: () => {}, resume: () => {} });
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        ".capability-card",
        gridRef.current,
      );

      if (reducedMotion) {
        gsap.set(cards, {
          opacity: 1,
          filter: "blur(0px)",
          z: 0,
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          boxShadow: "0 14px 34px rgba(56,44,31,0.12)",
        });
        return;
      }

      // 按键：带回弹的贝塞尔；回程：缓出的贝塞尔；呼吸：正弦
      const press = CustomEase.create(
        "capability-press",
        "0.34, 1.56, 0.64, 1",
      );
      const release = CustomEase.create(
        "capability-release",
        "0.22, 1, 0.36, 1",
      );

      gsap.set(cards, { ...BACK });

      const cycle = 5.6;
      const offset = cycle / cards.length;
      const timelines = cards.map((card, index) => {
        const timeline = gsap.timeline({
          repeat: -1,
          delay: index * offset,
        });

        // 后景呼吸（低幅度正弦起伏）
        timeline.to(
          card,
          {
            y: 6,
            scale: 0.945,
            duration: 0.55,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          0,
        );
        // 琴键按下浮现
        timeline.to(
          card,
          {
            ...FRONT,
            duration: 0.7,
            ease: press,
          },
          1.1,
        );
        // 前景停留呼吸
        timeline.to(
          card,
          {
            y: FRONT.y - 5,
            scale: FRONT.scale * 1.02,
            duration: 1.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          1.8,
        );
        // 缓缓沉回后景
        timeline.to(
          card,
          {
            ...BACK,
            duration: 0.9,
            ease: release,
          },
          4.2,
        );
        // 后景停一拍
        timeline.to(card, { duration: 0.5 }, 5.1);

        return timeline;
      });

      let resumeTimer: number | undefined;
      let raiseTween: gsap.core.Tween | null = null;
      let raisedIndex = -1;

      handlersRef.current = {
        pause: (hoveredIndex) => {
          timelines.forEach((timeline) => timeline.pause());
          window.clearTimeout(resumeTimer);
          raisedIndex = hoveredIndex;
          raiseTween = gsap.to(cards[hoveredIndex], {
            z: 96,
            scale: 1.09,
            y: -16,
            rotationX: 0,
            rotationY: 0,
            opacity: 1,
            filter: "blur(0px)",
            boxShadow: "0 36px 72px rgba(56,44,31,0.26)",
            duration: 0.5,
            ease: press,
            overwrite: true,
          });
        },
        resume: () => {
          window.clearTimeout(resumeTimer);
          if (raiseTween && raisedIndex >= 0) {
            const timeline = timelines[raisedIndex];
            const time = timeline.time() % cycle;
            const target = time >= 1.1 && time < 4.2 ? FRONT : BACK;
            raiseTween.kill();
            raiseTween = null;
            gsap.to(cards[raisedIndex], {
              ...target,
              duration: 0.5,
              ease: release,
              overwrite: true,
            });
          }
          resumeTimer = window.setTimeout(() => {
            timelines.forEach((timeline) => timeline.resume());
          }, 520);
        },
      };

      return () => {
        window.clearTimeout(resumeTimer);
        raiseTween?.kill();
        timelines.forEach((timeline) => timeline.kill());
      };
    },
    { scope: gridRef, dependencies: [reducedMotion] },
  );

  return (
    <section id="capabilities" className="relative overflow-hidden py-24 md:py-32">
      <InkBlob className="right-[-8rem] top-24 h-96 w-96" color="rgba(156,51,64,0.08)" />

      <div className="relative mx-auto max-w-[1320px] px-5 md:px-[6vw]">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <SectionLabel>PLATFORM FEATURE</SectionLabel>
            <SplitHeading
              lines={["从一份材料，", "到一场完整体验。"]}
              className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[3.4rem]"
            />
          </div>
          <p className="max-w-[390px] text-[13px] leading-[1.9] text-ink-muted md:mb-2">
            AI 负责搭建复杂叙事结构，教师始终掌握教学目标、内容边界与最终判断。
          </p>
        </Reveal>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 [perspective:1600px] sm:grid-cols-2 xl:grid-cols-4"
        >
          {features.map((feature, index) => (
            <Reveal key={feature.num} delay={index * 90}>
              <article
                className="capability-card group relative flex min-h-[350px] flex-col rounded-xl border border-line bg-paper-soft p-6 will-change-transform md:p-7"
                onPointerEnter={() => handlersRef.current.pause(index)}
                onPointerLeave={() => handlersRef.current.resume()}
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
                  aria-label={`了解「${feature.title}」`}
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
