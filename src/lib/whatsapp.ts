import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n";

const defaultMessageByLocale: Record<Locale, string> = {
  en: "Hi Bedsecret, I want to order",
  ms: "Hi Bedsecret, saya mahu buat pesanan",
  th: "สวัสดี Bedsecret ฉันต้องการสั่งซื้อ",
};

type BuildWhatsappMessageArgs = {
  locale: Locale;
  productName: string;
  sku: string;
};

export function buildWhatsappOrderUrl({
  locale,
  productName,
  sku,
}: BuildWhatsappMessageArgs): string {
  const message = `${defaultMessageByLocale[locale]} ${productName} (SKU: ${sku}, Language: ${locale.toUpperCase()}).`;
  const query = new URLSearchParams({ text: message });
  return `${siteConfig.whatsappUrl}?${query.toString()}`;
}
