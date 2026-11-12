# 可上传课堂资源

这四个工具是独立静态资源，不是门户内置工具，不注册 Next 页面，也不自动写入教师广场。

源码由 `feature/homepage-fixes` 的 `810b6bc` 提取，保留 Flynt 署名；改为独立 React 入口、原生页面滚动和本地依赖。无模型 API、登录依赖或外部 CDN。

## 构建与上传

```powershell
npm ci
npm run build:teaching-resources
```

产出位于 `output/teaching-resources/`：

| ZIP | 内容 | 能力 |
| --- | --- | --- |
| reward-studio.zip | 课堂印记工坊：奖状、邮票、小红花 | A4 打印、PNG 导出 |
| recitation.zip | 拾句：随机留白背诵、自选文章 | 无额外能力 |
| poetry-challenge.zip | 诗词上下句、提示、积分与重练 | 无额外能力 |
| sound-meter.zip | 自习音量灯、阈值、环境采样 | 用户主动授权麦克风 |

每份包含 `index.html`、`assets/app.js`、`assets/app.css`、`cover.svg`、`cover.png` 和 `narrativeos-resource.json`。ZIP 根目录直接是 index.html，无需填写入口。封面可使用包内 cover.png（或 ZIP 旁的 -cover.png）；分类、标题和发布状态仍由 Admin 管理。代码内 Flynt 署名不改变实际上传账号的所有权。

上传后使用普通 HTML 资源的精选、编辑、替换资源包、下架和重新发布操作。替换时上传完整的新 ZIP，不单独替换 index.html。

## 播放页适配

普通 HTTPS 静态站点打开工具时，直接使用本机浏览器能力。上传平台后继续使用不带 `allow-same-origin` 的隔离沙箱。配套 engine_skeleton 播放页按资源 manifest 开启可选能力：

- `print`：仅该资源允许调用打印，不给其他 HTML 增加弹窗权限。
- `png-export`：播放页校验 SVG 元素/属性，拒绝脚本、外部引用等内容，再返回 PNG 字节，解决不透明来源沙箱的 Canvas 导出限制。
- `microphone`：工具先请求授权，播放页出现确认按钮，用户点击后才请求浏览器麦克风。只把 RMS 功率数值发给资源，不传录音/音频流；停止、页面进入后台或离开后释放输入。

不要用增加 `allow-same-origin` 的方式绕过权限限制。印记工坊与音量灯在旧版平台沙箱中不能完整工作，须先更新配套播放页。HTTPS/localhost 是麦克风前提。

## 验证

`node --test tests/standalone-rewards.test.cjs` 验证名单分页、A4 几何、输入边界、诗词评分与随机留白。

配套后端 `tests/standalone_resources.browser.py --packages <本目录构建产出绝对路径>` 使用临时后台和模拟广场，真实上传四个 ZIP，验证页面交互、3508×2480 PNG、两页 A4 PDF、麦克风确认前零请求/确认后音量更新/停止后释放、隔离沙箱、下架和重新发布。麦克风采用浏览器合成输入，未做实体麦克风或实体 iPad/Safari 验收。

未自动上传到真实广场或部署线上。源码可以独立维护，构建目录不会作为门户运行时的一部分。
