import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { getAuthSecret } from "@/lib/auth/config";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashOtp(email: string, code: string) {
  return sha256(`${getAuthSecret()}:otp:${email}:${code}`);
}

export function hashSessionId(jti: string) {
  return sha256(`${getAuthSecret()}:session:${jti}`);
}

export function generateOtp() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function generateSessionId() {
  return randomBytes(32).toString("hex");
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
