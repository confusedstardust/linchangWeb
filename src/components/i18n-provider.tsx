"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getMessages,
  localizedPath,
  type Locale,
  type LocaleMessages,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  messages: LocaleMessages;
  switchLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export default function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const messages = useMemo(() => getMessages(locale), [locale]);
  const router = useRouter();
  const localeRef = useRef(locale);
  const routerRef = useRef(router);
  localeRef.current = locale;
  routerRef.current = router;

  useEffect(() => {
    document.documentElement.lang =
      locale === "en" ? "en" : locale === "zh-Hant" ? "zh-TW" : "zh-CN";
  }, [locale]);

  const switchLocale = useCallback((nextLocale: Locale) => {
    if (nextLocale === localeRef.current) return;
    const hash = window.location.hash;
    routerRef.current.push(`${localizedPath(nextLocale)}${hash}`);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages,
      switchLocale,
    }),
    [locale, messages, switchLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
