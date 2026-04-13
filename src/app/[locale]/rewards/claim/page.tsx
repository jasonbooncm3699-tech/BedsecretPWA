import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

type ClaimPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function buildSampleVoucher(locale: Locale): string {
  return `BS-${locale.toUpperCase()}-9Q2M6`;
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const t = getDictionary(typedLocale);
  const voucherCode = buildSampleVoucher(typedLocale);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <h1 className="text-3xl font-semibold text-foreground">{t.rewards.claim}</h1>
      <p className="text-sm text-muted-foreground">
        Your claim flow is now connected to a placeholder voucher generator. In production,
        this button will call Supabase to issue unique redeemable vouchers.
      </p>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-muted-foreground">Generated voucher code</p>
        <p className="mt-2 text-2xl font-bold tracking-wide">{voucherCode}</p>
      </div>
      <Link
        href={`/${typedLocale}/rewards`}
        className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        Back to rewards
      </Link>
    </section>
  );
}
