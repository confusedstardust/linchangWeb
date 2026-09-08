import { getPrisma } from "@/lib/db";
import { isValidEmail, normalizeEmail } from "@/lib/auth/config";
import { consumeEmailCode } from "@/lib/auth/otp";
import { applySessionCookie, createUserSession, toAuthUser } from "@/lib/auth/session";
import { configErrorResponse, jsonError, jsonOk } from "@/lib/auth/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let body: { email?: string; code?: string } = {};
    try {
      body = (await request.json()) as { email?: string; code?: string };
    } catch {
      return jsonError("验证码无效或已过期", 400);
    }
    const email = normalizeEmail(body.email ?? "");
    const code = (body.code ?? "").trim();

    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      return jsonError("验证码无效或已过期", 400);
    }

    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({
      where: { email },
      include: { accounts: { select: { provider: true } } },
    });
    if (!existing) {
      return jsonError("该邮箱尚未注册，请先注册", 404);
    }

    if (!(await consumeEmailCode(email, code))) {
      return jsonError("验证码无效或已过期", 400);
    }

    const user = await prisma.user.update({
      where: { id: existing.id },
      data: { emailVerifiedAt: existing.emailVerifiedAt ?? new Date() },
      include: { accounts: { select: { provider: true } } },
    });

    const authUser = toAuthUser(user);
    const token = await createUserSession(authUser);
    return applySessionCookie(jsonOk({ user: authUser }), token);
  } catch (error) {
    console.error("[auth] verify failed", error);
    return configErrorResponse(error);
  }
}
