"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm text-zinc-400">
          An unexpected error occurred while loading this page.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
