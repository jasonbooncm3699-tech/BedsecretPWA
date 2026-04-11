import { redirect } from "next/navigation";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { MemberSignupForm } from "@/components/member-signup-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    redirect("/en");
  }

  const activeLocale: Locale = locale;
  const t = getDictionary(activeLocale);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {t.common.joinMember}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">
          {t.member.title}
        </h1>
      </header>

      <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
        Social sign-in buttons (Google/Facebook) and Supabase email auth will be
        connected in the next backend integration step.
      </div>

      <div className="mt-6">
        <MemberSignupForm locale={activeLocale} />
      </div>
    </section>
  );
}
