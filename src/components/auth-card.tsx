"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n";

type AuthCardProps = {
  locale: Locale;
};

type AuthLabels = {
  title: string;
  subtitle: string;
  google: string;
  facebook: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailButton: string;
  profileTitle: string;
  profileNote: string;
  profileButton: string;
  success: string;
  missingConfig: string;
};

const authLabelsByLocale: Record<Locale, AuthLabels> = {
  en: {
    title: "Member Sign In",
    subtitle: "Continue with Google, Facebook, or email to join Bedsecret member.",
    google: "Continue with Google",
    facebook: "Continue with Facebook",
    emailLabel: "Email sign in link",
    emailPlaceholder: "you@example.com",
    emailButton: "Send sign in link",
    profileTitle: "Complete member profile",
    profileNote:
      "After social login, complete your profile to activate rewards and referral tracking.",
    profileButton: "Save profile",
    success: "Done. Check your email inbox for the sign in link.",
    missingConfig:
      "Supabase environment keys are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth.",
  },
  ms: {
    title: "Log Masuk Ahli",
    subtitle:
      "Teruskan dengan Google, Facebook, atau emel untuk sertai ahli Bedsecret.",
    google: "Teruskan dengan Google",
    facebook: "Teruskan dengan Facebook",
    emailLabel: "Pautan log masuk emel",
    emailPlaceholder: "anda@contoh.com",
    emailButton: "Hantar pautan log masuk",
    profileTitle: "Lengkapkan profil ahli",
    profileNote:
      "Selepas log masuk sosial, lengkapkan profil untuk aktifkan ganjaran dan jejak rujukan.",
    profileButton: "Simpan profil",
    success: "Selesai. Semak peti masuk emel anda untuk pautan log masuk.",
    missingConfig:
      "Kunci persekitaran Supabase belum ditetapkan. Tambah NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk aktifkan auth.",
  },
  th: {
    title: "เข้าสู่ระบบสมาชิก",
    subtitle:
      "เข้าสู่ระบบด้วย Google, Facebook หรืออีเมลเพื่อเป็นสมาชิก Bedsecret",
    google: "เข้าสู่ระบบด้วย Google",
    facebook: "เข้าสู่ระบบด้วย Facebook",
    emailLabel: "ลิงก์เข้าสู่ระบบผ่านอีเมล",
    emailPlaceholder: "you@example.com",
    emailButton: "ส่งลิงก์เข้าสู่ระบบ",
    profileTitle: "กรอกโปรไฟล์สมาชิก",
    profileNote:
      "หลังเข้าสู่ระบบโซเชียล โปรดกรอกโปรไฟล์เพื่อเปิดใช้งานรางวัลและระบบแนะนำเพื่อน",
    profileButton: "บันทึกโปรไฟล์",
    success: "เรียบร้อย กรุณาตรวจสอบอีเมลเพื่อคลิกลิงก์เข้าสู่ระบบ",
    missingConfig:
      "ยังไม่ได้ตั้งค่า Supabase keys โปรดเพิ่ม NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY เพื่อใช้งาน auth",
  },
};

export function AuthCard({ locale }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busyProvider, setBusyProvider] = useState<"google" | "facebook" | "email" | null>(
    null,
  );

  const labels = authLabelsByLocale[locale];
  const referral =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("ref")
      : null;
  const supabase = useMemo(() => getSupabaseClient(), []);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const redirectTo = `${origin}/${locale}/member${
    referral ? `?ref=${encodeURIComponent(referral)}` : ""
  }`;

  const handleOAuth = async (provider: "google" | "facebook") => {
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }

    setStatus("");
    setBusyProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }
  };

  const handleEmailMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }

    setStatus("");
    setBusyProvider("email");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }

    setStatus(labels.success);
    setBusyProvider(null);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-border bg-surface p-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{labels.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-60"
          disabled={busyProvider !== null}
        >
          {busyProvider === "google" ? "..." : labels.google}
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("facebook")}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-60"
          disabled={busyProvider !== null}
        >
          {busyProvider === "facebook" ? "..." : labels.facebook}
        </button>
      </div>

      <form onSubmit={handleEmailMagicLink} className="space-y-2">
        <label className="block text-sm font-medium text-foreground">{labels.emailLabel}</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={labels.emailPlaceholder}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            disabled={busyProvider !== null}
          >
            {busyProvider === "email" ? "..." : labels.emailButton}
          </button>
        </div>
      </form>

      {status ? (
        <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">{status}</p>
      ) : null}

      <div className="rounded-2xl border border-border bg-background p-4">
        <h3 className="text-base font-semibold">{labels.profileTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{labels.profileNote}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            placeholder="Full name"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          />
          <input
            placeholder="Phone"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          />
          <input
            type="date"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          className="mt-3 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          {labels.profileButton}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Supabase providers must be enabled in dashboard for Google/Facebook OAuth.
        <br />
        <Link href={`/${locale}/privacy`} className="underline">
          Privacy
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/terms`} className="underline">
          Terms
        </Link>
      </p>
    </div>
  );
}
