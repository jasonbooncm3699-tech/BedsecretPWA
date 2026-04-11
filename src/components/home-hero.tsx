import Link from "next/link";
import type { Locale, TranslationDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

type HomeHeroProps = {
  locale: Locale;
  t: TranslationDictionary;
};

export function HomeHero({ locale, t }: HomeHeroProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-8 shadow-sm md:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {siteConfig.description}
      </p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
        {t.home.heroTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
        {t.home.heroDescription}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/products`}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {t.nav.products}
        </Link>
        <Link
          href={`/${locale}/member`}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          {t.common.joinMember}
        </Link>
      </div>
    </section>
  );
}
