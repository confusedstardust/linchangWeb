"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M9.5 3C5.36 3 2 5.86 2 9.38c0 1.99 1.02 3.76 2.62 4.93l-.66 2.4 2.72-1.44c.9.25 1.85.38 2.82.38.13 0 .26 0 .39-.01a5.7 5.7 0 0 1-.39-2.06c0-3.17 2.9-5.74 6.5-5.74h.18C15.75 4.84 12.82 3 9.5 3Zm-2.2 4.12a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
      <path d="M22 14.2c0-2.82-2.63-5.1-5.87-5.1s-5.87 2.28-5.87 5.1 2.63 5.1 5.87 5.1c.68 0 1.33-.1 1.93-.28l2.26 1.2-.54-2c1.23-1 2.22-2.48 2.22-4.02Zm-7.57.92a.84.84 0 1 1 0-1.68.84.84 0 0 1 0 1.68Zm3.4 0a.84.84 0 1 1 0-1.68.84.84 0 0 1 0 1.68Z" />
    </svg>
  );
}

export default function WeChatCommunity({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="扫码进官方社群"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 text-ink-soft transition-colors hover:text-cinnabar",
          compact ? "h-11 w-11" : "text-xs",
        )}
      >
        <WeChatIcon className="h-[17px] w-[17px]" />
        {!compact && <span>官方社群</span>}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label="扫码进官方社群"
        >
          <button
            type="button"
            className="absolute inset-0 bg-night/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="关闭弹窗"
          />

          <div className="relative w-full max-w-sm animate-fade-up rounded-2xl border border-line bg-paper-soft p-8 text-center shadow-[0_30px_80px_rgba(22,19,16,0.4)]">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-cinnabar/50 hover:text-cinnabar"
              aria-label="关闭"
            >
              ✕
            </button>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#07c160] text-white shadow-[0_10px_24px_rgba(7,193,96,0.3)]">
              <WeChatIcon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
              扫码进官方社群
            </h3>
            <p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-[1.8] text-ink-muted">
              与老师们一起共创叙事课堂，第一时间获取新课例与玩法。
            </p>

            <div className="mx-auto mt-6 w-fit max-w-full rounded-xl border border-line bg-white p-3">
              <Image
                src="/community-qr.jpg"
                alt="NarrativeOS 用户内测微信群二维码"
                width={280}
                height={392}
                className="block h-auto w-[280px] max-w-full rounded-lg"
              />
            </div>

            <p className="mt-5 text-[10px] tracking-wider text-gold">
              打开微信「扫一扫」加入
            </p>
          </div>
        </div>
      )}
    </>
  );
}
