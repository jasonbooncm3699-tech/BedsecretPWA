"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { claimVoucher } from "@/lib/rewards";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Locale, TranslationDictionary } from "@/lib/i18n";

type RewardClaimCardProps = {
  locale: Locale;
  t: TranslationDictionary;
};

type ClaimState =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "success";
      message: string;
      code: string;
      amount: number;
      expiresAt: string;
    }
  | { kind: "error"; message: string };

export function RewardClaimCard({ locale, t }: RewardClaimCardProps) {
  const claimTitle = t?.rewards.claim ?? "Claim voucher";
  const supabase = useMemo(() => getSupabaseClient(), []);
  const isSupabaseReady = Boolean(supabase && isSupabaseConfigured());
  const [userId, setUserId] = useState<string | null>(null);
  const [claimState, setClaimState] = useState<ClaimState>({ kind: "idle" });
  const [booting, setBooting] = useState(isSupabaseReady);

  useEffect(() => {
    if (!isSupabaseReady || !supabase) {
      return;
    }

    let active = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) {
          return;
        }
        setUserId(data.user?.id ?? null);
      })
      .finally(() => {
        if (active) {
          setBooting(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isSupabaseReady, supabase]);

  const submitClaim = async () => {
    if (!supabase || !isSupabaseConfigured()) {
      setClaimState({
        kind: "error",
        message:
          "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.",
      });
      return;
    }

    if (!userId) {
      setClaimState({
        kind: "error",
        message: "Please sign in first to claim your voucher.",
      });
      return;
    }

    setClaimState({ kind: "loading" });
    const result = await claimVoucher(supabase, userId, locale);

    if (!result.ok) {
      const messageByReason: Record<typeof result.reason, string> = {
        profile_missing:
          "Member profile not found yet. Please complete your profile in Member page first.",
        no_claimable:
          "No claimable amount available yet. Referral rewards will appear after admin confirms purchases.",
        insert_failed: "Unable to issue voucher now. Please try again in a moment.",
      };
      setClaimState({
        kind: "error",
        message: messageByReason[result.reason],
      });
      return;
    }

    setClaimState({
      kind: "success",
      message: result.voucher.isNew
        ? "Voucher generated successfully. Share this code in WhatsApp when ordering."
        : "An active voucher already exists. Reuse the code below.",
      code: result.voucher.code,
      amount: result.voucher.amount,
      expiresAt: result.voucher.expiresAt,
    });
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <h1 className="text-3xl font-semibold text-foreground">{claimTitle}</h1>
      <p className="text-sm text-muted-foreground">
        Claim voucher to use during WhatsApp checkout with Bedsecret sales team.
      </p>

      <div className="rounded-2xl border border-border bg-surface p-6">
        {booting ? (
          <p className="text-sm text-muted-foreground">Checking member session...</p>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={submitClaim}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={claimState.kind === "loading"}
            >
              {claimState.kind === "loading" ? "Generating..." : claimTitle}
            </button>

            {claimState.kind === "error" ? (
              <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">
                {claimState.message}
              </p>
            ) : null}

            {claimState.kind === "success" ? (
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">{claimState.message}</p>
                <p className="mt-2 text-2xl font-bold tracking-wide">{claimState.code}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Amount: RM {claimState.amount.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expires: {new Date(claimState.expiresAt).toLocaleDateString()}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Link
        href={`/${locale}/rewards`}
        className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        Back to rewards
      </Link>
    </section>
  );
}
