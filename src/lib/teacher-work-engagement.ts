import { getPrisma } from "@/lib/db";

export type TeacherWorkEngagement = {
  viewCount: number;
  favoriteCount: number;
  favorited: boolean;
};

export async function teacherWorkEngagement(workIds: string[], userId?: string): Promise<Record<string, TeacherWorkEngagement>> {
  if (!workIds.length) return {};
  const works = await getPrisma().teacherWork.findMany({
    where: { id: { in: workIds }, status: "PUBLISHED" },
    select: {
      id: true,
      metrics: { select: { viewCount: true } },
      _count: { select: { favorites: true } },
      favorites: userId ? { where: { userId }, select: { workId: true } } : false,
    },
  });
  return Object.fromEntries(works.map(work => [work.id, {
    viewCount: work.metrics?.viewCount ?? 0,
    favoriteCount: work._count.favorites,
    favorited: Boolean(work.favorites?.length),
  }]));
}

export async function recordTeacherWorkView(workId: string) {
  return getPrisma().$transaction(async tx => {
    // MySQL performs the first insert and concurrent increments atomically.
    const changed = await tx.$executeRaw`
      INSERT INTO teacher_work_metrics (work_id, view_count)
      SELECT id, 1 FROM teacher_works WHERE id = ${workId} AND status = 'PUBLISHED'
      ON DUPLICATE KEY UPDATE view_count = view_count + 1
    `;
    if (!changed) return null;
    const metrics = await tx.teacherWorkMetrics.findUniqueOrThrow({ where: { workId }, select: { viewCount: true } });
    return metrics.viewCount;
  });
}

export async function setTeacherWorkFavorite(workId: string, userId: string, favorited: boolean) {
  return getPrisma().$transaction(async tx => {
    const work = await tx.teacherWork.findFirst({ where: { id: workId, status: "PUBLISHED" }, select: { id: true } });
    if (!work) return null;
    const favorite = { workId, userId };
    if (favorited) await tx.teacherWorkFavorite.createMany({ data: [favorite], skipDuplicates: true });
    else await tx.teacherWorkFavorite.deleteMany({ where: favorite });
    const favoriteCount = await tx.teacherWorkFavorite.count({ where: { workId } });
    return { favorited, favoriteCount };
  });
}
