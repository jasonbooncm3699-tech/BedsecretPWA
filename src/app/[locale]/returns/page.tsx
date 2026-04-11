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
    <section className="mx-auto w-full max-w-3xl space-y-4 rounded-3xl border border-border bg-surface p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t.legal.returns}</h1>
      <p className="text-sm leading-7 text-muted-foreground">{content}</p>
    </section>
  );
}
