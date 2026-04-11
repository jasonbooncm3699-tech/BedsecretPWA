import type { Locale } from "@/lib/i18n";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  price: number;
  category: string;
  image: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
};

export type Review = {
  id: string;
  productId?: string;
  reviewer: string;
  rating: number;
  source: string;
  text: Record<Locale, string>;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "glow-recovery-serum",
    sku: "BED-THA-001",
    price: 89,
    category: "Serum",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    name: {
      en: "Glow Recovery Serum",
      ms: "Serum Pemulihan Seri",
      th: "เซรั่มฟื้นฟูผิวใส",
    },
    description: {
      en: "Lightweight serum for brighter and smoother daily skin care.",
      ms: "Serum ringan untuk kulit lebih cerah dan licin setiap hari.",
      th: "เซรั่มเนื้อบางเบาเพื่อผิวกระจ่างใสและเรียบเนียนทุกวัน",
    },
  },
  {
    id: "2",
    slug: "soft-cloud-cleanser",
    sku: "BED-THA-002",
    price: 69,
    category: "Cleanser",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80",
    name: {
      en: "Soft Cloud Cleanser",
      ms: "Pencuci Wajah Soft Cloud",
      th: "คลีนเซอร์โฟมนุ่ม",
    },
    description: {
      en: "Gentle foam cleanser that refreshes without drying the skin.",
      ms: "Pencuci buih lembut yang menyegarkan tanpa mengeringkan kulit.",
      th: "โฟมล้างหน้าอ่อนโยน สดชื่นโดยไม่ทำให้ผิวแห้ง",
    },
  },
  {
    id: "3",
    slug: "barrier-balance-cream",
    sku: "BED-THA-003",
    price: 109,
    category: "Moisturizer",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80",
    name: {
      en: "Barrier Balance Cream",
      ms: "Krim Keseimbangan Barrier",
      th: "ครีมเสริมเกราะป้องกันผิว",
    },
    description: {
      en: "Hydrating moisturizer that supports skin barrier comfort.",
      ms: "Pelembap yang menyokong keselesaan lapisan pelindung kulit.",
      th: "มอยส์เจอไรเซอร์เพิ่มความชุ่มชื้นและเสริมเกราะผิว",
    },
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    reviewer: "Nadia K.",
    rating: 5,
    source: "TikTok Shop",
    text: {
      en: "Texture is super light and my skin looks healthier in two weeks.",
      ms: "Tekstur sangat ringan dan kulit saya nampak lebih sihat dalam dua minggu.",
      th: "เนื้อเบามาก ผิวดูสุขภาพดีขึ้นภายในสองสัปดาห์",
    },
  },
  {
    id: "r2",
    productId: "2",
    reviewer: "Aina R.",
    rating: 5,
    source: "TikTok Review",
    text: {
      en: "No tight feeling after cleansing. Great for daily use.",
      ms: "Tiada rasa tegang selepas cuci muka. Sesuai untuk kegunaan harian.",
      th: "ล้างแล้วไม่ตึงผิว ใช้ได้ทุกวันดีมาก",
    },
  },
  {
    id: "r3",
    reviewer: "May S.",
    rating: 4,
    source: "Community Feedback",
    text: {
      en: "Fast delivery and very responsive on WhatsApp.",
      ms: "Penghantaran cepat dan sangat responsif di WhatsApp.",
      th: "จัดส่งไวและตอบแชต WhatsApp เร็วมาก",
    },
  },
];

type LegalDocumentKey = "privacy" | "terms" | "returns" | "cookie";

const legalContentByLocale: Record<Locale, Record<LegalDocumentKey, string>> = {
  en: {
    privacy:
      "Bedsecret stores member profile and referral data securely in Supabase. We only use your data for membership services, rewards, and communication updates.",
    terms:
      "All product purchases are currently managed through WhatsApp confirmation. Bedsecret may update product pricing, voucher rules, and campaign mechanics when needed.",
    returns:
      "Please contact our WhatsApp support within 3 days after receiving your order for damaged or wrong item requests. Return approval is reviewed case-by-case.",
    cookie:
      "Bedsecret uses essential cookies and optional analytics cookies to improve the experience. You can accept or reject optional cookies from the consent banner.",
  },
  ms: {
    privacy:
      "Bedsecret menyimpan data profil ahli dan rujukan secara selamat di Supabase. Data anda hanya digunakan untuk perkhidmatan keahlian, ganjaran, dan kemas kini komunikasi.",
    terms:
      "Semua pembelian produk buat masa ini diurus melalui pengesahan WhatsApp. Bedsecret boleh mengemas kini harga, peraturan baucar, dan mekanik kempen apabila perlu.",
    returns:
      "Sila hubungi sokongan WhatsApp kami dalam tempoh 3 hari selepas menerima pesanan bagi item rosak atau tersalah hantar. Kelulusan pemulangan dinilai secara kes demi kes.",
    cookie:
      "Bedsecret menggunakan kuki penting dan kuki analitik pilihan untuk menambah baik pengalaman pengguna. Anda boleh terima atau tolak kuki pilihan melalui banner persetujuan.",
  },
  th: {
    privacy:
      "Bedsecret จัดเก็บข้อมูลสมาชิกและข้อมูลการแนะนำเพื่อนอย่างปลอดภัยใน Supabase โดยใช้ข้อมูลเพื่อบริการสมาชิก รางวัล และการสื่อสารเท่านั้น",
    terms:
      "การสั่งซื้อทั้งหมดในขณะนี้ยืนยันผ่าน WhatsApp เท่านั้น Bedsecret สามารถปรับราคา เงื่อนไขคูปอง และรูปแบบแคมเปญได้ตามความเหมาะสม",
    returns:
      "หากได้รับสินค้าผิดหรือเสียหาย กรุณาติดต่อทีม WhatsApp ภายใน 3 วันหลังรับสินค้า การอนุมัติคืนสินค้าจะพิจารณาเป็นรายกรณี",
    cookie:
      "Bedsecret ใช้คุกกี้ที่จำเป็นและคุกกี้วิเคราะห์แบบเลือกได้เพื่อปรับปรุงประสบการณ์การใช้งาน คุณสามารถยอมรับหรือปฏิเสธคุกกี้ที่ไม่จำเป็นได้",
  },
};

export type ReferralRewardStatus = {
  referralCode: string;
  successfulPurchases: number;
  pendingReferrals: number;
  claimableValue: number;
  expiryDays: number;
};

export const sampleRewardStatus: ReferralRewardStatus = {
  referralCode: "BED-A7K9Q",
  successfulPurchases: 3,
  pendingReferrals: 2,
  claimableValue: 30,
  expiryDays: 60,
};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((review) => review.productId === productId);
}

export function getLegalContent(locale: Locale, key: LegalDocumentKey): string {
  return legalContentByLocale[locale][key];
}
