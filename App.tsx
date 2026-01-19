
import React, { useState, createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Language, UserRole, CartItem, Product, Order, UserProfile, Notification, MerchantBusinessInfo, Payout, OrderStatus } from './types';
import { translations } from './i18n';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LanguageSelectionView from './views/LanguageSelection';
import LandingView from './views/Landing';
import CustomerHome from './views/CustomerHome';
import ProductDetail from './views/ProductDetail';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import ProfileView from './views/ProfileView';
import OrderTracking from './views/OrderTracking';
import SupportView from './views/SupportView';
import NotificationView from './views/NotificationView';
import AIHub from './views/AIHub';
import { ArrowUp } from 'lucide-react';
import { db, TableName } from './db';

export type ViewType = 'home' | 'profile' | 'product-detail' | 'cart' | 'checkout' | 'wishlist' | 'tracking' | 'support' | 'notifications' | 'ai-hub' | 'products' | 'add-product' | 'orders' | 'earnings' | 'settings' | 'customers' | 'marketing';

interface AppContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  hasConfirmedLanguage: boolean;
  setHasConfirmedLanguage: (val: boolean) => void;
  role: UserRole | null;
  setRole: (r: UserRole | null) => void;
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  cart: CartItem[];
  addToCart: (productId: string, price: number, variantId?: string) => void;
  updateCartQty: (productId: string, qty: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  t: (key: keyof typeof translations['en']) => string;
  currentView: ViewType;
  setView: (view: ViewType, pushToHistory?: boolean, smoothScroll?: boolean) => void;
  goBack: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  productToEdit: Product | null;
  setProductToEdit: (p: Product | null) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  placeOrder: (order: Order) => void;
  recentlyViewed: string[];
  notifications: Notification[];
  markAsRead: (id: string) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (o: Order | null) => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  businessInfo: MerchantBusinessInfo;
  payouts: Payout[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  useEffect(() => {
    db.init();
  }, []);

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('shaileshbhai_lang');
    return saved ? (saved as Language) : Language.ENGLISH;
  });

  const [hasConfirmedLanguage, setHasConfirmedLanguage] = useState<boolean>(() => {
    return !!localStorage.getItem('shaileshbhai_lang_confirmed');
  });

  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('shaileshbhai_role');
    return saved ? (saved as UserRole) : null;
  });

  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [products, setProducts] = useState<Product[]>(() => db.select<Product>('products'));
  const [orders, setOrders] = useState<Order[]>(() => db.select<Order>('orders'));
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shaileshbhai_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [businessInfo] = useState<MerchantBusinessInfo>({
    id: 'm1',
    storeName: 'Shaileshbhai Snacks',
    ownerName: 'Shailesh Bhai',
    gstNumber: '24AAAAA0000A1Z5',
    kycStatus: 'verified',
    fulfillmentType: 'SELLER_FULFILLED',
    bankAccount: {
      accountNumber: '1234567890',
      ifsc: 'ICIC0001234',
      bankName: 'ICICI Bank'
    },
    metrics: {
      orderDefectRate: 0,
      cancellationRate: 0,
      lateShipmentRate: 0
    }
  });

  const [payouts] = useState<Payout[]>([
    { id: 'pay1', amount: 12500, date: new Date().toISOString(), status: 'completed' },
    { id: 'pay2', amount: 8400, date: new Date(Date.now() - 604800000).toISOString(), status: 'completed' }
  ]);

  useEffect(() => {
    if (role === UserRole.CUSTOMER) {
      const profile: UserProfile = {
        id: 'u1',
        name: 'Jatin Kumar',
        email: 'jatin.k@example.com',
        role: UserRole.CUSTOMER,
        language: language
      };
      setUser(profile);
      db.syncCustomerToCloud(profile);
    }
  }, [role, language]);

  useEffect(() => {
    const unsubscribe = db.subscribe((table: TableName) => {
      if (table === 'products') setProducts(db.select<Product>('products'));
      if (table === 'orders') setOrders(db.select<Order>('orders'));
    });
    return unsubscribe;
  }, []);

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [viewStack, setViewStack] = useState<ViewType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Order Update', message: 'Your order is on the way!', date: new Date().toISOString(), read: false, type: 'order' },
    { id: 'n2', title: 'Welcome', message: 'Welcome to shaileshbhai no nasto.', date: new Date().toISOString(), read: false, type: 'system' }
  ]);

  useEffect(() => {
    localStorage.setItem('shaileshbhai_lang', language);
  }, [language]);

  useEffect(() => {
    if (hasConfirmedLanguage) localStorage.setItem('shaileshbhai_lang_confirmed', 'true');
    else localStorage.removeItem('shaileshbhai_lang_confirmed');
  }, [hasConfirmedLanguage]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('shaileshbhai_role', role);
      setCurrentView('home');
      setViewStack([]);
    } else {
      localStorage.removeItem('shaileshbhai_role');
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('shaileshbhai_cart', JSON.stringify(cart));
  }, [cart]);

  const t = (key: any) => {
    return (translations[language] as any)[key] || (translations[Language.ENGLISH] as any)[key];
  };

  const setView = useCallback((view: ViewType, pushToHistory = true, smoothScroll = false) => {
    if (view === currentView) return;
    const persistBuyNow = ['checkout', 'product-detail'].includes(view);
    if (!persistBuyNow) setBuyNowItem(null);
    if (pushToHistory) {
      setViewStack(prev => [...prev, currentView]);
      window.history.pushState({ view }, "", "");
    }
    setCurrentView(view);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: smoothScroll ? 'smooth' : 'auto' });
    }
  }, [currentView]);

  const goBack = useCallback(() => {
    if (viewStack.length > 0) {
      const prevView = viewStack[viewStack.length - 1];
      setViewStack(prev => prev.slice(0, -1));
      setCurrentView(prevView);
    }
  }, [viewStack]);

  useEffect(() => {
    const handlePopState = () => {
      if (viewStack.length > 0) goBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewStack, goBack]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addProduct = (p: Product) => {
    db.insert('products', p);
  };

  const updateProduct = (p: Product) => {
    // Added explicit type <Product> to db.update call to ensure correct generic inference
    db.update<Product>('products', p.id, p);
  };

  const addToCart = (productId: string, price: number, variantId?: string) => {
    const product = products.find(p => p.id === productId);
    const variant = product?.variants?.find(v => v.id === variantId);
    const sku = variant?.sku || product?.sku || 'SKU_UNKNOWN';
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && i.variantId === variantId);
      if (existing) {
        return prev.map(i => (i.productId === productId && i.variantId === variantId) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId, quantity: 1, price, sku, variantId }];
    });
  };

  const updateCartQty = (productId: string, qty: number, variantId?: string) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev => prev.map(i => (i.productId === productId && i.variantId === variantId) ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(i => !(i.productId === productId && i.variantId === variantId)));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    // Fix: Explicitly provide <Order> type to db.update to resolve inference issues with partial object literal
    db.update<Order>('orders', orderId, { status });
  };

  const placeOrder = (order: Order) => {
    const orderWithSteps = {
      ...order,
      trackingSteps: [
        { status: 'pending' as any, timestamp: new Date().toISOString(), location: 'Warehouse', completed: true },
        { status: 'confirmed' as any, timestamp: '', location: 'Processing', completed: false },
        { status: 'shipped' as any, timestamp: '', location: 'Logistics', completed: false },
        { status: 'delivered' as any, timestamp: '', location: 'Customer', completed: false },
      ]
    };
    db.placeOrderTransaction(orderWithSteps as any, products);
    if (!buyNowItem) clearCart();
    setBuyNowItem(null);
    setView('profile', true, true);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const renderPortal = () => {
    if (!hasConfirmedLanguage) return <LanguageSelectionView />;
    if (!role) return <LandingView onSelectRole={setRole} />;

    switch (currentView) {
      case 'product-detail': return <ProductDetail />;
      case 'cart': return <CartView />;
      case 'checkout': return <CheckoutView />;
      case 'profile': return <ProfileView />;
      case 'tracking': return <OrderTracking />;
      case 'support': return <SupportView />;
      case 'notifications': return <NotificationView />;
      case 'ai-hub': return <AIHub />;
      case 'home':
      default: return <CustomerHome />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      language, setLanguage, hasConfirmedLanguage, setHasConfirmedLanguage,
      role, setRole, user, setUser,
      products, addProduct, updateProduct, cart, addToCart, updateCartQty, removeFromCart, clearCart,
      wishlist, toggleWishlist, t, currentView, setView, goBack,
      selectedProduct, setSelectedProduct, productToEdit, setProductToEdit, orders, updateOrderStatus, placeOrder,
      recentlyViewed, notifications, markAsRead, selectedOrder, setSelectedOrder,
      buyNowItem, setBuyNowItem, businessInfo, payouts
    }}>
      <div className="h-full flex flex-col overflow-hidden bg-[#F3F4F4]">
        {role && <Header />}
        
        {role && (
          <motion.div
            className="fixed top-14 left-0 right-0 h-1 origin-left z-50 bg-[#5F9598]"
            style={{ scaleX }}
          />
        )}

        <main 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-grow relative overflow-y-auto pb-24 main-scroll-container"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={!hasConfirmedLanguage ? 'lang-select' : role ? currentView : 'landing'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="container mx-auto px-4 py-4 h-full"
            >
              {renderPortal()}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                onClick={scrollToTop}
                className="fixed bottom-24 right-6 w-12 h-12 bg-white text-[#061E29] rounded-full shadow-2xl flex items-center justify-center z-[60] border border-[#1D546D]/10 active:scale-90 transition-transform"
              >
                <ArrowUp size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </main>
        {role && <BottomNav />}
      </div>
    </AppContext.Provider>
  );
};

export default App;
