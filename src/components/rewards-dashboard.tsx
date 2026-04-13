"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale, TranslationDictionary } from "@/lib/i18n";
import { RewardSummaryCard } from "@/components/reward-summary-card";
import { fetchRewardSnapshot, type RewardSnapshot } from "@/lib/rewards";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { RewardClaimCard } from "@/components/reward-claim-card";

type RewardsDashboardProps = {
  locale: Locale;
  t: TranslationDictionary;
  mode?: "summary" | "claim";
};

export function RewardsDashboard({ locale, t, mode = "summary" }: RewardsDashboardProps) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [loading, setLoading] = useState(() => Boolean(supabase) && isSupabaseConfigured());
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [missingProfile, setMissingProfile] = useState(false);
  const [snapshot, setSnapshot] = useState<RewardSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured()) {
      return;
    }

    let active = true;

    const loadSnapshot = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setRequiresLogin(true);
        setLoading(false);
        return;
      }

      const rewardsSnapshot = await fetchRewardSnapshot(supabase, user.id);
      if (!active) {
        return;
      }

      if (!rewardsSnapshot) {
        setMissingProfile(true);
        setLoading(false);
        return;
      }

      setSnapshot(rewardsSnapshot);
      setLoading(false);
    };

    void loadSnapshot();

    return () => {
      active = false;
    };
  }, [supabase]);

  if (!isSupabaseConfigured() || !supabase) {
    return (
      <section className="space-y-4 rounded-3xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "claim" ? t.rewards.claim : t.rewards.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel environment variables first.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="space-y-4 rounded-3xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "claim" ? t.rewards.claim : t.rewards.title}
        </h1>
        <p className="text-sm text-muted-foreground">Loading your rewards...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="space-y-4 rounded-3xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "claim" ? t.rewards.claim : t.rewards.title}
        </h1>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      </section>
    );
  }

  if (requiresLogin) {
    return (
      <section className="space-y-4 rounded-3xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "claim" ? t.rewards.claim : t.rewards.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Please sign in to view your referral progress and claimable voucher balance.
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {t.common.joinMember}
        </Link>
      </section>
    );
  }

  if (missingProfile || !snapshot) {
    return (
      <section className="space-y-4 rounded-3xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "claim" ? t.rewards.claim : t.rewards.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete your member profile first, then refresh this page to load your rewards.
        </p>
        <Link
          href={`/${locale}/member`}
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          {t.nav.member}
        </Link>
      </section>
    );
  }

  if (mode === "claim") {
    return <RewardClaimCard locale={locale} t={t} />;
  }

  return <RewardSummaryCard locale={locale} t={t} data={snapshot} />;
}
