"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

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
  const [visible, setVisible] = useState(false);
  const linesKey = lines.join("\u0000");

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    let frame = 0;
    let fallback = 0;
    let observer: IntersectionObserver | null = null;

    const show = () => {
      observer?.disconnect();
      window.clearTimeout(fallback);
      frame = window.requestAnimationFrame(() => setVisible(true));
    };

    if (reducedMotion || !window.matchMedia("(min-width: 768px)").matches) {
      show();
      return () => window.cancelAnimationFrame(frame);
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) show();
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    fallback = window.setTimeout(show, 1800);

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
      show();
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(fallback);
      window.cancelAnimationFrame(frame);
    };
  }, [linesKey, reducedMotion, visible]);

  return (
    <h2 ref={ref} className={cn(className)}>
      {lines.map((line, lineIndex) => (
        <span
          key={`${linesKey}-${lineIndex}`}
          className="-mb-[0.08em] block overflow-hidden pb-[0.08em]"
        >
          <span
            className={cn(
              "block transform-gpu transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-[105%] opacity-0",
            )}
            style={{ transitionDelay: `${delay * 1000 + lineIndex * 80}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </h2>
  );
}
