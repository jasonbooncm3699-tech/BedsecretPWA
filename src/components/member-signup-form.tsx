"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type MemberSignupFormProps = {
  locale: Locale;
};

export function MemberSignupForm({ locale }: MemberSignupFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");

  const labels: Record<
    Locale,
    {
      title: string;
      note: string;
      button: string;
      success: string;
      placeholders: {
        fullName: string;
        phone: string;
        email: string;
      };
    }
  > = {
    en: {
      title: "Create your member profile",
      note: "Complete your profile after social sign in to unlock rewards and referrals.",
      button: "Create account",
      success:
        "Profile captured. Next step: connect this form submission to your Supabase members table.",
      placeholders: {
        fullName: "Full name",
        phone: "Phone",
        email: "Email",
      },
    },
    ms: {
      title: "Cipta profil ahli anda",
      note: "Lengkapkan profil selepas log masuk sosial untuk aktifkan ganjaran dan rujukan.",
      button: "Cipta akaun",
      success:
        "Profil berjaya direkodkan. Langkah seterusnya: sambung penghantaran borang ini ke jadual ahli Supabase.",
      placeholders: {
        fullName: "Nama penuh",
        phone: "Nombor telefon",
        email: "E-mel",
      },
    },
    th: {
      title: "สร้างโปรไฟล์สมาชิกของคุณ",
      note: "กรอกโปรไฟล์หลังเข้าสู่ระบบโซเชียลเพื่อเปิดใช้งานรางวัลและการแนะนำเพื่อน",
      button: "สร้างบัญชี",
      success:
        "บันทึกโปรไฟล์เรียบร้อย ขั้นตอนถัดไปคือเชื่อมการส่งฟอร์มนี้เข้าตารางสมาชิกใน Supabase",
      placeholders: {
        fullName: "ชื่อ-นามสกุล",
        phone: "เบอร์โทรศัพท์",
        email: "อีเมล",
      },
    },
  };

  const text = labels[locale];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="text-xl font-semibold text-foreground">{text.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{text.note}</p>

      {submitted ? (
        <p className="mt-4 rounded-xl bg-muted p-3 text-sm text-foreground">
          {text.success}
        </p>
      ) : (
        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!fullName || !phone || !dob || !email) {
              return;
            }
            setSubmitted(true);
          }}
        >
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={text.placeholders.fullName}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={text.placeholders.phone}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="date"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={text.placeholders.email}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="sm:col-span-2 mt-1 inline-flex justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {text.button}
          </button>
        </form>
      )}
    </div>
  );
}
