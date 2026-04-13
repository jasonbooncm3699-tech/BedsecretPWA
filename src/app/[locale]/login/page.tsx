import { redirect } from "next/navigation";
import { isSupportedLocale, type Locale } from "@/lib/i18n";
import { AuthCard } from "@/components/auth-card";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    redirect("/en");
  }

  const activeLocale: Locale = locale;

  return <AuthCard locale={activeLocale} />;
}
