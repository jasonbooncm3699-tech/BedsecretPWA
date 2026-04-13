type AdminListCardProps = {
  title: string;
  description: string;
  items: string[];
};

export function AdminListCard({ title, description, items }: AdminListCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-foreground/90">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-muted px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
