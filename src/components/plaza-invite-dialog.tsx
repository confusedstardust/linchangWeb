"use client";

import { useRef, useState, type RefObject } from "react";
import { CloseButton } from "@narrativeos/ui/close-button";
import logo from "@narrativeos/ui/logo.png";
import { teacherEcosystemPath, type Locale } from "@/lib/i18n";

const messages = {
  "zh-CN": { title: "邀请同行", headline: ["好灵感，", "值得一起分享。"], invitation: "来 NarrativeOS 教师资源广场，一起发现新的课堂灵感。", scan: "扫码打开教师资源广场", copy: "复制邀请文案", link: "仅复制链接", poster: "生成分享海报", save: "保存海报", copied: "已复制", manual: "请选择下方内容并复制。", failed: "海报生成失败，请重试。", generating: "正在生成…", close: "关闭" },
  "zh-Hant": { title: "邀請同行", headline: ["好靈感，", "值得一起分享。"], invitation: "來 NarrativeOS 教師資源廣場，一起發現新的課堂靈感。", scan: "掃碼開啟教師資源廣場", copy: "複製邀請文案", link: "僅複製連結", poster: "產生分享海報", save: "儲存海報", copied: "已複製", manual: "請選取下方內容並複製。", failed: "海報產生失敗，請重試。", generating: "正在產生…", close: "關閉" },
  en: { title: "Invite colleagues", headline: ["Good ideas", "are worth sharing."], invitation: "Find your next classroom idea in the NarrativeOS Teacher Resource Plaza.", scan: "Scan to explore the plaza", copy: "Copy invitation", link: "Copy link only", poster: "Generate poster", save: "Save poster", copied: "Copied", manual: "Select and copy the text below.", failed: "Could not generate the poster. Try again.", generating: "Generating…", close: "Close" },
};

async function createPoster(url: string, copy: typeof messages.en) {
  const { toCanvas } = await import("qrcode");
  const qr = document.createElement("canvas");
  await toCanvas(qr, url, { scale: 7, margin: 4, color: { dark: "#493626", light: "#ffffff" } });
  const brand = new Image();
  brand.src = logo.src;
  await brand.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1320;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#faf6ec";
  ctx.fillRect(0, 0, 900, 1320);
  ctx.fillStyle = "#9b3d44";
  ctx.font = "600 34px Microsoft YaHei, sans-serif";
  ctx.fillText("NarrativeOS", 65, 100);
  ctx.fillStyle = "#493626";
  ctx.font = "600 66px Microsoft YaHei, sans-serif";
  copy.headline.forEach((line, i) => ctx.fillText(line, 65, 235 + i * 90));
  ctx.fillStyle = "#88684f";
  ctx.font = "26px Microsoft YaHei, sans-serif";
  ctx.fillText(copy.invitation, 65, 405, 770);
  const logoScale = 400 / Math.max(brand.naturalWidth, brand.naturalHeight);
  const width = brand.naturalWidth * logoScale;
  const height = brand.naturalHeight * logoScale;
  ctx.drawImage(brand, (900 - width) / 2, 465 + (400 - height) / 2, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(55, 923, 790, 300, 24);
  ctx.fill();
  const qrSize = qr.width;
  ctx.drawImage(qr, 82, 923 + (300 - qrSize) / 2);
  ctx.fillStyle = "#493626";
  ctx.font = "500 29px Microsoft YaHei, sans-serif";
  ctx.fillText(copy.scan, 375, 1058, 430);
  ctx.fillStyle = "#88684f";
  ctx.font = "23px Microsoft YaHei, sans-serif";
  ctx.fillText("www.narrativeos.cn", 375, 1110, 430);
  return canvas.toDataURL("image/png");
}

export default function PlazaInviteDialog({ locale, dialog }: { locale: Locale; dialog: RefObject<HTMLDialogElement | null> }) {
  const copy = messages[locale];
  const url = new URL(teacherEcosystemPath(locale), "https://www.narrativeos.cn").href;
  const invitation = `${copy.invitation}\n${url}`;
  const [status, setStatus] = useState("");
  const [manualCopy, setManualCopy] = useState("");
  const [poster, setPoster] = useState("");
  const [generating, setGenerating] = useState(false);
  const manualInput = useRef<HTMLTextAreaElement>(null);

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setManualCopy("");
      setStatus(copy.copied);
    } catch {
      setManualCopy(text);
      setStatus(copy.manual);
      requestAnimationFrame(() => manualInput.current?.select());
    }
  }

  async function generate() {
    setGenerating(true);
    setStatus("");
    try { setPoster(await createPoster(url, copy)); }
    catch { setStatus(copy.failed); }
    finally { setGenerating(false); }
  }

  return <dialog ref={dialog} className="plaza-invite-dialog" aria-labelledby="plaza-invite-title" onClick={event => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }}>
    <section className="plaza-invite-body" data-lenis-prevent>
      <CloseButton className="plaza-invite-close" aria-label={copy.close} onClick={() => dialog.current?.close()} autoFocus />
      <h2 id="plaza-invite-title">{copy.title}</h2>
      <p>{copy.invitation}</p>
      <a className="plaza-invite-url" href={url} target="_blank" rel="noreferrer">{url}</a>
      <div className="plaza-invite-actions">
        <button type="button" className="plaza-primary" onClick={() => void copyText(invitation)}>{copy.copy}</button>
        <button type="button" onClick={() => void copyText(url)}>{copy.link}</button>
        <button type="button" disabled={generating} onClick={() => void generate()}>{generating ? copy.generating : copy.poster}</button>
      </div>
      <p role="status">{status}</p>
      {manualCopy && <textarea ref={manualInput} readOnly aria-label={copy.copy} value={manualCopy} />}
      {poster && <div className="plaza-invite-poster">
        {/* The image is generated in this browser as a PNG data URL. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt={copy.scan} />
        <a className="plaza-primary" href={poster} download="NarrativeOS-invitation.png">{copy.save}</a>
      </div>}
    </section>
  </dialog>;
}
