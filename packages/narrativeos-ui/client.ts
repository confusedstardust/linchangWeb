"use client";

export type AuthUser = {
  id: string;
  email: string | null;
  nickname: string | null;
  avatar_url: string | null;
  providers: string[];
  auth_type: "sso" | "invite";
};
export type CreditBalance = { available: number; reserved: number; consumed: number; revoked: number };
export const creditBalanceChangedEvent = "narrativeos:credits-changed";
export const authChangedEvent = "forge-auth-changed";
export const inviteStorageKey = "webgal_invite_code";
export const inviteHeaderName = "X-WebGAL-Invite-Code";

export function getStoredInviteCode() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(inviteStorageKey)?.trim() || "";
}
export function setStoredInviteCode(code: string) {
  window.localStorage.setItem(inviteStorageKey, code.trim());
}
export function clearStoredInviteCode() {
  window.localStorage.removeItem(inviteStorageKey);
}
export function inviteHeaders(): Record<string, string> {
  const code = getStoredInviteCode();
  return code ? { [inviteHeaderName]: encodeURIComponent(code) } : {};
}
export function jsonAuthHeaders(base?: HeadersInit) {
  const headers = new Headers(base);
  headers.set("Content-Type", "application/json");
  for (const [key, value] of Object.entries(inviteHeaders())) headers.set(key, value);
  return headers;
}

export async function getPortalSession<T>(url = "/api/auth/me"): Promise<T | null> {
  try {
    const response = await fetch(url, { credentials: "include", cache: "no-store" });
    return response.ok ? await response.json() as T : null;
  } catch { return null; }
}

export async function logoutSession(url: string) {
  const response = await fetch(url, { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Logout failed");
}

export function createAccountClient(options: {
  apiUrl: (path: string) => string;
  logoutUrl: () => string;
  portalSessionUrl?: string;
}) {
  async function request<T>(path: string): Promise<T> {
    const response = await fetch(options.apiUrl(path), {
      credentials: "include", cache: "no-store", headers: inviteHeaders(),
    });
    if (!response.ok) throw new Error(`Account request failed (${response.status})`);
    return await response.json() as T;
  }
  return {
    async getCurrentUser(): Promise<AuthUser | null> {
      try { return await request<AuthUser>("/auth/me"); } catch { /* Portal SSO is an optional fallback. */ }
      if (!options.portalSessionUrl) return null;
      const user = await getPortalSession<Omit<AuthUser, "avatar_url" | "auth_type"> & { avatarUrl: string | null }>(options.portalSessionUrl);
      return user ? { ...user, avatar_url: user.avatarUrl, providers: user.providers || [], auth_type: "sso" } : null;
    },
    async getCreditBalance(): Promise<CreditBalance | null> {
      try { return await request<CreditBalance>("/credits/balance"); } catch { return null; }
    },
    async getSubscription(): Promise<string> {
      const data = await request<{ subscription?: { name?: string } | null }>("/payments/subscription");
      return data.subscription?.name || "Free";
    },
    async isAdmin(): Promise<boolean> {
      try { await request("/admin/me"); return true; } catch { return false; }
    },
    async logout(user: AuthUser) {
      if (user.auth_type === "sso") await logoutSession(options.logoutUrl());
      clearStoredInviteCode();
      window.dispatchEvent(new Event(authChangedEvent));
    },
  };
}

export type AccountClient = ReturnType<typeof createAccountClient>;
