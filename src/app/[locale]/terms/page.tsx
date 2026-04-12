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
    <section className="mx-auto max-w-4xl space-y-6 rounded-[2rem] border border-border bg-surface p-7 shadow-[0_12px_35px_rgba(46,37,48,0.06)] sm:p-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{t.legal.terms}</h1>
      </header>
      <p className="text-[15px] leading-7 text-muted-foreground">
        {getLegalContent(locale, "terms")}
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
        <li>All pricing is shown in MYR and may change during campaigns.</li>
        <li>
          Referrals and vouchers are validated manually after successful WhatsApp
          purchase confirmation.
        </li>
        <li>
          Bedsecret may update reward rules, usage limits, and policies when needed.
        </li>
      </ul>
    </section>
  );
}
