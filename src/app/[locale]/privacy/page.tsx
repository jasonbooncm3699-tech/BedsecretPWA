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
    <section className="mx-auto w-full max-w-4xl space-y-6 rounded-3xl border border-border/70 bg-surface p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Legal
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t.legal.privacy}
        </h1>
      </div>
      <p className="text-[15px] leading-7 text-muted-foreground">
        {getLegalContent(safeLocale, "privacy")}
      </p>
    </section>
  );
}
