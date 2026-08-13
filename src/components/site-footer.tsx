import { navLinks } from "@/lib/content";
import { SealMark } from "@/components/decorations";

export default function SiteFooter() {
  return (
    <footer className="bg-[#151412] px-5 py-10 text-paper-soft md:px-[6vw]">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-7 md:flex-row md:items-center md:justify-between">
        <a href="#top" className="flex items-center gap-3">
          <SealMark char="叙" size={34} />
          <span className="flex flex-col gap-0.5">
            <strong className="font-serif text-sm">临场</strong>
            <small className="text-[8px] tracking-[0.2em] text-[#8f8880]">
              NARRATIVEOS
            </small>
          </span>
        </a>

        <p className="text-[10px] text-[#8f8880]">AI 叙事课堂生成平台</p>

        <nav className="flex flex-wrap gap-6" aria-label="页脚导航">
          {navLinks.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] text-[#b5ada5] transition-colors hover:text-gold-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <small className="text-[10px] text-[#8f8880]">© 2026 NarrativeOS</small>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1320px] items-center gap-3 text-[9px] tracking-[0.18em] text-[#6d665f]">
        <span className="h-px flex-1 bg-white/10" />
        让每一次选择，都成为理解的入口
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </footer>
  );
}
