import About from "@/components/about";
import Capabilities from "@/components/capabilities";
import CustomCursor from "@/components/custom-cursor";
import Experience from "@/components/experience";
import FeaturedCases from "@/components/featured-cases";
import FinalCta from "@/components/final-cta";
import Hero from "@/components/hero";
import I18nProvider from "@/components/i18n-provider";
import InkRipple from "@/components/ink-ripple";
import ProductsDock from "@/components/products-dock";
import ScrollProgress from "@/components/scroll-progress";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Stories from "@/components/stories";
import SubjectMarquee from "@/components/subject-marquee";
import Team from "@/components/team";
import Tech from "@/components/tech";
import Workflow from "@/components/workflow";
import { getMessages, type Locale } from "@/lib/i18n";

export default function HomePage({ locale }: { locale: Locale }) {
  const { metadata } = getMessages(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "NarrativeOS",
    alternateName: metadata.alternateName,
    url: `https://www.narrativeos.cn${locale === "zh-CN" ? "/" : locale === "en" ? "/en/" : "/zh-hant/"}`,
    description: metadata.description,
    knowsAbout: locale === "en"
      ? ["AI education", "narrative classroom", "generative AI", "roleplay learning"]
      : ["AI 教育", "叙事课堂", "生成式 AI", "角色扮演教学"],
  };

  return (
    <I18nProvider locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScrollProgress />
      <CustomCursor />
      <InkRipple />
      <SiteHeader />
      <main>
        <Hero />
        <ProductsDock />
        <Experience />
        <Capabilities />
        <SubjectMarquee />
        <Stories />
        <FeaturedCases />
        <Team />
        <Tech />
        <Workflow />
        <About />
        <FinalCta />
      </main>
      <SiteFooter />
    </I18nProvider>
  );
}
