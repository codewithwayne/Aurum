import { pgTable, uuid, varchar, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
  
  // Customer Details
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  
  // NEW: Delivery Method
  deliveryMethod: varchar("delivery_method", { length: 20 }).notNull().default("standard"), // "standard" or "arrange_own"
  
  // Delivery Details
  deliveryAddress: jsonb("delivery_address").$type<{
    county: string;
    estate: string;
    building: string;
    landmark: string;
    instructions: string;
  }>().notNull(),
  
  // Order Items
  items: jsonb("items").$type<{
    productId: string;
    variantId: string;
    name: string;
    size: string;
    priceKes: number;
    quantity: number;
  }[]>().notNull(),

  // Financials
  subtotalKes: integer("subtotal_kes").notNull(),
  deliveryFeeKes: integer("delivery_fee_kes").notNull(),
  totalKes: integer("total_kes").notNull(),

  // Statuses
  status: varchar("status", { length: 30 }).notNull().default("pending_payment"),
  paymentStatus: varchar("payment_status", { length: 30 }).notNull().default("pending"),
  
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});