
import { Product, Order, MerchantBusinessInfo, Coupon, Payout, UserRole, Language } from './types';
import { MOCK_PRODUCTS } from './constants';

type TableName = 'products' | 'orders' | 'merchants' | 'coupons' | 'payouts' | 'settings';

class DBService {
  private prefix = 'shaileshbhai_sql_';

  private getTable<T>(name: TableName): T[] {
    const data = localStorage.getItem(this.prefix + name);
    return data ? JSON.parse(data) : [];
  }

  private saveTable<T>(name: TableName, data: T[]) {
    localStorage.setItem(this.prefix + name, JSON.stringify(data));
  }

  // Initialize DB with seed data
  init() {
    const existingProducts = this.getTable<Product>('products');
    // Force refresh if the product list is small or non-existent to show the new 100 items
    if (existingProducts.length < 100) {
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

  // Generic Query (SELECT * FROM table WHERE ...)
  select<T>(table: TableName, filter?: (item: T) => boolean): T[] {
    const data = this.getTable<T>(table);
    return filter ? data.filter(filter) : data;
  }

  // Insert (INSERT INTO table VALUES ...)
  insert<T extends { id?: string }>(table: TableName, item: T): T {
    const data = this.getTable<T>(table);
    const newItem = { ...item, id: item.id || Math.random().toString(36).substr(2, 9) };
    this.saveTable(table, [newItem as any, ...data]);
    return newItem as T;
  }

  // Update (UPDATE table SET ... WHERE id = ...)
  update<T extends { id: string }>(table: TableName, id: string, updates: Partial<T>): T | null {
    const data = this.getTable<T>(table);
    const index = data.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    const updated = { ...data[index], ...updates };
    data[index] = updated;
    this.saveTable(table, data);
    return updated;
  }

  // Transaction Simulation: Atomic operations
  async executeTransaction(operations: () => void) {
    try {
      operations();
      console.log("Relational Transaction Committed Successfully.");
    } catch (e) {
      console.error("Relational Transaction Failed. Rollback would occur here.", e);
      throw e;
    }
  }

  // Specific Relational Logic: Place Order
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
  
  // Clear all for demo reset
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
