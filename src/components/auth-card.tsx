"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
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
  mode?: "start" | "complete";
};

type AuthLabels = {
  startTitle: string;
  startSubtitle: string;
  completeTitle: string;
  completeSubtitle: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSendButton: string;
  orText: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailSendButton: string;
  phoneSent: string;
  emailSent: string;
  profileButton: string;
  profileSaved: string;
  profileRequired: string;
  requiredFieldMessage: string;
  profileSaveError: string;
  signedInAs: string;
  signOut: string;
  loadingMember: string;
  phoneLockedHint: string;
  emailLockedHint: string;
  fullNamePlaceholder: string;
  dobLabel: string;
  missingConfig: string;
};

const authLabelsByLocale: Record<Locale, AuthLabels> = {
  en: {
    startTitle: "Member Sign In",
    startSubtitle: "Choose one option to continue.",
    completeTitle: "Complete Member Registration",
    completeSubtitle: "Enter your details to activate your member account.",
    phoneLabel: "Mobile phone",
    phonePlaceholder: "+60123456789",
    phoneSendButton: "Continue with phone",
    orText: "OR",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    emailSendButton: "Continue with email",
    phoneSent: "OTP sent to your mobile.",
    emailSent: "OTP sent to your email.",
    profileButton: "Save profile",
    profileSaved: "Profile saved. Redirecting to homepage...",
    profileRequired: "Please sign in first to continue.",
    requiredFieldMessage: "Full name, date of birth, and phone number are required.",
    profileSaveError: "Unable to save profile now. Please try again.",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    loadingMember: "Checking member session...",
    phoneLockedHint: "Verified phone number",
    emailLockedHint: "Verified email",
    fullNamePlaceholder: "Full name",
    dobLabel: "Date of birth",
    missingConfig:
      "Supabase environment keys are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth.",
  },
  ms: {
    startTitle: "Log Masuk Ahli",
    startSubtitle: "Pilih satu pilihan untuk teruskan.",
    completeTitle: "Lengkapkan Pendaftaran Ahli",
    completeSubtitle: "Isi maklumat anda untuk aktifkan akaun ahli.",
    phoneLabel: "Nombor telefon",
    phonePlaceholder: "+60123456789",
    phoneSendButton: "Teruskan dengan telefon",
    orText: "ATAU",
    emailLabel: "E-mel",
    emailPlaceholder: "anda@contoh.com",
    emailSendButton: "Teruskan dengan e-mel",
    phoneSent: "OTP telah dihantar ke telefon anda.",
    emailSent: "OTP telah dihantar ke e-mel anda.",
    profileButton: "Simpan profil",
    profileSaved: "Profil berjaya disimpan. Mengalihkan ke laman utama...",
    profileRequired: "Sila log masuk dahulu untuk teruskan.",
    requiredFieldMessage: "Nama penuh, tarikh lahir, dan nombor telefon adalah wajib.",
    profileSaveError: "Profil tidak dapat disimpan sekarang. Cuba lagi.",
    signedInAs: "Log masuk sebagai",
    signOut: "Log keluar",
    loadingMember: "Sedang semak sesi ahli...",
    phoneLockedHint: "Nombor telefon disahkan",
    emailLockedHint: "E-mel disahkan",
    fullNamePlaceholder: "Nama penuh",
    dobLabel: "Tarikh lahir",
    missingConfig:
      "Kunci persekitaran Supabase belum ditetapkan. Tambah NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk aktifkan auth.",
  },
  th: {
    startTitle: "เข้าสู่ระบบสมาชิก",
    startSubtitle: "เลือกหนึ่งวิธีเพื่อดำเนินการต่อ",
    completeTitle: "กรอกข้อมูลสมาชิกให้ครบ",
    completeSubtitle: "กรอกข้อมูลเพื่อเปิดใช้งานบัญชีสมาชิกของคุณ",
    phoneLabel: "เบอร์มือถือ",
    phonePlaceholder: "+60123456789",
    phoneSendButton: "เข้าสู่ระบบด้วยมือถือ",
    orText: "หรือ",
    emailLabel: "อีเมล",
    emailPlaceholder: "you@example.com",
    emailSendButton: "เข้าสู่ระบบด้วยอีเมล",
    phoneSent: "ส่ง OTP ไปยังมือถือแล้ว",
    emailSent: "ส่ง OTP ไปยังอีเมลแล้ว",
    profileButton: "บันทึกโปรไฟล์",
    profileSaved: "บันทึกโปรไฟล์แล้ว กำลังไปหน้าแรก...",
    profileRequired: "กรุณาเข้าสู่ระบบก่อนเพื่อดำเนินการต่อ",
    requiredFieldMessage: "ต้องกรอกชื่อเต็ม วันเกิด และหมายเลขโทรศัพท์",
    profileSaveError: "ไม่สามารถบันทึกโปรไฟล์ได้ในตอนนี้ โปรดลองอีกครั้ง",
    signedInAs: "เข้าสู่ระบบเป็น",
    signOut: "ออกจากระบบ",
    loadingMember: "กำลังตรวจสอบเซสชันสมาชิก...",
    phoneLockedHint: "ยืนยันเบอร์โทรแล้ว",
    emailLockedHint: "ยืนยันอีเมลแล้ว",
    fullNamePlaceholder: "ชื่อเต็ม",
    dobLabel: "วันเกิด",
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

export function AuthCard({ locale, mode = "start" }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [profileForm, setProfileForm] = useState<MemberProfileFormInput>({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    email: "",
  });
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionPhone, setSessionPhone] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [hydrating, setHydrating] = useState(mode === "complete" && Boolean(supabase));
  const [status, setStatus] = useState("");
  const [busyProvider, setBusyProvider] = useState<"phone" | "email" | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const labels = authLabelsByLocale[locale];
  const referral = searchParams.get("ref");
  const isSignedIn = Boolean(sessionUserId);
  const isSignedInWithPhone = Boolean(sessionPhone?.trim());
  const isSignedInWithEmail = Boolean(sessionEmail?.trim());
  const resolvedProfilePhone = isSignedInWithPhone ? sessionPhone ?? "" : profileForm.phone;
  const resolvedProfileEmail = isSignedInWithEmail ? sessionEmail ?? "" : profileForm.email;

  useEffect(() => {
    if (mode !== "complete" || !supabase) {
      return;
    }

    let active = true;

    const hydrateSessionAndProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) {
        return;
      }

      if (error) {
        setStatus(error.message);
        setHydrating(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setHydrating(false);
        router.replace(`/${locale}/login${referral ? `?ref=${encodeURIComponent(referral)}` : ""}`);
        return;
      }

      const sessionMember: SessionMember = {
        id: user.id,
        email: user.email ?? null,
        phone: user.phone ?? null,
      };

      setSessionUserId(sessionMember.id);
      setSessionEmail(sessionMember.email);
      setSessionPhone(sessionMember.phone);

      const bootstrappedProfile = await bootstrapMemberProfile(supabase, sessionMember, referral);
      if (!active) {
        return;
      }

      if (bootstrappedProfile) {
        setProfile(bootstrappedProfile);
        setProfileForm({
          fullName: bootstrappedProfile.full_name ?? "",
          phone: bootstrappedProfile.phone ?? sessionMember.phone ?? "",
          dateOfBirth: bootstrappedProfile.date_of_birth ?? "",
          email: bootstrappedProfile.email ?? sessionMember.email ?? "",
        });
      } else {
        setProfileForm({
          fullName: "",
          phone: sessionMember.phone ?? "",
          dateOfBirth: "",
          email: sessionMember.email ?? "",
        });
      }

      setHydrating(false);
    };

    void hydrateSessionAndProfile();

    return () => {
      active = false;
    };
  }, [locale, mode, referral, router, supabase]);

  const goToVerifyPage = (method: "phone" | "email", value: string) => {
    const params = new URLSearchParams({
      method,
      value,
    });
    if (referral) {
      params.set("ref", referral);
    }
    router.push(`/${locale}/login/verify?${params.toString()}`);
  };

  const handleSendPhoneOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    const normalizedPhone = phoneInput.trim();
    if (!normalizedPhone) {
      return;
    }

    setStatus("");
    setBusyProvider("phone");
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }

    setStatus(labels.phoneSent);
    setBusyProvider(null);
    goToVerifyPage("phone", normalizedPhone);
  };

  const handleSendEmailOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    const normalizedEmail = emailInput.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    setStatus("");
    setBusyProvider("email");
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }

    setStatus(labels.emailSent);
    setBusyProvider(null);
    goToVerifyPage("email", normalizedEmail);
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    if (!sessionUserId) {
      setStatus(labels.profileRequired);
      return;
    }

    const nextFullName = profileForm.fullName.trim();
    const nextDateOfBirth = profileForm.dateOfBirth;
    const nextPhone = resolvedProfilePhone.trim();
    const nextEmail = resolvedProfileEmail.trim();

    if (!nextFullName || !nextDateOfBirth || !nextPhone) {
      setStatus(labels.requiredFieldMessage);
      return;
    }

    setStatus("");
    setSavingProfile(true);
    const savedProfile = await saveMemberProfileForm(supabase, sessionUserId, {
      fullName: nextFullName,
      phone: nextPhone,
      dateOfBirth: nextDateOfBirth,
      email: nextEmail,
    });
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
      email: savedProfile.email ?? "",
    });

    setStatus(labels.profileSaved);
    router.push(`/${locale}`);
    router.refresh();
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    router.replace(`/${locale}/login${referral ? `?ref=${encodeURIComponent(referral)}` : ""}`);
  };

  if (mode === "complete") {
    return (
      <div className={`${APP_CONTAINER_CLASS} space-y-5`}>
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{labels.completeTitle}</h2>
          <p className="mt-2 text-base text-muted-foreground">{labels.completeSubtitle}</p>
        </div>

        {hydrating ? (
          <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">{labels.loadingMember}</p>
        ) : (
          <>
            {isSignedIn ? (
              <p className="text-sm text-muted-foreground">
                {labels.signedInAs}:{" "}
                <span className="font-medium text-foreground">
                  {sessionEmail ?? sessionPhone ?? "member"}
                </span>
              </p>
            ) : null}
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <input
                required
                value={profileForm.fullName}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                placeholder={labels.fullNamePlaceholder}
                className={APP_INPUT_CLASS}
                disabled={!isSignedIn || savingProfile}
              />
              <input
                required
                type="tel"
                value={resolvedProfilePhone}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder={isSignedInWithPhone ? labels.phoneLockedHint : labels.phoneLabel}
                className={APP_INPUT_CLASS}
                disabled={!isSignedIn || savingProfile || isSignedInWithPhone}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">{labels.dobLabel}</label>
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
                  className={APP_INPUT_CLASS}
                  disabled={!isSignedIn || savingProfile}
                />
              </div>
              <input
                type="email"
                value={resolvedProfileEmail}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder={isSignedInWithEmail ? labels.emailLockedHint : labels.emailLabel}
                className={APP_INPUT_CLASS}
                disabled={!isSignedIn || savingProfile || isSignedInWithEmail}
              />
              <button
                type="submit"
                className={APP_PRIMARY_BUTTON_CLASS}
                disabled={!isSignedIn || savingProfile}
              >
                {savingProfile ? "..." : labels.profileButton}
              </button>
            </form>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-2xl border border-border px-4 py-3 text-base font-semibold transition hover:bg-muted"
            >
              {labels.signOut}
            </button>

            {profile?.referral_code ? (
              <p className="text-xs text-muted-foreground">
                Referral code: <span className="font-semibold text-foreground">{profile.referral_code}</span>
              </p>
            ) : null}
          </>
        )}

        {status ? <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">{status}</p> : null}

        <p className="text-xs text-muted-foreground">
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

  return (
    <div className={`${APP_CONTAINER_CLASS} space-y-5`}>
      <div>
        <h2 className="text-3xl font-semibold text-foreground">{labels.startTitle}</h2>
        <p className="mt-2 text-base text-muted-foreground">{labels.startSubtitle}</p>
      </div>

      <form onSubmit={handleSendPhoneOtp} className="space-y-3">
        <label className="block text-lg font-semibold text-foreground">{labels.phoneLabel}</label>
        <input
          required
          type="tel"
          value={phoneInput}
          onChange={(event) => setPhoneInput(event.target.value)}
          placeholder={labels.phonePlaceholder}
          className={APP_INPUT_CLASS}
        />
        <button type="submit" className={APP_PRIMARY_BUTTON_CLASS} disabled={busyProvider !== null}>
          {busyProvider === "phone" ? "..." : labels.phoneSendButton}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/80" />
        <span className="text-sm font-semibold tracking-wider text-muted-foreground">{labels.orText}</span>
        <div className="h-px flex-1 bg-border/80" />
      </div>

      <form onSubmit={handleSendEmailOtp} className="space-y-3">
        <label className="block text-lg font-semibold text-foreground">{labels.emailLabel}</label>
        <input
          required
          type="email"
          value={emailInput}
          onChange={(event) => setEmailInput(event.target.value)}
          placeholder={labels.emailPlaceholder}
          className={APP_INPUT_CLASS}
        />
        <button type="submit" className={APP_SECONDARY_BUTTON_CLASS} disabled={busyProvider !== null}>
          {busyProvider === "email" ? "..." : labels.emailSendButton}
        </button>
      </form>

      {status ? <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">{status}</p> : null}

      <p className="text-xs text-muted-foreground">
        Supabase Auth must have Phone and Email providers enabled.
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
