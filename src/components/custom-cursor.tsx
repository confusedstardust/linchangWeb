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
    gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 1 });

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
        scale: interactive ? 1.55 : 1,
        opacity: interactive ? 1 : 0.82,
        backgroundColor: interactive ? "rgba(156,51,64,0.16)" : "rgba(156,51,64,0.08)",
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
      className="pointer-events-none fixed left-0 top-0 z-[90] h-[22px] w-[22px] rounded-full border border-cinnabar/80 bg-cinnabar/10 opacity-0 shadow-[0_0_0_1px_rgba(156,51,64,0.12),0_2px_16px_rgba(156,51,64,0.28)] backdrop-blur-[1px]"
      aria-hidden
    />
  );
}
