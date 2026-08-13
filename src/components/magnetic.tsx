"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const relativeX = event.clientX - (rect.left + rect.width / 2);
    const relativeY = event.clientY - (rect.top + rect.height / 2);

    gsap.to(element, {
      x: relativeX * strength,
      y: relativeY * strength,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const onPointerLeave = () => {
    const element = ref.current;
    if (!element) return;
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.38)",
    });
  };

  return (
    <div
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
