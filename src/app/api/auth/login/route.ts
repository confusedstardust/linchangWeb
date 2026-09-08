import { getPrisma } from "@/lib/db";
import { isValidEmail, normalizeEmail } from "@/lib/auth/config";
import { verifyPassword } from "@/lib/auth/crypto";
import { applySessionCookie, createUserSession, toAuthUser } from "@/lib/auth/session";
import { configErrorResponse, jsonError, jsonOk } from "@/lib/auth/http";

export const dynamic = "force-dynamic";

const INVALID = "邮箱或密码错误";

export async function POST(request: Request) {
  try {
    let body: { email?: string; password?: string } = {};
    try {
      body = (await request.json()) as { email?: string; password?: string };
    } catch {
      return jsonError(INVALID, 400);
    }

    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";
    if (!isValidEmail(email) || !password) {
      return jsonError(INVALID, 400);
    }

    const user = await getPrisma().user.findUnique({
      where: { email },
      include: { accounts: { select: { provider: true } } },
    });

    if (!user?.passwordHash || !user.emailVerifiedAt) {
      return jsonError(INVALID, 401);
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      return jsonError(INVALID, 401);
    }

    const authUser = toAuthUser(user);
    const token = await createUserSession(authUser);
    return applySessionCookie(jsonOk({ user: authUser }), token);
  } catch (error) {
    console.error("[auth] login failed", error);
    return configErrorResponse(error);
  }
}
