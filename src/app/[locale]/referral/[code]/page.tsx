import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

type ReferralPageProps = {
  params: Promise<{ locale: string; code: string }>;
};

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  const { locale, code } = await params;
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "en";
  return {
    title: `Referral ${code.toUpperCase()} (${safeLocale.toUpperCase()})`,
    description: `Join Bedsecret membership with referral code ${code.toUpperCase()}.`,
    alternates: {
      canonical: `/referral/${code}`,
    },
    openGraph: {
      title: `Bedsecret Referral ${code.toUpperCase()}`,
      description: "Join membership and start your referral reward journey.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bedsecret Referral",
      description: "Join Bedsecret membership with your friend referral code.",
    },
  };
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { locale, code } = await params;
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "en";
  const t = getDictionary(safeLocale);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 py-10">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t.common.referralRewards}
      </p>
      <h1 className="text-3xl font-semibold text-foreground">
        You were invited with code: {code.toUpperCase()}
      </h1>
      <p className="text-muted-foreground">
        Create your Bedsecret member account and enjoy referral rewards after your first
        successful purchase through WhatsApp.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${safeLocale}/login?ref=${code}`}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {t.common.joinMember}
        </Link>
        <Link
          href={`/${safeLocale}/products`}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          {t.nav.products}
        </Link>
      </div>
    </section>
  );
}
