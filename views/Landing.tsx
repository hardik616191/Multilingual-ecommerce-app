
import React from 'react';
import { useApp } from '../App';
import { UserRole, Language } from '../types';
import { ShoppingBag, Store, ArrowRight, Languages } from 'lucide-react';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingView: React.FC<LandingProps> = ({ onSelectRole }) => {
  const { t, setLanguage } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto px-4">
      <div className="mb-6 flex gap-4">
        <button 
          onClick={() => setLanguage(Language.ENGLISH)}
          className="px-4 py-2 rounded-full border hover:bg-indigo-50 transition-colors flex items-center gap-2"
        >
          <Languages size={16} /> English
        </button>
        <button 
          onClick={() => setLanguage(Language.HINDI)}
          className="px-4 py-2 rounded-full border hover:bg-indigo-50 transition-colors"
        >
          हिन्दी
        </button>
        <button 
          onClick={() => setLanguage(Language.GUJARATI)}
          className="px-4 py-2 rounded-full border hover:bg-indigo-50 transition-colors"
        >
          ગુજરાતી
        </button>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        {t('heroTitle')}
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl">
        {t('heroSubtitle')}
      </p>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        <div 
          onClick={() => onSelectRole(UserRole.CUSTOMER)}
          className="group cursor-pointer bg-white p-8 rounded-2xl border-2 border-transparent hover:border-indigo-600 shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">{t('customerName')}</h3>
          <p className="text-gray-500 mb-6">Browse products, apply coupons, and get delivery in 24 hours.</p>
          <button className="flex items-center gap-2 text-indigo-600 font-semibold mx-auto">
            Get Started <ArrowRight size={18} />
          </button>
        </div>

        <div 
          onClick={() => onSelectRole(UserRole.MERCHANT)}
          className="group cursor-pointer bg-white p-8 rounded-2xl border-2 border-transparent hover:border-indigo-600 shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 mx-auto group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Store size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">{t('merchantName')}</h3>
          <p className="text-gray-500 mb-6">Manage inventory, track sales, and grow your local business.</p>
          <button className="flex items-center gap-2 text-emerald-600 font-semibold mx-auto">
            Open Store <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-20 border-t pt-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-3xl font-bold text-indigo-600">10k+</p>
            <p className="text-gray-500 text-sm">Active Merchants</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">3</p>
            <p className="text-gray-500 text-sm">Languages Supported</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">50k+</p>
            <p className="text-gray-500 text-sm">Products Listed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">24/7</p>
            <p className="text-gray-500 text-sm">Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
