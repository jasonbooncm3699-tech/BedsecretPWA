import type { Locale, TranslationDictionary } from "@/lib/i18n";
import type { ReferralRewardStatus } from "@/lib/data";

type RewardSummaryCardProps = {
  locale: Locale;
  t: TranslationDictionary;
  data: ReferralRewardStatus;
};

export function RewardSummaryCard({ locale, t, data }: RewardSummaryCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t.common.referralRewards}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">{t.rewards.title}</h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Referral code</p>
          <p className="mt-1 font-semibold">{data.referralCode}</p>
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

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          {t.rewards.claim}
        </button>
        <p className="text-sm text-muted-foreground">
          Voucher valid for {data.expiryDays} days. Current language:{" "}
          <span className="uppercase">{locale}</span>
        </p>
      </div>
    </section>
  );
}
