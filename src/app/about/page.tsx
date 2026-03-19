import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/shared/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "About PleaseFixMyPDF — PDF Tools Built with Love",
  description:
    "The story behind PleaseFixMyPDF.com — private PDF tools built by a developer for his wife.",
  alternates: { canonical: "https://pleasefixmypdf.com/about/" },
  openGraph: {
    title: "About PleaseFixMyPDF — PDF Tools Built with Love",
    description:
      "The story behind PleaseFixMyPDF.com — private PDF tools built by a developer for his wife.",
    url: "https://pleasefixmypdf.com/about/",
  },
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="page-wrap animate-fadeIn">
      <article className="card-surface mx-auto max-w-3xl space-y-10 p-6 sm:p-10">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            About PleaseFixMyPDF
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A love story told in merged documents and rotated pages.
          </p>
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            Yes, I know the name &ldquo;PleaseFixMyPDF&rdquo; is long — but all the other domains were already taken, and it&apos;s mostly for me, not you. Just kidding.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            The Origin Story
          </h2>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            It all started with my lovely wife, <strong className="text-gray-900 dark:text-white">OO</strong> — who, as it turns out, has a PDF problem. Not the fun kind. The &ldquo;I need to merge 12 student enrolment forms, three offer letters, and a visa checklist before my next counselling session&rdquo; kind.
          </p>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            As an education counsellor, OO lives in a world of PDFs. Student applications, university documents, compliance paperwork — her entire day is spent wrangling files that never seem to be in the right order, the right orientation, or the right format.
          </p>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            Every tool she tried online had the same playbook: let you do <em>one</em> thing, then hit you with a paywall, a signup form, and a newsletter you never asked for. She&apos;d sigh. I&apos;d hear the sigh from across the room. And when OO sighs… dinner quality drops. Dramatically.
          </p>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            Now, I&apos;m a simple man who lives by a simple equation:
          </p>
          <blockquote className="border-l-4 border-primary bg-primary/5 py-2 pl-4 pr-2 text-gray-800 dark:border-primary dark:bg-primary/10 dark:text-gray-200">
            <strong className="text-gray-900 dark:text-white">Happy Wife → Good Food → Happy Life</strong>
            <br />
            <span className="text-sm">— Peer-reviewed. Universally accepted. Not up for debate.</span>
          </blockquote>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            So I did what any reasonable developer-husband would do: I stayed up way too late, consumed mass amounts of coffee, argued with my code, and built an entire PDF toolkit from scratch — no uploads, no nonsense.
          </p>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            OO tested it. OO approved it. Dinner that night? <em>Outstanding.</em>
          </p>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            And that&apos;s how <strong className="text-gray-900 dark:text-white">PleaseFixMyPDF.com</strong> was born — not from a business plan or a startup pitch deck, but from the desperate culinary ambitions of a man who wanted his wife to stop fighting with PDF tools and start making biryani instead.
          </p>
        </section>

        <section className="space-y-4 border-t border-border pt-8 dark:border-gray-700">
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            Dedicated to OO
          </h2>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            Education counsellor by day. PDF power user by necessity. The woman who can merge student documents faster than I can write the code that merges them. You&apos;re the reason this exists — and the reason I eat well. I love you.
          </p>
          <p className="text-sm italic text-gray-600 dark:text-gray-400">
            (If you&apos;re reading this OO — yes, this counts as a romantic gesture. More romantic than debugging at 2am? Debatable. But close.)
          </p>
        </section>

        <section className="space-y-6 border-t border-border pt-8 dark:border-gray-700">
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            What we stand for
          </h2>
          <dl className="space-y-5 text-gray-700 dark:text-gray-300">
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white mb-1">100% Private</dt>
              <dd className="ml-0 pl-0 text-[15px] leading-relaxed">
                Your files never leave your browser. No servers, no uploads, no sneaky data collection. What happens in your tab stays in your tab.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white mb-1">Built with love (and caffeine)</dt>
              <dd className="ml-0 pl-0 text-[15px] leading-relaxed">
                A side project powered by late nights, strong coffee, and the unwavering motivation of a home-cooked meal.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white mb-1">Biryani-driven development</dt>
              <dd className="ml-0 pl-0 text-[15px] leading-relaxed">
                Every feature ships faster when dinner is on the line. Bug fixes get priority when dessert is at stake.
              </dd>
            </div>
          </dl>
        </section>

        <section className="space-y-6 border-t border-border pt-8 dark:border-gray-700">
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            Testimonial from the Cloud Education team
          </h2>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            Behind every great PDF tool is a team of education professionals who generate an unreasonable amount of PDFs. The Cloud Education team stress-tested this tool before you ever clicked a button — and they&apos;re the reason half these features exist.
          </p>
          <blockquote className="rounded-lg border border-border bg-white/50 py-4 pl-4 pr-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200">
              &ldquo;We process dozens of student PDFs every day. PleaseFixMyPDF is the only tool that stays fast and doesn&apos;t send files anywhere.&rdquo;
            </p>
            <cite className="mt-2 block text-sm not-italic text-gray-600 dark:text-gray-400">
              — Cloud Education team
            </cite>
          </blockquote>
        </section>

        <footer className="border-t border-border pt-8 text-center dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            OO-approved. Spouse-tested. Dinner-guaranteed.
          </p>
          <p className="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
            *Dinner not actually guaranteed. But your PDFs will be fixed.
          </p>
          <Link
            href="/merge"
            className="primary-button mt-6 inline-block"
          >
            Fix your PDFs
          </Link>
        </footer>
      </article>
    </div>
    </>
  );
}
