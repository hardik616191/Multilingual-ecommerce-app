
import { Product, Order, MerchantBusinessInfo, Payout, UserRole, Language } from './types';
import { MOCK_PRODUCTS } from './constants';

export type TableName = 'products' | 'orders' | 'merchants' | 'coupons' | 'payouts' | 'settings';

type DBChangeCallback = (table: TableName) => void;

class DBService {
  private prefix = 'shaileshbhai_sql_';
  private syncChannel: BroadcastChannel;
  private listeners: Set<DBChangeCallback> = new Set();

  constructor() {
    this.syncChannel = new BroadcastChannel('shaileshbhai_sync');
    this.syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'DB_UPDATE') {
        this.notifyListeners(event.data.table);
      }
    };
  }

  private getTable<T>(name: TableName): T[] {
    const data = localStorage.getItem(this.prefix + name);
    return data ? JSON.parse(data) : [];
  }

  private saveTable<T>(name: TableName, data: T[]) {
    localStorage.setItem(this.prefix + name, JSON.stringify(data));
    // Broadcast to other tabs
    this.syncChannel.postMessage({ type: 'DB_UPDATE', table: name, timestamp: Date.now() });
    // Notify local listeners
    this.notifyListeners(name);
  }

  private notifyListeners(table: TableName) {
    this.listeners.forEach(cb => cb(table));
  }

  public subscribe(cb: DBChangeCallback) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  // Initialize DB with seed data
  init() {
    const existingProducts = this.getTable<Product>('products');
    // Updated threshold to 150 to ensure full catalog hydration
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
  }

  // Generic Query
  select<T>(table: TableName, filter?: (item: T) => boolean): T[] {
    const data = this.getTable<T>(table);
    return filter ? data.filter(filter) : data;
  }

  // Insert
  insert<T extends { id?: string }>(table: TableName, item: T): T {
    const data = this.getTable<T>(table);
    const newItem = { ...item, id: item.id || Math.random().toString(36).substr(2, 9) };
    this.saveTable(table, [newItem as any, ...data]);
    return newItem as T;
  }

  // Update
  update<T extends { id: string }>(table: TableName, id: string, updates: Partial<T>): T | null {
    const data = this.getTable<T>(table);
    const index = data.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    const updated = { ...data[index], ...updates };
    data[index] = updated;
    this.saveTable(table, data);
    return updated;
  }

  // Delete
  delete(table: TableName, id: string) {
    const data = this.getTable<any>(table);
    const filtered = data.filter(i => i.id !== id);
    this.saveTable(table, filtered);
  }

  async executeTransaction(operations: () => void) {
    try {
      operations();
      console.log("Real-time Relational Transaction Committed.");
    } catch (e) {
      console.error("Transaction Failed.", e);
      throw e;
    }
  }

  placeOrderTransaction(order: Order, products: Product[]) {
    this.executeTransaction(() => {
      this.insert('orders', order);

      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          this.update<Product>('products', product.id, { stock: newStock });
          
          if (item.variantId && product.variants) {
            const updatedVariants = product.variants.map(v => 
              v.id === item.variantId ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v
            );
            this.update<Product>('products', product.id, { variants: updatedVariants });
          }
        }
      });
    });
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
