# homepage-fixes 修复提取

2026-11-06，从 feature/homepage-fixes 只提取首页触屏/视频/访客登录态及链接修复。四个课堂工具、builtinTeacherWorks 登记、广场数据合并逻辑不进入门户运行时。

部署配置对齐已有 linchang-web 项目与 3002 端口，同时保留当前 main 的目标地址校验及 diagnose_only。未修改线上服务器。

验证：TypeScript；24 项账号与广场接口测试；homepage-intro.browser.cjs 使用 Edge/Chromium 的 iPad 横竖屏模拟、无 JavaScript、脚本失败、视频成功/拒绝播放、减少动态效果场景。不是实体 iPad / Safari 验收。

四个工具另行放在 teaching-resources/，构建产出 output/teaching-resources/*.zip，不注册门户路由、不自动写入广场。上传与上下架仍走普通 HTML 资源流程。
