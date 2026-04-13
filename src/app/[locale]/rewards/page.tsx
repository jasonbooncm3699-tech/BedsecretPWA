import { sampleRewardStatus } from "@/lib/data";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { RewardSummaryCard } from "@/components/reward-summary-card";
import { notFound } from "next/navigation";

export default async function RewardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }
  const language: Locale = locale;
  const t = getDictionary(language);

  return (
    <section>
      <RewardSummaryCard locale={language} t={t} data={sampleRewardStatus} />
    </section>
  );
}
