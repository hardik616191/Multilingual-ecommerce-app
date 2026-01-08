
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole, Language } from '../types';
import { ShoppingCart, LayoutDashboard, Package, User, LogOut, Menu, X, Globe } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'products' | 'orders' | 'profile') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const { t, language, setLanguage, role, setRole, cart } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Vaniya</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {role === UserRole.MERCHANT ? (
            <>
              <button 
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                <LayoutDashboard size={18} />
                {t('merchantDash')}
              </button>
              <button 
                onClick={() => onNavigate('products')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'products' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                <Package size={18} />
                {t('inventory')}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                {t('customerHome')}
              </button>
              <button className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                {t('categories')}
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 px-2 py-1 border rounded-full transition-all">
              <Globe size={16} />
              <span className="text-xs font-semibold uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-32 py-2">
              <button onClick={() => setLanguage(Language.ENGLISH)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">English</button>
              <button onClick={() => setLanguage(Language.HINDI)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">हिन्दी</button>
              <button onClick={() => setLanguage(Language.GUJARATI)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">ગુજરાતી</button>
            </div>
          </div>

          {role === UserRole.CUSTOMER && (
            <div className="relative cursor-pointer hover:text-indigo-600">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
          )}

          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

          <button 
            onClick={() => setRole(null)}
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>

          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">
          {role === UserRole.MERCHANT ? (
            <>
              <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="block w-full text-left py-2 font-medium">{t('merchantDash')}</button>
              <button onClick={() => { onNavigate('products'); setIsMenuOpen(false); }} className="block w-full text-left py-2 font-medium">{t('inventory')}</button>
            </>
          ) : (
            <>
              <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="block w-full text-left py-2 font-medium">{t('customerHome')}</button>
              <button className="block w-full text-left py-2 font-medium">{t('categories')}</button>
            </>
          )}
          <button onClick={() => setRole(null)} className="block w-full text-left py-2 font-medium text-red-600">{t('logout')}</button>
        </div>
      )}
    </header>
  );
};

export default Header;
