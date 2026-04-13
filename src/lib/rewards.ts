import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n";

const FALLBACK_REWARD_PER_REFERRAL = 10;
const FALLBACK_VOUCHER_EXPIRY_DAYS = 60;

type RewardSettingsRow = {
  reward_per_successful_referral: number | null;
  voucher_expiry_days: number | null;
};

type VoucherRow = {
  code: string;
  amount: number;
  status: "issued" | "redeemed" | "expired";
  expires_at: string;
  created_at: string;
};

export type MemberProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  referral_code: string;
  referred_by?: string | null;
};

export type MemberProfileFormInput = {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  email: string;
};

export type SessionMember = {
  id: string;
  email: string | null;
};

export type RewardSnapshot = {
  referralCode: string;
  successfulPurchases: number;
  pendingReferrals: number;
  claimableValue: number;
  expiryDays: number;
  activeVoucher: {
    code: string;
    amount: number;
    expiresAt: string;
  } | null;
};

function toWholeNumber(value: number | null | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.max(Math.round(value), 0);
}

function toMoneyNumber(value: number | null | undefined, fallback = 0): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.max(Number(value.toFixed(2)), 0);
}

function randomAlphaNumeric(size: number): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";
  for (let index = 0; index < size; index += 1) {
    output += charset[Math.floor(Math.random() * charset.length)];
  }
  return output;
}

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

export function createReferralCode(): string {
  return `BED-${randomAlphaNumeric(6)}`;
}

export function createVoucherCode(locale: Locale): string {
  return `BS-${locale.toUpperCase()}-${randomAlphaNumeric(7)}`;
}

export async function ensureUniqueReferralCode(
  supabase: SupabaseClient,
  maxAttempts = 8,
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = createReferralCode();
    const { data, error } = await supabase
      .from("member_profiles")
      .select("id")
      .eq("referral_code", candidate)
      .maybeSingle();
    if (!error && !data) {
      return candidate;
    }
  }

  return `BED-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function resolveReferrerIdByCode(
  supabase: SupabaseClient,
  code: string,
): Promise<string | null> {
  const normalizedCode = normalizeReferralCode(code);
  if (!normalizedCode) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_referrer_by_code", {
    input_code: normalizedCode,
  });

  if (error) {
    return null;
  }

  return typeof data === "string" ? data : null;
}

async function tryResolveReferrerByDirectSelect(
  supabase: SupabaseClient,
  code: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("member_profiles")
    .select("id")
    .eq("referral_code", normalizeReferralCode(code))
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return typeof data.id === "string" ? data.id : null;
}

export async function resolveReferrerId(
  supabase: SupabaseClient,
  code: string,
): Promise<string | null> {
  const withRpc = await resolveReferrerIdByCode(supabase, code);
  if (withRpc) {
    return withRpc;
  }

  return tryResolveReferrerByDirectSelect(supabase, code);
}

export async function getMemberProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<MemberProfile | null> {
  const { data, error } = await supabase
    .from("member_profiles")
    .select("id,email,full_name,phone,date_of_birth,referral_code,referred_by")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as MemberProfile;
}

async function ensureReferralRecord(
  supabase: SupabaseClient,
  memberId: string,
  referrerId: string,
) {
  await supabase.from("referrals").upsert(
    {
      referrer_id: referrerId,
      referred_member_id: memberId,
      status: "pending",
    },
    {
      onConflict: "referred_member_id",
      ignoreDuplicates: true,
    },
  );
}

export async function bootstrapMemberProfile(
  supabase: SupabaseClient,
  user: SessionMember,
  referralCode: string | null,
): Promise<MemberProfile | null> {
  const existingProfile = await getMemberProfile(supabase, user.id);
  if (existingProfile) {
    if (!existingProfile.email && user.email) {
      await supabase
        .from("member_profiles")
        .update({
          email: user.email,
        })
        .eq("id", user.id);
    }

    if (!existingProfile.referred_by && referralCode) {
      const referrerId = await resolveReferrerId(supabase, referralCode);
      if (referrerId && referrerId !== user.id) {
        await supabase
          .from("member_profiles")
          .update({
            referred_by: referrerId,
          })
          .eq("id", user.id)
          .is("referred_by", null);
        await ensureReferralRecord(supabase, user.id, referrerId);
      }
    }

    return getMemberProfile(supabase, user.id);
  }

  let assignedReferralCode = await ensureUniqueReferralCode(supabase);
  let lastErrorCode: string | null = null;
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const referrerId = referralCode ? await resolveReferrerId(supabase, referralCode) : null;
    const safeReferrer = referrerId && referrerId !== user.id ? referrerId : null;

    const { error } = await supabase.from("member_profiles").insert({
      id: user.id,
      email: user.email ?? null,
      referral_code: assignedReferralCode,
      referred_by: safeReferrer,
    });

    if (!error) {
      if (safeReferrer) {
        await ensureReferralRecord(supabase, user.id, safeReferrer);
      }
      return getMemberProfile(supabase, user.id);
    }

    lastErrorCode = error.code ?? null;
    if (error.code === "23505") {
      assignedReferralCode = await ensureUniqueReferralCode(supabase);
      continue;
    }

    break;
  }

  if (lastErrorCode === "23505") {
    return getMemberProfile(supabase, user.id);
  }

  return null;
}

export async function saveMemberProfileForm(
  supabase: SupabaseClient,
  userId: string,
  input: MemberProfileFormInput,
): Promise<MemberProfile | null> {
  const payload = {
    full_name: input.fullName.trim() || null,
    phone: input.phone.trim() || null,
    date_of_birth: input.dateOfBirth || null,
    email: input.email.trim() || null,
  };

  const { error } = await supabase.from("member_profiles").update(payload).eq("id", userId);
  if (error) {
    return null;
  }

  return getMemberProfile(supabase, userId);
}

export async function getRewardSettings(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("reward_settings")
    .select("reward_per_successful_referral,voucher_expiry_days")
    .limit(1)
    .maybeSingle();

  const row = (data ?? null) as RewardSettingsRow | null;

  return {
    rewardPerSuccessfulReferral: toMoneyNumber(
      row?.reward_per_successful_referral,
      FALLBACK_REWARD_PER_REFERRAL,
    ),
    voucherExpiryDays: toWholeNumber(row?.voucher_expiry_days, FALLBACK_VOUCHER_EXPIRY_DAYS),
  };
}

async function countReferralsByStatus(
  supabase: SupabaseClient,
  userId: string,
  status: "pending" | "purchased",
): Promise<number> {
  const { count } = await supabase
    .from("referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", userId)
    .eq("status", status);

  return typeof count === "number" ? count : 0;
}

async function listMemberVouchers(
  supabase: SupabaseClient,
  userId: string,
): Promise<VoucherRow[]> {
  const { data, error } = await supabase
    .from("reward_vouchers")
    .select("code,amount,status,expires_at,created_at")
    .eq("member_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as VoucherRow[];
}

function findActiveVoucher(vouchers: VoucherRow[]) {
  const now = Date.now();
  const active = vouchers.find(
    (voucher) => voucher.status === "issued" && new Date(voucher.expires_at).getTime() > now,
  );

  if (!active) {
    return null;
  }

  return {
    code: active.code,
    amount: toMoneyNumber(active.amount),
    expiresAt: active.expires_at,
  };
}

function calculateClaimableValue(
  successfulPurchases: number,
  rewardPerSuccessfulReferral: number,
  vouchers: VoucherRow[],
): number {
  const earned = successfulPurchases * rewardPerSuccessfulReferral;
  const now = Date.now();
  const alreadyClaimed = vouchers
    .filter(
      (voucher) =>
        voucher.status === "redeemed" ||
        (voucher.status === "issued" && new Date(voucher.expires_at).getTime() > now),
    )
    .reduce((total, voucher) => total + toMoneyNumber(voucher.amount), 0);

  return toMoneyNumber(Math.max(earned - alreadyClaimed, 0));
}

export async function fetchRewardSnapshot(
  supabase: SupabaseClient,
  userId: string,
): Promise<RewardSnapshot | null> {
  const [profile, settings, pendingReferrals, successfulPurchases, vouchers] =
    await Promise.all([
      getMemberProfile(supabase, userId),
      getRewardSettings(supabase),
      countReferralsByStatus(supabase, userId, "pending"),
      countReferralsByStatus(supabase, userId, "purchased"),
      listMemberVouchers(supabase, userId),
    ]);

  if (!profile) {
    return null;
  }

  return {
    referralCode: profile.referral_code,
    successfulPurchases,
    pendingReferrals,
    claimableValue: calculateClaimableValue(
      successfulPurchases,
      settings.rewardPerSuccessfulReferral,
      vouchers,
    ),
    expiryDays: settings.voucherExpiryDays,
    activeVoucher: findActiveVoucher(vouchers),
  };
}

export type ClaimVoucherResult =
  | {
      ok: true;
      voucher: {
        code: string;
        amount: number;
        expiresAt: string;
        isNew: boolean;
      };
    }
  | {
      ok: false;
      reason: "profile_missing" | "no_claimable" | "insert_failed";
    };

export async function claimVoucher(
  supabase: SupabaseClient,
  userId: string,
  locale: Locale,
): Promise<ClaimVoucherResult> {
  const snapshot = await fetchRewardSnapshot(supabase, userId);
  if (!snapshot) {
    return {
      ok: false,
      reason: "profile_missing",
    };
  }

  if (snapshot.activeVoucher) {
    return {
      ok: true,
      voucher: {
        ...snapshot.activeVoucher,
        isNew: false,
      },
    };
  }

  if (snapshot.claimableValue <= 0) {
    return {
      ok: false,
      reason: "no_claimable",
    };
  }

  const expiresAt = new Date(
    Date.now() + snapshot.expiryDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const amount = snapshot.claimableValue;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = createVoucherCode(locale);
    const { error } = await supabase.from("reward_vouchers").insert({
      member_id: userId,
      code,
      amount,
      status: "issued",
      expires_at: expiresAt,
      source: "referral",
    });

    if (!error) {
      return {
        ok: true,
        voucher: {
          code,
          amount,
          expiresAt,
          isNew: true,
        },
      };
    }

    if (error.code === "23505") {
      continue;
    }

    return {
      ok: false,
      reason: "insert_failed",
    };
  }

  return {
    ok: false,
    reason: "insert_failed",
  };
}
