import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQAccordion } from "@/components/faq-accordion";
import { HomeHero } from "@/components/home-hero";
import { ProductCarousel } from "@/components/product-carousel";
import { ReviewCard } from "@/components/review-card";
import { faqItems, products, reviews } from "@/lib/data";
import { getDictionary, isSupportedLocale } from "@/lib/i18n";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const homeFaqItems = faqItems.slice(0, 3).map((item) => ({
    id: item.id,
    question: item.question[locale],
    answer: item.answer[locale],
  }));

  return (
    <div className="space-y-8">
      <HomeHero locale={locale} t={t} />

      <section className="space-y-4">
        <ProductCarousel products={products} locale={locale} t={t} />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">{t.common.socialProof}</h2>
          <Link
            href={`/${locale}/reviews`}
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            {t.nav.reviews}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-border bg-surface p-6">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-2xl font-semibold">{t.faq.title}</h3>
          <Link
            href={`/${locale}/faq`}
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            {t.nav.faq}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">{t.faq.description}</p>
        <FAQAccordion items={homeFaqItems} />
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <h3 className="text-2xl font-semibold">{t.home.whyJoinTitle}</h3>
        <p className="mt-2 text-muted-foreground">{t.home.whyJoinDescription}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/login`}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {t.common.joinMember}
          </Link>
          <Link
            href={`/${locale}/rewards`}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            {t.common.referralRewards}
          </Link>
        </div>
      </section>
    </div>
  );
}
