import { getPrisma } from "@/lib/db";
import { CODE_MAX_ATTEMPTS } from "@/lib/auth/config";
import { hashOtp, safeEqual } from "@/lib/auth/crypto";

export async function consumeEmailCode(email: string, code: string) {
  const prisma = getPrisma();
  const record = await prisma.verificationCode.findFirst({
    where: { email, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date() || record.attempts >= CODE_MAX_ATTEMPTS) {
    return false;
  }

  if (!safeEqual(record.codeHash, hashOtp(email, code))) {
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });
  return true;
}
