"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n";
import {
  bootstrapMemberProfile,
  hasRequiredMemberDetails,
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
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSendButton: string;
  otpLabel: string;
  otpPlaceholder: string;
  otpVerifyButton: string;
  otpSent: string;
  otpVerified: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailButton: string;
  emailSent: string;
  profileTitle: string;
  profileNotePhone: string;
  profileNoteEmail: string;
  profileNoteFallback: string;
  phoneLockedHint: string;
  emailLockedHint: string;
  profileButton: string;
  profileSaved: string;
  profileRequired: string;
  requiredFieldMessage: string;
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
    subtitle:
      "Sign in with phone OTP or email link. After verification, complete member registration to unlock rewards.",
    phoneLabel: "Phone number (SMS OTP)",
    phonePlaceholder: "+60123456789",
    phoneSendButton: "Send OTP",
    otpLabel: "Enter OTP code",
    otpPlaceholder: "6-digit code",
    otpVerifyButton: "Verify OTP",
    otpSent: "OTP sent. Check your SMS and enter the code.",
    otpVerified: "Phone verified. Complete your member registration below.",
    emailLabel: "Email magic link",
    emailPlaceholder: "you@example.com",
    emailButton: "Send sign in link",
    emailSent: "Sign in link sent. Check your inbox to continue.",
    profileTitle: "Complete Member Registration",
    profileNotePhone:
      "Your phone is verified and locked. Add remaining details to activate member rewards.",
    profileNoteEmail:
      "Your email is verified and locked. Please add your phone and remaining details.",
    profileNoteFallback: "Complete your details below to activate member rewards.",
    phoneLockedHint: "Verified phone number (locked)",
    emailLockedHint: "Verified email (locked)",
    profileButton: "Save profile",
    profileSaved: "Profile saved. Redirecting to homepage...",
    profileRequired:
      "Please sign in first. Once signed in, complete your profile to continue.",
    requiredFieldMessage: "Full name, date of birth, and phone number are required.",
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
      "Log masuk menggunakan OTP telefon atau pautan emel. Selepas pengesahan, lengkapkan pendaftaran ahli untuk ganjaran.",
    phoneLabel: "Nombor telefon (OTP SMS)",
    phonePlaceholder: "+60123456789",
    phoneSendButton: "Hantar OTP",
    otpLabel: "Masukkan kod OTP",
    otpPlaceholder: "Kod 6 digit",
    otpVerifyButton: "Sahkan OTP",
    otpSent: "OTP telah dihantar. Semak SMS anda dan masukkan kod.",
    otpVerified: "Telefon berjaya disahkan. Lengkapkan pendaftaran ahli di bawah.",
    emailLabel: "Pautan ajaib emel",
    emailPlaceholder: "anda@contoh.com",
    emailButton: "Hantar pautan log masuk",
    emailSent: "Pautan log masuk dihantar. Sila semak peti masuk emel anda.",
    profileTitle: "Lengkapkan Pendaftaran Ahli",
    profileNotePhone:
      "Telefon anda telah disahkan dan dikunci. Isi maklumat selebihnya untuk aktifkan ganjaran.",
    profileNoteEmail:
      "Emel anda telah disahkan dan dikunci. Sila tambah nombor telefon dan maklumat lain.",
    profileNoteFallback: "Lengkapkan maklumat anda di bawah untuk aktifkan ganjaran ahli.",
    phoneLockedHint: "Nombor telefon disahkan (dikunci)",
    emailLockedHint: "Emel disahkan (dikunci)",
    profileButton: "Simpan profil",
    profileSaved: "Profil berjaya disimpan. Mengalihkan ke laman utama...",
    profileRequired:
      "Sila log masuk dahulu. Selepas itu, lengkapkan profil untuk teruskan.",
    requiredFieldMessage: "Nama penuh, tarikh lahir, dan nombor telefon adalah wajib.",
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
      "เข้าสู่ระบบด้วย OTP ทางโทรศัพท์หรือลิงก์อีเมล หลังยืนยันแล้วให้กรอกข้อมูลสมาชิกเพื่อปลดล็อกรางวัล",
    phoneLabel: "หมายเลขโทรศัพท์ (SMS OTP)",
    phonePlaceholder: "+60123456789",
    phoneSendButton: "ส่ง OTP",
    otpLabel: "กรอกรหัส OTP",
    otpPlaceholder: "รหัส 6 หลัก",
    otpVerifyButton: "ยืนยัน OTP",
    otpSent: "ส่ง OTP แล้ว กรุณาตรวจสอบ SMS และกรอกรหัส",
    otpVerified: "ยืนยันเบอร์โทรแล้ว กรุณากรอกข้อมูลสมาชิกด้านล่าง",
    emailLabel: "ลิงก์เข้าสู่ระบบทางอีเมล",
    emailPlaceholder: "you@example.com",
    emailButton: "ส่งลิงก์เข้าสู่ระบบ",
    emailSent: "ส่งลิงก์เข้าสู่ระบบแล้ว กรุณาตรวจสอบอีเมลของคุณ",
    profileTitle: "กรอกข้อมูลสมาชิกให้ครบ",
    profileNotePhone:
      "หมายเลขโทรศัพท์ของคุณยืนยันแล้วและล็อกไว้ กรุณากรอกข้อมูลที่เหลือเพื่อเปิดใช้งานรางวัล",
    profileNoteEmail:
      "อีเมลของคุณยืนยันแล้วและล็อกไว้ กรุณาเพิ่มหมายเลขโทรศัพท์และข้อมูลที่เหลือ",
    profileNoteFallback: "กรอกข้อมูลด้านล่างให้ครบเพื่อเปิดใช้งานรางวัลสมาชิก",
    phoneLockedHint: "หมายเลขโทรศัพท์ที่ยืนยันแล้ว (ล็อก)",
    emailLockedHint: "อีเมลที่ยืนยันแล้ว (ล็อก)",
    profileButton: "บันทึกโปรไฟล์",
    profileSaved: "บันทึกโปรไฟล์แล้ว กำลังไปหน้าแรก...",
    profileRequired: "กรุณาเข้าสู่ระบบก่อน จากนั้นกรอกโปรไฟล์เพื่อดำเนินการต่อ",
    requiredFieldMessage: "ต้องกรอกชื่อเต็ม วันเกิด และหมายเลขโทรศัพท์",
    profileSaveError: "ไม่สามารถบันทึกโปรไฟล์ได้ในตอนนี้ โปรดลองอีกครั้ง",
    signedInAs: "เข้าสู่ระบบเป็น",
    signOut: "ออกจากระบบ",
    loadingMember: "กำลังตรวจสอบเซสชันสมาชิก...",
    missingConfig:
      "ยังไม่ได้ตั้งค่า Supabase keys โปรดเพิ่ม NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY เพื่อใช้งาน auth",
  },
};

export function AuthCard({ locale }: AuthCardProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [phoneInput, setPhoneInput] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
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
  const [hydrating, setHydrating] = useState(Boolean(supabase));
  const [status, setStatus] = useState("");
  const [busyProvider, setBusyProvider] = useState<"phone" | "otp" | "email" | null>(null);
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
        setSessionPhone(null);
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
      setSessionPhone(user.phone);

      const bootstrapProfile = await bootstrapMemberProfile(supabase, user, referral);
      if (!active) {
        return;
      }

      if (!bootstrapProfile) {
        setProfile(null);
        return;
      }

      setProfile(bootstrapProfile);
      setProfileForm({
        fullName: bootstrapProfile.full_name ?? "",
        phone: bootstrapProfile.phone ?? user.phone ?? "",
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
          data.user
            ? {
                id: data.user.id,
                email: data.user.email ?? null,
                phone: data.user.phone ?? null,
              }
            : null,
        );
      })
      .finally(() => {
        if (active) {
          setHydrating(false);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void applyProfileState(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? null,
              phone: session.user.phone ?? null,
            }
          : null,
      );
      setHydrating(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [referral, supabase]);

  const normalizedPhoneInput = phoneInput.trim();
  const isSignedInWithPhone = Boolean(sessionPhone?.trim());
  const isSignedInWithEmail = Boolean(sessionEmail?.trim());
  const resolvedProfilePhone = isSignedInWithPhone ? sessionPhone ?? "" : profileForm.phone;
  const resolvedProfileEmail = isSignedInWithEmail ? sessionEmail ?? "" : profileForm.email;
  const profileNote = isSignedInWithPhone
    ? labels.profileNotePhone
    : isSignedInWithEmail
      ? labels.profileNoteEmail
      : labels.profileNoteFallback;

  const handleSendPhoneOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    if (!normalizedPhoneInput) {
      return;
    }

    setStatus("");
    setBusyProvider("phone");
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhoneInput,
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }

    setPendingPhone(normalizedPhoneInput);
    setOtpInput("");
    setStatus(labels.otpSent);
    setBusyProvider(null);
  };

  const handleVerifyPhoneOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus(labels.missingConfig);
      return;
    }
    if (!pendingPhone || !otpInput.trim()) {
      return;
    }

    setStatus("");
    setBusyProvider("otp");
    const { error } = await supabase.auth.verifyOtp({
      phone: pendingPhone,
      token: otpInput.trim(),
      type: "sms",
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }

    setPendingPhone("");
    setOtpInput("");
    setStatus(labels.otpVerified);
    setBusyProvider(null);
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
      email: emailInput.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus(error.message);
      setBusyProvider(null);
      return;
    }

    setStatus(labels.emailSent);
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

    const nextPhone = resolvedProfilePhone.trim();
    const nextFullName = profileForm.fullName.trim();
    const nextDateOfBirth = profileForm.dateOfBirth;
    if (!nextFullName || !nextDateOfBirth || !nextPhone) {
      setStatus(labels.requiredFieldMessage);
      return;
    }

    setStatus("");
    setSavingProfile(true);
    const savedProfile = await saveMemberProfileForm(supabase, sessionUserId, {
      fullName: nextFullName,
      dateOfBirth: nextDateOfBirth,
      phone: nextPhone,
      email: resolvedProfileEmail.trim(),
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
      email: savedProfile.email ?? sessionEmail ?? "",
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
    setStatus("");
  };

  return (
    <div className="space-y-6 rounded-3xl border border-border bg-surface p-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{labels.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      {!isSignedIn ? (
        <div className="space-y-4">
          <form onSubmit={handleSendPhoneOtp} className="space-y-2 rounded-2xl border border-border p-4">
            <label className="block text-sm font-medium text-foreground">{labels.phoneLabel}</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                required
                type="tel"
                value={phoneInput}
                onChange={(event) => setPhoneInput(event.target.value)}
                placeholder={labels.phonePlaceholder}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                disabled={busyProvider !== null}
              >
                {busyProvider === "phone" ? "..." : labels.phoneSendButton}
              </button>
            </div>
          </form>

          {pendingPhone ? (
            <form
              onSubmit={handleVerifyPhoneOtp}
              className="space-y-2 rounded-2xl border border-border p-4"
            >
              <label className="block text-sm font-medium text-foreground">{labels.otpLabel}</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  required
                  inputMode="numeric"
                  value={otpInput}
                  onChange={(event) => setOtpInput(event.target.value)}
                  placeholder={labels.otpPlaceholder}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
                  disabled={busyProvider !== null}
                >
                  {busyProvider === "otp" ? "..." : labels.otpVerifyButton}
                </button>
              </div>
            </form>
          ) : null}

          <form onSubmit={handleEmailMagicLink} className="space-y-2 rounded-2xl border border-border p-4">
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
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
                disabled={busyProvider !== null}
              >
                {busyProvider === "email" ? "..." : labels.emailButton}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {status ? (
        <p className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">{status}</p>
      ) : null}

      <div className="rounded-2xl border border-border bg-background p-4">
        <h3 className="text-base font-semibold">{labels.profileTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{profileNote}</p>
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
                  value={resolvedProfilePhone}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder={isSignedInWithPhone ? labels.phoneLockedHint : profilePlaceholders.phone}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  disabled={!isSignedIn || savingProfile || isSignedInWithPhone}
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
                  required={isSignedInWithEmail}
                  type="email"
                  value={resolvedProfileEmail}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder={isSignedInWithEmail ? labels.emailLockedHint : profilePlaceholders.email}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  disabled={!isSignedIn || savingProfile || isSignedInWithEmail}
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
            {profile?.referral_code && hasRequiredMemberDetails(profile) ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {profilePlaceholders.referralCode}:{" "}
                <span className="font-semibold text-foreground">{profile.referral_code}</span>
              </p>
            ) : null}
          </>
        )}
      </div>

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
