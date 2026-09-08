import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Reserved WeChat OAuth callback. Not implemented in this release. */
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
