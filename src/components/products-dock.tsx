"use client";

import { useEffect, useRef, type RefObject } from "react";
import { products, WORKBENCH_URL, type Product } from "@/lib/content";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/brand-logo";

const CARD_COUNT = products.length;
const ANGLE_STEP = (Math.PI * 2) / CARD_COUNT;
const ORBIT_SECONDS = 30;

type OrbitHandlers = {
  pause: (source: string) => void;
  resume: (source: string) => void;
};

function OrbitCard({
  product,
  index,
  handlers,
}: {
  product: Product;
  index: number;
  handlers: RefObject<OrbitHandlers>;
}) {
  const pointerSource = `pointer-${index}`;
  const focusSource = `focus-${index}`;

  return (
    <a
      href={WORKBENCH_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="orbit-card group absolute left-1/2 top-1/2 w-[250px] will-change-transform rounded-xl border border-line bg-paper-soft/97 p-5 shadow-[0_18px_44px_rgba(56,44,31,0.12)] transition-[border-color,box-shadow] duration-300 hover:border-cinnabar/55 hover:shadow-[0_26px_60px_rgba(56,44,31,0.2)] md:w-[300px]"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") handlers.current.pause(pointerSource);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") handlers.current.resume(pointerSource);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) {
          handlers.current.pause(focusSource);
        }
      }}
      onBlur={() => handlers.current.resume(focusSource)}
    >
      <span
        className="absolute inset-x-6 top-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold/70 to-transparent transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />

      <div className="flex items-start justify-between">
        <span
          className="flex h-10 w-10 animate-float items-center justify-center rounded-lg bg-paper-deep font-brush text-lg text-cinnabar transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-cinnabar-soft"
          style={{ animationDelay: `${-index * 0.9}s`, animationDuration: "6s" }}
        >
          {product.icon}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[9px] font-semibold",
            product.badgeClass,
          )}
        >
          {product.badge}
        </span>
      </div>

      <strong className="mt-4 font-serif text-[15px] font-semibold text-ink">
        {product.title}
      </strong>
      <p className="mt-2 text-xs leading-[1.7] text-ink-muted">
        {product.description}
      </p>
      <span
        className="absolute bottom-4 right-4 text-gold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
        aria-hidden
      >
        ↗
      </span>
    </a>
  );
}

export default function ProductsDock() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const handlersRef = useRef<OrbitHandlers>({
    pause: () => {},
    resume: () => {},
  });
  const { locale, messages } = useI18n();
  const localizedProducts = messages.content.products;

  useEffect(() => {
    const stage = stageRef.current;
    const orbit = orbitRef.current;
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>(".orbit-card"));
    if (!cards.length) return;

    let rx = 0;
    let ry = 0;
    let progress = Math.PI / 2;

    const measure = () => {
      const width = stage.clientWidth;
      const isMobile = width < 768;
      const cardWidth = isMobile ? 250 : 300;
      rx = Math.min(Math.max(width * 0.5 - cardWidth * 0.58, 150), 440);
      ry = isMobile ? 70 : 106;
      if (orbit) {
        orbit.style.width = `${rx * 2}px`;
        orbit.style.height = `${ry * 2}px`;
        orbit.style.transform = "translate(-50%, -50%)";
      }
    };

    const render = () => {
      cards.forEach((card, index) => {
        const angle = progress + index * ANGLE_STEP;
        const depth = (Math.sin(angle) + 1) / 2;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        const scale = 0.74 + 0.46 * depth;
        const tilt = (depth - 0.5) * 26;
        card.style.zIndex = String(Math.round(depth * 10));
        card.style.opacity = String(0.42 + 0.58 * depth);
        card.style.filter = `blur(${(1 - depth) * 2.2}px)`;
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotateX(${tilt}deg) scale(${scale})`;
      });
    };

    measure();
    render();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
    });
    resizeObserver.observe(stage);

    const activeInteractions = new Set<string>();
    handlersRef.current = {
      pause: (source) => {
        activeInteractions.add(source);
        pausedRef.current = true;
      },
      resume: (source) => {
        activeInteractions.delete(source);
        if (activeInteractions.size === 0) pausedRef.current = false;
      },
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!pausedRef.current) {
        progress += ((Math.PI * 2) / ORBIT_SECONDS) * (dt / 1000);
      }
      render();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [locale, localizedProducts]);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative z-10 overflow-hidden bg-paper px-5 pb-24 md:px-[6vw] md:pb-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="relative h-[470px] w-full [perspective:1200px] md:h-[520px]">
          <div ref={stageRef} className="orbit-stage absolute inset-0">
            <div
              ref={orbitRef}
              className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-gold/35"
              aria-hidden
            />

            <span
              className="absolute left-1/2 top-1/2 z-[20] -translate-x-1/2 -translate-y-1/2"
              aria-hidden
            >
              <span className="absolute -inset-5 animate-breathe rounded-full bg-cinnabar/12 blur-2xl" />
              <BrandLogo size={64} />
            </span>

            {localizedProducts.map((product, index) => (
              <OrbitCard
                key={`${index}-${product.icon}`}
                product={product}
                index={index}
                handlers={handlersRef}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
