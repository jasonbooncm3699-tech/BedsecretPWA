import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { isSupportedLocale, type Locale } from "@/lib/i18n";

type CompleteRegistrationPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CompleteRegistrationPage({
  params,
}: CompleteRegistrationPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale: Locale = locale;
  return (
    <Suspense fallback={<div className="rounded-2xl border border-border bg-surface p-6" />}>
      <AuthCard locale={activeLocale} mode="complete" />
    </Suspense>
  );
}
