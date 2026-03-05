"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toGithubUrl, type Category } from "@/lib/openclaw";

export default function ClientSearch({ categories }: { categories: Category[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((it) =>
          (it.title + " " + it.description + " " + cat.name).toLowerCase().includes(query)
        )
      }))
      .filter((cat) => cat.items.length > 0);
  }, [q, categories]);

  return (
    <div className="mt-8">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm"
      />

      {filtered.map((cat) => (
        <div key={cat.name} className="mt-8">
          <h2 className="text-lg font-semibold">{cat.name}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((it) => (
              <div
                key={`${cat.name}-${it.slug}`}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:bg-zinc-800"
              >
                <Link href={`/usecase/${it.slug}`} className="block">
                  <h3 className="font-medium">{it.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-3">{it.description}</p>
                </Link>
                <a
                  href={toGithubUrl(it.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs underline"
                >
                  Ver idea en GitHub
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
