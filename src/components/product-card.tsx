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
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-lg font-semibold">{product.name[locale]}</h3>
        <p className="text-sm text-muted-foreground">{product.description[locale]}</p>
        <p className="text-base font-semibold">RM {product.price}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="rounded-full border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
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
            className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            {t.common.orderViaWhatsapp}
          </a>
        </div>
      </div>
    </article>
  );
}
