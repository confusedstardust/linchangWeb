import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import {
  SESSION_COOKIE,
  SESSION_DAYS,
  getAuthSecret,
  isSecureCookie,
  type AuthUser,
  type SessionJwtPayload,
} from "@/lib/auth/config";
import { generateSessionId, hashSessionId } from "@/lib/auth/crypto";

function secretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function signSessionToken(payload: SessionJwtPayload) {
  return new SignJWT({
    email: payload.email,
    providers: payload.providers,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setJti(payload.jti)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey(), {
    algorithms: ["HS256"],
  });

  if (!payload.sub || !payload.jti || !Array.isArray(payload.providers)) {
    throw new Error("Invalid session token");
  }

  return {
    sub: payload.sub,
    email: typeof payload.email === "string" ? payload.email : null,
    providers: payload.providers.filter((item): item is string => typeof item === "string"),
    jti: payload.jti,
  } satisfies SessionJwtPayload;
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function toAuthUser(user: {
  id: string;
  email: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  accounts: Array<{ provider: string }>;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    providers: user.accounts.map((account) => account.provider),
  };
}

export async function createUserSession(user: AuthUser) {
  const prisma = getPrisma();
  const jti = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      tokenHash: hashSessionId(jti),
      expiresAt,
    },
  });

  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
    providers: user.providers,
    jti,
  });

  return token;
}

export async function readSessionUser(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;

  try {
    const payload = await verifySessionToken(token);
    const prisma = getPrisma();
    const session = await prisma.authSession.findUnique({
      where: { tokenHash: hashSessionId(payload.jti) },
      include: {
        user: {
          include: { accounts: { select: { provider: true } } },
        },
      },
    });

    if (!session || session.expiresAt < new Date() || session.userId !== payload.sub) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      nickname: session.user.nickname,
      avatarUrl: session.user.avatarUrl,
      providers: session.user.accounts.map((account) => account.provider),
    };
  } catch {
    return null;
  }
}

export async function revokeSession(token: string | undefined) {
  if (!token) return;
  try {
    const payload = await verifySessionToken(token);
    await getPrisma().authSession.deleteMany({
      where: { tokenHash: hashSessionId(payload.jti) },
    });
  } catch {
    // Ignore expired or malformed tokens on logout.
  }
}
