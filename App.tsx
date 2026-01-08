
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Language, UserRole, Product, CartItem } from './types';
import { translations } from './i18n';
import Header from './components/Header';
import LandingView from './views/Landing';
import CustomerHome from './views/CustomerHome';
import MerchantDashboard from './views/MerchantDashboard';
import ProductManagement from './views/ProductManagement';

interface AppContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  role: UserRole | null;
  setRole: (r: UserRole | null) => void;
  cart: CartItem[];
  addToCart: (productId: string, price: number) => void;
  removeFromCart: (productId: string) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [role, setRole] = useState<UserRole | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'orders' | 'profile'>('home');

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations[Language.ENGLISH][key];
  };

  const addToCart = (productId: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId, quantity: 1, price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId === productId));
  };

  const renderView = () => {
    if (!role) return <LandingView onSelectRole={setRole} />;

    if (role === UserRole.MERCHANT) {
      if (currentView === 'products') return <ProductManagement />;
      return <MerchantDashboard />;
    }

    return <CustomerHome />;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, role, setRole, cart, addToCart, removeFromCart, t }}>
      <div className="min-h-screen flex flex-col">
        {role && (
          <Header 
            onNavigate={(view: any) => setCurrentView(view)} 
            currentView={currentView}
          />
        )}
        <main className="flex-grow container mx-auto px-4 py-6">
          {renderView()}
        </main>
        <footer className="bg-white border-t py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2024 Vaniya E-commerce. Multilingual Platform for local artisans and global customers.</p>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
};

export default App;
