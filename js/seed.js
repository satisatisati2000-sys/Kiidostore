export const LOCAL_SEED = {
  settings: {
    docId: "store",
    data: {
      storeName: "KIIDO STORE",
      tagline: "Bounty Rush",
      whatsappNumber: "",
      instagramUrl: "https://instagram.com/kiido.store",
      defaultCurrency: "SAR",
      heroTitle: "KIIDO STORE",
      heroText: "",
      footerText: "KIIDO STORE",
      bgColor: "#120406",
      bg2Color: "#1A0508",
      surfaceColor: "#24070B",
      surface2Color: "#2D090E",
      primaryColor: "#E61E2A",
      primaryDarkColor: "#B3121D",
      primaryLightColor: "#FF3B47",
      maroonColor: "#6F0D14",
      textColor: "#FFFFFF",
      text2Color: "#E8D7D9",
      mutedColor: "#B99EA2",
      active: true
    }
  },
  categories: [
    { id: "cat_accounts", name: "الحسابات", icon: "👑", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80", subtitle: "", description: "", parentId: "", order: 1, active: true },
    { id: "cat_gems", name: "الجواهر", icon: "💎", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80", subtitle: "", description: "", parentId: "", order: 2, active: true },
    { id: "cat_platforms", name: "المنصات", icon: "🎮", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80", subtitle: "", description: "", parentId: "", order: 3, active: true },
    { id: "cat_special", name: "العروض", icon: "🔥", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", subtitle: "", description: "", parentId: "", order: 4, active: true },

    { id: "sub_acc_starter", name: "بداية قوية", icon: "⚡", image: "", subtitle: "", description: "", parentId: "cat_accounts", order: 1, active: true },
    { id: "sub_acc_legend", name: "أسطورية", icon: "🏆", image: "", subtitle: "", description: "", parentId: "cat_accounts", order: 2, active: true },
    { id: "sub_acc_ranked", name: "رانك", icon: "🎯", image: "", subtitle: "", description: "", parentId: "cat_accounts", order: 3, active: true },
    { id: "sub_gems_small", name: "صغيرة", icon: "✨", image: "", subtitle: "", description: "", parentId: "cat_gems", order: 1, active: true },
    { id: "sub_gems_mid", name: "متوسطة", icon: "💠", image: "", subtitle: "", description: "", parentId: "cat_gems", order: 2, active: true },
    { id: "sub_gems_mega", name: "كبيرة", icon: "🌟", image: "", subtitle: "", description: "", parentId: "cat_gems", order: 3, active: true },
    { id: "sub_ios", name: "iOS", icon: "🍎", image: "", subtitle: "", description: "", parentId: "cat_platforms", order: 1, active: true },
    { id: "sub_android", name: "Android", icon: "🤖", image: "", subtitle: "", description: "", parentId: "cat_platforms", order: 2, active: true },
    { id: "sub_flash", name: "Flash Deals", icon: "⚡", image: "", subtitle: "", description: "", parentId: "cat_special", order: 1, active: true },
    { id: "sub_bundle", name: "Bundles", icon: "🎁", image: "", subtitle: "", description: "", parentId: "cat_special", order: 2, active: true }
  ],
  products: [
    { id: "prod_acc_starter_01", name: "حساب بداية ناري", price: 79, oldPrice: 99, badge: "مميز", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_accounts", subcategoryId: "sub_acc_starter", deliveryText: "تسليم فوري", shortText: "", description: "حساب مناسب للبداية السريعة.", details: "", order: 1, active: true },
    { id: "prod_acc_legend_01", name: "حساب أسطوري فاخر", price: 249, oldPrice: 289, badge: "Legend", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_accounts", subcategoryId: "sub_acc_legend", deliveryText: "جاهز للتسليم", shortText: "", description: "حساب نادر للمستخدمين الباحثين عن قيمة أعلى.", details: "", order: 2, active: true },
    { id: "prod_acc_ranked_01", name: "حساب رانك تنافسي", price: 139, oldPrice: 169, badge: "Ranked", image: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_accounts", subcategoryId: "sub_acc_ranked", deliveryText: "تسليم سريع", shortText: "", description: "حساب جاهز للتنافس.", details: "", order: 3, active: true },
    { id: "prod_gems_small_01", name: "باقة جواهر 250", price: 29, oldPrice: 35, badge: "Quick", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_gems", subcategoryId: "sub_gems_small", deliveryText: "تنفيذ سريع", shortText: "", description: "", details: "", order: 4, active: true },
    { id: "prod_gems_mid_01", name: "باقة جواهر 700", price: 69, oldPrice: 79, badge: "Popular", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_gems", subcategoryId: "sub_gems_mid", deliveryText: "تنفيذ مباشر", shortText: "", description: "", details: "", order: 5, active: true },
    { id: "prod_gems_mega_01", name: "باقة جواهر 1500", price: 129, oldPrice: 149, badge: "Best Value", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_gems", subcategoryId: "sub_gems_mega", deliveryText: "أفضل قيمة", shortText: "", description: "", details: "", order: 6, active: true },
    { id: "prod_bundle_01", name: "حزمة KIIDO المميزة", price: 199, oldPrice: 229, badge: "Bundle", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_special", subcategoryId: "sub_bundle", deliveryText: "تسليم خلال وقت قصير", shortText: "", description: "", details: "", order: 7, active: true },
    { id: "prod_flash_01", name: "عرض خاطف محدود", price: 59, oldPrice: 75, badge: "Flash", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80", categoryId: "cat_special", subcategoryId: "sub_flash", deliveryText: "لفترة محدودة", shortText: "", description: "", details: "", order: 8, active: true }
  ],
  sliders: [
    { id: "slider_01", title: "الحسابات", text: "", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80", ctaLabel: "فتح", targetType: "category", targetId: "cat_accounts", categoryId: "cat_accounts", subcategoryId: "", productId: "", customUrl: "", order: 1, active: true },
    { id: "slider_02", title: "الجواهر", text: "", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80", ctaLabel: "فتح", targetType: "subcategory", targetId: "sub_gems_mega", categoryId: "cat_gems", subcategoryId: "sub_gems_mega", productId: "", customUrl: "", order: 2, active: true },
    { id: "slider_03", title: "مختارات", text: "", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80", ctaLabel: "فتح", targetType: "product", targetId: "prod_acc_legend_01", categoryId: "", subcategoryId: "", productId: "prod_acc_legend_01", customUrl: "", order: 3, active: true }
  ],
  banners: [
    { id: "banner_01", title: "الحسابات", text: "", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1600&q=80", targetType: "category", targetId: "cat_accounts", categoryId: "cat_accounts", subcategoryId: "", productId: "", customUrl: "", order: 1, active: true },
    { id: "banner_02", title: "الجواهر", text: "", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1600&q=80", targetType: "category", targetId: "cat_gems", categoryId: "cat_gems", subcategoryId: "", productId: "", customUrl: "", order: 2, active: true },
    { id: "banner_03", title: "Flash Deals", text: "", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80", targetType: "subcategory", targetId: "sub_flash", categoryId: "cat_special", subcategoryId: "sub_flash", productId: "", customUrl: "", order: 3, active: true },
    { id: "banner_04", title: "Best Value", text: "", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80", targetType: "product", targetId: "prod_gems_mega_01", categoryId: "", subcategoryId: "", productId: "prod_gems_mega_01", customUrl: "", order: 4, active: true }
  ],
  cards: [
    { id: "card_01", title: "أسطورية", text: "", image: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80", badge: "", icon: "🏆", cardKind: "link", sectionId: "", categoryId: "cat_accounts", subcategoryId: "sub_acc_legend", targetType: "subcategory", targetId: "sub_acc_legend", customUrl: "", order: 1, active: true },
    { id: "card_02", title: "سريعة", text: "", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1200&q=80", badge: "", icon: "💎", cardKind: "link", sectionId: "", categoryId: "cat_gems", subcategoryId: "sub_gems_small", targetType: "subcategory", targetId: "sub_gems_small", customUrl: "", order: 2, active: true },
    { id: "card_03", title: "Android", text: "", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", badge: "", icon: "🤖", cardKind: "link", sectionId: "", categoryId: "cat_platforms", subcategoryId: "sub_android", targetType: "subcategory", targetId: "sub_android", customUrl: "", order: 3, active: true },
    { id: "card_04", title: "iOS", text: "", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80", badge: "", icon: "🍎", cardKind: "link", sectionId: "", categoryId: "cat_platforms", subcategoryId: "sub_ios", targetType: "subcategory", targetId: "sub_ios", customUrl: "", order: 4, active: true },
    { id: "card_05", title: "Bundles", text: "", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", badge: "", icon: "🎁", cardKind: "link", sectionId: "", categoryId: "cat_special", subcategoryId: "sub_bundle", targetType: "subcategory", targetId: "sub_bundle", customUrl: "", order: 5, active: true },
    { id: "card_06", title: "Flash", text: "", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80", badge: "", icon: "⚡", cardKind: "link", sectionId: "", categoryId: "cat_special", subcategoryId: "sub_flash", targetType: "subcategory", targetId: "sub_flash", customUrl: "", order: 6, active: true },
    { id: "card_section_accounts", title: "الحسابات", text: "", image: "", badge: "", icon: "👑", cardKind: "section", sectionId: "accounts-section", categoryId: "cat_accounts", subcategoryId: "", targetType: "category", targetId: "cat_accounts", customUrl: "", order: 7, active: true },
    { id: "card_section_gems", title: "الجواهر", text: "", image: "", badge: "", icon: "💎", cardKind: "section", sectionId: "gems-section", categoryId: "cat_gems", subcategoryId: "", targetType: "category", targetId: "cat_gems", customUrl: "", order: 8, active: true }
  ],
  reviews: [
    { id: "review_01", name: "سالم", text: "الموقع مرتب وسريع والشراء واضح.", rating: 5, order: 1, active: true },
    { id: "review_02", name: "نواف", text: "البطاقات واضحة والوصول للعروض سهل.", rating: 5, order: 2, active: true },
    { id: "review_03", name: "رهف", text: "واجهة نظيفة جدًا على الجوال.", rating: 5, order: 3, active: true },
    { id: "review_04", name: "تركي", text: "التصنيفات والتنقل مرتبان بشكل ممتاز.", rating: 4, order: 4, active: true }
  ]
};
