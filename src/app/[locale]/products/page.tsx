import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getDictionary, isSupportedLocale } from "@/lib/i18n";
import { products } from "@/lib/data";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    return { title: "Products" };
  }

  const t = getDictionary(locale);
  return {
    title: t.nav.products,
    description: "Explore skincare products curated by Bedsecret.",
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{t.nav.products}</h1>
        <p className="mt-2 text-muted-foreground">
          Viral Thai skincare picks, selected for Malaysian market.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} t={t} />
        ))}
      </div>
    </section>
  );
}
