import { Star } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Review } from "@/lib/data";

type ReviewCardProps = {
  review: Review;
  locale: Locale;
};

export function ReviewCard({ review, locale }: ReviewCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{review.reviewer}</p>
        <p className="text-xs text-muted-foreground">{review.source}</p>
      </div>
      <div className="mb-3 flex items-center gap-1 text-primary">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={`${review.id}-star-${index}`} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{review.text[locale]}</p>
    </article>
  );
}
