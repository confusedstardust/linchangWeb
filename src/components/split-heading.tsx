"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SplitHeadingProps = {
  lines: string[];
  className?: string;
  delay?: number;
};

function SplitLine({ line, lineIndex }: { line: string; lineIndex: number }) {
  const tokens = line.split(/(\s+)/);

  return tokens.map((token, tokenIndex) => {
    if (!token) return null;

    if (/^\s+$/.test(token)) {
      return (
        <span
          key={`${lineIndex}-space-${tokenIndex}`}
          className="split-char inline-block will-change-transform"
        >
          {"\u00A0"}
        </span>
      );
    }

    return (
      <span
        key={`${lineIndex}-word-${tokenIndex}`}
        className="inline-block whitespace-nowrap"
      >
        {Array.from(token).map((char, charIndex) => (
          <span
            key={`${lineIndex}-${tokenIndex}-${charIndex}`}
            className="split-char inline-block will-change-transform"
          >
            {char}
          </span>
        ))}
      </span>
    );
  });
}

export default function SplitHeading({
  lines,
  className,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const linesKey = lines.join("\u0000");

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const chars = ref.current?.querySelectorAll(".split-char");
        if (!chars?.length || !ref.current) return;

        gsap.set(chars, { yPercent: 120, opacity: 0, rotate: 3 });
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.028,
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 84%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [reducedMotion, delay, linesKey] },
  );

  return (
    <h2 ref={ref} className={cn(className)}>
      {lines.map((line, lineIndex) => (
        <span
          key={`${linesKey}-${lineIndex}`}
          className="-mb-[0.08em] block overflow-hidden pb-[0.08em]"
        >
          <SplitLine line={line} lineIndex={lineIndex} />
        </span>
      ))}
    </h2>
  );
}
