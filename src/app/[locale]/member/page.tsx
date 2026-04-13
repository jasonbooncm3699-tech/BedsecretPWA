import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

type MemberPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MemberPage(props: MemberPageProps) {
  const { locale: localeParam } = await props.params;
  const locale: Locale = isSupportedLocale(localeParam) ? localeParam : "en";
  const t = getDictionary(locale);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-surface p-6">
        <h1 className="text-3xl font-semibold">{t.member.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.member.description}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {t.member.benefits.map((benefit) => (
            <li key={benefit} className="rounded-xl bg-muted px-3 py-2 text-sm">
              {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/${locale}/login`}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {t.common.joinMember}
          </Link>
          <Link
            href={`/${locale}/rewards`}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            {t.common.referralRewards}
          </Link>
        </div>
      </section>

      <AuthCard locale={locale} />
    </div>
  );
}
