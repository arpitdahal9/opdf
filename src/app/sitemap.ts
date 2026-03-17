import type { MetadataRoute } from "next";

import { blogSlugs } from "@/lib/blog";
import {
  allConversionPaths,
  allToolPaths,
  alternativePaths,
  audiencePaths,
  comparePaths,
  microToolPaths,
  staticRoutes,
} from "@/lib/content";

export const dynamic = "force-static";

const baseUrl = "https://pleasefixmypdf.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    ...staticRoutes,
    "/tools",
    "/blog",
    ...allToolPaths,
    ...allConversionPaths,
    ...microToolPaths,
    ...comparePaths,
    ...alternativePaths,
    ...audiencePaths,
    ...blogSlugs.map((slug) => `/blog/${slug}`),
  ];

  return routes.map((route) => {
    const changeFrequency: "weekly" | "monthly" = route === "" ? "weekly" : "monthly";
    return {
      url: route ? `${baseUrl}${route}` : baseUrl,
      lastModified: new Date(),
      changeFrequency,
      priority: route === "" ? 1 : route.startsWith("/blog") ? 0.6 : 0.8,
    };
  });
}
