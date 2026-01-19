
import React from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { Home, ShoppingCart, User, Sparkles } from 'lucide-react';

const BottomNav: React.FC = () => {
  const { currentView, setView, t, cart } = useApp();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { id: 'home', icon: Home, label: t('customerHome') },
    { id: 'ai-hub', icon: Sparkles, label: 'Magic' },
    { id: 'cart', icon: ShoppingCart, label: t('cart'), badge: cartCount },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#061E29] border-t border-[#1D546D]/20 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                isActive ? 'text-[#5F9598]' : 'text-[#1D546D]'
              }`}
            >
              <div className="relative">
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 font-bold shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{tab.label.split(' ')[0]}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 w-8 h-1 bg-[#5F9598] rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
