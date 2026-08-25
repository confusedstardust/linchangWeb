"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { SectionLabel } from "@/components/decorations";

export default function FeaturedCases() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = pinned ?? hovered;
  const { locale, messages } = useI18n();
  const copy = messages.ui.cases;
  const localizedCases = messages.content.featuredCases;

  return (
    <section id="cases" className="border-t border-line py-10 md:py-32">
      <div className="mx-auto max-w-[1292px] px-5 md:px-[6vw]">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <SectionLabel>{copy.label}</SectionLabel>
            <SplitHeading
              lines={[copy.title]}
              className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:text-[2.8rem] lg:text-[2.8rem]"
            />
          </div>
          <p className="max-w-[390px] text-[13px] leading-[1.9] text-ink-muted md:mb-2">
            {copy.description}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="grid grid-cols-1 gap-4 md:flex md:aspect-[3.08/1] md:h-auto [--case-grow:2.8]"
            onPointerLeave={() => setHovered(null)}
          >
            {localizedCases.map((item, index) => {
              const isActive = active === index;
              return (
                <article
                  key={item.title}
                  onPointerEnter={() => setHovered(index)}
                  onClick={() => setPinned(pinned === index ? null : index)}
                  className={cn(
                    "relative min-w-0 w-full cursor-pointer overflow-hidden rounded-xl border bg-night transition-[height,flex-grow,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-full",
                    isActive ? "h-[540px] md:h-full" : "h-[220px]",
                    isActive
                      ? "border-gold/40 shadow-[0_30px_70px_rgba(56,44,31,0.24)]"
                      : "border-line shadow-[0_14px_34px_rgba(56,44,31,0.10)]",
                  )}
                  style={{ flexGrow: isActive ? "var(--case-grow)" : 1, flexBasis: 0 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 60vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-night/65 via-transparent to-night/30"
                    aria-hidden
                  />

                  {/* 收起状态：竖排标题 */}
                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-between p-4 transition-opacity duration-300 md:p-5",
                      isActive ? "pointer-events-none opacity-0" : "opacity-100",
                    )}
                  >
                    <span className="font-serif text-[10px] tracking-[0.22em] text-gold-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-base text-paper-soft md:text-lg",
                        locale === "en"
                          ? "max-w-[85%] text-center font-sans font-medium leading-[1.35] tracking-[0.12em]"
                          : "case-title font-brush tracking-[0.3em]",
                      )}
                    >
                      {item.shortTitle}
                    </span>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        isActive ? "bg-gold-soft" : "bg-paper-soft/50",
                      )}
                      aria-hidden
                    />
                  </div>

                  {/* 展开状态：左文右视频 */}
                  <div
                    key={isActive ? "open" : "closed"}
                    className={cn(
                      "absolute inset-0 grid grid-cols-1 transition-opacity duration-300 md:grid-cols-[300px_1fr]",
                      isActive ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                  >
                    <div className="animate-fade-up relative mx-auto flex w-full flex-col justify-center bg-paper-soft/97 p-6 md:mx-0 md:w-auto md:p-9">
                      <span className="text-[8px] font-semibold tracking-[0.22em] text-gold">
                        {item.category}
                      </span>
                      <h3 className="mt-3 font-serif text-lg font-medium leading-[1.3] text-ink md:text-[1.55rem]">
                        {item.title}
                      </h3>
                      {item.author && (
                        <p className="mt-2 text-[8px] tracking-[0.16em] text-gold">
                          {copy.author}: {item.author}
                        </p>
                      )}
                      <p className="mt-3 text-[10px] leading-[1.9] text-ink-muted">
                        {item.description}
                      </p>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-5 text-[11px] text-ink transition-colors hover:text-cinnabar"
                      >
                        {copy.enter}
                        <span className="text-cinnabar">↗</span>
                      </a>
                    </div>

                    <div className="animate-flip-in-right relative min-h-[280px] overflow-hidden bg-night md:min-h-[220px]">
                      {item.video ? (
                        <video
                          src={item.video}
                          poster={item.image}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          disablePictureInPicture
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 80vw, 60vw"
                          className="object-cover"
                        />
                      )}
                      {!item.video && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-16 w-16 animate-breathe items-center justify-center rounded-full border border-paper-soft/55 bg-night/25 text-paper-soft backdrop-blur-sm">
                              <span className="ml-1 text-lg" aria-hidden>
                                ▶
                              </span>
                            </span>
                          </div>
                          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-paper-soft/20 bg-night/35 px-3.5 py-1 text-[9px] tracking-[0.2em] text-paper-soft backdrop-blur-sm">
                            {copy.comingSoon}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
