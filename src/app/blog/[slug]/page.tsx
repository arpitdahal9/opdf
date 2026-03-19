import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { FAQSection } from "@/components/shared/FAQSection";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { getBlogPost, blogSlugs } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://pleasefixmypdf.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pleasefixmypdf.com/blog/${post.slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.h1, url: `/blog/${post.slug}` },
  ];

  const faqItems = post.faqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <article className="page-wrap mx-auto max-w-3xl space-y-8 px-4 pb-12 pt-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.h1}</h1>
          <p className="text-gray-600 dark:text-gray-400">{post.description}</p>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          {post.body.map((block, i) => {
            const trimmed = block.trim();
            const key = `${post.slug}-block-${i}`;

            const h2Prefix = "## ";
            const h3Prefix = "### ";
            const h4Prefix = "#### ";

            if (trimmed.startsWith(h2Prefix)) {
              return (
                <h2 key={key} className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  {trimmed.slice(h2Prefix.length)}
                </h2>
              );
            }

            if (trimmed.startsWith(h3Prefix)) {
              return (
                <h3 key={key} className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  {trimmed.slice(h3Prefix.length)}
                </h3>
              );
            }

            if (trimmed.startsWith(h4Prefix)) {
              return (
                <h4 key={key} className="mt-5 text-base font-semibold text-gray-900 dark:text-white">
                  {trimmed.slice(h4Prefix.length)}
                </h4>
              );
            }

            if (trimmed.startsWith("[[Screenshot:") && trimmed.endsWith("]]")) {
              const label = trimmed.replace("[[Screenshot:", "").replace("]]", "").trim();
              return (
                <div
                  key={key}
                  className="my-6 rounded-xl border border-border bg-muted/30 p-4 text-sm text-gray-700 dark:bg-muted/10 dark:text-gray-200"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">Screenshot</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{label}</p>
                </div>
              );
            }

            return (
              <p key={key} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
          <p className="font-medium text-gray-900 dark:text-white mb-2">Use our tools</p>
          <ul className="flex flex-wrap gap-3">
            {post.toolLinks.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  {t.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <FAQSection items={faqItems} />
        {post.relatedBlogLinks?.length ? (
          <div className="rounded-xl border border-border bg-white p-4 dark:bg-gray-900 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Related guides</p>
            <ul className="flex flex-wrap gap-3">
              {post.relatedBlogLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <RelatedTools tools={post.toolLinks} />
      </article>
    </>
  );
}
