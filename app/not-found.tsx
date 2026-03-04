import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-semibold">404 - Page not found</h1>
        <p className="mt-3 text-sm text-zinc-400">
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
