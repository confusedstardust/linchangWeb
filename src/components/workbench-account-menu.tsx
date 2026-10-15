"use client";

import type { AnchorHTMLAttributes } from "react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { teacherResourcePlazaUrl, clearStoredInviteCode, getCurrentUser, getCreditBalance, ssoLoginUrl, type AuthUser, type CreditBalance } from "@/lib/workbench-account";
import { withBasePath, workbenchHref, creditBalanceChangedEvent, jsonAuthHeaders } from "@/lib/workbench-account";

function Icon({ kind }: { kind: "person" | "works" | "assets" | "logout" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "person" ? <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></> : kind === "works" ? <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></> : kind === "assets" ? <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></> : <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M9 12h12m-4-4 4 4-4 4" /></>}
  </svg>;
}

export function WorkbenchAccountMenu({ className = "", tour, includeAdmin = true }: { className?: string; tour?: string; includeAdmin?: boolean }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [subscription, setSubscription] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const titleId = useId();
  const refreshAccount = useRef<(force?: boolean) => void>(() => {});

  useEffect(() => {
    let active = true;
    void getCurrentUser().then((value) => { if (active) { setUser(value); setLoaded(true); } });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user?.auth_type !== "sso") { refreshAccount.current = () => {}; return; }
    let active = true;
    let inFlight = false;
    let queued = false;
    let balanceAt = 0;
    let subscriptionAt = 0;
    const refresh = (force = false) => {
      if (!active) return;
      if (inFlight) { if (force) queued = true; return; }
      const now = Date.now();
      const needBalance = force || now - balanceAt >= 60_000;
      const needSubscription = force || now - subscriptionAt >= 60_000;
      if (!needBalance && !needSubscription) return;
      inFlight = true;
      if (needBalance) setBalanceLoading(true);
      const balanceRequest = needBalance ? getCreditBalance().then(value => {
        if (active && value) { setBalance(value); balanceAt = Date.now(); }
      }) : Promise.resolve();
      const subscriptionRequest = needSubscription ? fetch(withBasePath("/api/forge/payments/subscription"), { credentials: "include", cache: "no-store" })
        .then(async response => { if (!response.ok) throw new Error("subscription unavailable"); return response.json(); })
        .then(data => { if (active) { setSubscription(data.subscription?.name || "Free"); subscriptionAt = Date.now(); } }) : Promise.resolve();
      void Promise.allSettled([balanceRequest, subscriptionRequest]).then(() => {
        inFlight = false;
        if (!active) return;
        setBalanceLoading(false);
        if (queued) { queued = false; refresh(true); }
      });
    };
    refreshAccount.current = refresh;
    // Prefetch once after login; reopening uses the last good values.
    refresh();
    const onChanged = () => refresh(true);
    window.addEventListener(creditBalanceChangedEvent, onChanged);
    return () => { active = false; refreshAccount.current = () => {}; window.removeEventListener(creditBalanceChangedEvent, onChanged); };
  }, [user?.id, user?.auth_type]);

  useEffect(() => { if (open) refreshAccount.current(); }, [open]);

  if (loaded && !user) return <a className="plaza-account-trigger" href={ssoLoginUrl()} data-tour={tour}>登录</a>;
  const name = user?.nickname || user?.email?.split("@")[0] || "创作者";
  const avatar = user?.avatar_url && !avatarFailed
    ? <img src={user.avatar_url} alt="" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
    : <span>{name.slice(0, 1).toUpperCase()}</span>;

  async function logout() {
    if (!user || loggingOut) return;
    setLoggingOut(true); setLogoutError("");
    try {
      if (user.auth_type === "sso") {
        const url = new URL("/api/auth/logout", ssoLoginUrl());
        const response = await fetch(url, { method: "POST", credentials: "include" });
        if (!response.ok) throw new Error("登出失败，请稍后重试");
      }
      clearStoredInviteCode();
      setUser(null); setOpen(false);
      window.location.reload();
    } catch { setLogoutError("登出失败，请稍后重试"); setLoggingOut(false); }
  }

  return <div className="plaza-account-root">
      <button type="button" popoverTarget={`${titleId}-popover`} className={`plaza-account-trigger ${className}`} data-tour={tour} disabled={!loaded} aria-label={loaded ? `${name}的账户` : "正在加载账户"}>
        <span className="plaza-account-trigger-avatar">{loaded ? avatar : <Icon kind="person" />}</span>
        <span>账户</span><svg className="plaza-account-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
    <div id={`${titleId}-popover`} popover="auto" onToggle={(event) => { setOpen(event.newState === "open"); setLogoutError(""); }} className="plaza-account-popover" aria-labelledby={titleId}>
      <div className="plaza-account-profile">
        <div className="plaza-account-profile-top"><button type="button" className="plaza-account-close" aria-label="关闭账户浮窗" onClick={() => document.getElementById(`${titleId}-popover`)?.hidePopover()}>×</button></div>
        <div className="plaza-account-identity"><span className="plaza-account-avatar">{avatar}<span className="plaza-account-status-dot" role="img" aria-label={user?.auth_type === "invite" ? "内测访问已登录" : "已登录 NarrativeOS"} title={user?.auth_type === "invite" ? "内测访问已登录" : "已登录 NarrativeOS"} /></span><div><h2 id={titleId}>{name}</h2><p>{user?.email || (user?.auth_type === "invite" ? "邀请码身份" : "NarrativeOS 创作者")}</p></div></div>
        {user?.auth_type === "sso" ? <span className="plaza-account-plan-label" aria-label="当前订阅">{subscription || "…"}</span> : null}
      </div>
      {user?.auth_type === "sso" ? <section className="plaza-account-credits" aria-label="账户积分" aria-busy={balanceLoading}>
        <div><span>{balance && balance.available < 0 ? "积分余额 · 欠费" : "可用积分"}</span><strong>{balance ? balance.available.toLocaleString("zh-CN") : balanceLoading ? "…" : "—"}</strong></div><Link className="plaza-account-recharge" href="/recharge" onClick={() => setOpen(false)}>充值</Link>
        {!balance || balance.reserved > 0 ? <p>{!balance && balanceLoading ? "正在获取积分…" : balance ? `${balance.reserved.toLocaleString("zh-CN")} 积分正在任务中使用` : "积分暂时无法获取，请稍后重新打开"}</p> : null}
      </section> : null}
      <nav className="plaza-account-actions" aria-label="我的空间">
        <Link href="/history" onClick={() => setOpen(false)}><Icon kind="works" /><span>我的作品</span><b aria-hidden="true">›</b></Link>
        <Link href="/assets" onClick={() => setOpen(false)}><Icon kind="assets" /><span>素材库</span><b aria-hidden="true">›</b></Link>
        <a href={teacherResourcePlazaUrl()} aria-current="page" onClick={() => document.getElementById(`${titleId}-popover`)?.hidePopover()}><Icon kind="assets" /><span>教师资源广场</span><b aria-hidden="true">›</b></a>
        <Link href="/my-assets" onClick={() => setOpen(false)}><Icon kind="assets" /><span>我的资产</span><b aria-hidden="true">›</b></Link>
        {includeAdmin ? <AdminLink onClick={() => setOpen(false)}><Icon kind="person" /><span>平台管理</span><b aria-hidden="true">›</b></AdminLink> : null}
      </nav>
      <div className="plaza-account-footer"><div><span>账号 ID</span><code>{user?.id}</code></div><button className="plaza-account-logout" type="button" disabled={loggingOut} onClick={() => void logout()} aria-label="登出账户"><Icon kind="logout" /><span>{loggingOut ? "登出中…" : "登出"}</span></button></div>
      {logoutError ? <span className="plaza-account-copy-status" role="alert">{logoutError}</span> : null}
    </div>
  </div>;
}

function Link({ href = "/", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={workbenchHref(href)} {...props} />;
}
function AdminLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/workbench-account/admin/me", { credentials: "include", headers: jsonAuthHeaders() }).then(response => { if (active) setAllowed(response.ok); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return allowed ? <Link href="/admin" onClick={onClick}>{children}</Link> : null;
}
