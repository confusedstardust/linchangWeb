import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clapperboard, LayoutGrid } from "lucide-react";
import I18nProvider from "@/components/i18n-provider";
import { AuthSessionProvider } from "@/components/auth-session";
import BrandLogo from "@/components/brand-logo";
import LoginForm from "@/components/login-form";
import LoginLanguage from "@/components/login-language";
import { localizedPath, type Locale } from "@/lib/i18n";

export const loginMetadata: Metadata = {
  robots: { index: false, follow: false },
};

const introduction = {
  "zh-CN": {
    title: ["让每堂课", "都有故事可探索"],
    description: "用 AI 把教学灵感变成互动内容，让学生边玩边学。",
    features: ["互动绘本", "教学动画", "课堂活动"],
  },
  "zh-Hant": {
    title: ["讓每堂課", "都有故事可探索"],
    description: "用 AI 把教學靈感變成互動內容，讓學生邊玩邊學。",
    features: ["互動繪本", "教學動畫", "課堂活動"],
  },
  en: {
    title: ["Every lesson", "a story to explore"],
    description: "Turn teaching ideas into interactive experiences with AI.",
    features: ["Picture books", "Animations", "Classroom activities"],
  },
} satisfies Record<Locale, { title: string[]; description: string; features: string[] }>;

const featureStyles = [
  { Icon: BookOpen, color: "bg-[#e5f1e7] text-[#39684e]" },
  { Icon: Clapperboard, color: "bg-[#fbe7da] text-[#9e482f]" },
  { Icon: LayoutGrid, color: "bg-[#f8edcf] text-[#85621b]" },
];

export default function LoginPage({ locale }: { locale: Locale }) {
  const copy = introduction[locale];

  return (
    <I18nProvider locale={locale}>
      <AuthSessionProvider>
        <div className="min-h-[100svh] bg-[#faf6ee] text-[#28241e] [background-image:radial-gradient(ellipse_at_13%_46%,#f8ead6_0%,transparent_56%)]">
          <header className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-10">
            <Link href={localizedPath(locale)} className="inline-flex items-center gap-2.5 text-[19px] font-semibold tracking-tight">
              <BrandLogo size={36} />
              NarrativeOS
            </Link>
            <LoginLanguage />
          </header>
          <main className="mx-auto grid min-h-[calc(100svh-76px)] max-w-[1192px] items-center gap-7 px-5 pb-9 pt-3 sm:px-10 lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-16 lg:pb-14">
            <section className="mx-auto w-full max-w-[610px]">
              <h1 className="font-serif text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.14] tracking-tight">
                {copy.title[0]}<br />
                <span className="text-[#a34032]">{copy.title[1]}</span>
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-[#665b50] sm:mt-4 sm:text-base">
                {copy.description}
              </p>
              <div className="relative mt-5 aspect-[2.1/1] overflow-hidden rounded-[22px] bg-[#f5e3ca] ring-1 ring-[#8d5734]/10 sm:mt-6 sm:rounded-[30px]">
                <Image src="https://ecs-oss-ist.oss-cn-hangzhou.aliyuncs.com/site_asset/images/login-classroom-terrain.webp" alt="" fill loading="eager" sizes="(min-width: 1024px) 610px, (min-width: 640px) 610px, calc(100vw - 40px)" className="object-cover" />
              </div>
              <ul className="mt-3 hidden grid-cols-3 gap-2.5 sm:grid">
                {featureStyles.map(({ Icon, color }, index) => (
                  <li key={copy.features[index]} className="flex min-h-14 items-center gap-2 rounded-2xl border border-[#eee3d5] bg-[#fffdf8] px-2.5 text-sm font-medium">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${color}`}>
                      <Icon size={16} aria-hidden />
                    </span>
                    {copy.features[index]}
                  </li>
                ))}
              </ul>
            </section>
            <div className="mx-auto flex w-full max-w-[610px] flex-col justify-center rounded-[30px] border border-[#eee4d7] bg-[#fffdfa] p-5 shadow-[0_20px_64px_rgba(97,61,29,0.10)] sm:px-8 sm:py-9 lg:min-h-[550px]">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </main>
        </div>
      </AuthSessionProvider>
    </I18nProvider>
  );
}
