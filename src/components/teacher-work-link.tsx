"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  workId: string;
  onViewRecorded?: (viewCount: number) => void;
};

/** A work link is the single client-side boundary for recording genuine opens. */
export default function TeacherWorkLink({ workId, onViewRecorded, onClick, onAuxClick, ...props }: Props) {
  function sendView() {
    void fetch("/api/teacher-ecosystem/works/engagement", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ workId }),
      credentials: "same-origin",
      keepalive: true,
    }).then(async response => {
      if (!response.ok || !onViewRecorded) return;
      const payload = await response.json() as { viewCount?: unknown };
      if (typeof payload.viewCount === "number") onViewRecorded(payload.viewCount);
    }).catch(() => {
      // Opening the work must not depend on analytics availability.
    });
  }

  function recordView(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    sendView();
  }

  function recordMiddleClick(event: MouseEvent<HTMLAnchorElement>) {
    onAuxClick?.(event);
    if (!event.defaultPrevented && event.button === 1) sendView();
  }

  return <a {...props} onClick={recordView} onAuxClick={recordMiddleClick} />;
}
