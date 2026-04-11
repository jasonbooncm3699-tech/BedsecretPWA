import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/lib/site-config";
import type { Locale, TranslationDictionary } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  t: TranslationDictionary;
};

export function SiteFooter({ locale, t }: SiteFooterProps) {
  const socialItems = [
    {
      href: siteConfig.socialLinks.tiktok,
      label: "TikTok",
      icon: <FaTiktok className="h-5 w-5" aria-hidden />,
    },
    {
      href: siteConfig.socialLinks.instagram,
      label: "Instagram",
      icon: <FaInstagram className="h-5 w-5" aria-hidden />,
    },
    {
      href: siteConfig.socialLinks.facebook,
      label: "Facebook",
      icon: <FaFacebookF className="h-5 w-5" aria-hidden />,
    },
    {
      href: siteConfig.whatsappUrl,
      label: "WhatsApp",
      icon: <FaWhatsapp className="h-5 w-5" aria-hidden />,
    },
  ];

  return (
    <footer className="mt-12 border-t border-border/60 bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              {item.icon}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link href={`/${locale}/privacy`} className="hover:text-foreground">
            {t.legal.privacy}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-foreground">
            {t.legal.terms}
          </Link>
          <Link href={`/${locale}/returns`} className="hover:text-foreground">
            {t.legal.returns}
          </Link>
          <Link href={`/${locale}/cookie`} className="hover:text-foreground">
            {t.legal.cookie}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground/80">
          &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
          {siteConfig.description}
        </p>
      </div>
    </footer>
  );
}
