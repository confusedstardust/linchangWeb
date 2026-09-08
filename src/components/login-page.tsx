import { Suspense } from "react";
import type { Metadata } from "next";
import CustomCursor from "@/components/custom-cursor";
import I18nProvider from "@/components/i18n-provider";
import { AuthSessionProvider } from "@/components/auth-session";
import LoginForm from "@/components/login-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import type { Locale } from "@/lib/i18n";

export const loginMetadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginPage({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <AuthSessionProvider>
        <CustomCursor />
        <SiteHeader />
        <main className="flex min-h-[100svh] items-center justify-center bg-paper px-5 pb-20 pt-28">
          <div className="w-full max-w-[420px] rounded-[1.5rem] border border-line bg-paper-soft p-8 shadow-[0_24px_64px_rgba(53,42,30,0.08)]">
            <p className="text-[10px] tracking-[0.28em] text-gold">NARRATIVEOS</p>
            <div className="mt-6">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </main>
        <SiteFooter />
      </AuthSessionProvider>
    </I18nProvider>
  );
}
