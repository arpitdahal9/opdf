import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pleasefixmypdf.com";
  const routes = [
    "",
    "/merge",
    "/split",
    "/rotate",
    "/reorder",
    "/compress",
    "/word-to-pdf",
    "/pdf-to-word",
    "/image-to-pdf",
    "/converter",
    "/about",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: "2025-06-01",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
