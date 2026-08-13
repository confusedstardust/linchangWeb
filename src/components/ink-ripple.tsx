"use client";

import { useEffect, useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function InkRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nextId = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const ripple = { id: (nextId += 1), x: event.clientX, y: event.clientY };
      setRipples((current) => [...current.slice(-5), ripple]);
      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== ripple.id));
      }, 1500);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden" aria-hidden>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute"
          style={{ left: ripple.x, top: ripple.y }}
        >
          <i className="ink-drop" />
          <i className="ink-drop ink-drop-2" />
          <i className="ink-ring" />
        </span>
      ))}
    </div>
  );
}
