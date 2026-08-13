import type { Metadata, Viewport } from "next";
import { Ma_Shan_Zheng, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  display: "swap",
});

const maShan = Ma_Shan_Zheng({
  variable: "--font-ma-shan",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "NarrativeOS · AI 叙事课堂生成平台",
    description:
      "让知识不只被讲述，而是被亲历。从一份教学材料，到一场完整体验。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ede1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${notoSerif.variable} ${maShan.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
