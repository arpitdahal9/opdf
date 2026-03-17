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
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
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
        <RelatedTools tools={post.toolLinks} />
      </article>
    </>
  );
}
