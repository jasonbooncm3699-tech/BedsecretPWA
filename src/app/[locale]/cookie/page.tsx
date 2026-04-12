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
    <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-border/70 bg-surface p-7 shadow-[0_14px_40px_rgba(46,37,48,0.06)] md:p-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t.legal.cookie}</h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{content}</p>
    </section>
  );
}
