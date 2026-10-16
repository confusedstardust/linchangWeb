"use client";

import { AccountMenu } from "@narrativeos/ui";
import { accountClient, ssoLoginUrl, teacherResourcePlazaUrl, workbenchHref } from "@/lib/workbench-account";
import { getMessages, type Locale } from "@/lib/i18n";

export function WorkbenchAccountMenu({ locale = "zh-CN", className, tour, includeAdmin = true }: {
  locale?: Locale; className?: string; tour?: string; includeAdmin?: boolean;
}) {
  return <AccountMenu client={accountClient} href={workbenchHref}
    loginHref={() => ssoLoginUrl(locale)} plazaHref={() => teacherResourcePlazaUrl(locale)}
    onLogout={() => window.location.reload()} activePlaza includeAdmin={includeAdmin}
    locale={locale} messages={getMessages(locale).ui.account} className={className} tour={tour} />;
}
