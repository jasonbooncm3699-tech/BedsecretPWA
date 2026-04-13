import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { products } from "@/lib/data";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedBasePaths = [
    "",
    "/products",
    "/reviews",
    "/member",
    "/login",
    "/login/verify",
    "/login/complete",
    "/rewards",
  ];

  const staticUrls = SUPPORTED_LOCALES.flatMap((locale) =>
    localizedBasePaths.map((path) => ({
      url: `${siteConfig.domain}/${locale}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );

  const productUrls = SUPPORTED_LOCALES.flatMap((locale) =>
    products.map((product) => ({
      url: `${siteConfig.domain}/${locale}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...staticUrls, ...productUrls];
}
