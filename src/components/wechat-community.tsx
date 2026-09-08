"use client";

import { Component, useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLenis } from "lenis/react";
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
  const lenis = useLenis();
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

  const closeDialog = () => setOpen(false);

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
    <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-3 px-4 py-8">
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
    lenis?.stop();
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lenis]);

  const dialog = open
    ? createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={copy.ariaLabel}
          onClick={closeDialog}
        >
          <div className="absolute inset-0 bg-night/70 backdrop-blur-[6px]" aria-hidden />

          <div
            className="relative z-10 flex max-h-[min(88svh,36rem)] w-full max-w-[22rem] animate-fade-up flex-col overflow-hidden rounded-t-[1.75rem] border border-line bg-paper-soft shadow-[0_24px_64px_rgba(22,19,16,0.38)] sm:rounded-[1.75rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDialog}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper-deep hover:text-cinnabar"
              aria-label={copy.close}
            >
              ✕
            </button>

            <div className="overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#07c160] text-white">
                  <WeChatIcon className="h-4 w-4" />
                </span>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {copy.title}
                </h3>
              </div>
              <p className="mx-auto mt-2 max-w-[16.5rem] text-[11px] leading-[1.75] text-ink-muted">
                {copy.description}
              </p>

              <div className="relative mx-auto mt-4 w-fit max-w-full overflow-hidden rounded-2xl border border-line bg-white p-2.5">
                {qrStatus === "error" ? (
                  qrUnavailable
                ) : (
                  <QrErrorBoundary resetKey={qrSrc} fallback={qrUnavailable}>
                    {qrStatus === "loading" && (
                      <div
                        className="absolute inset-2.5 animate-pulse rounded-xl bg-paper-soft"
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
                        "mx-auto block h-auto max-h-[min(42svh,260px)] w-auto max-w-[200px] rounded-xl object-contain",
                        qrStatus === "loading" && "opacity-0",
                      )}
                    />
                  </QrErrorBoundary>
                )}
              </div>

              {qrStatus !== "error" && (
                <p className="mt-3 pb-1 text-[10px] tracking-wider text-gold">
                  {copy.instruction}
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

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
      {dialog}
    </>
  );
}
