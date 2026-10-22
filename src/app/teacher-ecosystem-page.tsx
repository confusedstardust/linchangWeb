import TeacherPlazaHeader from "@/components/teacher-plaza-header";
import TeacherWorkFeed from "@/components/teacher-work-feed";
import { getMessages, teacherEcosystemPath, type Locale } from "@/lib/i18n";


export default async function TeacherEcosystemPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const copy = getMessages(locale).ui.plaza;
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
