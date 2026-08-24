"use client";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

function MarqueeRow({ subjects, reverse = false }: { subjects: string[]; reverse?: boolean }) {
  const items = reverse ? [...subjects].reverse() : subjects;
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((subject) => (
        <span key={subject} className="flex items-center">
          <span
            className={cn(
              "px-7 font-serif text-lg md:px-9 md:text-xl",
              reverse ? "text-ink/50" : "text-ink/70",
            )}
          >
            {subject}
          </span>
          <span className="h-1 w-1 rounded-full bg-cinnabar/50" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "flex w-max",
        reverse ? "animate-marquee-rev" : "animate-marquee",
      )}
    >
      {row}
      <div aria-hidden>{row}</div>
    </div>
  );
}

export default function SubjectMarquee() {
  const { messages } = useI18n();
  const copy = messages.ui.subjects;
  const localizedSubjects = messages.content.subjects;
  return (
    <div
      className="marquee-mask relative overflow-hidden border-y border-line bg-paper-soft py-4 md:py-5"
      aria-label={copy.ariaLabel}
    >
      <MarqueeRow subjects={localizedSubjects} />
      <div className="mt-2 border-t border-line/60 pt-2">
        <MarqueeRow subjects={localizedSubjects} reverse />
      </div>
      <span
        className="vertical-rl pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 font-brush text-[10px] tracking-[0.3em] text-cinnabar/70 md:block"
        aria-hidden
      >
        {copy.firstMark}
      </span>
      <span
        className="vertical-rl pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 font-brush text-[10px] tracking-[0.3em] text-gold md:block"
        aria-hidden
      >
        {copy.secondMark}
      </span>
    </div>
  );
}
