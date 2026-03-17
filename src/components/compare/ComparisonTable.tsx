import Link from "next/link";

export interface ComparisonRow {
  feature: string;
  pleasefix: string | boolean;
  competitor: string | boolean;
}

export function ComparisonTable({
  title,
  rows,
  competitorName,
}: {
  title: string;
  rows: ComparisonRow[];
  competitorName: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border dark:border-gray-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{title}</th>
            <th className="py-3 px-4 font-semibold text-primary">PleaseFixMyPDF</th>
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.feature}
              className="border-b border-border dark:border-gray-700 last:border-0"
            >
              <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                {row.feature}
              </td>
              <td className="py-3 px-4">
                {typeof row.pleasefix === "boolean" ? (row.pleasefix ? "Yes" : "No") : row.pleasefix}
              </td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                {typeof row.competitor === "boolean" ? (row.competitor ? "Yes" : "No") : row.competitor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompareCta() {
  return (
    <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 dark:bg-primary/10 text-center">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">
        Try PleaseFixMyPDF — no signup required
      </p>
      <Link href="/tools" className="primary-button inline-block">
        View all tools
      </Link>
    </div>
  );
}
