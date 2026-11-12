import { configErrorResponse, jsonError, jsonOk, sessionCookieValue } from "@/lib/auth/http";
import { AuthError, requireSameOrigin } from "@/lib/auth/security";
import { readSessionUser } from "@/lib/auth/session";
import { recordTeacherWorkView, setTeacherWorkFavorite } from "@/lib/teacher-work-engagement";

async function mutate(request: Request, action: "view" | "favorite") {
  try {
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    const workId = body?.workId;
    if (typeof workId !== "string" || !/^[a-zA-Z0-9_-]{1,191}$/.test(workId)) return jsonError("Invalid work ID", 400);

    if (action === "view") {
      const viewCount = await recordTeacherWorkView(workId);
      return viewCount === null ? jsonError("Work not found", 404) : jsonOk({ viewCount });
    }

    if (typeof body.favorited !== "boolean") return jsonError("Invalid favorite state", 400);
    const user = await readSessionUser(await sessionCookieValue());
    if (!user) return jsonError("Sign in required", 401);
    const engagement = await setTeacherWorkFavorite(workId, user.id, body.favorited);
    return engagement ? jsonOk(engagement) : jsonError("Work not found", 404);
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error("[teacher-ecosystem] engagement update failed", error);
    return configErrorResponse(error);
  }
}

export function POST(request: Request) {
  return mutate(request, "view");
}

export function PUT(request: Request) {
  return mutate(request, "favorite");
}
