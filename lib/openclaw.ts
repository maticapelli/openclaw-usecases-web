export type UseCase = {
  title: string;
  description: string;
  url: string;
  slug: string;
};

export type Category = {
  name: string;
  items: UseCase[];
};

const OWNER = "hesamsheikh";
const REPO = "awesome-openclaw-usecases";
const BRANCH = "main";

export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const README_RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/README.md`;

export function toGithubUrl(githubUrl: string) {
  const normalized = githubUrl.trim();

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const relativePath = normalized.replace(/^\.\//, "").replace(/^\//, "");
  return `${REPO_URL}/blob/${BRANCH}/${relativePath}`;
}

export function toRawUrl(githubUrl: string) {
  const normalized = githubUrl.trim();

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
      .replace("https://github.com/", "https://raw.githubusercontent.com/")
      .replace("/blob/", "/");
  }

  const relativePath = normalized.replace(/^\.\//, "").replace(/^\//, "");
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${relativePath}`;
}

export function slugFromUrlOrTitle(url: string, title: string) {
  const m = url.match(/\/usecases\/([^/]+)\.md/i);
  if (m?.[1]) return m[1].toLowerCase();
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseReadmeToCategories(readme: string): Category[] {
  const lines = readme.split("\n");
  const categories: Category[] = [];
  const usedSlugs = new Set<string>();

  let current: Category | null = null;
  let inTable = false;

  for (let line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      current = { name: h2[1].trim(), items: [] };
      categories.push(current);
      inTable = false;
      continue;
    }

    if (!current) continue;

    if (line.trim().toLowerCase().startsWith("| name")) {
      inTable = true;
      continue;
    }

    if (inTable && line.trim().match(/^\|\s*-+/)) continue;

    if (inTable && (!line.trim().startsWith("|") || line.trim() === "|")) {
      inTable = false;
      continue;
    }

    if (inTable && line.trim().startsWith("|")) {
      const cols = line.split("|").slice(1, -1).map((c) => c.trim());
      if (cols.length < 2) continue;

      const link = cols[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (!link) continue;

      const title = link[1].trim();
      const url = link[2].trim();
      const baseSlug = slugFromUrlOrTitle(url, title);
      let slug = baseSlug;
      let suffix = 2;

      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }

      usedSlugs.add(slug);

      current.items.push({
        title,
        description: cols[1],
        url,
        slug
      });
    }
  }

  return categories.filter((c) => c.items.length > 0);
}

export async function fetchCategories() {
  const res = await fetch(README_RAW, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch README");
  const text = await res.text();
  return parseReadmeToCategories(text);
}
