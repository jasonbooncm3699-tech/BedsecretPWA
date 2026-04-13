import Link from "next/link";
import type { Locale, TranslationDictionary } from "@/lib/i18n";

type RewardSummaryCardProps = {
  locale: Locale;
  t: TranslationDictionary;
  data: {
    referralCode: string;
    successfulPurchases: number;
    pendingReferrals: number;
    claimableValue: number;
    expiryDays: number;
    activeVoucher?: {
      code: string;
      amount: number;
      expiresAt: string;
    } | null;
  };
};

export function RewardSummaryCard({ locale, t, data }: RewardSummaryCardProps) {
  const hasActiveVoucher = Boolean(data.activeVoucher);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t.common.referralRewards}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">{t.rewards.title}</h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Referral code</p>
          <p className="mt-1 font-semibold">{data.referralCode || "-"}</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Successful purchases</p>
          <p className="mt-1 font-semibold">{data.successfulPurchases}</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending referrals</p>
          <p className="mt-1 font-semibold">{data.pendingReferrals}</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Claimable amount</p>
          <p className="mt-1 font-semibold">RM {data.claimableValue}</p>
        </div>
      </div>

      {hasActiveVoucher ? (
        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Active voucher</p>
          <p className="mt-1 text-lg font-semibold">
            {data.activeVoucher?.code} (RM {data.activeVoucher?.amount.toFixed(2)})
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Expires at {new Date(data.activeVoucher?.expiresAt ?? "").toLocaleDateString()}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/${locale}/rewards/claim`}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {t.rewards.claim}
        </Link>
        <p className="text-sm text-muted-foreground">
          Voucher valid for {data.expiryDays} days. Current language:{" "}
          <span className="uppercase">{locale}</span>
        </p>
      </div>
    </section>
  );
}
