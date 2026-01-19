
import { Product, Order, Language, UserProfile } from './types';
import { MOCK_PRODUCTS } from './constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ijkcwcipeutbidtyldva.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h1EASqXlVZZJEh80fqXdhA_MdRWj-N-';

export type TableName = 'products' | 'orders' | 'customers';

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
    if (existingProducts.length < 1) {
      this.saveTable('products', MOCK_PRODUCTS);
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

  // Sync customer profile to cloud
  async syncCustomerToCloud(profile: UserProfile) {
    try {
      // FIX: Changed from 'customer' to 'customers' to match TableName and schema convention
      const { error } = await this.supabase
        .from('customers')
        .upsert({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          preferred_language: profile.language,
          last_active: new Date().toISOString()
        });
      if (error) throw error;
    } catch (e: any) {
      console.error("Cloud Customer Sync Error: " + (e?.message || JSON.stringify(e) || "Unknown error"));
    }
  }

  // FIX: Added missing syncProductToCloud method to DBService
  async syncProductToCloud(product: Product) {
    try {
      const { error } = await this.supabase
        .from('products')
        .upsert({
          id: product.id,
          sku: product.sku,
          brand: product.brand,
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          rating: product.rating,
          merchant_id: product.merchantId,
          fulfillment_mode: product.fulfillmentMode,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
    } catch (e: any) {
      console.error("Cloud Product Sync Error: " + (e?.message || JSON.stringify(e) || "Unknown error"));
    }
  }

  async placeOrderTransaction(order: Order, products: Product[]) {
    this.insert('orders', order);
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        this.update<Product>('products', product.id, { stock: newStock });
      }
    });

    try {
      await this.supabase.from('orders').insert([order]);
    } catch (e: any) {
      console.error("Order cloud sync failed: " + (e?.message || JSON.stringify(e)));
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
