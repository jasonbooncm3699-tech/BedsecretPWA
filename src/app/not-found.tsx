import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for may have moved or is unavailable.
      </p>
      <Link
        href="/en"
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Back to Home
      </Link>
    </div>
  );
}
