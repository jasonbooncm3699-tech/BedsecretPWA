import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import type { Locale, TranslationDictionary } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  t: TranslationDictionary;
};

export function SiteFooter({ locale, t }: SiteFooterProps) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4">
          <a href={siteConfig.socialLinks.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
          <a
            href={siteConfig.socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            href={siteConfig.socialLinks.facebook}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href={`/${locale}/privacy`}>{t.legal.privacy}</Link>
          <Link href={`/${locale}/terms`}>{t.legal.terms}</Link>
          <Link href={`/${locale}/returns`}>{t.legal.returns}</Link>
          <Link href={`/${locale}/cookie`}>{t.legal.cookie}</Link>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
          {siteConfig.description}
        </p>
      </div>
    </footer>
  );
}
