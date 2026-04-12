export const SUPPORTED_LOCALES = ["en", "ms", "th"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const defaultLocale: Locale = "en";

export type TranslationDictionary = {
  nav: {
    home: string;
    products: string;
    reviews: string;
    member: string;
    faq: string;
  };
  common: {
    joinMember: string;
    orderViaWhatsapp: string;
    viewDetails: string;
    shopAll: string;
    referralRewards: string;
    socialProof: string;
  };
  home: {
    heroTitle: string;
    heroDescription: string;
    featuredProducts: string;
    whyJoinTitle: string;
    whyJoinDescription: string;
  };
  faq: {
    title: string;
    description: string;
  };
  member: {
    title: string;
    description: string;
    benefits: string[];
  };
  rewards: {
    title: string;
    claim: string;
  };
  legal: {
    privacy: string;
    terms: string;
    returns: string;
    cookie: string;
    faq: string;
  };
};

const dictionaries: Record<Locale, TranslationDictionary> = {
  en: {
    nav: {
      home: "Home",
      products: "Products",
      reviews: "Reviews",
      member: "Member",
      faq: "FAQ",
    },
    common: {
      joinMember: "Join Member",
      orderViaWhatsapp: "Order via WhatsApp",
      viewDetails: "View details",
      shopAll: "Shop All",
      referralRewards: "Referral & Rewards",
      socialProof: "Trusted Reviews",
    },
    home: {
      heroTitle: "Thai Viral Skincare Curated for Malaysia",
      heroDescription:
        "Discover proven skincare picks and order directly with our sales team on WhatsApp.",
      featuredProducts: "Featured Products",
      whyJoinTitle: "Join Bedsecret Member",
      whyJoinDescription:
        "Register once to collect rewards, track referrals, and receive exclusive restock offers.",
    },
    faq: {
      title: "Frequently Asked Questions",
      description:
        "Quick answers about ordering, membership, referrals, and vouchers.",
    },
    member: {
      title: "Member Access",
      description:
        "Public browsing is always open. Join membership to unlock referral tracking and voucher claims.",
      benefits: [
        "Unique referral code and share button",
        "Reward status tracking after friend purchases",
        "Voucher claim page for WhatsApp redemption",
        "Priority offers and restock updates",
      ],
    },
    rewards: {
      title: "My Rewards",
      claim: "Claim voucher",
    },
    legal: {
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      returns: "Returns",
      cookie: "Cookie Policy",
      faq: "FAQ",
    },
  },
  ms: {
    nav: {
      home: "Utama",
      products: "Produk",
      reviews: "Ulasan",
      member: "Ahli",
      faq: "Soalan Lazim",
    },
    common: {
      joinMember: "Sertai Ahli",
      orderViaWhatsapp: "Pesan di WhatsApp",
      viewDetails: "Lihat butiran",
      shopAll: "Lihat Semua",
      referralRewards: "Rujukan & Ganjaran",
      socialProof: "Ulasan Dipercayai",
    },
    home: {
      heroTitle: "Skincare Thai Viral Pilihan untuk Malaysia",
      heroDescription:
        "Terokai produk skincare yang terbukti dan buat pesanan terus dengan pasukan jualan kami di WhatsApp.",
      featuredProducts: "Produk Pilihan",
      whyJoinTitle: "Sertai Ahli Bedsecret",
      whyJoinDescription:
        "Daftar sekali untuk kumpul ganjaran, jejak rujukan, dan dapatkan tawaran restock eksklusif.",
    },
    faq: {
      title: "Soalan Lazim",
      description:
        "Jawapan ringkas mengenai pesanan, keahlian, rujukan, dan baucar.",
    },
    member: {
      title: "Akses Ahli",
      description:
        "Layari laman secara terbuka. Sertai keahlian untuk jejak rujukan dan tuntutan baucar.",
      benefits: [
        "Kod rujukan unik dengan butang kongsi",
        "Jejak status ganjaran selepas pembelian rakan",
        "Halaman tuntutan baucar untuk tebusan WhatsApp",
        "Tawaran eksklusif dan notis restock awal",
      ],
    },
    rewards: {
      title: "Ganjaran Saya",
      claim: "Tuntut baucar",
    },
    legal: {
      privacy: "Dasar Privasi",
      terms: "Terma & Syarat",
      returns: "Pemulangan",
      cookie: "Dasar Kuki",
      faq: "Soalan Lazim",
    },
  },
  th: {
    nav: {
      home: "หน้าแรก",
      products: "สินค้า",
      reviews: "รีวิว",
      member: "สมาชิก",
      faq: "คำถามที่พบบ่อย",
    },
    common: {
      joinMember: "สมัครสมาชิก",
      orderViaWhatsapp: "สั่งผ่าน WhatsApp",
      viewDetails: "ดูรายละเอียด",
      shopAll: "ดูทั้งหมด",
      referralRewards: "แนะนำเพื่อน & รางวัล",
      socialProof: "รีวิวจากลูกค้า",
    },
    home: {
      heroTitle: "สกินแคร์ไวรัลจากไทย คัดมาเพื่อมาเลเซีย",
      heroDescription:
        "ค้นหาผลิตภัณฑ์ที่กำลังมาแรงและสั่งซื้อผ่านทีมขายของเราบน WhatsApp ได้ทันที",
      featuredProducts: "สินค้าแนะนำ",
      whyJoinTitle: "สมัครสมาชิก Bedsecret",
      whyJoinDescription:
        "สมัครครั้งเดียวเพื่อสะสมรางวัล ติดตามการแนะนำเพื่อน และรับแจ้งเตือนสินค้าเข้าใหม่",
    },
    faq: {
      title: "คำถามที่พบบ่อย",
      description:
        "คำตอบสั้นๆ เกี่ยวกับการสั่งซื้อ สมาชิก การแนะนำเพื่อน และคูปอง",
    },
    member: {
      title: "สิทธิ์สมาชิก",
      description:
        "ทุกคนสามารถเข้าชมเว็บไซต์ได้ สมัครสมาชิกเพื่อใช้งานระบบแนะนำเพื่อนและรับคูปอง",
      benefits: [
        "โค้ดแนะนำเพื่อนเฉพาะบุคคลพร้อมปุ่มแชร์",
        "ติดตามสถานะรางวัลเมื่อเพื่อนซื้อสินค้า",
        "หน้ารับคูปองสำหรับใช้กับคำสั่งซื้อ WhatsApp",
        "รับข้อเสนอพิเศษและแจ้งเตือนสินค้าเข้าใหม่",
      ],
    },
    rewards: {
      title: "รางวัลของฉัน",
      claim: "รับคูปอง",
    },
    legal: {
      privacy: "นโยบายความเป็นส่วนตัว",
      terms: "ข้อกำหนดและเงื่อนไข",
      returns: "การคืนสินค้า",
      cookie: "นโยบายคุกกี้",
      faq: "คำถามที่พบบ่อย",
    },
  },
};

export function isSupportedLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale];
}

