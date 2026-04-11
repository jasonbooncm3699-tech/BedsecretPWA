import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { MainShell } from "@/components/main-shell";
import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
} from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <MainShell locale={locale}>{children}</MainShell>;
}
