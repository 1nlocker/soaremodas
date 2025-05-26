import { products, users, sales, siteVisits, promotions, storeSettings, type Product, type InsertProduct, type User, type InsertUser, type Sale, type InsertSale, type SiteVisit, type InsertSiteVisit, type Promotion, type InsertPromotion, type StoreSettings, type InsertStoreSettings } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getProductsByCategory(category: string): Promise<Product[]>;
  updateStock(productId: number, quantity: number): Promise<Product | undefined>;
  getLowStockProducts(): Promise<Product[]>;
  
  // Sales methods
  createSale(sale: InsertSale): Promise<Sale>;
  getAllSales(): Promise<Sale[]>;
  getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]>;
  getSalesAnalytics(): Promise<any>;
  
  // Visit tracking methods
  recordVisit(visit: InsertSiteVisit): Promise<SiteVisit>;
  getVisitsAnalytics(): Promise<any>;
  
  // Promotion methods
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  getAllPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  updatePromotion(id: number, promotion: Partial<InsertPromotion>): Promise<Promotion | undefined>;
  deletePromotion(id: number): Promise<boolean>;
  
  // Store settings methods
  getStoreSettings(): Promise<StoreSettings | undefined>;
  updateStoreSettings(settings: Partial<InsertStoreSettings>): Promise<StoreSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async updateStock(productId: number, quantity: number): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ stock: quantity })
      .where(eq(products.id, productId))
      .returning();
    return product || undefined;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db.select().from(products).where(sql`${products.stock} <= ${products.minStock}`);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const [sale] = await db
      .insert(sales)
      .values({
        ...insertSale,
        saleDate: new Date().toISOString(),
      })
      .returning();
    return sale;
  }

  async getAllSales(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.saleDate));
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    return await db.select().from(sales)
      .where(sql`${sales.saleDate} >= ${startDate} AND ${sales.saleDate} <= ${endDate}`)
      .orderBy(desc(sales.saleDate));
  }

  async getSalesAnalytics(): Promise<any> {
    const totalSalesResult = await db.select({
      totalRevenue: sql<number>`COALESCE(SUM(${sales.totalPrice}), 0)`,
      totalOrders: sql<number>`COUNT(*)`,
      avgOrderValue: sql<number>`COALESCE(AVG(${sales.totalPrice}), 0)`,
    }).from(sales);

    const topProductsResult = await db.select({
      productId: sales.productId,
      productName: products.name,
      totalQuantity: sql<number>`SUM(${sales.quantity})`,
      totalRevenue: sql<number>`SUM(${sales.totalPrice})`,
    })
    .from(sales)
    .leftJoin(products, eq(sales.productId, products.id))
    .groupBy(sales.productId, products.name)
    .orderBy(desc(sql`SUM(${sales.totalPrice})`))
    .limit(5);

    return {
      ...totalSalesResult[0],
      topProducts: topProductsResult,
    };
  }

  async recordVisit(insertVisit: InsertSiteVisit): Promise<SiteVisit> {
    const [visit] = await db
      .insert(siteVisits)
      .values({
        ...insertVisit,
        visitDate: new Date().toISOString(),
      })
      .returning();
    return visit;
  }

  async getVisitsAnalytics(): Promise<any> {
    const totalVisitsResult = await db.select({
      totalVisits: sql<number>`COUNT(*)`,
      uniqueVisits: sql<number>`COUNT(DISTINCT ${siteVisits.ipAddress})`,
    }).from(siteVisits);

    const dailyVisitsResult = await db.select({
      date: sql<string>`DATE(${siteVisits.visitDate})`,
      visits: sql<number>`COUNT(*)`,
    })
    .from(siteVisits)
    .groupBy(sql`DATE(${siteVisits.visitDate})`)
    .orderBy(desc(sql`DATE(${siteVisits.visitDate})`))
    .limit(30);

    const topPagesResult = await db.select({
      page: siteVisits.pageViewed,
      visits: sql<number>`COUNT(*)`,
    })
    .from(siteVisits)
    .groupBy(siteVisits.pageViewed)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(10);

    return {
      ...totalVisitsResult[0],
      dailyVisits: dailyVisitsResult,
      topPages: topPagesResult,
    };
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const [promotion] = await db
      .insert(promotions)
      .values({
        ...insertPromotion,
        createdAt: new Date().toISOString(),
      })
      .returning();
    return promotion;
  }

  async getAllPromotions(): Promise<Promotion[]> {
    return await db.select().from(promotions).orderBy(desc(promotions.createdAt));
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const currentDate = new Date().toISOString().split('T')[0];
    return await db.select().from(promotions)
      .where(sql`${promotions.isActive} = true AND ${promotions.startDate} <= ${currentDate} AND ${promotions.endDate} >= ${currentDate}`)
      .orderBy(desc(promotions.createdAt));
  }

  async updatePromotion(id: number, promotionUpdate: Partial<InsertPromotion>): Promise<Promotion | undefined> {
    const [promotion] = await db
      .update(promotions)
      .set(promotionUpdate)
      .where(eq(promotions.id, id))
      .returning();
    return promotion || undefined;
  }

  async deletePromotion(id: number): Promise<boolean> {
    const result = await db.delete(promotions).where(eq(promotions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getStoreSettings(): Promise<StoreSettings | undefined> {
    const [settings] = await db.select().from(storeSettings).limit(1);
    return settings || undefined;
  }

  async updateStoreSettings(settingsUpdate: Partial<InsertStoreSettings>): Promise<StoreSettings> {
    const existing = await this.getStoreSettings();
    
    if (existing) {
      const [updated] = await db
        .update(storeSettings)
        .set({
          ...settingsUpdate,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(storeSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(storeSettings)
        .values({
          ...settingsUpdate,
          updatedAt: new Date().toISOString(),
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
