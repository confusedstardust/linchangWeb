# NarrativeOS · AI 叙事课堂生成平台

官网首页，Next.js 16 + Tailwind CSS v4 实现，古风水墨视觉 + 视频沉浸式 Hero。

## 技术栈

- Next.js 16（App Router / TypeScript / Turbopack）
- Tailwind CSS v4（`@theme` 设计令牌 + 自定义关键帧）
- `next/font/google` 自托管 Noto Serif SC / Noto Sans SC / 马善政毛笔体
- GSAP 3 + ScrollTrigger + `@gsap/react`（钉住滚动、横向画廊、逐字标题、光标与磁吸）
- Lenis 1.3（`lenis/react`）平滑滚动，并与 ScrollTrigger 同步

## 动效清单

- 开场墨幕：双帘幕揭开 + 印章落款，Hero 标题逐字墨迹式入场
- Hero 钉住：向下滚动时视频放大、文案消散，产品坞随后覆盖
- 「课堂灵感」桌面端横向滚动画廊（移动端自动回退为纵向卡片）
- 大标题逐字揭示、滚动进度条、自定义光标、磁吸按钮、鼠标光晕
- 数字计数、打字机对话、叙事模式自动轮播、学科跑马灯
- 完整支持 `prefers-reduced-motion`，动效全部自动降级

## 本地运行

需要 Node.js 18.18+（本机可用 `nvm use 20`）：

```bash
npm install
npm run dev
```

默认访问 `http://localhost:3000`。

## 目录结构

- `src/app` — 根布局、页面与 favicon
- `src/components` — 各区块组件（Hero、产品、体验、能力、灵感、团队、技术、流程等）
- `src/lib/content.ts` — 全站文案与数据，可直接修改
- `src/app/globals.css` — 古风设计令牌、纹理、印章与动效
- `public/hero.mp4` — Hero 背景视频（`public/hero-poster.jpg` 为首帧占位）

## 常用命令

```bash
npm run dev    # 本地开发
npm run build  # 生产构建
npm run lint   # 代码检查
```
