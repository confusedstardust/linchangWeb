import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/config";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function jsonOk<T extends Record<string, unknown>>(body?: T, status = 200) {
  return NextResponse.json({ ok: true, ...body }, { status });
}

export async function sessionCookieValue() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export function configErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Auth is not configured";
  if (message.includes("Can't reach database server") || message.includes("PrismaClientInitializationError")) {
    return jsonError("无法连接数据库，请检查 DATABASE_URL 和 RDS 白名单", 503);
  }
  if (message.includes("DATABASE_URL")) {
    return jsonError("未配置 DATABASE_URL", 503);
  }
  if (message.includes("AUTH_SECRET")) {
    return jsonError("未配置 AUTH_SECRET", 503);
  }
  if (message.includes("SMTP")) {
    return jsonError("邮件发送失败，请检查 SMTP 配置", 503);
  }
  return jsonError("服务异常，请稍后重试", 500);
}
