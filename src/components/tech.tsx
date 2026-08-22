import { techLayers, techNotes, type TechLayer } from "@/lib/content";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import SplitHeading from "@/components/split-heading";
import { InkBlob, SectionLabel } from "@/components/decorations";

function chipClass(tone: TechLayer["tone"]) {
  switch (tone) {
    case "cinnabar":
      return "border-cinnabar/50 text-[#f0d8dc] hover:border-cinnabar";
    case "gold":
      return "border-gold/40 text-gold-soft hover:border-gold";
    default:
      return "border-white/15 text-[#c9c1b8] hover:border-gold";
  }
}

export default function Tech() {
  return (
    <section
      id="tech"
      className="relative overflow-hidden border-t border-line bg-paper-deep py-10 md:py-32"
    >
      <InkBlob className="-left-24 bottom-10 h-96 w-96" color="rgba(156,51,64,0.1)" />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-14 px-5 md:px-[6vw] lg:grid-cols-[0.72fr_1.28fr] lg:gap-[7vw]">
        <Reveal>
          <SectionLabel>TECHNOLOGY FRAMEWORK</SectionLabel>
          <SplitHeading
            lines={["一套围绕课堂目标", "组织的生成架构。"]}
            className="mt-5 font-serif text-[2.15rem] font-medium leading-[1.35] text-ink sm:text-4xl md:whitespace-nowrap md:text-[3.4rem]"
          />
          <p className="mt-6 max-w-[430px] text-[13px] leading-[1.95] text-ink-muted">
            从教学材料理解，到叙事规划、内容生成与课堂交付，NarrativeOS
            以分层工作流保持内容的一致性、可编辑性和教学可控性。
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {techNotes.map((note) => (
              <span
                key={note}
                className="cursor-default rounded-full border border-cinnabar/25 bg-white/50 px-3 py-1.5 text-[9px] text-cinnabar transition-all duration-300 hover:-translate-y-0.5 hover:bg-cinnabar hover:text-paper-soft"
              >
                {note}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="relative overflow-hidden rounded-2xl bg-night p-6 text-paper-soft shadow-[0_26px_60px_rgba(47,37,27,0.18)] md:p-8"
            style={{
              backgroundImage:
                "radial-gradient(rgba(229,210,163,0.06) 0.7px, transparent 0.7px)",
              backgroundSize: "18px 18px",
            }}
          >
            <span
              className="pointer-events-none absolute inset-x-0 h-20 animate-scan bg-gradient-to-b from-transparent via-gold-soft/10 to-transparent"
              aria-hidden
            />

            <div className="relative flex items-center justify-between border-b border-white/15 pb-5">
              <strong className="font-serif text-lg">NarrativeOS Architecture</strong>
              <span className="text-[8px] tracking-[0.16em] text-gold-soft">
                FROM MATERIAL TO EXPERIENCE
              </span>
            </div>

            <div className="relative">
              {techLayers.map((layer) => (
                <div
                  key={layer.name}
                  className="group grid grid-cols-1 gap-2 border-b border-white/10 py-5 transition-all duration-300 last:border-b-0 hover:bg-white/[0.04] md:grid-cols-[112px_1fr] md:items-center md:gap-4 md:px-2 md:group-hover:px-4"
                >
                  <div className="font-serif text-[11px] text-gold-soft">
                    {layer.name}
                    <small className="mt-1 block text-[8px] tracking-[0.1em] text-[#817970]">
                      {layer.nameEn}
                    </small>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.chips.map((chip) => (
                      <span
                        key={chip}
                        className={cn(
                          "rounded border bg-white/5 px-2.5 py-1.5 text-[9px] transition-transform duration-300 hover:-translate-y-0.5",
                          chipClass(layer.tone),
                        )}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
