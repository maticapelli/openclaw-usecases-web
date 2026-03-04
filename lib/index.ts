import { fetchCategories, type UseCase } from "./openclaw";

export type UseCaseIndexEntry = UseCase & { category: string };

export async function getUseCaseIndex(): Promise<Record<string, UseCaseIndexEntry>> {
  const categories = await fetchCategories();

  const entries: UseCaseIndexEntry[] = categories.flatMap((c) =>
    c.items.map((it) => ({ ...it, category: c.name }))
  );

  return Object.fromEntries(entries.map((e) => [e.slug, e]));
}
