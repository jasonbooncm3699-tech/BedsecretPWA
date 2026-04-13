import { ReviewCard } from "@/components/review-card";
import { reviews } from "@/lib/data";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

type ReviewsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = await params;
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "en";
  const t = getDictionary(safeLocale);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t.common.socialProof}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Reviews are curated by Bedsecret admin from social platforms to highlight
          real product feedback.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} locale={safeLocale} />
        ))}
      </div>
    </section>
  );
}
