"use client";

import { WORKBENCH_URL } from "@/lib/content";
export type AuthUser = { id: string; email: string | null; nickname: string | null; avatar_url: string | null; auth_type: "sso" | "invite" };
export type CreditBalance = { available: number; reserved: number; consumed: number; revoked: number };
export const creditBalanceChangedEvent = "narrativeos:credits-changed";
export function workbenchHref(path: string) { return `${WORKBENCH_URL.replace(/\/$/, "")}${path}`; }
export function withBasePath(path: string) { return path.replace("/api/forge/", "/api/workbench-account/"); }
export function jsonAuthHeaders(): Record<string, string> {
  const code = typeof window !== "undefined" ? localStorage.getItem("webgal_invite_code") : null;
  return code ? { "X-WebGAL-Invite-Code": encodeURIComponent(code) } : {};
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/workbench-account/auth/me", { credentials: "include", cache: "no-store", headers: jsonAuthHeaders() });
    if (response.ok) return await response.json() as AuthUser;
  } catch { /* Use the same SSO session if the workbench service is unavailable. */ }
  try {
    const response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
    if (!response.ok) return null;
    const user = await response.json();
    return { ...user, avatar_url: user.avatarUrl, auth_type: "sso" };
  } catch { return null; }
}
export async function getCreditBalance(): Promise<CreditBalance | null> {
  try {
    const response = await fetch("/api/workbench-account/credits/balance", { credentials: "include", cache: "no-store" });
    return response.ok ? await response.json() as CreditBalance : null;
  } catch { return null; }
}
export function ssoLoginUrl() { return typeof window === "undefined" ? "/login/" : new URL(`/login/?next=${encodeURIComponent(location.href)}`, location.origin).href; }
export function clearStoredInviteCode() { localStorage.removeItem("webgal_invite_code"); }
export function teacherResourcePlazaUrl() { return "/teacher-ecosystem/"; }
