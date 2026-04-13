import { notFound } from "next/navigation";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { RewardClaimCard } from "@/components/reward-claim-card";

type ClaimPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = getDictionary(typedLocale);

  return <RewardClaimCard locale={typedLocale} t={t} />;
}
