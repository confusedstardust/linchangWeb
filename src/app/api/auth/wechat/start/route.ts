import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * WeChat OAuth start. Reserved for open-platform login.
 * Env: WECHAT_APP_ID, WECHAT_APP_SECRET
 * Callback: /api/auth/wechat/callback
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      provider: "wechat",
      error: "微信登录即将开放",
    },
    { status: 501 },
  );
}
