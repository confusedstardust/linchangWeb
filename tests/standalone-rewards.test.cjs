const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function createLoader(database) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const container = { exports: {} };
    cache.set(file, container.exports);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    vm.runInNewContext(code, {
      module: container, exports: container.exports, Date, Buffer, URLSearchParams,
      require: id => id === "@/lib/db" ? { getPrisma: () => database }
        : id.startsWith(".") ? load(path.resolve(path.dirname(file), `${id}.ts`)) : require(id),
    });
    return container.exports;
  }
  return load;
}

const load = createLoader();
const rewards = load("teaching-resources/src/lib/classroom-rewards.ts");


test("certificate batches preserve student names, ordering and per-student copies", () => {
  const settings = { ...rewards.initialRewardSettings("2026-11-03"), names: "小禾，安安\nChristopher", copies: 2 };
  const sheets = rewards.rewardSheets(settings);
  assert.equal(sheets.length, 6);
  assert.equal(sheets.map(sheet => sheet[0].student).join("|"), "小禾|小禾|安安|安安|Christopher|Christopher");
  assert.equal(rewards.rewardSheets({ ...settings, names: "  " })[0][0].student, "闪闪发光的你");
});

test("A4 sticker batches paginate without losing names and copies", () => {
  const settings = { ...rewards.initialRewardSettings("2026-11-03"), template: "flower", names: "小禾\n安安\n小满", copies: 5 };
  const sheets = rewards.rewardSheets(settings);
  assert.equal(sheets.map(sheet => sheet.length).join(","), "12,3");
  assert.equal(sheets[1].map(label => label.student).join(","), "小满,小满,小满");
  assert.equal(sheets[1][2].number, 15);
});

test("invalid quantities, oversized batches, invalid dates and overflowing text are blocked", () => {
  const defaults = rewards.initialRewardSettings("2026-11-03");
  for (const copies of [NaN, 0, 1.5, 13]) assert.match(rewards.validateRewardSettings({ ...defaults, copies }), /份数/);
  assert.match(rewards.validateRewardSettings({ ...defaults, names: Array.from({ length: 61 }, (_, i) => `学生${i}`).join("\n") }), /60/);
  assert.match(rewards.validateRewardSettings({ ...defaults, date: "2026-02-30" }), /日期/);
  assert.match(rewards.validateRewardSettings({ ...defaults, message: "一\n二\n三\n四\n五" }), /换行/);
  assert.equal(rewards.validateRewardSettings({ ...defaults, message: "好".repeat(120) }), null);
});

test("Chinese and Latin wrapping retains content and A4 orientation has the right geometry", () => {
  const original = "跨学科探索ABC123小小的好奇心";
  assert.equal(rewards.wrapRewardText(original, 6).join(""), original);
  assert.equal(rewards.formatRewardDate("2026-11-03"), "2026 年 11 月 3 日");
  const certificate = rewards.rewardPaper("certificate"), stickers = rewards.rewardPaper("postage");
  assert.equal(certificate.width, 297); assert.equal(certificate.height, 210);
  assert.equal(stickers.width, 210); assert.equal(stickers.height, 297);
  assert.equal(certificate.pngWidth, stickers.pngHeight);
});

test("poetry rounds preserve ten unique questions and score accepted answers",()=>{
 const poetry=load('teaching-resources/src/lib/poetry-challenge.ts');
 for(const level of ['easy','medium','hard']){
  const questions=poetry.createPoetryRound(level,'mixed',42);
  assert.equal(questions.length,10);assert.equal(new Set(questions.map(q=>q.id)).size,10);
  const question=questions[0];assert.equal(poetry.gradePoetryAnswer(question,question.answer,false).points,10);
  assert.equal(poetry.gradePoetryAnswer(question,question.answer,true).points,5);
 }
});
test("recitation masks retain punctuation and can generate a fresh set of blanks",()=>{
 const api=load('teaching-resources/src/lib/recitation.ts');
 const text='床前明月光，疑是地上霜。';const first=api.recitationMask(text,50,12);const next=api.recitationMask(text,50,12,first);
 assert.notEqual(first.join(','),next.join(','));assert.ok(first.every(index=>!/[，。]/.test(Array.from(text)[index])));
});
