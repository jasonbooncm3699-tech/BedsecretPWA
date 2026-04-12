import { getLegalContent } from "@/lib/data";
import { getDictionary, isSupportedLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ReturnsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ReturnsPage({ params }: ReturnsPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const content = getLegalContent(locale, "returns");

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 rounded-[2rem] border border-border/70 bg-surface p-7 shadow-[0_18px_45px_rgba(46,37,48,0.06)] md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Legal
      </p>
      <h1 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
        {t.legal.returns}
      </h1>
      <p className="text-[15px] leading-8 text-muted-foreground">{content}</p>
    </section>
  );
}
