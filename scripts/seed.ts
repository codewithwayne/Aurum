import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, productVariants } from "../src/lib/db/schema";

config({ path: ".env.local" });

// --- Sample data -----------------------------------------------------------
// These are illustrative products for development. Replace with real Aurum
// catalogue data before going live. Do not claim designer-original status;
// these are perfume oils sold under Aurum's own brand.
const seedData = [
  {
    slug: "velvet-oud",
    name: "Velvet Oud",
    brand: "Aurum Parfums",
    category: "unisex",
    shortDescription: "Rich, smoky oud wrapped in rose and sandalwood.",
    fullDescription:
      "Velvet Oud opens with a bright breath of bergamot before settling into a deep heart of oud and rose. The dry-down is warm and resinous, anchored by sandalwood and soft musk.",
    fragranceFamily: "Woody",
    scentNotes: {
      top: ["Bergamot"],
      heart: ["Oud", "Rose"],
      base: ["Sandalwood", "Musk"],
    },
    characteristics: ["woody", "warm", "smoky"],
    occasions: ["Evening", "Date Night", "Special Occasions"],
    seasons: ["Autumn", "Winter"],
    images: [],
    isBestseller: true,
    isNewArrival: false,
    isPublished: true,
    seoTitle: "Velvet Oud — Woody Unisex Perfume Oil | Aurum Parfums",
    seoDescription:
      "A smoky, resinous oud for evenings. Available in 10ml and 30ml perfume oils.",
    variants: [
      { size: "10ml", priceKes: 900, stock: 50, sku: "AU-VO-10" },
      { size: "30ml", priceKes: 2300, stock: 20, sku: "AU-VO-30" },
    ],
  },
  {
    slug: "citrus-ivory",
    name: "Citrus Ivory",
    brand: "Aurum Parfums",
    category: "unisex",
    shortDescription: "Bright citrus lifted with white florals and clean musk.",
    fullDescription:
      "A fresh, airy composition built around lemon, bergamot and neroli, grounded with a soft base of white musk and cedar.",
    fragranceFamily: "Fresh",
    scentNotes: {
      top: ["Lemon", "Bergamot"],
      heart: ["Neroli", "Jasmine"],
      base: ["White Musk", "Cedar"],
    },
    characteristics: ["fresh", "citrusy", "clean"],
    occasions: ["Everyday Wear", "Office", "Summer"],
    seasons: ["Spring", "Summer"],
    images: [],
    isBestseller: false,
    isNewArrival: true,
    isPublished: true,
    seoTitle: "Citrus Ivory — Fresh Unisex Perfume Oil | Aurum Parfums",
    seoDescription:
      "A bright, airy citrus for daily wear. Available in 10ml and 30ml perfume oils.",
    variants: [
      { size: "10ml", priceKes: 900, stock: 40, sku: "AU-CI-10" },
      { size: "30ml", priceKes: 2300, stock: 15, sku: "AU-CI-30" },
    ],
  },
  {
    slug: "midnight-jasmine",
    name: "Midnight Jasmine",
    brand: "Aurum Parfums",
    category: "women",
    shortDescription: "Night-blooming jasmine with amber and vanilla warmth.",
    fullDescription:
      "A rich floral built on jasmine sambac, layered with orange blossom and a warm base of amber, vanilla and sandalwood.",
    fragranceFamily: "Floral",
    scentNotes: {
      top: ["Orange Blossom"],
      heart: ["Jasmine", "Tuberose"],
      base: ["Amber", "Vanilla", "Sandalwood"],
    },
    characteristics: ["floral", "sweet", "warm"],
    occasions: ["Evening", "Date Night", "Special Occasions"],
    seasons: ["Autumn", "Winter"],
    images: [],
    isBestseller: true,
    isNewArrival: false,
    isPublished: true,
    seoTitle: "Midnight Jasmine — Floral Perfume Oil | Aurum Parfums",
    seoDescription:
      "A night-blooming floral for evenings. Available in 10ml and 30ml perfume oils.",
    variants: [
      { size: "10ml", priceKes: 1000, stock: 35, sku: "AU-MJ-10" },
      { size: "30ml", priceKes: 2500, stock: 12, sku: "AU-MJ-30" },
    ],
  },
  {
    slug: "amber-noir",
    name: "Amber Noir",
    brand: "Aurum Parfums",
    category: "men",
    shortDescription: "Dark amber with spice, leather and tobacco.",
    fullDescription:
      "Amber Noir is warm and commanding: pink pepper and cardamom open into a heart of amber and leather, closing with tobacco, tonka and patchouli.",
    fragranceFamily: "Warm & Spicy",
    scentNotes: {
      top: ["Pink Pepper", "Cardamom"],
      heart: ["Amber", "Leather"],
      base: ["Tobacco", "Tonka Bean", "Patchouli"],
    },
    characteristics: ["warm", "spicy", "leathery"],
    occasions: ["Evening", "Date Night"],
    seasons: ["Autumn", "Winter"],
    images: [],
    isBestseller: false,
    isNewArrival: false,
    isPublished: true,
    seoTitle: "Amber Noir — Warm Spicy Perfume Oil | Aurum Parfums",
    seoDescription:
      "A warm, leathery amber for evenings. Available in 10ml and 30ml perfume oils.",
    variants: [
      { size: "10ml", priceKes: 900, stock: 30, sku: "AU-AN-10" },
      { size: "30ml", priceKes: 2300, stock: 10, sku: "AU-AN-30" },
    ],
  },
  {
    slug: "white-musk",
    name: "White Musk",
    brand: "Aurum Parfums",
    category: "unisex",
    shortDescription: "Clean, skin-close musk with a whisper of iris.",
    fullDescription:
      "A soft, minimal musk: iris and violet leaf lift a clean heart, closing into a skin-close base of white musk and cashmeran.",
    fragranceFamily: "Musky",
    scentNotes: {
      top: ["Violet Leaf"],
      heart: ["Iris"],
      base: ["White Musk", "Cashmeran"],
    },
    characteristics: ["musky", "clean", "soft"],
    occasions: ["Everyday Wear", "Office"],
    seasons: ["Spring", "Summer", "Autumn"],
    images: [],
    isBestseller: false,
    isNewArrival: false,
    isPublished: true,
    seoTitle: "White Musk — Soft Musky Perfume Oil | Aurum Parfums",
    seoDescription:
      "A clean, skin-close musk for daily wear. Available in 10ml and 30ml perfume oils.",
    variants: [
      { size: "10ml", priceKes: 900, stock: 45, sku: "AU-WM-10" },
      { size: "30ml", priceKes: 2300, stock: 20, sku: "AU-WM-30" },
    ],
  },
  {
    slug: "rose-saffron",
    name: "Rose Saffron",
    brand: "Aurum Parfums",
    category: "women",
    shortDescription: "Radiant rose lifted with saffron and oud.",
    fullDescription:
      "A luminous rose: saffron and raspberry accent the opening, the heart blooms into damask rose and geranium, and the base rests on oud and ambergris.",
    fragranceFamily: "Floral",
    scentNotes: {
      top: ["Saffron", "Raspberry"],
      heart: ["Damask Rose", "Geranium"],
      base: ["Oud", "Ambergris"],
    },
    characteristics: ["floral", "warm", "rich"],
    occasions: ["Evening", "Special Occasions"],
    seasons: ["Autumn", "Winter"],
    images: [],
    isBestseller: false,
    isNewArrival: true,
    isPublished: true,
    seoTitle: "Rose Saffron — Rich Floral Perfume Oil | Aurum Parfums",
    seoDescription:
      "A saffron-accented rose for statement wear. Available in 10ml and 30ml perfume oils.",
    variants: [
      { size: "10ml", priceKes: 1000, stock: 25, sku: "AU-RS-10" },
      { size: "30ml", priceKes: 2500, stock: 8, sku: "AU-RS-30" },
    ],
  },
];

// --- Main -----------------------------------------------------------------
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Check .env.local");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Clearing existing products and variants...");
  await db.delete(productVariants);
  await db.delete(products);

  console.log(`Inserting ${seedData.length} products...`);
  for (const { variants, ...productData } of seedData) {
    const [inserted] = await db
      .insert(products)
      .values(productData)
      .returning({ id: products.id });

    await db.insert(productVariants).values(
      variants.map((v) => ({ ...v, productId: inserted.id }))
    );

    console.log(`  ✓ ${productData.name} (${variants.length} variants)`);
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });