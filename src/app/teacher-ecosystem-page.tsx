import { WORKBENCH_URL } from "@/lib/content";
import type { PlazaPracticeTool } from "@/components/plaza-discovery";
import { parseFilters } from "@/lib/teacher-plaza-filters";
import TeacherPlazaHeader from "@/components/teacher-plaza-header";
import TeacherPlaza from "@/components/teacher-plaza";
import { PlazaSiteFooter } from "@/components/site-footer";
import { listFilteredTeacherWorks, listFeaturedTeacherWorks, teacherWorkFacets, type PublicTeacherWork } from "@/lib/teacher-ecosystem";
import { teacherWorkEngagement, type TeacherWorkEngagement } from "@/lib/teacher-work-engagement";
import { sessionCookieValue } from "@/lib/auth/http";
import { readSessionUser } from "@/lib/auth/session";
import { loginPath, teacherEcosystemPath, type Locale } from "@/lib/i18n";
import { redirect } from "next/navigation";
import "./teacher-plaza.css";

async function loadPracticeTools(): Promise<PlazaPracticeTool[] | null> {
  try {
    const response = await fetch(`${WORKBENCH_URL.replace(/\/$/, "")}/api/forge/practice-tools`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`Practice tools: HTTP ${response.status}`);
    const data = await response.json() as { items?: PlazaPracticeTool[] };
    if (!Array.isArray(data.items)) throw new Error("Invalid practice tools response");
    return data.items;
  } catch (error) {
    console.error("[teacher-ecosystem] practice tools load failed", error);
    return null;
  }
}

export default async function TeacherEcosystemPage({ locale, searchParams }: {
  locale: Locale;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const value = (key: string) => typeof values[key] === "string" ? values[key].slice(0, 80) : "";
  const favoritesOnly = value("view") === "favorites";
  const query = favoritesOnly ? "" : value("q");
  const filters = parseFilters(favoritesOnly ? {} : values);
  const requested = Number.parseInt(value("page"), 10);
  const user = await readSessionUser(await sessionCookieValue());
  if (favoritesOnly && !user) {
    const next = `${teacherEcosystemPath(locale)}?view=favorites`;
    redirect(`${loginPath(locale)}?next=${encodeURIComponent(next)}`);
  }
  const practiceToolsRequest = favoritesOnly ? null : loadPracticeTools();
  let result;
  let facets = { subjects: [] as string[], grades: [] as string[], tags: [] as string[] };
  let loadFailed = false;
  let featuredWorks: PublicTeacherWork[] = [];
  let engagement: Record<string, TeacherWorkEngagement> = {};
  try {
    if (favoritesOnly && user) {
      result = await listFilteredTeacherWorks(query, requested, filters.pageSize, filters, user.id);
    } else {
      [result, facets, featuredWorks] = await Promise.all([listFilteredTeacherWorks(query, requested, filters.pageSize, filters), teacherWorkFacets(), listFeaturedTeacherWorks()]);
    }
    engagement = await teacherWorkEngagement(result.works.map(work => work.id), user?.id).catch(error => {
      console.error("[teacher-ecosystem] metrics load failed", error);
      return {};
    });
  } catch (error) {
    console.error("[teacher-ecosystem] page load failed", error);
    loadFailed = true;
    result = { query, page: 1, pageSize: 12, total: 0, totalPages: 1, works: [] };
  }
  return <main className="plaza" data-lenis-prevent-wheel>
    <TeacherPlazaHeader locale={locale} favoritesOnly={favoritesOnly} />
    <TeacherPlaza key={`${user?.id ?? ""}:${favoritesOnly}:${result.page}:${result.works.map(work => work.id).join(",")}`} locale={locale} favoritesOnly={favoritesOnly} result={result} featuredWorks={featuredWorks} practiceTools={await practiceToolsRequest} facets={facets} filters={filters} loadFailed={loadFailed} initialEngagement={engagement} />
    <PlazaSiteFooter locale={locale} />
  </main>;
}
