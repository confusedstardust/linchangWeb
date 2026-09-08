import { notFound } from "next/navigation";
import LoginPage, { loginMetadata } from "@/components/login-page";
import { isLocalePath, routeToLocale } from "@/lib/i18n";

export const metadata = loginMetadata;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh-hant" }];
}

export default async function LocalizedLogin({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocalePath(locale)) notFound();
  return <LoginPage locale={routeToLocale(locale)} />;
}
