"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { products, WORKBENCH_URL, type Product } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/brand-logo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CARD_COUNT = products.length;
const ANGLE_STEP = (Math.PI * 2) / CARD_COUNT;

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
  const handlersRef = useRef<OrbitHandlers>({
    pause: () => {},
    resume: () => {},
  });
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const stage = stageRef.current;
      const orbit = orbitRef.current;
      if (!stage) return;

      const cards = gsap.utils.toArray<HTMLElement>(".orbit-card", stage);
      const state = { progress: Math.PI / 2 };

      const setters = cards.map((card) => ({
        x: gsap.quickSetter(card, "x", "px"),
        y: gsap.quickSetter(card, "y", "px"),
        scale: gsap.quickSetter(card, "scale"),
        opacity: gsap.quickSetter(card, "opacity"),
        zIndex: gsap.quickSetter(card, "zIndex"),
        rotationX: gsap.quickSetter(card, "rotationX", "deg"),
        filter: gsap.quickSetter(card, "filter"),
      }));

      let rx = 0;
      let ry = 0;

      const measure = () => {
        const width = stage.clientWidth;
        const isMobile = width < 768;
        const cardWidth = isMobile ? 250 : 300;
        rx = Math.min(Math.max(width * 0.5 - cardWidth * 0.58, 150), 440);
        ry = isMobile ? 70 : 106;
        if (orbit) {
          gsap.set(orbit, { width: rx * 2, height: ry * 2 });
        }
      };

      gsap.set(cards, { xPercent: -50, yPercent: -50 });
      gsap.set(orbit, { xPercent: -50, yPercent: -50 });
      measure();

      const render = () => {
        cards.forEach((card, index) => {
          const angle = state.progress + index * ANGLE_STEP;
          const depth = (Math.sin(angle) + 1) / 2;
          const x = Math.cos(angle) * rx;
          const y = Math.sin(angle) * ry;

          setters[index].x(x);
          setters[index].y(y);
          setters[index].scale(0.74 + 0.46 * depth);
          setters[index].opacity(reducedMotion ? 1 : 0.42 + 0.58 * depth);
          setters[index].zIndex(Math.round(depth * 10));
          setters[index].rotationX((depth - 0.5) * 26);
          setters[index].filter(
            reducedMotion ? "blur(0px)" : `blur(${(1 - depth) * 2.2}px)`,
          );
        });
      };

      render();

      const resizeObserver = new ResizeObserver(() => {
        measure();
        render();
      });
      resizeObserver.observe(stage);

      let autoTween: gsap.core.Tween | null = null;
      let resumeTimer: number | undefined;
      let isInView = false;
      const activeInteractions = new Set<string>();

      const stopAuto = () => {
        autoTween?.kill();
        autoTween = null;
      };

      const startAuto = () => {
        if (reducedMotion || !isInView || activeInteractions.size > 0) return;
        stopAuto();
        autoTween = gsap.to(state, {
          progress: `+=${Math.PI * 2}`,
          duration: 30,
          ease: "none",
          repeat: -1,
          onUpdate: render,
        });
      };

      const pauseAndCenter = (source: string) => {
        if (reducedMotion) return;
        const wasIdle = activeInteractions.size === 0;
        activeInteractions.add(source);
        window.clearTimeout(resumeTimer);
        stopAuto();
        if (!wasIdle) return;

        const remainder = ((state.progress % ANGLE_STEP) + ANGLE_STEP) % ANGLE_STEP;
        const target = ((Math.PI / 2) % ANGLE_STEP + ANGLE_STEP) % ANGLE_STEP;
        let delta = target - remainder;
        if (delta > ANGLE_STEP / 2) delta -= ANGLE_STEP;
        if (delta < -ANGLE_STEP / 2) delta += ANGLE_STEP;

        gsap.to(state, {
          progress: state.progress + delta,
          duration: 0.8,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: render,
        });
      };

      handlersRef.current = {
        pause: pauseAndCenter,
        resume: (source) => {
          activeInteractions.delete(source);
          if (activeInteractions.size > 0) return;
          window.clearTimeout(resumeTimer);
          resumeTimer = window.setTimeout(startAuto, 700);
        },
      };

      const visibilityTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          isInView = self.isActive;
          if (isInView) startAuto();
          else stopAuto();
        },
      });

      isInView = visibilityTrigger.isActive;
      if (isInView) startAuto();

      gsap.fromTo(
        stage,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );

      return () => {
        resizeObserver.disconnect();
        window.clearTimeout(resumeTimer);
        visibilityTrigger.kill();
        stopAuto();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative z-10 overflow-hidden bg-paper px-5 pb-24 md:px-[6vw] md:pb-28"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="relative h-[470px] w-full [perspective:1200px] md:h-[520px]">
          <div
            ref={stageRef}
            className="orbit-stage absolute inset-0"
          >
            {/* 轨道 */}
            <div
              ref={orbitRef}
              className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-gold/35"
              aria-hidden
            />

            {/* 中心星球 */}
            <span
              className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
              aria-hidden
            >
              <span className="absolute -inset-5 animate-breathe rounded-full bg-cinnabar/12 blur-2xl" />
              <BrandLogo size={64} />
            </span>

            {products.map((product, index) => (
              <OrbitCard
                key={product.title}
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
