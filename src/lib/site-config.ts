export const siteConfig = {
  name: "Bedsecret",
  description: "Personal Care Solution",
  tagline: "Personal Care Solution",
  domain: "https://bedsecret.com",
  whatsappUrl: "https://wa.me/601135783151",
  whatsappNumber: "+601135783151",
  socialLinks: {
    tiktok: "https://www.tiktok.com/@bedsecretcare",
    instagram: "https://www.instagram.com/bedsecretmy",
    facebook: "https://www.facebook.com/bedsecret",
  },
  locales: ["en", "ms", "th"] as const,
};

export type SiteLocale = (typeof siteConfig.locales)[number];
