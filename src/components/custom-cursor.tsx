"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    document.documentElement.classList.add("custom-cursor-enabled");
    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 1 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.22, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.22, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const interactive = (event.target as Element | null)?.closest(
        "a, button, [role='tab'], [data-cursor]",
      );
      gsap.to(ring, {
        scaleX: interactive ? 1.55 : 1,
        scaleY: interactive ? 1.55 : 1,
        opacity: interactive ? 1 : 0.82,
        backgroundColor: interactive ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.1)",
        duration: 0.28,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed left-0 top-0 z-[90] h-[22px] w-[22px] rounded-full border border-white/95 bg-white/10 opacity-0 mix-blend-difference shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_2px_16px_rgba(255,255,255,0.45)] backdrop-blur-[1px]"
      aria-hidden
    />
  );
}
