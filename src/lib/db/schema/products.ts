import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    brand: varchar("brand", { length: 255 }),
    category: varchar("category", { length: 20 }).notNull(),
    shortDescription: text("short_description").notNull(),
    fullDescription: text("full_description").notNull(),
    fragranceFamily: varchar("fragrance_family", { length: 50 }),
    scentNotes: jsonb("scent_notes").$type<{
      top: string[];
      heart: string[];
      base: string[];
    }>(),
    characteristics: jsonb("characteristics").$type<string[]>(),
    occasions: jsonb("occasions").$type<string[]>(),
    seasons: jsonb("seasons").$type<string[]>(),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    isNewArrival: boolean("is_new_arrival").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_published_idx").on(table.isPublished),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: varchar("size", { length: 20 }).notNull(),
    priceKes: integer("price_kes").notNull(),
    stock: integer("stock").notNull().default(0),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    isAvailable: boolean("is_available").notNull().default(true),
    image: varchar("image", { length: 500 }),
  },
  (table) => [
    uniqueIndex("product_variants_product_size_idx").on(
      table.productId,
      table.size
    ),
  ]
);