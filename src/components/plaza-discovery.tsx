"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PlazaSubjectIcon from "./plaza-subject-icon";
import type { PublicTeacherWork } from "@/lib/teacher-ecosystem";
import type { Locale } from "@/lib/i18n";
import TeacherWorkLink from "./teacher-work-link";

const tools = ["语文", "数学", "科学", "信息科技", "美术", "跨学科"];

export default function PlazaDiscovery({ works, locale, onViewRecorded }: {
  works: PublicTeacherWork[]; locale: Locale;
  onViewRecorded: (workId: string, viewCount: number) => void;
}) {
  const count = works.length;
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number; direction: number } | null>(null);
  const [interactionVersion, setInteractionVersion] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const requested = useRef(0);
  const moving = useRef(false);
  const queued = useRef<{ index: number; direction: number } | null>(null);
  const nextFrame = useRef<number | null>(null);
  const advance = useRef<(target: number, direction?: number) => void>(() => {});
  const en = locale === "en";
  const active = (turn?.to ?? index) % Math.max(1, count);
  const current = works[active];

  const goTo = useCallback((target: number, direction = 1) => {
    if (count < 2) return;
    const normalized = ((target % count) + count) % count;
    requested.current = normalized;
    if (moving.current) { queued.current = { index: normalized, direction }; return; }
    if (normalized === position.current % count) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      position.current = normalized; setIndex(normalized); return;
    }
    moving.current = true;
    setTurn({ from: position.current % count, to: normalized, direction });
  }, [count]);
  useLayoutEffect(() => { advance.current = goTo; }, [goTo]);

  useLayoutEffect(() => {
    if (!turn || !stage.current) return;
    const front = stage.current.querySelector('.plaza-stack-front');
    const outgoing = stage.current.querySelector('.plaza-stack-outgoing');
    const near = stage.current.querySelector('.plaza-stack-near');
    const far = stage.current.querySelector('.plaza-stack-far');
    const direction = turn.direction;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: () => {
        position.current = turn.to;
        setIndex(turn.to); setTurn(null); moving.current = false;
        const pending = queued.current; queued.current = null;
        if (pending && pending.index !== turn.to) {
          nextFrame.current = window.requestAnimationFrame(() => advance.current(pending.index, pending.direction));
        }
      }});
      timeline.fromTo(outgoing, { xPercent: 0, rotation: 0, scale: 1, opacity: 1 },
        { xPercent: direction * -108, y: -18, rotation: direction * -7, scale: .97, opacity: 0, duration: .42, ease: 'power2.in' }, 0);
      timeline.fromTo(front, { x: 8, y: 12, rotation: 2, scale: .975 },
        { x: 0, y: 0, rotation: 0, scale: 1, duration: .74, ease: 'elastic.out(1, 0.72)' }, .15);
      if (near) timeline.fromTo(near, { x: -5, y: 16, rotation: -2.4, scale: .96 },
        { x: 7, y: 8, rotation: 1.6, scale: .985, duration: .72, ease: 'power3.out' }, .13);
      if (far) timeline.fromTo(far, { xPercent: direction * 20, y: 14, rotation: direction * 5, scale: .94, opacity: 0 },
        { xPercent: 0, x: -5, y: 14, rotation: -2.4, scale: .96, opacity: 1, duration: .7, ease: 'power3.out' }, .25);
    }, stage);
    return () => context.revert();
  }, [turn]);

  useEffect(() => () => { if (nextFrame.current !== null) window.cancelAnimationFrame(nextFrame.current); }, []);
  useEffect(() => {
    if (count < 2 || hovered || focused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) advance.current(position.current + 1);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [count, hovered, focused, interactionVersion]);
  function step(direction: number) { setInteractionVersion(value => value + 1); goTo(requested.current + direction, direction); }

  return <section className="plaza-discovery">
    <div className="plaza-carousel" role="region" aria-roledescription={en ? "carousel" : "轮播"} aria-label={en ? "Featured cases" : "精选案例"}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => setFocused(event.target.matches(":focus-visible"))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      {current ? <div className="plaza-stack-stage" ref={stage} data-moving={!!turn}>
        {count > 2 && <div className="plaza-stack-card plaza-stack-far plaza-slide" aria-hidden="true"><SlideContents key={works[(active+2)%count].id} work={works[(active+2)%count]} /></div>}
        {count > 1 && <div className="plaza-stack-card plaza-stack-near plaza-slide" aria-hidden="true"><SlideContents key={works[(active+1)%count].id} work={works[(active+1)%count]} /></div>}
        <TeacherWorkLink workId={current.id} onViewRecorded={count => onViewRecorded(current.id, count)} className="plaza-stack-card plaza-stack-front plaza-slide" href={current.playUrl} target="_blank" rel="noopener noreferrer" aria-label={`${current.title}${en ? ' (opens in a new tab)' : '（在新标签页打开）'}`}>
          <SlideContents key={current.id} work={current} />
          <div className="plaza-slide-caption"><h2>{current.title}</h2>{current.summary && <div className="plaza-slide-summary"><p>{current.summary}</p></div>}</div>
        </TeacherWorkLink>
        {turn && works[turn.from] && <div className="plaza-stack-card plaza-stack-outgoing plaza-slide" aria-hidden="true"><SlideContents key={works[turn.from].id} work={works[turn.from]} /><div className="plaza-slide-caption"><h2>{works[turn.from].title}</h2>{works[turn.from].summary && <div className="plaza-slide-summary"><p>{works[turn.from].summary}</p></div>}</div></div>}
        {count > 1 && <div className="plaza-carousel-controls">
          <button onClick={() => step(-1)} aria-label={en ? "Previous case" : "上一个案例"}><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></button>
          <div className="plaza-carousel-dots">{works.map((work,i) => <button key={work.id} aria-label={`${en ? "View" : "查看"}：${work.title}`} aria-current={active === i ? "true" : undefined} onClick={() => { setInteractionVersion(value => value + 1); goTo(i, i < active ? -1 : 1); }} />)}</div>
          <button onClick={() => step(1)} aria-label={en ? "Next case" : "下一个案例"}><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>

        </div>}
      </div> : <div className="plaza-carousel-empty"><PlazaSubjectIcon /><h2>{en ? "More classroom inspiration, coming soon" : "下一份课堂灵感，即将登场"}</h2><p>{en ? "Discover teacher creations below." : "先去下方，发现老师们的课堂创意。"}</p></div>}
    </div>
    <aside className="plaza-tools" aria-labelledby="plaza-tools-title"><div className="plaza-tools-heading"><h2 id="plaza-tools-title">{en ? "Teaching tools" : "讲练工具"}</h2><span>{en ? "Coming soon" : "敬请期待"}</span></div>
      <div className="plaza-tools-grid">{tools.map((subject,i) => <div className="plaza-tool-placeholder" key={subject}><PlazaSubjectIcon subject={subject}/><div><strong>{en ? `Tool ${String(i+1).padStart(2,"0")}` : `讲练工具 ${String(i+1).padStart(2,"0")}`}</strong><small>{en ? "In preparation" : "正在准备中"}</small></div></div>)}</div>
    </aside>
  </section>;
}

function SlideContents({ work }: { work: PublicTeacherWork }) {
  const [failed, setFailed] = useState(false);
  return work.coverUrl && !failed ?
    // eslint-disable-next-line @next/next/no-img-element
    <img className="plaza-slide-image" src={work.coverUrl} alt="" onError={() => setFailed(true)} draggable={false} /> :
    <div className="plaza-slide-fallback"><PlazaSubjectIcon subject={work.subject || undefined} /></div>;
}
