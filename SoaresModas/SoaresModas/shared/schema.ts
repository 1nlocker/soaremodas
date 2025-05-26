import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // price in cents
  category: text("category").notNull(),
  image: text("image").notNull(),
  badge: text("badge"), // LIMITADO, BESTSELLER, etc.
  available: boolean("available").notNull().default(true),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(5),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Sales and Analytics tables
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  saleDate: text("sale_date").notNull().default("CURRENT_TIMESTAMP"),
});

export const siteVisits = pgTable("site_visits", {
  id: serial("id").primaryKey(),
  visitDate: text("visit_date").notNull().default("CURRENT_TIMESTAMP"),
  pageViewed: text("page_viewed").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  logoUrl: text("logo_url"),
  iconUrl: text("icon_url"),
  storeName: text("store_name").notNull().default("Soares Modas"),
  storeDescription: text("store_description"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  image: true,
  badge: true,
  available: true,
  stock: true,
  minStock: true,
});

export const insertSaleSchema = createInsertSchema(sales).pick({
  productId: true,
  quantity: true,
  totalPrice: true,
  customerName: true,
  customerPhone: true,
});

export const insertVisitSchema = createInsertSchema(siteVisits).pick({
  pageViewed: true,
  userAgent: true,
  ipAddress: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).pick({
  title: true,
  description: true,
  discountPercentage: true,
  startDate: true,
  endDate: true,
  isActive: true,
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettings).pick({
  logoUrl: true,
  iconUrl: true,
  storeName: true,
  storeDescription: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type SiteVisit = typeof siteVisits.$inferSelect;
export type InsertSiteVisit = z.infer<typeof insertVisitSchema>;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type StoreSettings = typeof storeSettings.$inferSelect;
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
