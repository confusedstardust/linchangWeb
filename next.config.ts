import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
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
