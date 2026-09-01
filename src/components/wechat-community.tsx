"use client";

import { Component, useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

const WECHAT_GROUP_QR_URL =
  "https://linchangweb.oss-cn-beijing.aliyuncs.com/WeChatGroupPic/index.jpg";
const LOCAL_QR_URL = "/community-qr.jpg";

type QrStatus = "loading" | "ready" | "error";

class QrErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; resetKey: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

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

function freshOssQrUrl() {
  return `${WECHAT_GROUP_QR_URL}?t=${Date.now()}`;
}

export default function WeChatCommunity({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [qrSrc, setQrSrc] = useState(WECHAT_GROUP_QR_URL);
  const [qrStatus, setQrStatus] = useState<QrStatus>("loading");
  const usedFallbackRef = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { messages } = useI18n();
  const copy = messages.ui.wechat;

  const resetQr = () => {
    usedFallbackRef.current = false;
    setQrStatus("loading");
    setQrSrc(freshOssQrUrl());
  };

  const openDialog = () => {
    resetQr();
    setOpen(true);
  };

  const handleQrError = () => {
    if (!usedFallbackRef.current) {
      usedFallbackRef.current = true;
      setQrStatus("loading");
      setQrSrc(LOCAL_QR_URL);
      return;
    }
    setQrStatus("error");
  };

  const handleQrLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (event.currentTarget.naturalWidth === 0) {
      handleQrError();
      return;
    }
    setQrStatus("ready");
  };

  const qrUnavailable = (
    <div className="flex min-h-[280px] w-[280px] max-w-full flex-col items-center justify-center gap-3 px-4 py-10">
      <p className="text-[12px] leading-[1.8] text-ink-muted">{copy.qrUnavailable}</p>
      <button
        type="button"
        onClick={resetQr}
        className="rounded-full border border-line px-4 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-cinnabar/50 hover:text-cinnabar"
      >
        {copy.qrRetry}
      </button>
    </div>
  );

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
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-label={copy.ariaLabel}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 text-ink-soft transition-colors hover:text-cinnabar",
          compact ? "h-11 w-11" : "text-xs",
        )}
      >
        <WeChatIcon className="h-[17px] w-[17px]" />
        {!compact && <span>{messages.ui.header.community}</span>}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={copy.ariaLabel}
        >
          <button
            type="button"
            className="absolute inset-0 bg-night/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label={copy.closeDialog}
          />

          <div className="relative w-full max-w-sm animate-fade-up rounded-2xl border border-line bg-paper-soft p-8 text-center shadow-[0_30px_80px_rgba(22,19,16,0.4)]">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-cinnabar/50 hover:text-cinnabar"
              aria-label={copy.close}
            >
              ✕
            </button>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#07c160] text-white shadow-[0_10px_24px_rgba(7,193,96,0.3)]">
              <WeChatIcon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
              {copy.title}
            </h3>
            <p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-[1.8] text-ink-muted">
              {copy.description}
            </p>

            <div className="relative mx-auto mt-6 w-fit max-w-full overflow-hidden rounded-xl border border-line bg-white p-3">
              {qrStatus === "error" ? (
                qrUnavailable
              ) : (
                <QrErrorBoundary resetKey={qrSrc} fallback={qrUnavailable}>
                  {qrStatus === "loading" && (
                    <div
                      className="absolute inset-3 animate-pulse rounded-lg bg-paper-soft"
                      aria-hidden
                    />
                  )}
                  <Image
                    key={qrSrc}
                    src={qrSrc}
                    alt={copy.qrAlt}
                    width={280}
                    height={392}
                    unoptimized
                    onLoad={handleQrLoad}
                    onError={handleQrError}
                    className={cn(
                      "block h-auto w-[280px] max-w-full rounded-lg",
                      qrStatus === "loading" && "opacity-0",
                    )}
                    style={{ height: "auto" }}
                  />
                </QrErrorBoundary>
              )}
            </div>

            {qrStatus !== "error" && (
              <p className="mt-5 text-[10px] tracking-wider text-gold">
                {copy.instruction}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
