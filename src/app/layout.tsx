import type { Metadata, Viewport } from "next";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/600.css";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/500.css";
import "@fontsource/noto-serif-sc/600.css";
import "@fontsource/ma-shan-zheng/400.css";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.narrativeos.cn"),
  title: "NarrativeOS · AI 叙事课堂生成平台",
  description:
    "将课文、知识点与教学目标，转化为一场学生可以进入、选择和反思的 AI 叙事课堂。",
  keywords: [
    "AI 教育",
    "叙事课堂",
    "生成式 AI",
    "角色扮演",
    "闯关解谜",
    "NarrativeOS",
  ],
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "NarrativeOS" }],
  creator: "NarrativeOS",
  publisher: "NarrativeOS",
  category: "education",
  openGraph: {
    title: "NarrativeOS · AI 叙事课堂生成平台",
    description:
      "让知识不只被讲述，而是被亲历。从一份教学材料，到一场完整体验。",
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "NarrativeOS",
    images: [
      {
        url: "/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "NarrativeOS AI 叙事课堂生成平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NarrativeOS · AI 叙事课堂生成平台",
    description:
      "将课文、知识点与教学目标，转化为学生可以进入的 AI 叙事课堂。",
    images: ["/hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ede1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
