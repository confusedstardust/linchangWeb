const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
export const workspaceSidebarWidth = 204;

export function portalHref(path: string, origin: string, configuredOrigin?: string) {
  if (configuredOrigin?.trim()) return new URL(path, configuredOrigin.trim()).href;
  if (!origin) return path;
  const url = new URL(origin);
  if (url.port !== "3001") return path;
  url.port = loopbackHosts.has(url.hostname) ? "3000" : "3002";
  return new URL(path, url).href;
}

export function workbenchHref(path: string, origin: string, configuredBase?: string) {
  if (configuredBase?.trim()) return configuredBase.trim().replace(/\/+$/, "") + path;
  if (origin) {
    const url = new URL(origin);
    const local = loopbackHosts.has(url.hostname) && url.port === "3000";
    if (local || url.port === "3002") {
      url.port = "3001";
      return new URL(local ? path : "/narrativeos" + path, url).href;
    }
  }
  return "/narrativeos" + path;
}
