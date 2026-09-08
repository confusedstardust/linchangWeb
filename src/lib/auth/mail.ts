import nodemailer from "nodemailer";

export function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

export async function sendVerificationEmail(email: string, code: string) {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "NarrativeOS 登录验证码",
    text: `您的验证码是 ${code}，5 分钟内有效。Your verification code is ${code}. It expires in 5 minutes.`,
    html: `
      <div style="font-family:Georgia,serif;color:#262019;line-height:1.7">
        <p>您的 NarrativeOS 登录验证码是：</p>
        <p style="font-size:28px;letter-spacing:8px;font-weight:700">${code}</p>
        <p>5 分钟内有效。如非本人操作，请忽略此邮件。</p>
        <p style="color:#7d7367;font-size:13px">Your verification code expires in 5 minutes.</p>
      </div>
    `,
  });
  return true;
}
