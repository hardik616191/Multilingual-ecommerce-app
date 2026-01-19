
import { Product, Order, MerchantBusinessInfo, Payout, UserRole, Language, UserProfile } from './types';
import { MOCK_PRODUCTS } from './constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Configuration from user details
const SUPABASE_URL = 'https://ijkcwcipeutbidtyldva.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h1EASqXlVZZJEh80fqXdhA_MdRWj-N-';

export type TableName = 'products' | 'orders' | 'merchants' | 'coupons' | 'payouts' | 'settings' | 'customers';

type DBChangeCallback = (table: TableName) => void;

class DBService {
  private prefix = 'shaileshbhai_sql_';
  private syncChannel: BroadcastChannel;
  private listeners: Set<DBChangeCallback> = new Set();
  private supabase: SupabaseClient;

  constructor() {
    this.syncChannel = new BroadcastChannel('shaileshbhai_sync');
    this.syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'DB_UPDATE') {
        this.notifyListeners(event.data.table);
      }
    };
    
    // Initialize Supabase Client
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  private getTable<T>(name: TableName): T[] {
    const data = localStorage.getItem(this.prefix + name);
    return data ? JSON.parse(data) : [];
  }

  private saveTable<T>(name: TableName, data: T[]) {
    localStorage.setItem(this.prefix + name, JSON.stringify(data));
    this.syncChannel.postMessage({ type: 'DB_UPDATE', table: name, timestamp: Date.now() });
    this.notifyListeners(name);
  }

  private notifyListeners(table: TableName) {
    this.listeners.forEach(cb => cb(table));
  }

  public subscribe(cb: DBChangeCallback) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async init() {
    const existingProducts = this.getTable<Product>('products');
    if (existingProducts.length < 150) {
      this.saveTable('products', MOCK_PRODUCTS);
    }
    
    if (!localStorage.getItem(this.prefix + 'merchants')) {
      this.saveTable('merchants', [{
        id: 'm1',
        storeName: 'shaileshbhai no nasto',
        ownerName: 'Shaileshbhai',
        gstNumber: '',
        kycStatus: 'unverified',
        fulfillmentType: 'SELLER_FULFILLED',
        bankAccount: { accountNumber: '', ifsc: '', bankName: '' },
        metrics: { orderDefectRate: 0, cancellationRate: 0, lateShipmentRate: 0 }
      }]);
    }

    // Pull products from 'merchant' table in Supabase
    try {
      const { data, error } = await this.supabase
        .from('merchant')
        .select('*');

      if (!error && data && data.length > 0) {
        // Map Supabase 'merchant' columns back to local Product type
        const cloudProducts: Product[] = data.map(row => ({
          id: row.id || Math.random().toString(),
          sku: row.sku || 'SKU_AUTO',
          brand: row.brand || 'Merchant',
          title: row.product_name as Record<Language, string>,
          description: row.description || { en: '' },
          price: row.base_price,
          image: row.product_photo,
          category: row.category,
          stock: row.stock,
          rating: 5,
          reviews: [],
          merchantId: 'm1',
          status: 'active',
          fulfillmentMode: 'SELLER_FULFILLED',
          variants: row.variants_data || []
        }));
        this.saveTable('products', cloudProducts);
      }
    } catch (e) {
      console.warn("Supabase Product Sync Failed.", e);
    }
  }

  select<T>(table: TableName, filter?: (item: T) => boolean): T[] {
    const data = this.getTable<T>(table);
    return filter ? data.filter(filter) : data;
  }

  insert<T extends { id?: string }>(table: TableName, item: T): T {
    const data = this.getTable<T>(table);
    const newItem = { ...item, id: item.id || Math.random().toString(36).substr(2, 9) };
    this.saveTable(table, [newItem as any, ...data]);
    return newItem as T;
  }

  update<T extends { id: string }>(table: TableName, id: string, updates: Partial<T>): T | null {
    const data = this.getTable<T>(table);
    const index = data.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    const updated = { ...data[index], ...updates };
    data[index] = updated;
    this.saveTable(table, data);
    return updated;
  }

  // Cloud Sync for Merchant Table (Products)
  async syncProductToCloud(product: Product) {
    try {
      const { error } = await this.supabase
        .from('merchant')
        .upsert({
          id: product.id,
          product_photo: product.image,
          product_name: product.title,
          category: product.category,
          has_variants: !!(product.variants && product.variants.length > 0),
          base_price: product.price,
          stock: product.stock,
          is_available: product.stock > 0,
          sku: product.sku,
          brand: product.brand,
          variants_data: product.variants || []
        });
      if (error) throw error;
      console.log("Supabase Merchant Table: Product synced successfully.");
    } catch (e) {
      console.error("Cloud Merchant Sync Error:", e);
    }
  }

  // Cloud Sync for Customer Table
  async syncCustomerToCloud(profile: UserProfile) {
    try {
      const { error } = await this.supabase
        .from('customer')
        .upsert({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          preferred_language: profile.language,
          last_active: new Date().toISOString()
        });
      if (error) throw error;
      console.log("Supabase Customer Table: Profile synced successfully.");
    } catch (e) {
      console.error("Cloud Customer Sync Error:", e);
    }
  }

  async placeOrderTransaction(order: Order, products: Product[]) {
    this.insert('orders', order);
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        this.update<Product>('products', product.id, { stock: newStock });
        this.syncProductToCloud({ ...product, stock: newStock }); // Sync inventory update
      }
    });

    try {
      await this.supabase.from('orders').insert([order]);
    } catch (e) {
      console.error("Order cloud sync failed", e);
    }
  }
  
  reset() {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
}

export const db = new DBService();
