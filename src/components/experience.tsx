"use client";

import { useEffect, useRef, useState } from "react";
import { WORKBENCH_URL } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import BrandLogo from "@/components/brand-logo";
import { InkBlob, SectionLabel } from "@/components/decorations";

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
  const { messages } = useI18n();
  const copy = messages.ui.experience;
  const localizedModes = messages.content.narrativeModes;
  const mode = localizedModes[activeIndex];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const bells = Array.from(stage.querySelectorAll<HTMLElement>(".chime-swing"));
    if (!bells.length) return;

    const AMPLITUDE = 12;
    const PERIOD = 1.45;
    const CYCLES = 2;
    const DURATION = PERIOD * CYCLES;
    const STAGGER = 0.2;

    let inView = false;
    let playing = false;
    let startedAt = 0;
    let frame = 0;

    const rest = () => {
      bells.forEach((bell) => {
        bell.style.transform = "rotate(0deg)";
      });
    };

    const play = () => {
      playing = true;
      startedAt = performance.now();
    };

    const tick = (now: number) => {
      const rect = stage.getBoundingClientRect();
      const visible =
        rect.top < window.innerHeight * 0.88 && rect.bottom > window.innerHeight * 0.12;
      const gone = rect.bottom <= 0 || rect.top >= window.innerHeight;

      if (visible && !inView) {
        inView = true;
        play();
      } else if (gone && inView) {
        inView = false;
        playing = false;
        rest();
      }

      if (playing) {
        const elapsed = (now - startedAt) / 1000;
        const lastDelay = (bells.length - 1) * STAGGER;
        if (elapsed >= DURATION + lastDelay) {
          playing = false;
          rest();
        } else {
          bells.forEach((bell, index) => {
            const local = elapsed - index * STAGGER;
            if (local <= 0 || local >= DURATION) {
              bell.style.transform = "rotate(0deg)";
              return;
            }
            const restRatio = Math.min(1, local / DURATION);
            const decay = 1 - restRatio * 0.22;
            const settle = restRatio > 0.86 ? 1 - (restRatio - 0.86) / 0.14 : 1;
            const phase = (local / PERIOD) * Math.PI * 2;
            const swing = Math.sin(phase) * AMPLITUDE * decay * settle;
            bell.style.transform = `rotate(${swing}deg)`;
          });
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    rest();
    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % localizedModes.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [paused, activeIndex, localizedModes.length]);

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-paper-deep py-8 md:py-32"
    >
      <InkBlob className="-left-28 top-10 h-96 w-96" color="rgba(177,140,69,0.16)" />
      <InkBlob className="-right-32 bottom-0 h-[28rem] w-[28rem]" color="rgba(156,51,64,0.12)" />

      <div className="relative mx-auto max-w-[1320px] px-5 md:px-[6vw]">
        <Reveal className="mb-4 flex flex-col justify-between gap-0 md:mb-16 md:flex-row md:items-end md:gap-6">
          <div>
            <SectionLabel>{copy.label}</SectionLabel>
            <SplitHeading
              lines={copy.title}
              className="mt-3 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:mt-5 sm:text-4xl md:mt-5 md:text-[2.8rem] lg:text-[2.8rem]"
            />
          </div>
          <p className="max-w-[390px] text-[13px] leading-[1.9] text-ink-muted md:mb-2">
            {copy.description}
          </p>
        </Reveal>

        <div
          ref={stageRef}
          className="grid grid-cols-1 gap-4 [perspective:1500px] lg:grid-cols-[0.62fr_1.15fr_0.73fr]"
        >
          {/* 模式选择 */}
          <div
            className="experience-panel chime-swing rounded-xl border border-line bg-paper-soft p-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className="text-[11px] text-ink-muted">{copy.choose}</p>
            <div className="mt-3 border-t border-line" role="tablist" aria-label={copy.tabLabel}>
              {localizedModes.map((item, index) => (
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
                  {copy.tabs[index]}
                </button>
              ))}
            </div>
            <a
              href={WORKBENCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-6 text-xs text-ink transition-colors hover:text-cinnabar"
            >
              {copy.explore}
              <span className="text-cinnabar">→</span>
            </a>
          </div>

          {/* 对话演示 */}
          <div
            className="experience-panel chime-swing rounded-xl border border-line bg-paper-soft p-6 md:p-7"
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
                  {copy.teacher}
                </span>
                <p className="rounded-[2px_9px_9px_9px] bg-paper-deep px-4 py-3 text-xs leading-[1.75] text-ink">
                  {mode.prompt}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-[34px_1fr] gap-3">
                <BrandLogo size={34} />
                <div className="rounded-[2px_9px_9px_9px] border border-line bg-white px-4 py-3.5">
                  <small className="text-[9px] tracking-wider text-gold">
                    {copy.generating}
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
                <span>{copy.edit}</span>
                <b className="flex h-7 w-7 items-center justify-center rounded bg-night text-xs text-paper-soft">
                  →
                </b>
              </div>
            </div>
          </div>

          {/* 预览 */}
          <aside
            className="experience-panel chime-swing rounded-xl bg-night text-paper-soft"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div key={`preview-${mode.id}`} className="animate-mode-flash p-6">
              <div className="flex items-center justify-between text-[8px] tracking-[0.16em] text-gold-soft">
                <span>{copy.preview}</span>
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
