import Image from "next/image";
import Link from "next/link";
import type { Locale, TranslationDictionary } from "@/lib/i18n";
import type { Product } from "@/lib/data";
import { buildWhatsappOrderUrl } from "@/lib/whatsapp";

type ProductCardProps = {
  product: Product;
  locale: Locale;
  t: TranslationDictionary;
};

export function ProductCard({ product, locale, t }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-[0_8px_26px_rgba(29,18,29,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(29,18,29,0.08)]">
      <div className="relative aspect-square overflow-hidden rounded-b-3xl">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-lg font-semibold leading-tight">{product.name[locale]}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{product.description[locale]}</p>
        <p className="text-base font-semibold tracking-tight">RM {product.price}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="rounded-full border border-border px-3.5 py-2 text-xs font-semibold hover:bg-muted"
          >
            {t.common.viewDetails}
          </Link>
          <a
            href={buildWhatsappOrderUrl({
              locale,
              productName: product.name[locale],
              sku: product.sku,
            })}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            {t.common.orderViaWhatsapp}
          </a>
        </div>
      </div>
    </article>
  );
}
