import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isSupportedLocale, type Locale } from "@/lib/i18n";
import { VerifyOtpCard } from "@/components/verify-otp-card";

export default async function VerifyOtpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    redirect("/en");
  }

  const activeLocale: Locale = locale;

  return (
    <Suspense fallback={null}>
      <VerifyOtpCard locale={activeLocale} />
    </Suspense>
  );
}
