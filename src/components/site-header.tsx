import Link from "next/link";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDictionary, type Locale } from "@/lib/i18n";

const navItems = (locale: Locale) => {
  const text = getDictionary(locale);
  return [
    { href: `/${locale}`, label: text.nav.home },
    { href: `/${locale}/products`, label: text.nav.products },
    { href: `/${locale}/reviews`, label: text.nav.reviews },
    { href: `/${locale}/member`, label: text.nav.member },
  ];
};

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const text = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href={`/${locale}`}
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Bedsecret
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems(locale).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/75 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
          <Link
            href={`/${locale}/login`}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            {text.common.joinMember}
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
