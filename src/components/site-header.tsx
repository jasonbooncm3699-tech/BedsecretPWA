"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDictionary, type Locale } from "@/lib/i18n";
import { useState } from "react";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const items = navItems(locale);

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
          {items.map((item) => (
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
            onClick={() => setMobileNavOpen((current) => !current)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          mobileNavOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
          className={`absolute inset-0 bg-black/35 transition ${
            mobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[84%] max-w-xs border-r border-border bg-surface p-5 shadow-xl transition-transform duration-200 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <p className="text-lg font-semibold">Menu</p>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-muted hover:text-foreground"
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/rewards`}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-muted hover:text-foreground"
              onClick={() => setMobileNavOpen(false)}
            >
              {text.common.referralRewards}
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}
