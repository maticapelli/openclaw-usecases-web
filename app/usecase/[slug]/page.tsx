import type { Metadata } from "next";
import Link from "next/link";
import { getUseCaseIndex } from "@/lib/index";
import { toGithubUrl, toRawUrl } from "@/lib/openclaw";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

const APP_TITLE = "Awesome OpenClaw Use Cases";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idx = await getUseCaseIndex();
  const entry = idx[slug];

  if (!entry) {
    return {
      title: `Use case not found | ${APP_TITLE}`,
      description: "The requested use case was not found."
    };
  }

  return {
    title: `${entry.title} | ${APP_TITLE}`,
    description: entry.description
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = await getUseCaseIndex();
  const entry = idx[slug];

  if (!entry) {
    return <div className="p-10">Use case not found.</div>;
  }

  const raw = toRawUrl(entry.url);
  let md = "";
  let loadError = false;

  try {
    const res = await fetch(raw, { next: { revalidate: 3600 } });
    if (!res.ok) {
      loadError = true;
    } else {
      md = await res.text();
    }
  } catch {
    loadError = true;
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm underline">
          ← Back
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">{entry.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{entry.category}</p>
        <a
          href={toGithubUrl(entry.url)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm underline"
        >
          Ver idea en GitHub
        </a>

        {loadError ? (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
            No pudimos cargar el contenido markdown en este momento.
            <div className="mt-3">
              <a
                href={toGithubUrl(entry.url)}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Abrir archivo en GitHub
              </a>
            </div>
          </div>
        ) : (
          <article className="markdown-body mt-8 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            >
              {md}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </main>
  );
}
