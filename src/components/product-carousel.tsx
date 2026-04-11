"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/data";
import type { Locale, TranslationDictionary } from "@/lib/i18n";

type ProductCarouselProps = {
  products: Product[];
  locale: Locale;
  t: TranslationDictionary;
};

export function ProductCarousel({
  products,
  locale,
  t,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(() => products, [products]);

  const scrollByCard = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const amount = Math.max(track.clientWidth * 0.8, 280);
    track.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {t.home.featuredProducts}
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface hover:bg-muted"
            aria-label="Scroll products left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface hover:bg-muted"
            aria-label="Scroll products right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((product) => (
          <div
            key={product.id}
            className="min-w-[78%] flex-none snap-start sm:min-w-[48%] lg:min-w-[35%]"
          >
            <ProductCard product={product} locale={locale} t={t} />
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-1">
        <a
          href={`/${locale}/products`}
          className="rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:opacity-90"
        >
          {t.common.shopAll}
        </a>
      </div>
    </section>
  );
}
