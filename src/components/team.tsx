"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { SectionLabel } from "@/components/decorations";

export default function Team() {
  const [activeIndex, setActiveIndex] = useState(2);
  const trackRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const { locale, messages } = useI18n();
  const copy = messages.ui.team;
  const localizedMembers = messages.content.teamMembers;
  const active = localizedMembers[activeIndex];
  const loopedMembers = [...localizedMembers, ...localizedMembers];

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((current) => (current + 1) % localizedMembers.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [localizedMembers.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const half = track.scrollWidth / 2;
      if (half > 0 && !pausedRef.current) {
        x -= (half / 30000) * dt;
        if (x <= -half) x += half;
        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [locale, localizedMembers.length]);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    let angle = 0;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      angle = (angle + (360 / 28000) * dt) % 360;
      ring.style.transform = `rotate(${angle}deg)`;
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="team" className="relative overflow-hidden border-t border-gold-soft/15 bg-night py-10 text-paper-soft md:py-32">
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" aria-hidden />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-[6vw]">
        <Reveal className="mb-14 flex flex-col justify-between gap-7 md:mb-16 md:flex-row md:items-end">
          <div>
            <SectionLabel className="text-gold-soft" dark>{copy.label}</SectionLabel>
            <SplitHeading
              lines={copy.title}
              className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-paper-soft sm:text-4xl md:text-[2.8rem] lg:text-[2.8rem]"
            />
          </div>
          <p className="max-w-[380px] text-[13px] leading-[1.9] text-gold-soft/55 md:mb-2">
            {copy.description}
          </p>
        </Reveal>

        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-[6vw]">
          <Reveal className="relative flex flex-col justify-between border-t border-gold-soft/20 pt-6">
            <div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-gold-soft/70">
                <span>{copy.fieldNotes} / 0{activeIndex + 1}</span>
                <span>{localizedMembers.length} {copy.members}</span>
              </div>
              <div className="mt-10 hidden h-px bg-gold-soft/20 lg:block">
                <div className="h-px bg-gold-soft transition-all duration-700" style={{ width: `${((activeIndex + 1) / localizedMembers.length) * 100}%` }} />
              </div>
            </div>
            <div className="mt-10 lg:mt-auto">
              <p className="max-w-[440px] font-serif text-2xl leading-[1.5] text-gold-soft md:text-3xl">“{active.short}”</p>
              <p className="mt-6 max-w-[470px] text-xs leading-[2] text-paper-soft/55">{active.bio}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {active.tags.map((tag) => <span key={tag} className="rounded-full border border-gold-soft/25 px-3 py-1.5 text-[9px] text-gold-soft/90">{tag}</span>)}
              </div>
            </div>
          </Reveal>

          <div className="relative min-h-[520px] md:min-h-[600px]">
            <div className="absolute right-0 top-0 z-10 text-right">
              <span className="block text-[9px] tracking-[0.24em] text-gold-soft/70">
                {copy.current} / 0{activeIndex + 1}
              </span>
              <strong className="mt-1 block font-serif text-xl text-paper-soft md:text-2xl">
                {active.name}
              </strong>
            </div>
            <div
              ref={ringRef}
              className="pointer-events-none absolute left-[12%] top-[8%] h-[72%] w-[72%] rounded-full border border-gold-soft/20 will-change-transform"
              aria-hidden
            >
              <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-gold-soft shadow-[0_0_18px_6px_rgba(229,210,163,0.22)]" />
            </div>

            <div
              className="absolute left-[7%] top-[11%] h-[68%] w-[74%] overflow-hidden rounded-2xl border border-gold-soft/35 bg-night p-2 shadow-[0_30px_100px_rgba(22,19,16,0.55)] transition-transform duration-700 md:p-3"
              style={{ transform: `rotate(${activeIndex % 2 ? 1 : -1}deg)` }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-night-soft">
                <Image key={active.image} src={active.image} alt={copy.imageAlt.replace("{name}", active.name)} fill sizes="(max-width: 1024px) 70vw, 42vw" className="object-contain transition-transform duration-1000 hover:scale-105" priority={activeIndex === 2} />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-night/10" aria-hidden />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="text-[9px] tracking-[0.22em] text-gold-soft">{active.discipline}</span>
                <h3 className="mt-2 font-serif text-3xl text-paper-soft md:text-5xl">{active.name}</h3>
                <p className="mt-1 text-[11px] text-gold-soft/70">{active.role}</p>
              </div>
            </div>

            <div
              className="absolute bottom-[-2rem] left-[-4%] right-[-4%] overflow-hidden border-y border-gold-soft/15 bg-night py-2 lg:bottom-[-1.5rem]"
              onMouseEnter={() => {
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                pausedRef.current = false;
              }}
            >
              <div ref={trackRef} className="flex w-max will-change-transform">
                {loopedMembers.map((member, index) => {
                  const memberIndex = index % localizedMembers.length;
                  const isActive = activeIndex === memberIndex;
                  return (
                    <button
                      key={`${member.name}-${index}`}
                      type="button"
                      aria-label={copy.viewMember.replace("{name}", member.name)}
                      aria-pressed={isActive}
                      onMouseEnter={() => setActiveIndex(memberIndex)}
                      onFocus={() => setActiveIndex(memberIndex)}
                      onClick={() => setActiveIndex(memberIndex)}
                      className={cn(
                        "team-member-tile group relative mx-1 h-[78px] w-[112px] shrink-0 overflow-hidden rounded-md border bg-night transition-all duration-500 md:h-[92px] md:w-[132px]",
                        isActive ? "border-gold-soft shadow-[0_0_24px_rgba(229,210,163,0.2)]" : "border-gold-soft/20 hover:border-gold-soft/60",
                      )}
                    >
                      <Image src={member.image} alt="" fill sizes="140px" className={cn("object-cover transition-all duration-500 group-hover:scale-110", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100")} />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night to-transparent px-2 pb-1.5 pt-5 text-left font-serif text-xs text-paper-soft">{member.name}</span>
                      {isActive && <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-gold-soft shadow-[0_0_10px_3px_rgba(229,210,163,0.45)]" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
