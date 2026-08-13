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

export default function SplitHeading({
  lines,
  className,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      const chars = ref.current.querySelectorAll(".split-char");

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
    },
    { scope: ref, dependencies: [reducedMotion, delay] },
  );

  return (
    <h2 ref={ref} className={cn(className)}>
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          className="-mb-[0.08em] block overflow-hidden pb-[0.08em]"
        >
          {Array.from(line).map((char, charIndex) => (
            <span
              key={`${lineIndex}-${charIndex}`}
              className="split-char inline-block will-change-transform"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
