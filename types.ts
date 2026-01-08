
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

export interface Product {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: Review[];
  merchantId: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  customerId: string;
  merchantId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: Language;
}
