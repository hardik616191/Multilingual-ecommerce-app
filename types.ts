
export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  GUJARATI = 'gu'
}

export enum UserRole {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  ADMIN = 'admin'
}

export type FulfillmentMode = 'SELLER_FULFILLED' | 'PLATFORM_FULFILLED';

export interface Product {
  id: string;
  sku: string;
  brand: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: Review[];
  merchantId: string;
  variants?: ProductVariant[];
  status: 'active' | 'pending_approval' | 'rejected' | 'hidden';
  fulfillmentMode: FulfillmentMode;
}

export interface ProductVariant {
  id: string;
  sku: string;
  type: 'Size' | 'Flavor' | 'Weight';
  value: string;
  priceDelta: number;
  stock: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other' | 'Warehouse';
  name: string;
  street: string;
  city: string;
  zip: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  merchantId: string;
  items: CartItem[];
  subtotal: number;
  commission: number;
  tax: number;
  total: number;
  status: OrderStatus;
  date: string;
  address: Address;
  trackingSteps?: TrackingStep[];
  fulfillmentMode: FulfillmentMode;
}

export interface TrackingStep {
  status: OrderStatus;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'disputed';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  variantId?: string;
  sku: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: Language;
}

export interface MerchantBusinessInfo {
  id: string;
  storeName: string;
  ownerName: string;
  logo?: string;
  gstNumber: string;
  kycStatus: 'unverified' | 'pending' | 'verified';
  fulfillmentType: FulfillmentMode;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  metrics: {
    orderDefectRate: number;
    cancellationRate: number;
    lateShipmentRate: number;
  };
}

export interface Settlement {
  id: string;
  amount: number;
  grossSales: number;
  fees: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  invoiceUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'deal' | 'system' | 'performance';
}

export interface Payout {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'model';
  parts: { text: string; inlineData?: { data: string; mimeType: string } }[];
  isThinking?: boolean;
}
