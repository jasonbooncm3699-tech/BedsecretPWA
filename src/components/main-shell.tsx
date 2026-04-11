import type { ReactNode } from "react";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { getDictionary, type Locale } from "@/lib/i18n";

type MainShellProps = {
  locale: Locale;
  children: ReactNode;
};

export function MainShell({ locale, children }: MainShellProps) {
  const dictionary = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <SiteFooter locale={locale} t={dictionary} />
      <WhatsAppFab />
      <CookieBanner />
    </div>
  );
}
