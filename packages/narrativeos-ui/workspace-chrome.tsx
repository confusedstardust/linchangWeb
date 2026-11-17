"use client";

import { ChevronLeft } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { workspaceSidebarWidth } from "./app-links";
import styles from "./workspace-chrome.module.css";

export function WorkspaceFrame({ sidebar, header, children, footer }: {
  sidebar?: ReactNode; header?: ReactNode; children: ReactNode; footer?: ReactNode;
}) {
  return <div data-workspace-frame className={styles.frame} style={{ "--workspace-sidebar-width": `${workspaceSidebarWidth}px` } as CSSProperties}>
    {sidebar}
    <div className={styles.body}>
      {header}
      <div className={styles.content}>{children}</div>
      {footer}
    </div>
  </div>;
}

type BackProps = {
  fallback: string;
  siblingApp?: string;
  label?: string;
  ready?: boolean;
  confirmNavigation?: () => boolean | Promise<boolean>;
};

export function WorkspaceBack({ fallback, siblingApp, label = "返回上一页", ready = true, confirmNavigation }: BackProps) {
  async function back() {
    if (confirmNavigation && !await confirmNavigation()) return;
    const navigation = (window as Window & { navigation?: { canGoBack: boolean } }).navigation;
    const referrer = document.referrer && new URL(document.referrer).origin;
    const siblingOrigin = siblingApp && new URL(siblingApp, location.origin).origin;
    const fromProduct = referrer && (referrer === location.origin || referrer === siblingOrigin);
    if (navigation?.canGoBack || (fromProduct && history.length > 1)) history.back();
    else location.assign(fallback);
  }

  return <button type="button" className={styles.back} disabled={!ready} onClick={back}><ChevronLeft aria-hidden="true" size={17} />{label}</button>;
}

export function WorkspaceHeader({ title, subtitle, logo, back, actions }: {
  title: ReactNode; subtitle?: ReactNode; logo: ReactNode; back?: BackProps; actions?: ReactNode;
}) {
  return <header className={styles.header} data-workspace-header>
    <div className={styles.brand}>
      <span className={styles.brandLogo} data-workspace-header-logo>{logo}</span>
      <span><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</span>
    </div>
    {(back || actions) && <div className={styles.actions}>{back && <WorkspaceBack {...back} />}{actions}</div>}
  </header>;
}

export const workspaceContactHref = "mailto:contactus@narrativeos.cn";

export function WorkspaceFooter({ brand, logo, homeHref, cases, community, announcements, navLabel, contactLabel = "联系我们" }: {
  brand: string; logo: ReactNode; homeHref: string; navLabel: string;
  cases: { href: string; label: string };
  community: () => void;
  contactLabel?: string;
  announcements: { label: string; onClick: () => void };
}) {
  return <footer className={styles.footer} data-workspace-footer>
    <div className={styles.footerInner}>
      <a className={styles.footerBrand} href={homeHref}>{logo}<span><strong>{brand}</strong><small>NARRATIVEOS</small></span></a>
      <div className={styles.footerLinks}>
        <nav aria-label={navLabel}>
          <a href={cases.href}>{cases.label}</a>
          <button type="button" onClick={community}>Q&amp;A</button>
          <button type="button" onClick={announcements.onClick}>{announcements.label}</button>
          <a href={workspaceContactHref}>{contactLabel}</a>
        </nav>
        <div className={styles.legal}>
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">津ICP备2025028636号-2</a>
          <small>© 2026 NarrativeOS</small>
        </div>
      </div>
    </div>
  </footer>;
}
