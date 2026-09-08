import { getPrisma } from "@/lib/db";
import {
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  PASSWORD_MIN_LENGTH,
} from "@/lib/auth/config";
import { consumeEmailCode } from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/crypto";
import { applySessionCookie, createUserSession, toAuthUser } from "@/lib/auth/session";
import { configErrorResponse, jsonError, jsonOk } from "@/lib/auth/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let body: { email?: string; password?: string; code?: string } = {};
    try {
      body = (await request.json()) as { email?: string; password?: string; code?: string };
    } catch {
      return jsonError("请填写完整注册信息", 400);
    }

    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";
    const code = (body.code ?? "").trim();

    if (!isValidEmail(email)) {
      return jsonError("请输入有效邮箱", 400);
    }
    if (!isValidPassword(password)) {
      return jsonError(`密码至少 ${PASSWORD_MIN_LENGTH} 位`, 400);
    }
    if (!/^\d{6}$/.test(code)) {
      return jsonError("验证码无效或已过期", 400);
    }

    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("该邮箱已注册，请直接登录", 409);
    }

    if (!(await consumeEmailCode(email, code))) {
      return jsonError("验证码无效或已过期", 400);
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        emailVerifiedAt: new Date(),
        nickname: email.split("@")[0] ?? email,
        passwordHash,
        accounts: {
          create: {
            provider: "email",
            providerAccountId: email,
          },
        },
      },
      include: { accounts: { select: { provider: true } } },
    });

    const authUser = toAuthUser(user);
    const token = await createUserSession(authUser);
    return applySessionCookie(jsonOk({ user: authUser }), token);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError("该邮箱已注册，请直接登录", 409);
    }
    console.error("[auth] register failed", error);
    return configErrorResponse(error);
  }
}
