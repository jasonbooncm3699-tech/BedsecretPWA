"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type MemberSignupFormProps = {
  locale: Locale;
};

export function MemberSignupForm({ locale }: MemberSignupFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const labels: Record<Locale, { title: string; note: string; button: string }> = {
    en: {
      title: "Create your member profile",
      note: "This form is ready to connect with Supabase Auth and your member table.",
      button: "Create account",
    },
    ms: {
      title: "Cipta profil ahli anda",
      note: "Borang ini sedia disambung ke Supabase Auth dan jadual ahli anda.",
      button: "Cipta akaun",
    },
    th: {
      title: "สร้างโปรไฟล์สมาชิกของคุณ",
      note: "ฟอร์มนี้พร้อมเชื่อมต่อกับ Supabase Auth และตารางสมาชิกของคุณ",
      button: "สร้างบัญชี",
    },
  };

  const text = labels[locale];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="text-xl font-semibold text-foreground">{text.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{text.note}</p>

      {submitted ? (
        <p className="mt-4 rounded-xl bg-muted p-3 text-sm text-foreground">
          Thanks! Your member interest has been captured. Next step is enabling Supabase
          save on submit.
        </p>
      ) : (
        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            required
            placeholder="Full name"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="tel"
            placeholder="Phone"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="date"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="email"
            placeholder="Email"
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
