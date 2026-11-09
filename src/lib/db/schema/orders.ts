import { pgTable, uuid, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
  
  // LINK TO CUSTOMER PROFILE
  customerId: uuid("customer_id").references(() => customers.id),
  
  // Customer Details (Snapshot at time of purchase)
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  
  // Delivery Method
  deliveryMethod: varchar("delivery_method", { length: 20 }).notNull().default("standard"),
  
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

  // Add this inside the orders table definition, near the statuses:
  mpesaReceipt: varchar("mpesa_receipt", { length: 50 }),

  // Statuses
  status: varchar("status", { length: 30 }).notNull().default("pending_payment"),
  paymentStatus: varchar("payment_status", { length: 30 }).notNull().default("pending"),
  
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});