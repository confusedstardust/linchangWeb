import TeacherPlazaHeader from "@/components/teacher-plaza-header";
import TeacherWorkFeed from "@/components/teacher-work-feed";
import { teacherEcosystemPath, type Locale } from "@/lib/i18n";

const copyByLocale = {
  "zh-CN": {
    eyebrow: "TEACHER RESOURCE PLAZA",
    title: "教师资源广场",
    description: "来自一线教师的叙事课堂作品。寻找灵感，打开作品，并把优秀实践带回自己的课堂。",
    search: "搜索作品标题",
    searchButton: "搜索",
    clear: "清除搜索",
    back: "返回 NarrativeOS",
    empty: "暂时没有匹配的作品",
    emptyHint: "换一个标题关键词试试，或稍后再来看看教师们的新作品。",
    works: "个公开作品",
    author: "创作者",
    enter: "开始体验",
    practice: "讲评练",
    previous: "上一页",
    next: "下一页",
  },
  en: {
    eyebrow: "TEACHER RESOURCE PLAZA",
    title: "Teacher Resource Plaza",
    description: "Narrative classroom experiences made by teachers. Find an idea, open a work, and bring strong practice back to your classroom.",
    search: "Search by title",
    searchButton: "Search",
    clear: "Clear",
    back: "Back to NarrativeOS",
    empty: "No matching works yet",
    emptyHint: "Try another title keyword or return later for new teacher creations.",
    works: "public works",
    author: "Creator",
    enter: "Open experience",
    practice: "Review & practice",
    previous: "Previous",
    next: "Next",
  },
  "zh-Hant": {
    eyebrow: "TEACHER RESOURCE PLAZA",
    title: "教師資源廣場",
    description: "來自一線教師的敘事課堂作品。尋找靈感，打開作品，並把優秀實踐帶回自己的課堂。",
    search: "搜尋作品標題",
    searchButton: "搜尋",
    clear: "清除搜尋",
    back: "返回 NarrativeOS",
    empty: "暫時沒有符合的作品",
    emptyHint: "換一個標題關鍵詞試試，或稍後再來看看教師們的新作品。",
    works: "個公開作品",
    author: "創作者",
    enter: "開始體驗",
    practice: "講評練",
    previous: "上一頁",
    next: "下一頁",
  },
} as const;

export default async function TeacherEcosystemPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const copy = copyByLocale[locale];
  const values = await searchParams;
  const query = typeof values.q === "string" ? values.q : "";

  return (
    <main className="ecosystem-page ecosystem-with-site-header">
      <TeacherPlazaHeader locale={locale} />

      <section className="ecosystem-hero">
        <p>{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <span>{copy.description}</span>
        <form className="ecosystem-search" action={teacherEcosystemPath(locale)} method="get" role="search">
          <label htmlFor="teacher-work-query">{copy.search}</label>
          <div>
            <input id="teacher-work-query" name="q" defaultValue={query} placeholder={copy.search} maxLength={80} />
            <button type="submit">{copy.searchButton}</button>
          </div>
        </form>
      </section>

      <TeacherWorkFeed key={query} query={query} locale={locale} copy={copy} />

    </main>
  );
}
