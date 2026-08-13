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

export default function Home() {
  return (
    <>
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
