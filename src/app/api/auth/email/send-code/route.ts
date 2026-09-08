import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import {
  SEND_COOLDOWN_MS,
  SEND_EMAIL_HOURLY_LIMIT,
  SEND_IP_HOURLY_LIMIT,
  CODE_TTL_MS,
  clientIp,
  isValidEmail,
  normalizeEmail,
} from "@/lib/auth/config";
import { generateOtp, hashOtp } from "@/lib/auth/crypto";
import { sendVerificationEmail } from "@/lib/auth/mail";
import { configErrorResponse, jsonError, jsonOk } from "@/lib/auth/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let body: { email?: string } = {};
    try {
      body = (await request.json()) as { email?: string };
    } catch {
      return jsonError("请输入有效邮箱", 400);
    }
    const email = normalizeEmail(body.email ?? "");
    if (!isValidEmail(email)) {
      return jsonError("请输入有效邮箱", 400);
    }

    const prisma = getPrisma();
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const ip = clientIp(request);

    const [latest, emailCount, ipCount] = await Promise.all([
      prisma.verificationCode.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      }),
      prisma.verificationCode.count({
        where: { email, createdAt: { gt: hourAgo } },
      }),
      prisma.verificationCode.count({
        where: { ip, createdAt: { gt: hourAgo } },
      }),
    ]);

    if (latest && now.getTime() - latest.createdAt.getTime() < SEND_COOLDOWN_MS) {
      return jsonError("发送过于频繁，请稍后再试", 429);
    }
    if (emailCount >= SEND_EMAIL_HOURLY_LIMIT || ipCount >= SEND_IP_HOURLY_LIMIT) {
      return jsonError("发送过于频繁，请稍后再试", 429);
    }

    const code = generateOtp();
    await prisma.verificationCode.create({
      data: {
        email,
        codeHash: hashOtp(email, code),
        expiresAt: new Date(now.getTime() + CODE_TTL_MS),
        ip,
      },
    });

    await sendVerificationEmail(email, code);
    return jsonOk({
      cooldown: SEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    console.error("[auth] send-code failed", error);
    return configErrorResponse(error);
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
