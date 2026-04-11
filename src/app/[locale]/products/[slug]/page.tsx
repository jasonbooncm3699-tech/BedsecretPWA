import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import {
  getProductBySlug,
  getReviewsByProductId,
  products,
  type Product,
} from "@/lib/data";
import { buildWhatsappOrderUrl } from "@/lib/whatsapp";
import { ReviewCard } from "@/components/review-card";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: "en", slug: product.slug },
    { locale: "ms", slug: product.slug },
    { locale: "th", slug: product.slug },
  ]);
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) {
    return { title: "Product" };
  }

  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name[locale]} | Bedsecret`,
    description: product.description[locale],
  };
}

function RelatedProducts({
  locale,
  currentProduct,
}: {
  locale: Locale;
  currentProduct: Product;
}) {
  const t = getDictionary(locale);
  const related = products.filter((item) => item.id !== currentProduct.id).slice(0, 2);
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">{t.home.featuredProducts}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} t={t} />
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const productReviews = getReviewsByProductId(product.id);
  const whatsappUrl = buildWhatsappOrderUrl({
    locale,
    productName: product.name[locale],
    sku: product.sku,
  });

  return (
    <div className="space-y-8">
      <section className="grid gap-8 rounded-3xl border border-border bg-surface p-6 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src={product.image}
            alt={product.name[locale]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold">{product.name[locale]}</h1>
          <p className="mt-4 text-base text-muted-foreground">
            {product.description[locale]}
          </p>
          <p className="mt-5 text-xl font-semibold">RM {product.price}</p>
          <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {t.common.orderViaWhatsapp}
          </a>
        </div>
      </section>

      {productReviews.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold">{t.common.socialProof}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {productReviews.map((review) => (
              <ReviewCard key={review.id} review={review} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <RelatedProducts locale={locale} currentProduct={product} />
    </div>
  );
}
