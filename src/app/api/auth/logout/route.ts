import { jsonOk, sessionCookieValue } from "@/lib/auth/http";
import { clearSessionCookie, revokeSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const token = await sessionCookieValue();
  await revokeSession(token);
  return clearSessionCookie(jsonOk());
}
