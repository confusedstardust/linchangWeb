import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linchangweb.oss-cn-beijing.aliyuncs.com",
        pathname: "/WeChatGroupPic/**",
      },
    ],
  },
};

export default nextConfig;
