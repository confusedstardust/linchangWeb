import type { Locale } from "@/lib/i18n";
import { workbenchHref } from "@narrativeos/ui/app-links";
import { useBrowserOrigin } from "@narrativeos/ui/workspace-sidebar";

const assetRoot = "https://ecs-oss-ist.oss-cn-hangzhou.aliyuncs.com/site_asset";
const featured = [
  ["interactive-classroom", "做互动课件", "做互動課件", "Interactive lessons", "用可操作的课件探索知识", "用可操作的課件探索知識", "Explore concepts through interactive activities"],
  ["visual-design", "做教学动画", "做教學動畫", "Teaching animations", "让月相变化和物理过程动起来", "讓月相變化和物理過程動起來", "Bring lunar phases and physical processes to life"],
  ["ip-narrative", "做 RPG 游戏", "做 RPG 遊戲", "Role-playing games", "扮演角色，做选择，探索不同结局", "扮演角色，做選擇，探索不同結局", "Play a role, make choices and explore different endings"],
  ["practice-tools", "做课后练习", "做課後練習", "After-class practice", "制作知识问答和配套习题", "製作知識問答和配套習題", "Create quizzes and practice exercises"],
] as const;
const more = [
  ["cultural-experience", "文旅体验", "文旅體驗", "Cultural experiences"],
  ["science-mystery", "科普解谜", "科普解謎", "Science mysteries"],
  ["creative-outline", "创意大纲", "創意大綱", "Story outlines"],
  ["asset-library", "素材广场", "素材廣場", "Asset plaza"],
] as const;

export default function PlazaCreation({ locale }: { locale: Locale }) {
  const language = locale === "en" ? 3 : locale === "zh-Hant" ? 2 : 1;
  const origin = useBrowserOrigin();
  const base = process.env.NEXT_PUBLIC_WORKBENCH_URL;
  const practice = workbenchHref("/practice", origin, base);
  return (
    <div className="plaza-creation">
      <div className="plaza-creation-grid">
        {featured.map(entry => (
          <a key={entry[0]} href={practice} className="plaza-creation-card" style={{ backgroundImage: `linear-gradient(0deg, #17151bf5, #17151b16 90%), url(${assetRoot}/scene-${entry[0]}.png)` }}>
            <strong>{entry[language]}</strong>
            <small>{entry[language + 3]}</small>
          </a>
        ))}
      </div>
      <h3>{locale === "en" ? "More ways to create" : locale === "zh-Hant" ? "更多創作方向" : "更多创作方向"}</h3>
      <div className="plaza-creation-more">
        {more.map(entry => (
          <a key={entry[0]} href={entry[0] === "asset-library" ? workbenchHref("/assets", origin, base) : practice}>
            <span aria-hidden="true" style={{ backgroundImage: `url(${assetRoot}/scene-${entry[0]}.png)` }} />
            <strong>{entry[language]}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}
