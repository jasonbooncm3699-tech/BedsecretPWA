"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function swapLocaleInPath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${targetLocale}`;
  }

  const first = segments[0] as Locale;
  if (SUPPORTED_LOCALES.includes(first)) {
    segments[0] = targetLocale;
    return `/${segments.join("/")}`;
  }

  return `/${targetLocale}/${segments.join("/")}`;
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center rounded-full border bg-surface p-1 text-xs font-medium">
      {SUPPORTED_LOCALES.map((locale) => {
        const href = swapLocaleInPath(pathname, locale);
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={href}
            className={cn(
              "rounded-full px-2.5 py-1 uppercase",
              isActive
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
