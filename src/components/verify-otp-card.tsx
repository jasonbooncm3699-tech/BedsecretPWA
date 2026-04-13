"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n";

type VerifyOtpCardProps = {
  locale: Locale;
};

type VerifyOtpLabels = {
  title: string;
  subtitle: string;
  otpLabel: string;
  otpPlaceholder: string;
  verifyButton: string;
  resendButton: string;
  backButton: string;
  invalidContext: string;
  verified: string;
  resent: string;
  missingConfig: string;
};

const labelsByLocale: Record<Locale, VerifyOtpLabels> = {
  en: {
    title: "Verify OTP",
    subtitle: "Enter the 6-digit code sent to your selected channel.",
    otpLabel: "6-digit code",
    otpPlaceholder: "123456",
    verifyButton: "Verify code",
    resendButton: "Resend OTP",
    backButton: "Back to sign in",
    invalidContext: "Missing verification details. Please start sign in again.",
    verified: "OTP verified. Continue to complete your registration.",
    resent: "A new OTP has been sent.",
    missingConfig:
      "Supabase environment keys are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth.",
  },
  ms: {
    title: "Sahkan OTP",
    subtitle: "Masukkan kod 6 digit yang dihantar ke saluran pilihan anda.",
    otpLabel: "Kod 6 digit",
    otpPlaceholder: "123456",
    verifyButton: "Sahkan kod",
    resendButton: "Hantar semula OTP",
    backButton: "Kembali ke log masuk",
    invalidContext: "Maklumat pengesahan tiada. Sila mula log masuk semula.",
    verified: "OTP disahkan. Teruskan untuk lengkapkan pendaftaran anda.",
    resent: "OTP baharu telah dihantar.",
    missingConfig:
      "Kunci persekitaran Supabase belum ditetapkan. Tambah NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk aktifkan auth.",
  },
  th: {
    title: "ยืนยัน OTP",
    subtitle: "กรอกรหัส 6 หลักที่ส่งไปยังช่องทางที่คุณเลือก",
    otpLabel: "รหัส 6 หลัก",
    otpPlaceholder: "123456",
    verifyButton: "ยืนยันรหัส",
    resendButton: "ส่ง OTP ใหม่",
    backButton: "กลับไปหน้าเข้าสู่ระบบ",
    invalidContext: "ไม่พบข้อมูลการยืนยัน กรุณาเริ่มเข้าสู่ระบบใหม่",
    verified: "ยืนยัน OTP สำเร็จ ไปกรอกข้อมูลสมาชิกต่อได้เลย",
    resent: "ส่ง OTP ใหม่เรียบร้อยแล้ว",
    missingConfig:
      "ยังไม่ได้ตั้งค่า Supabase keys โปรดเพิ่ม NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY เพื่อใช้งาน auth",
  },
};

const APP_CONTAINER_CLASS =
  "rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%),var(--surface)] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.26)] sm:p-6";
const APP_INPUT_CLASS =
  "w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/25";
const APP_PRIMARY_BUTTON_CLASS =
  "w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60";
const APP_SECONDARY_BUTTON_CLASS =
  "w-full rounded-2xl border border-border px-4 py-3 text-base font-semibold transition hover:bg-muted disabled:opacity-60";

export function VerifyOtpCard({ locale }: VerifyOtpCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const labels = labelsByLocale[locale];

  const method = searchParams.get("method");
  const value = searchParams.get("value");
  const referral = searchParams.get("ref");
  const validMethod = method === "phone" || method === "email" ? method : null;

  const [otpInput, setOtpInput] = useState("");
  const [busy, setBusy] = useState<"verify" | "resend" | null>(null);
  const [status, setStatus] = useState("");

  const goToCompletePage = () => {
    const params = new URLSearchParams();
    if (validMethod) {
      params.set("method", validMethod);
    }
    if (value) {
      params.set("value", value);
    }
    if (referral) {
      params.set("ref", referral);
    }
    const query = params.toString();
    router.push(`/${locale}/login/complete${query ? `?${query}` : ""}`);
  };

  const resendOtp = async () => {
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    if (!validMethod || !value) {
      setStatus(labels.invalidContext);
      return;
    }

    setStatus("");
    setBusy("resend");
    const payload =
      validMethod === "phone"
        ? { phone: value }
        : { email: value, options: { shouldCreateUser: true } };
    const { error } = await supabase.auth.signInWithOtp(payload);
    if (error) {
      setStatus(error.message);
      setBusy(null);
      return;
    }
    setBusy(null);
    setStatus(labels.resent);
  };

  const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    if (!validMethod || !value) {
      setStatus(labels.invalidContext);
      return;
    }
    if (!otpInput.trim()) {
      return;
    }

    setStatus("");
    setBusy("verify");
    const { error } =
      validMethod === "phone"
        ? await supabase.auth.verifyOtp({
            phone: value,
            token: otpInput.trim(),
            type: "sms",
          })
        : await supabase.auth.verifyOtp({
            email: value,
            token: otpInput.trim(),
            type: "email",
          });

    if (error) {
      setStatus(error.message);
      setBusy(null);
      return;
    }

    setBusy(null);
    setStatus(labels.verified);
    goToCompletePage();
  };

  return (
    <div className={`${APP_CONTAINER_CLASS} space-y-5`}>
      <div>
        <h2 className="text-3xl font-semibold text-foreground">{labels.title}</h2>
        <p className="mt-2 text-base text-muted-foreground">{labels.subtitle}</p>
      </div>

      {validMethod && value ? (
        <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">
          {validMethod === "phone" ? "Mobile" : "Email"}: {value}
        </p>
      ) : (
        <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">
          {labels.invalidContext}
        </p>
      )}

      <form onSubmit={verifyOtp} className="space-y-3">
        <label className="block text-lg font-semibold text-foreground">{labels.otpLabel}</label>
        <input
          required
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otpInput}
          onChange={(event) => setOtpInput(event.target.value)}
          placeholder={labels.otpPlaceholder}
          className={APP_INPUT_CLASS}
        />
        <button type="submit" className={APP_PRIMARY_BUTTON_CLASS} disabled={busy !== null}>
          {busy === "verify" ? "..." : labels.verifyButton}
        </button>
      </form>

      <button type="button" className={APP_SECONDARY_BUTTON_CLASS} onClick={resendOtp} disabled={busy !== null}>
        {busy === "resend" ? "..." : labels.resendButton}
      </button>

      {status ? <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">{status}</p> : null}

      <Link
        href={`/${locale}/login`}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-border px-4 py-3 text-base font-semibold hover:bg-muted"
      >
        {labels.backButton}
      </Link>
    </div>
  );
}
