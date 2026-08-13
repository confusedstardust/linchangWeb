import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.24em] text-gold",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-7 bg-gradient-to-r",
          dark ? "from-gold-soft to-gold" : "from-cinnabar to-gold",
        )}
      />
      {children}
    </span>
  );
}

export function SealMark({
  char = "叙",
  className,
  size,
}: {
  char?: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("seal-mark", className)}
      style={size ? { width: size, height: size } : undefined}
    >
      {char}
    </span>
  );
}

export function BrushUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute -bottom-3 left-0 h-3.5 w-full text-gold",
        className,
      )}
      viewBox="0 0 240 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        className="brush-path"
        pathLength={1}
        d="M2 8.5C42 3.5 78 2.2 238 6.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InkBlob({
  className,
  color = "rgba(156,51,64,0.13)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`,
      }}
    />
  );
}

export function Mountains({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none block w-full text-paper", className)}
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        d="M0 220V176C186 100 308 154 478 120C660 84 748 42 936 68C1076 90 1204 32 1440 60V220H0Z"
        fill="currentColor"
        opacity="0.34"
      />
      <path
        d="M0 220V196C230 140 372 182 556 156C738 130 902 92 1096 120C1250 143 1338 106 1440 124V220H0Z"
        fill="currentColor"
        opacity="0.72"
      />
      <path
        d="M0 220V210C268 178 426 202 636 184C828 168 1022 152 1204 170C1320 182 1386 172 1440 180V220H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloudDrift({
  className,
  reverse = false,
}: {
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-x-0", className)}
      aria-hidden
    >
      <svg
        className={cn(
          "w-[760px] md:w-[980px]",
          reverse ? "animate-drift-rev" : "animate-drift",
        )}
        viewBox="0 0 980 160"
        fill="none"
      >
        <path
          d="M90 112c46-28 78-8 112 6 24 10 44 4 66-10 32-20 78-26 112 0 30 22 66 22 100 4 42-22 86-18 122 4 34 20 70 20 106 2 42-20 92-22 128 6"
          stroke="rgba(243,237,225,0.16)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M150 96c30-18 58-6 84 6"
          stroke="rgba(229,210,163,0.18)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M560 40c36-22 74-8 104 8"
          stroke="rgba(243,237,225,0.14)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function QrPlaceholder({
  className,
  modules = 25,
}: {
  className?: string;
  modules?: number;
}) {
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < modules; y += 1) {
    for (let x = 0; x < modules; x += 1) {
      const inFinder =
        (x < 7 && y < 7) ||
        (x >= modules - 7 && y < 7) ||
        (x < 7 && y >= modules - 7);
      if (!inFinder && (x * 7 + y * 13 + x * y) % 5 < 2) {
        cells.push({ x, y });
      }
    }
  }

  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${modules} ${modules}`}
      className={cn("block h-full w-full", className)}
      fill="none"
      aria-hidden
    >
      <rect width={modules} height={modules} fill="#fff" />
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill="currentColor"
        />
      ))}
      {finder(0, 0)}
      {finder(modules - 7, 0)}
      {finder(0, modules - 7)}
    </svg>
  );
}
