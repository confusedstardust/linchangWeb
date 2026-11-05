import { build } from 'esbuild';
import sharp from 'sharp';
import { mkdirSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const tools = [
  ['reward-studio','课堂印记工坊',['print','png-export'],'跨学科'],
  ['recitation','拾句 · 随机留白背诵',[],'语文'],
  ['poetry-challenge','诗词接龙 · 上下句闯关',[],'语文'],
  ['sound-meter','静一静 · 自习音量灯',['microphone'],'跨学科'],
];
const root = resolve('teaching-resources');
const output = resolve('output/teaching-resources');
mkdirSync(output, { recursive: true });
for (const [name,title,capabilities,subject] of tools) {
  const target = join(output,name); mkdirSync(join(target,'assets'),{recursive:true});
  await build({ entryPoints:[join(root,'src/entries',`${name}.tsx`)], bundle:true, outfile:join(target,'assets/app.js'), minify:true, sourcemap:false, format:'iife', jsx:'automatic', target:['es2020'], loader:{'.png':'dataurl'}, define:{'process.env.NODE_ENV':'"production"'}, legalComments:'eof' });
  writeFileSync(join(target,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="stylesheet" href="assets/app.css"></head><body id="top"><div id="root"></div><script src="assets/app.js"></script></body></html>`);
  copyFileSync(join(root,'covers',`${name}.svg`),join(target,'cover.svg'));
  await sharp(join(root,'covers',`${name}.svg`)).resize(1280,720).png().toFile(join(target,'cover.png'));
  copyFileSync(join(target,'cover.png'),join(output,`${name}-cover.png`));
  writeFileSync(join(target,'narrativeos-resource.json'),JSON.stringify({schema:1,title,author:'Flynt',subject,capabilities},null,2));
  const result=spawnSync('python',['-c',"from pathlib import Path;import sys,zipfile;root=Path(sys.argv[1]);out=Path(sys.argv[2]);\nwith zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:\n for p in sorted(root.rglob('*')):\n  if p.is_file():z.write(p,p.relative_to(root).as_posix())",target,join(output,`${name}.zip`)],{encoding:'utf8'});
  if(result.status!==0)throw new Error(result.stderr);
  console.log(`${name}.zip — ${title} (${capabilities.join(', ')||'no capabilities'})`);
}
writeFileSync(join(output,'upload-guide.md'),'# 上传说明\n\n分别上传四个 ZIP，入口留空（自动识别 index.html）。作者署名 Flynt 保留于包内，实际发布账号由 Admin 上传身份决定。封面可使用包内 cover.png 或同目录下的 -cover.png。\n\n音量灯需要新版播放页的麦克风数值代理；印记工坊需要打印与 PNG 导出能力。所有文件自包含，不依赖门户页面、模型或外部 CDN。\n');
console.log(`Output: ${output}; ${readdirSync(output).length} entries`);
