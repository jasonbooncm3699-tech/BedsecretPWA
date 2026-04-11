import { getDictionary, isSupportedLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getLegalContent } from "@/lib/data";

type CookiePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CookiePage({ params }: CookiePageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const content = getLegalContent(locale, "cookie");

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-surface p-6">
      <h1 className="text-2xl font-semibold">{t.legal.cookie}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{content}</p>
    </section>
  );
}
