import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/app/home-page";
import { getLocaleMetadata, isLocalePath, routeToLocale } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh-hant" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocalePath(locale)) return {};
  return getLocaleMetadata(routeToLocale(locale));
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocalePath(locale)) notFound();
  return <HomePage locale={routeToLocale(locale)} />;
}
