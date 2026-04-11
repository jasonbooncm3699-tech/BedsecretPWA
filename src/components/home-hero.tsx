import Link from "next/link";
import type { Locale, TranslationDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

type HomeHeroProps = {
  locale: Locale;
  t: TranslationDictionary;
};

export function HomeHero({ locale, t }: HomeHeroProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-surface p-8 shadow-[0_20px_60px_rgba(229,109,146,0.12)] md:p-14">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        {siteConfig.description}
      </p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
        {t.home.heroTitle}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
        {t.home.heroDescription}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/products`}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover"
        >
          {t.nav.products}
        </Link>
        <Link
          href={`/${locale}/member`}
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
        >
          {t.common.joinMember}
        </Link>
      </div>
    </section>
  );
}
