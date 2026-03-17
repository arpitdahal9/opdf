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
            The Cloud Education VIP Wall of Fame
          </h2>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            Behind every great PDF tool is a team of education professionals who generate an unreasonable amount of PDFs. These are the people who stress-tested this tool before you ever clicked a button — and the reason half these features exist.
          </p>
          <ul className="space-y-5 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3 rounded-lg border border-border bg-white/50 py-4 pl-4 pr-4 dark:border-gray-700 dark:bg-gray-800/50">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div className="min-w-0 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-white">Oshin Oli</span>
                <span className="text-gray-600 dark:text-gray-400"> — Senior Education Counsellor &amp; Migration Advisor.</span>
                <p className="text-[15px] leading-relaxed">
                  The OO herself. Chief PDF Complainer. Head of Quality Assurance (unofficial). The reason this website exists and the reason I eat well. Every feature request she makes comes with an implied threat to dinner.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border border-border bg-white/50 py-4 pl-4 pr-4 dark:border-gray-700 dark:bg-gray-800/50">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div className="min-w-0 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-white">Saksham Subedi</span>
                <span className="text-gray-600 dark:text-gray-400"> — Co-Founder &amp; COO, Cloud Education Group.</span>
                <p className="text-[15px] leading-relaxed">
                  The man running the ship that generates the PDFs that broke my wife&apos;s spirit that led to this website. In a way, this is all his fault. Thank you, Saksham.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border border-border bg-white/50 py-4 pl-4 pr-4 dark:border-gray-700 dark:bg-gray-800/50">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div className="min-w-0 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-white">Sangam Subedi</span>
                <span className="text-gray-600 dark:text-gray-400"> — Qualified Education Agent Counsellor (QEAC 13566), Cloud Education.</span>
                <p className="text-[15px] leading-relaxed">
                  Another Subedi in the game. At this point I&apos;m convinced the Subedis have a monopoly on education consulting. Sangam, if you&apos;re reading this — you&apos;re welcome for the free PDF merges.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border border-border bg-white/50 py-4 pl-4 pr-4 dark:border-gray-700 dark:bg-gray-800/50">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div className="min-w-0 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-white">Shreesham Shrestha</span>
                <span className="text-gray-600 dark:text-gray-400"> — Senior Business Development Manager, Cloud Education.</span>
                <p className="text-[15px] leading-relaxed">
                  The man developing business so fast, the PDFs can&apos;t keep up. Shreesham generates paperwork at a pace that would make a government office jealous.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border border-border bg-white/50 py-4 pl-4 pr-4 dark:border-gray-700 dark:bg-gray-800/50">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div className="min-w-0 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-white">Amita Baniya</span>
                <span className="text-gray-600 dark:text-gray-400"> — Onshore Visa &amp; Admission Coordinator.</span>
                <p className="text-[15px] leading-relaxed">
                  If your visa got processed and your documents were in order, there&apos;s a chance Amita merged them here first. Open to work and absolutely cracked at document wrangling.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border border-border bg-amber-50/80 py-4 pl-4 pr-4 dark:border-amber-700/40 dark:bg-amber-950/30">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div className="min-w-0 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-white">MARA dai</span>
                <span className="text-gray-600 dark:text-gray-400"> — Migration Agents Registration Authority.</span>
                <p className="text-[15px] leading-relaxed">
                  The final boss. The one they all answer to. You don&apos;t merge PDFs for MARA dai — you merge PDFs because of MARA dai. Respect the dai. 🙏
                </p>
              </div>
            </li>
          </ul>
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
