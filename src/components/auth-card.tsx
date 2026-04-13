"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n";
import {
  bootstrapMemberProfile,
  saveMemberProfileForm,
  type MemberProfile,
  type MemberProfileFormInput,
  type SessionMember,
} from "@/lib/rewards";

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
  profileSaved: string;
  profileRequired: string;
  profileSaveError: string;
  signedInAs: string;
  signOut: string;
  loadingMember: string;
  missingConfig: string;
};

const profilePlaceholdersByLocale: Record<
  Locale,
  { fullName: string; phone: string; email: string; referralCode: string; memberFallback: string }
> = {
  en: {
    fullName: "Full name",
    phone: "Phone",
    email: "Email",
    referralCode: "Referral code",
    memberFallback: "member",
  },
  ms: {
    fullName: "Nama penuh",
    phone: "Nombor telefon",
    email: "E-mel",
    referralCode: "Kod rujukan",
    memberFallback: "ahli",
  },
  th: {
    fullName: "ชื่อเต็ม",
    phone: "เบอร์โทรศัพท์",
    email: "อีเมล",
    referralCode: "โค้ดแนะนำเพื่อน",
    memberFallback: "สมาชิก",
  },
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
    profileSaved: "Profile saved. Your rewards dashboard is now linked.",
    profileRequired:
      "Please sign in first. Once signed in, complete your profile to continue.",
    profileSaveError: "Unable to save profile now. Please try again.",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    loadingMember: "Checking member session...",
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
    profileSaved: "Profil berjaya disimpan. Dashboard ganjaran kini dipautkan.",
    profileRequired:
      "Sila log masuk dahulu. Selepas itu, lengkapkan profil untuk teruskan.",
    profileSaveError: "Profil tidak dapat disimpan sekarang. Cuba lagi.",
    signedInAs: "Log masuk sebagai",
    signOut: "Log keluar",
    loadingMember: "Sedang semak sesi ahli...",
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
    profileSaved: "บันทึกโปรไฟล์แล้ว เชื่อมต่อแดชบอร์ดรางวัลเรียบร้อย",
    profileRequired: "กรุณาเข้าสู่ระบบก่อน จากนั้นกรอกโปรไฟล์เพื่อดำเนินการต่อ",
    profileSaveError: "ไม่สามารถบันทึกโปรไฟล์ได้ในตอนนี้ โปรดลองอีกครั้ง",
    signedInAs: "เข้าสู่ระบบเป็น",
    signOut: "ออกจากระบบ",
    loadingMember: "กำลังตรวจสอบเซสชันสมาชิก...",
    missingConfig:
      "ยังไม่ได้ตั้งค่า Supabase keys โปรดเพิ่ม NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY เพื่อใช้งาน auth",
  },
};

export function AuthCard({ locale }: AuthCardProps) {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [emailInput, setEmailInput] = useState("");
  const [profileForm, setProfileForm] = useState<MemberProfileFormInput>({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    email: "",
  });
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [hydrating, setHydrating] = useState(Boolean(supabase));
  const [status, setStatus] = useState("");
  const [busyProvider, setBusyProvider] = useState<"google" | "facebook" | "email" | null>(
    null,
  );
  const [savingProfile, setSavingProfile] = useState(false);

  const labels = authLabelsByLocale[locale];
  const profilePlaceholders = profilePlaceholdersByLocale[locale];
  const referral =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("ref")
      : null;
  const isSignedIn = Boolean(sessionUserId);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const redirectTo = `${origin}/${locale}/member${
    referral ? `?ref=${encodeURIComponent(referral)}` : ""
  }`;

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    const applyProfileState = async (user: SessionMember | null) => {
      if (!active) {
        return;
      }

      if (!user) {
        setSessionUserId(null);
        setSessionEmail(null);
        setProfile(null);
        setProfileForm({
          fullName: "",
          phone: "",
          dateOfBirth: "",
          email: "",
        });
        return;
      }

      setSessionUserId(user.id);
      setSessionEmail(user.email);

      const bootstrapProfile = await bootstrapMemberProfile(supabase, user, referral);
      if (!active) {
        return;
      }

      if (!bootstrapProfile) {
        setProfile(null);
        setProfileForm((current) => ({
          ...current,
          email: user.email ?? current.email,
        }));
        return;
      }

      setProfile(bootstrapProfile);
      setProfileForm({
        fullName: bootstrapProfile.full_name ?? "",
        phone: bootstrapProfile.phone ?? "",
        dateOfBirth: bootstrapProfile.date_of_birth ?? "",
        email: bootstrapProfile.email ?? user.email ?? "",
      });
    };

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (error) {
          setStatus(error.message);
          return;
        }
        return applyProfileState(
          data.user ? { id: data.user.id, email: data.user.email ?? null } : null,
        );
      })
      .finally(() => {
        if (active) {
          setHydrating(false);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void applyProfileState(
        session?.user ? { id: session.user.id, email: session.user.email ?? null } : null,
      );
      setHydrating(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [referral, supabase]);

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
      email: emailInput,
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

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    if (!sessionUserId) {
      setStatus(labels.profileRequired);
      return;
    }

    setStatus("");
    setSavingProfile(true);
    const savedProfile = await saveMemberProfileForm(supabase, sessionUserId, profileForm);
    setSavingProfile(false);

    if (!savedProfile) {
      setStatus(labels.profileSaveError);
      return;
    }

    setProfile(savedProfile);
    setProfileForm({
      fullName: savedProfile.full_name ?? "",
      phone: savedProfile.phone ?? "",
      dateOfBirth: savedProfile.date_of_birth ?? "",
      email: savedProfile.email ?? sessionEmail ?? "",
    });
    setStatus(labels.profileSaved);
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    setStatus("");
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
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
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
        {hydrating ? (
          <p className="mt-3 text-sm text-muted-foreground">{labels.loadingMember}</p>
        ) : (
          <>
            {isSignedIn ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {labels.signedInAs}:{" "}
                <span className="font-medium text-foreground">
                  {sessionEmail ?? profilePlaceholders.memberFallback}
                </span>
              </p>
            ) : null}
            <form onSubmit={handleSaveProfile} className="mt-3 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  required
                  value={profileForm.fullName}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder={profilePlaceholders.fullName}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  disabled={!isSignedIn || savingProfile}
                />
                <input
                  required
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder={profilePlaceholders.phone}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  disabled={!isSignedIn || savingProfile}
                />
                <input
                  required
                  type="date"
                  value={profileForm.dateOfBirth}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      dateOfBirth: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  disabled={!isSignedIn || savingProfile}
                />
                <input
                  required
                  type="email"
                  value={profileForm.email}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder={profilePlaceholders.email}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  disabled={!isSignedIn || savingProfile}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
                  disabled={!isSignedIn || savingProfile}
                >
                  {savingProfile ? "Saving..." : labels.profileButton}
                </button>
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    {labels.signOut}
                  </button>
                ) : null}
              </div>
            </form>
            {profile?.referral_code ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {profilePlaceholders.referralCode}:{" "}
                <span className="font-semibold text-foreground">{profile.referral_code}</span>
              </p>
            ) : null}
          </>
        )}
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
