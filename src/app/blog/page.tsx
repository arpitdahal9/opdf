import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";
import { allBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — How to merge, compress, split PDFs | PleaseFixMyPDF",
  description:
    "Guides and tips: how to merge PDF files, compress PDF, split PDF, convert Word to PDF. All in your browser.",
  alternates: { canonical: "https://pleasefixmypdf.com/blog/" },
  openGraph: {
    title: "Blog — How to merge, compress, split PDFs | PleaseFixMyPDF",
    description:
      "Guides and tips: how to merge PDF files, compress PDF, split PDF, convert Word to PDF. All in your browser.",
    url: "https://pleasefixmypdf.com/blog/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
];

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap mx-auto max-w-3xl space-y-10 px-4 pb-12 pt-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">
            How-to guides and tips for merging, compressing, splitting, and converting PDFs.
          </p>
        </header>

        <ul className="space-y-6">
          {allBlogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md dark:bg-gray-900 dark:border-gray-700"
              >
                <h2 className="font-semibold text-gray-900 dark:text-white">{post.h1}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
