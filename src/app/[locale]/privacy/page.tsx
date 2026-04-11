import { getLegalContent } from "@/lib/data";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "en";
  const t = getDictionary(safeLocale);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4 py-8">
      <h1 className="text-3xl font-semibold">{t.legal.privacy}</h1>
      <p className="text-sm leading-7 text-muted-foreground">
        {getLegalContent(safeLocale, "privacy")}
      </p>
    </section>
  );
}
