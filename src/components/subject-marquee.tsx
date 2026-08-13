import { subjects } from "@/lib/content";
import { cn } from "@/lib/utils";

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
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
  return (
    <div
      className="marquee-mask relative overflow-hidden border-y border-line bg-paper-soft py-4 md:py-5"
      aria-label="支持的学科"
    >
      <MarqueeRow />
      <div className="mt-2 border-t border-line/60 pt-2">
        <MarqueeRow reverse />
      </div>
      <span
        className="vertical-rl pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 font-brush text-[10px] tracking-[0.3em] text-cinnabar/70 md:block"
        aria-hidden
      >
        文以载道
      </span>
      <span
        className="vertical-rl pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 font-brush text-[10px] tracking-[0.3em] text-gold md:block"
        aria-hidden
      >
        学以致用
      </span>
    </div>
  );
}
