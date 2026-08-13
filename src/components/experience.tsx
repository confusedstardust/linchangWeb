"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { narrativeModes, WORKBENCH_URL } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

gsap.registerPlugin(useGSAP);

function Typewriter({ text, speed = 16 }: { text: string; speed?: number }) {
  const [count, setCount] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const timer = setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, reducedMotion]);

  const display = reducedMotion ? text : text.slice(0, count);

  return (
    <>
      {display}
      {!reducedMotion && count < text.length && (
        <span className="ml-0.5 animate-blink text-cinnabar" aria-hidden>
          ▍
        </span>
      )}
    </>
  );
}

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mode = narrativeModes[activeIndex];

  useGSAP(
    () => {
      if (reducedMotion) return;
      const panels = gsap.utils.toArray<HTMLElement>(
        ".experience-panel",
        stageRef.current,
      );

      const applyHidden = () => {
        panels.forEach((panel, index) => {
        gsap.set(panel, {
          opacity: 0,
          y: 70,
          scale: 0.92,
          rotationX: index === 1 ? -84 : 0,
          rotationY: index === 0 ? -82 : index === 2 ? 82 : 0,
          transformOrigin:
            index === 0
              ? "left center"
              : index === 2
                ? "right center"
                : "top center",
          filter: "blur(12px)",
        });
        });
      };

      applyHidden();

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(
          panels,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "back.out(1.25)",
            stagger: 0.2,
          },
          0,
        )
        .to(
          panels,
          {
            rotationZ: 5.5,
            transformOrigin: "top center",
            duration: 0.38,
            ease: "power1.inOut",
            stagger: 0.14,
          },
          1.5,
        )
        .to(
          panels,
          {
            rotationZ: -3.5,
            duration: 0.38,
            ease: "power1.inOut",
            stagger: 0.14,
          },
          1.9,
        )
        .to(
          panels,
          {
            rotationZ: 2,
            duration: 0.32,
            ease: "power1.inOut",
            stagger: 0.14,
          },
          2.3,
        )
        .to(
          panels,
          {
            rotationZ: 0,
            duration: 0.3,
            ease: "power1.out",
            stagger: 0.12,
          },
          2.65,
        );

      let inView = false;
      let rafId = 0;

      const tick = () => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (rect) {
          const isVisible =
            rect.bottom > 0 && rect.top < window.innerHeight * 0.7;

          if (isVisible && !inView) {
            inView = true;
            applyHidden();
            timeline.restart();
          } else if (!isVisible && inView) {
            const fullyOffScreen =
              rect.bottom <= 0 || rect.top >= window.innerHeight;
            if (fullyOffScreen) {
              inView = false;
              applyHidden();
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
      };
    },
    { scope: stageRef, dependencies: [reducedMotion] },
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % narrativeModes.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [paused, activeIndex]);

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-paper-deep py-24 md:py-32"
    >
      <InkBlob className="-left-28 top-10 h-96 w-96" color="rgba(177,140,69,0.16)" />
      <InkBlob className="-right-32 bottom-0 h-[28rem] w-[28rem]" color="rgba(156,51,64,0.12)" />

      <div className="relative mx-auto max-w-[1320px] px-5 md:px-[6vw]">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <SectionLabel>AGENT 与叙事</SectionLabel>
            <SplitHeading
              lines={["把教学意图，", "变成可以进入的故事。"]}
              className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[3.4rem]"
            />
          </div>
          <p className="max-w-[390px] text-[13px] leading-[1.9] text-ink-muted md:mb-2">
            老师保留判断与修改权，NarrativeOS
            负责把复杂的角色、场景、任务和分支组织成完整体验。
          </p>
        </Reveal>

        <div
          ref={stageRef}
          className="grid grid-cols-1 gap-4 [perspective:1500px] lg:grid-cols-[0.62fr_1.15fr_0.73fr]"
        >
          {/* 模式选择 */}
          <div
            className="experience-panel rounded-xl border border-line bg-paper-soft p-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className="text-[11px] text-ink-muted">选择一个叙事入口</p>
            <div className="mt-3 border-t border-line" role="tablist" aria-label="叙事模式">
              {narrativeModes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative flex w-full items-center gap-3 border-b border-line py-4 text-left text-[13px] transition-colors",
                    activeIndex === index
                      ? "font-semibold text-cinnabar"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-y-3 left-0 w-0.5 rounded-full transition-all",
                      activeIndex === index
                        ? "bg-cinnabar opacity-100"
                        : "opacity-0",
                    )}
                    aria-hidden
                  />
                  <span className="font-serif text-[9px] tracking-wider text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {["角色扮演", "闯关解谜", "分支选择"][index]}
                </button>
              ))}
            </div>
            <a
              href={WORKBENCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-6 text-xs text-ink transition-colors hover:text-cinnabar"
            >
              探索全部叙事模式
              <span className="text-cinnabar">→</span>
            </a>
          </div>

          {/* 对话演示 */}
          <div
            className="experience-panel rounded-xl border border-line bg-paper-soft p-6 md:p-7"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div key={mode.id} className="animate-mode-flash min-h-[520px]">
              <div className="flex items-start justify-between border-b border-line pb-5">
                <div className="flex flex-col gap-1.5">
                  <small className="text-[9px] font-semibold tracking-wider text-cinnabar">
                    {mode.eyebrow}
                  </small>
                  <strong className="font-serif text-lg font-medium text-ink md:text-xl">
                    {mode.title}
                  </strong>
                </div>
                <span className="rounded-full border border-cinnabar/35 px-2.5 py-1 text-[8px] tracking-[0.14em] text-cinnabar">
                  LIVE
                </span>
              </div>

              <div className="mt-6 grid grid-cols-[34px_1fr] gap-3">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line font-serif text-[13px] text-ink-muted">
                  师
                </span>
                <p className="rounded-[2px_9px_9px_9px] bg-paper-deep px-4 py-3 text-xs leading-[1.75] text-ink">
                  {mode.prompt}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-[34px_1fr] gap-3">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-cinnabar font-serif text-sm italic text-paper-soft">
                  N
                </span>
                <div className="rounded-[2px_9px_9px_9px] border border-line bg-white px-4 py-3.5">
                  <small className="text-[9px] tracking-wider text-gold">
                    NARRATIVEOS 正在编排叙事…
                  </small>
                  <p className="mt-3 min-h-[66px] font-serif text-[13px] leading-[1.85] text-ink">
                    <Typewriter text={mode.reply} />
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[9px] text-[#7a5f2a]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-md border border-line px-3 py-2 text-[11px] text-ink-muted md:ml-[46px]">
                <span>继续修改这场课堂…</span>
                <b className="flex h-7 w-7 items-center justify-center rounded bg-night text-xs text-paper-soft">
                  →
                </b>
              </div>
            </div>
          </div>

          {/* 预览 */}
          <aside
            className="experience-panel rounded-xl bg-night text-paper-soft"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div key={`preview-${mode.id}`} className="animate-mode-flash p-6">
              <div className="flex items-center justify-between text-[8px] tracking-[0.16em] text-gold-soft">
                <span>即将生成 · PREVIEW</span>
                <i className="h-1.5 w-1.5 rounded-full bg-cinnabar" aria-hidden />
              </div>
              <p className="mt-9 text-[10px] text-[#aca49b]">
                {mode.preview.meta}
              </p>
              <h3 className="mt-1 font-serif text-3xl font-medium tracking-[0.08em]">
                {mode.preview.title}
              </h3>
              <small className="mt-2 block font-serif text-[10px] text-[#c7beb4]">
                {mode.preview.sub}
              </small>
              <div className="mt-6 rounded-md border border-gold-soft/20 p-4">
                <span className="text-[8px] tracking-wider text-gold">
                  {mode.preview.scene}
                </span>
                <p className="my-4 font-serif text-[11px] leading-[1.8] text-[#ddd7cf]">
                  {mode.preview.sceneText}
                </p>
                <div className="mt-2 rounded-md bg-cinnabar/25 px-3 py-2 text-[9px] text-paper-soft ring-1 ring-cinnabar/65">
                  A　{mode.preview.choices[0]}
                </div>
                <div className="mt-1.5 rounded-md border border-white/10 px-3 py-2 text-[9px] text-[#999189]">
                  B　{mode.preview.choices[1]}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
