import { getLegalContent } from "@/lib/data";
import { getDictionary, isSupportedLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type LegalTermsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LegalTermsPage({ params }: LegalTermsPageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <section className="mx-auto max-w-4xl space-y-4 rounded-3xl border border-border bg-surface p-8">
      <h1 className="text-3xl font-semibold">{t.legal.terms}</h1>
      <p className="text-sm leading-7 text-muted-foreground">
        {getLegalContent(locale, "terms")}
      </p>
    </section>
  );
}
