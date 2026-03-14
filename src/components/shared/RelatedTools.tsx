import Link from "next/link";

export type RelatedTool = { href: string; label: string };

export function RelatedTools({ tools }: { tools: RelatedTool[] }) {
  if (!tools.length) return null;

  return (
    <section className="border-t border-border pt-10 dark:border-gray-700" aria-label="Related tools">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">You might also need</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              {tool.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
