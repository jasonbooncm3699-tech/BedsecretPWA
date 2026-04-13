import { Star } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Review } from "@/lib/data";

type ReviewCardProps = {
  review: Review;
  locale: Locale;
};

export function ReviewCard({ review, locale }: ReviewCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(46,37,48,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(46,37,48,0.09)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{review.reviewer}</p>
        <p className="text-xs text-muted-foreground">{review.source}</p>
      </div>
      <div className="mb-3 flex items-center gap-1 text-primary">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={`${review.id}-star-${index}`} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        {review.text[locale]}
      </p>
    </article>
  );
}
