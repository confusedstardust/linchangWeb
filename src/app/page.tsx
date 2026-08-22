import About from "@/components/about";
import Capabilities from "@/components/capabilities";
import CustomCursor from "@/components/custom-cursor";
import Experience from "@/components/experience";
import FeaturedCases from "@/components/featured-cases";
import FinalCta from "@/components/final-cta";
import Hero from "@/components/hero";
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "NarrativeOS",
  alternateName: "临场",
  url: "https://www.narrativeos.cn/",
  description:
    "将课文、知识点与教学目标，转化为学生可以进入、选择和反思的 AI 叙事课堂。",
  knowsAbout: ["AI 教育", "叙事课堂", "生成式 AI", "角色扮演教学"],
};

export default function Home() {
  return (
    <>
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
    </>
  );
}
