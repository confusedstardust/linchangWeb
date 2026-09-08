import { NextResponse } from "next/server";
import { configErrorResponse, jsonError, sessionCookieValue } from "@/lib/auth/http";
import { readSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await readSessionUser(await sessionCookieValue());
    if (!user) {
      return jsonError("未登录", 401);
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("[auth] me failed", error);
    return configErrorResponse(error);
  }
}
