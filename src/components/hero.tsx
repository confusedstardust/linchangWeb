"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WORKBENCH_URL } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Magnetic from "@/components/magnetic";
import {
  BrushUnderline,
  InkBlob,
  Mountains,
} from "@/components/decorations";
import BrandLogo from "@/components/brand-logo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const playbackTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [curtainGone, setCurtainGone] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const openTimer = setTimeout(() => setIntroDone(true), 420);
    const removeTimer = setTimeout(() => setCurtainGone(true), 1450);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    if (curtainGone) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [curtainGone]);

  const beginPlayback = useCallback(() => {
    if (startedRef.current || !curtainGone) return;
    startedRef.current = true;

    const charsLine1 = gsap.utils.toArray<HTMLElement>(
      ".hero-line-1 .hero-line-char",
      sectionRef.current,
    );
    const charsLine2 = gsap.utils.toArray<HTMLElement>(
      ".hero-line-2 .hero-line-char",
      sectionRef.current,
    );
    const fades = gsap.utils.toArray<HTMLElement>(
      ".hero-fade",
      sectionRef.current,
    );

    playbackTimelineRef.current?.kill();
    const timeline = gsap.timeline({ delay: 0.05 });
    playbackTimelineRef.current = timeline;
    timeline
      .to(
        charsLine1,
        {
          xPercent: -160,
          opacity: 0,
          duration: 0.85,
          ease: "power2.in",
          stagger: 0.035,
        },
        0,
      )
      .to(
        charsLine2,
        {
          xPercent: 160,
          opacity: 0,
          duration: 0.85,
          ease: "power2.in",
          stagger: 0.035,
        },
        0,
      )
      .to(
        ".hero-brush-path",
        { opacity: 0, duration: 0.4, ease: "power2.in" },
        0,
      )
      .to(
        fades,
        {
          opacity: 0,
          yPercent: -20,
          duration: 0.55,
          ease: "power2.in",
          stagger: 0.05,
        },
        0.05,
      )
      .call(
        () => {
          videoRef.current?.play().catch(() => {});
        },
        undefined,
        0.98,
      );
  }, [curtainGone]);

  const restoreIntroContent = useCallback(() => {
    if (!startedRef.current || !curtainGone) return;
    startedRef.current = false;
    playbackTimelineRef.current?.kill();
    playbackTimelineRef.current = null;
    videoRef.current?.pause();

    const chars = gsap.utils.toArray<HTMLElement>(
      ".hero-line-char",
      sectionRef.current,
    );
    const fades = gsap.utils.toArray<HTMLElement>(
      ".hero-fade",
      sectionRef.current,
    );

    gsap.killTweensOf([...chars, ...fades]);
    gsap.killTweensOf(".hero-brush-path");
    gsap.to(chars, {
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.015,
    });
    gsap.to(fades, {
      y: 0,
      yPercent: 0,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
      stagger: 0.035,
    });
    gsap.to(".hero-brush-path", {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [curtainGone]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 30) beginPlayback();
      else restoreIntroContent();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [beginPlayback, restoreIntroContent]);

  useGSAP(
    () => {
      if (reducedMotion) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current || !mediaRef.current) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=135%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            mediaRef.current,
            { scaleX: 1, scaleY: 1 },
            { scaleX: 1.16, scaleY: 1.16, ease: "none" },
            0,
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        ".hero-line-char",
        sectionRef.current,
      );
      const fades = gsap.utils.toArray<HTMLElement>(
        ".hero-fade",
        sectionRef.current,
      );

      if (reducedMotion) {
        gsap.set([...chars, ...fades], { clearProps: "all" });
        gsap.set(".hero-brush-path", { strokeDashoffset: 0 });
        return;
      }

      if (!introDone) {
        gsap.set(chars, { yPercent: 45, opacity: 0 });
        gsap.set(fades, { y: 18, opacity: 0 });
        return;
      }

      const underlineDelay = chars.length * 0.045 + 0.5;
      gsap
        .timeline({ delay: 0.12 })
        .fromTo(
          chars,
          { yPercent: 45, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.045,
          },
          0,
        )
        .fromTo(
          fades,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.09,
          },
          0.4,
        )
        .fromTo(
          ".hero-brush-path",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.85,
            ease: "power2.inOut",
          },
          underlineDelay,
        );
    },
    { scope: sectionRef, dependencies: [introDone, reducedMotion] },
  );

  const onSectionClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;
    beginPlayback();
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      onClick={onSectionClick}
      className="relative min-h-[100svh] cursor-pointer overflow-hidden bg-night text-paper-soft"
    >
      {/* 视频背景 */}
      <div
        ref={mediaRef}
        className="absolute -inset-y-[8%] inset-x-0 will-change-transform"
        aria-hidden
      >
        <video
          ref={videoRef}
          className="h-full w-full animate-pan object-cover"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          onPlaying={() => setVideoReady(true)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 墨色氛围层 */}
      <div className="absolute inset-0 bg-night/25" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_44%,rgba(22,19,16,0.12),rgba(22,19,16,0.52)_78%,rgba(22,19,16,0.86))]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-night/55 via-transparent to-night/65"
        aria-hidden
      />
      <InkBlob
        className="left-[8%] top-[16%] h-[30rem] w-[30rem] animate-ink-breathe mix-blend-screen"
        color="rgba(177,140,69,0.18)"
      />
      <InkBlob
        className="right-[4%] top-[38%] h-[26rem] w-[26rem] animate-ink-breathe mix-blend-screen"
        color="rgba(156,51,64,0.22)"
      />
      <div
        className="paper-grain absolute inset-0 opacity-[0.18] mix-blend-overlay"
        aria-hidden
      />

      {/* 主体内容 */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-28 pt-28 text-center md:px-10">
        <div className="flex max-w-[880px] flex-col items-center">
          <span className="hero-fade inline-flex items-center gap-2.5 rounded-full border border-paper-soft/25 bg-night/35 px-4 py-1.5 text-[11px] tracking-wide text-paper-soft/90 backdrop-blur-sm">
            <i
              className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cinnabar"
              aria-hidden
            />
            已接入 AI 叙事课堂生成引擎
          </span>

          <p className="hero-fade mt-7 text-[10px] font-medium tracking-[0.32em] text-gold-soft">
            NARRATIVE LEARNING, REIMAGINED
          </p>

          <h1 className="mt-4 font-serif text-[2.75rem] font-semibold leading-[1.18] tracking-tight text-shadow-ink sm:text-6xl md:text-7xl lg:text-[5.3rem]">
            <span className="hero-line-1 block">
              {Array.from("让知识不只被讲述，").map((char, index) => (
                <span
                  key={`line1-${index}`}
                  className="hero-line-char inline-block will-change-transform"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span className="hero-line-2 block">
              {Array.from("而是被").map((char, index) => (
                <span
                  key={`line2-${index}`}
                  className="hero-line-char inline-block will-change-transform"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
              <em className="relative mx-1 inline-block font-brush font-normal not-italic text-gold-soft">
                {Array.from("亲历").map((char, index) => (
                  <span
                    key={`em-${index}`}
                    className="hero-line-char inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
                <BrushUnderline className="hero-brush-path" />
              </em>
              <span className="hero-line-char inline-block will-change-transform">
                。
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-7 max-w-[640px] font-serif text-base leading-[1.9] text-paper-soft/85 text-shadow-ink md:text-lg">
            将课文、知识点与教学目标，转化为一场学生可以进入、选择和反思的
            AI 叙事课堂。
          </p>

          <div className="hero-fade mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Magnetic className="flex h-12 w-full sm:w-auto">
              <a
                href={WORKBENCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full w-full items-center justify-center gap-5 overflow-hidden rounded-md bg-cinnabar px-7 text-sm text-paper-soft shadow-[0_14px_34px_rgba(112,34,46,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cinnabar-deep hover:shadow-[0_18px_42px_rgba(112,34,46,0.45)] sm:gap-10"
              >
                <span
                  className="absolute left-0 top-0 h-full w-[38%] animate-shine bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  aria-hidden
                />
                开始创作
              </a>
            </Magnetic>
            <a
              href="#experience"
              className="inline-flex h-12 w-full items-center justify-center rounded-md border border-paper-soft/35 bg-paper-soft/10 px-7 text-sm text-paper-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-paper-soft/60 hover:bg-paper-soft/20 sm:w-auto"
            >
              了解更多
            </a>
          </div>
        </div>
      </div>

      {/* 远山剪影过渡 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 md:h-36">
        <Mountains className="h-full" />
      </div>

      {/* 视频加载过渡 */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-night transition-opacity duration-1000 ${
          videoReady ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: "url(/hero-poster.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      {/* 开场墨幕 */}
      {!curtainGone && (
        <div className="absolute inset-0 z-40 overflow-hidden" aria-hidden>
          <div
            className={`absolute inset-x-0 top-0 h-1/2 bg-night transition-transform duration-[900ms] ease-[cubic-bezier(0.72,0,0.2,1)] ${
              introDone ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            <div className="paper-grain absolute inset-0 opacity-[0.08]" />
          </div>
          <div
            className={`absolute inset-x-0 bottom-0 h-1/2 bg-night transition-transform duration-[900ms] ease-[cubic-bezier(0.72,0,0.2,1)] ${
              introDone ? "translate-y-full" : "translate-y-0"
            }`}
          >
            <div className="paper-grain absolute inset-0 opacity-[0.08]" />
          </div>

          <div
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 transition-all duration-500 ${
              introDone ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <span className="relative">
              <BrandLogo size={84} />
              <span className="absolute -inset-4 -z-10 animate-breathe rounded-full bg-cinnabar/20 blur-2xl" />
            </span>
            <span className="font-brush text-2xl tracking-[0.2em] text-paper-soft">
              AI 叙事课堂
            </span>
            <span className="text-[9px] tracking-[0.42em] text-gold-soft">
              NARRATIVEOS
            </span>
            <span className="h-px w-28 animate-breathe bg-gradient-to-r from-transparent via-cinnabar to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
}
