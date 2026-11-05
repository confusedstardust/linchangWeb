import { parseFilters } from "@/lib/teacher-plaza-filters";
import TeacherPlazaHeader from "@/components/teacher-plaza-header";
import TeacherPlaza from "@/components/teacher-plaza";
import { listFilteredTeacherWorks, listFeaturedTeacherWorks, teacherWorkFacets, type PublicTeacherWork } from "@/lib/teacher-ecosystem";
import { type Locale } from "@/lib/i18n";
import "./teacher-plaza.css";

export default async function TeacherEcosystemPage({ locale, searchParams }: {
  locale: Locale;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const value = (key: string) => typeof values[key] === "string" ? values[key].slice(0, 80) : "";
  const query = value("q");
  const filters = parseFilters(values);
  const requested = Number.parseInt(value("page"), 10);
  let result;
  let facets = { subjects: [] as string[], grades: [] as string[], tags: [] as string[] };
  let loadFailed = false;
  let featuredWorks: PublicTeacherWork[] = [];
  try {
    [result, facets, featuredWorks] = await Promise.all([listFilteredTeacherWorks(query, requested, filters.pageSize, filters), teacherWorkFacets(), listFeaturedTeacherWorks()]);
  } catch (error) {
    console.error("[teacher-ecosystem] page load failed", error);
    loadFailed = true;
    result = { query, page: 1, pageSize: 12, total: 0, totalPages: 1, works: [] };
  }
  return <main className="plaza">
    <TeacherPlazaHeader locale={locale} />
    <TeacherPlaza locale={locale} result={result} featuredWorks={featuredWorks} facets={facets} filters={filters} loadFailed={loadFailed} />
  </main>;
}
