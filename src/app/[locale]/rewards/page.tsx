import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { RewardsDashboard } from "@/components/rewards-dashboard";
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
      <RewardsDashboard locale={language} t={t} />
    </section>
  );
}
