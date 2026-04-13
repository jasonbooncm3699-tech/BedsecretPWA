import Link from "next/link";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

type MemberPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MemberPage(props: MemberPageProps) {
  const { locale: localeParam } = await props.params;
  const locale: Locale = isSupportedLocale(localeParam) ? localeParam : "en";
  const t = getDictionary(locale);

  return (
    <section className="space-y-5 rounded-3xl border border-border bg-surface p-6">
      <h1 className="text-3xl font-semibold">{t.member.title}</h1>
      <p className="text-sm text-muted-foreground">{t.member.description}</p>
      <div className="flex flex-wrap gap-2">
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
  );
}
