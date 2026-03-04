import { fetchCategories, REPO_URL } from "@/lib/openclaw";
import ClientSearch from "@/components/client-search";

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">Awesome OpenClaw Use Cases</h1>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm underline"
        >
          Ver repositorio en GitHub
        </a>
        <ClientSearch categories={categories} />
      </div>
    </main>
  );
}
