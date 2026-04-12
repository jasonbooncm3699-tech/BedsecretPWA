import { FAQAccordion } from "@/components/faq-accordion";
import { faqItems } from "@/lib/data";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type FaqPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale: Locale = locale;
  const t = getDictionary(activeLocale);
  const items = faqItems.map((item) => ({
    id: item.id,
    question: item.question[activeLocale],
    answer: item.answer[activeLocale],
  }));

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t.faq.title}
        </h1>
        <p className="text-sm text-muted-foreground">{t.faq.description}</p>
      </header>
      <FAQAccordion items={items} />
    </section>
  );
}
