const BASE = "https://pleasefixmypdf.com";

export type BreadcrumbItem = { name: string; url: string };

function breadcrumbToJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbToJsonLd(items)) }}
    />
  );
}
