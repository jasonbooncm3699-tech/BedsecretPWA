import { AdminListCard } from "@/components/admin-list-card";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Bedsecret Admin
        </p>
        <h1 className="text-3xl font-semibold">Operational Dashboard</h1>
        <p className="text-muted-foreground">
          Single-admin workspace for products, reviews, referrals, and legal content.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <AdminListCard
          title="Products"
          description="Manage active product list and detail content."
          items={[
            "Create/edit product SKU",
            "Set MYR pricing",
            "Control status visibility",
          ]}
        />
        <AdminListCard
          title="Reviews"
          description="Publish curated reviews from TikTok and social channels."
          items={[
            "Add review text manually",
            "Set review rating",
            "Assign optional product relation",
          ]}
        />
        <AdminListCard
          title="Referrals & Rewards"
          description="Track referrals and manually validate successful purchases."
          items={[
            "Mark referral as purchased",
            "Enter order amount",
            "Issue and redeem voucher codes",
          ]}
        />
      </section>
    </main>
  );
}
