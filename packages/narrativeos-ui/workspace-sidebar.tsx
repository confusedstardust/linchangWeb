"use client";

import { Grid2X2, Images, Menu, PanelLeft, PenLine, Sparkles } from "lucide-react";
import { useId, useState, useSyncExternalStore, type MouseEventHandler, type ReactNode } from "react";
import type { AccountLinkComponent } from "./account-menu";
import styles from "./workspace-sidebar.module.css";

const subscribeToOrigin = () => () => {};
const browserOrigin = () => window.location.origin;
const serverOrigin = () => "";

export function useBrowserOrigin() {
  return useSyncExternalStore(subscribeToOrigin, browserOrigin, serverOrigin);
}

const sidebarBreakpoint = "(min-width: 801px)";
function subscribeToBreakpoint(callback: () => void) {
  const media = matchMedia(sidebarBreakpoint);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const desktopSnapshot = () => matchMedia(sidebarBreakpoint).matches;
const desktopOnServer = () => true;

export function useWorkspaceSidebar() {
  const desktop = useSyncExternalStore(subscribeToBreakpoint, desktopSnapshot, desktopOnServer);
  const [open, setOpen] = useState<boolean>();
  return { expanded: open ?? desktop, desktop, setOpen };
}

type SidebarTarget =
  | { href: string; external?: boolean; current?: boolean; onClick?: MouseEventHandler<HTMLAnchorElement> }
  | { href?: never; disabled?: boolean; onClick?: MouseEventHandler<HTMLButtonElement> };

type SidebarItem = SidebarTarget & { label: string; icon: ReactNode };

const primaryNavigation = [
  { id: "discover", icon: Grid2X2, labels: ["发现灵感", "發現靈感", "Discover"] },
  { id: "create", icon: Sparkles, labels: ["我的创作", "我的創作", "My creations"] },
  { id: "works", icon: PenLine, labels: ["我的作品", "我的作品", "My works"] },
  { id: "assets", icon: Images, labels: ["素材广场", "素材廣場", "Asset plaza"] },
] as const;
type PrimaryEntry = (typeof primaryNavigation)[number]["id"];
type PrimaryLinks = Record<PrimaryEntry, Extract<SidebarTarget, { href: string }>>;

export function WorkspaceSidebar({
  className, expanded, onToggle, toggleLabel, ariaLabel, brandHref, tagline,
  logo, links, locale = "zh-CN", secondaryLinks, action, children, promo, footer, LinkComponent = "a",
}: {
  className?: string;
  expanded: boolean;
  onToggle: () => void;
  toggleLabel: string;
  ariaLabel: string;
  brandHref: string;
  tagline: string;
  logo: (size: number) => ReactNode;
  links: PrimaryLinks;
  locale?: "zh-CN" | "zh-Hant" | "en";
  secondaryLinks?: SidebarItem[];
  action?: SidebarItem;
  children?: ReactNode;
  promo?: SidebarTarget & { title: string; description: string };
  footer: ReactNode;
  LinkComponent?: AccountLinkComponent | "a";
}) {
  const navigationId = useId();

  function control(target: SidebarTarget, content: ReactNode, className: string, label?: string) {
    const props = { className, "aria-label": label, title: label };
    if (target.href !== undefined) {
      const Anchor = target.external ? "a" : LinkComponent;
      return <Anchor {...props} href={target.href} onClick={target.onClick}
        aria-current={target.current ? "page" : undefined}>{content}</Anchor>;
    }
    return <button {...props} type="button" disabled={target.disabled} onClick={target.onClick}>{content}</button>;
  }

  const item = (entry: SidebarItem) => control(entry, <>{entry.icon}<span>{entry.label}</span></>, styles.item, entry.label);

  return <aside className={[styles.root, className].filter(Boolean).join(" ")}
    data-workspace-sidebar data-collapsed={!expanded} aria-label={ariaLabel}>
    <div className={styles.heading}>
      <LinkComponent href={brandHref} className={styles.brand} aria-label="NarrativeOS">
        {logo(34)}<span><strong>NarrativeOS</strong><small>{tagline}</small></span>
      </LinkComponent>
      <button type="button" className={styles.toggle} onClick={onToggle} aria-label={toggleLabel}
        title={toggleLabel} aria-expanded={expanded} aria-controls={navigationId}>
        {expanded ? <PanelLeft aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </div>
    <nav id={navigationId} className={styles.links} aria-label={ariaLabel}>
      {primaryNavigation.map(({ id, icon: Icon, labels }) => (
        <div className={styles.row} key={id}>{item({
          ...links[id], label: labels[locale === "en" ? 2 : locale === "zh-Hant" ? 1 : 0],
          icon: <Icon aria-hidden="true" />,
        })}</div>
      ))}
    </nav>
    {secondaryLinks && <div className={`${styles.links} ${styles.secondary}`}>
      {secondaryLinks.map(entry => <div className={styles.row} key={entry.label}>{item(entry)}</div>)}
    </div>}
    {action && <div className={styles.action}>{item(action)}</div>}
    {children && <div className={styles.extra}>{children}</div>}
    <div className={styles.bottom}>
      {promo && control(promo, <><strong>{promo.title}</strong><span>{promo.description}</span>{logo(64)}</>, styles.promo)}
      <div className={styles.footer}>{footer}</div>
    </div>
  </aside>;
}
