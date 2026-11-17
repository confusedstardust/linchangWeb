"use client";

import { useEffect, useRef, useState } from "react";
import { CloseButton } from "@narrativeos/ui/close-button";
import { workbenchHref } from "@narrativeos/ui/app-links";
import { useBrowserOrigin } from "@narrativeos/ui/workspace-sidebar";
import type { Locale } from "@/lib/i18n";
import styles from "./portal-support.module.css";

type Panel = "questions" | "announcements";

export function usePortalSupport(locale: Locale) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const origin = useBrowserOrigin();
  const copy = {
    "zh-CN": { announcements: "公告", questions: "提问与答疑", close: "关闭" },
    "zh-Hant": { announcements: "公告", questions: "提問與答疑", close: "關閉" },
    en: { announcements: "Announcements", questions: "Questions and answers", close: "Close" },
  }[locale];
  const src = panel ? workbenchHref(`/support/embed?panel=${panel}`, origin, process.env.NEXT_PUBLIC_WORKBENCH_URL) : "";

  useEffect(() => {
    if (!src) return;
    const expectedOrigin = new URL(src, location.origin).origin;
    function handleMessage(event: MessageEvent) {
      if (event.origin === expectedOrigin && event.source === frame.current?.contentWindow &&
          event.data === "narrativeos:close-support") dialog.current?.close();
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [src]);

  function open(value: Panel) {
    setPanel(value);
    dialog.current?.showModal();
  }

  return {
    openQuestions: () => open("questions"),
    openAnnouncements: () => open("announcements"),
    announcementsLabel: copy.announcements,
    popup: <dialog ref={dialog} className={styles.dialog} aria-label={panel ? copy[panel] : "NarrativeOS"}
      onClose={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.surface}>
        <CloseButton className={styles.close} aria-label={copy.close} onClick={() => dialog.current?.close()} />
        {panel && <iframe ref={frame} className={styles.frame} title={copy[panel]} src={src} />}
      </div>
    </dialog>,
  };
}
