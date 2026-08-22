"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

function ScrollSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh()).catch(() => {});

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target =
        href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;

      event.preventDefault();
      if (target === 0) {
        lenis.scrollTo(0, { duration: 1.3 });
      } else {
        const element = target as HTMLElement;
        const targetTop = element.getBoundingClientRect().top + lenis.scroll;
        const topOffset = href === "#about" ? 148 : 82;
        lenis.scrollTo(Math.max(0, targetTop - topOffset), { duration: 1.3 });
      }
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: true,
      }}
    >
      <ScrollSync />
      {children}
    </ReactLenis>
  );
}
