import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.narrativeos.cn/sitemap.xml",
    host: "https://www.narrativeos.cn",
  };
}
