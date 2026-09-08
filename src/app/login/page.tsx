import LoginPage, { loginMetadata } from "@/components/login-page";

export const metadata = loginMetadata;

export default function ZhLogin() {
  return <LoginPage locale="zh-CN" />;
}
