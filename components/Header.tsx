
import React from 'react';
import { useApp } from '../App';
import { Language, UserRole } from '../types';
import { Globe, LogOut, Radio, Store, ShoppingBag } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage, setRole, setView, role, t } = useApp();

  const isMerchant = role === UserRole.MERCHANT;

  return (
    <header className={`${isMerchant ? 'bg-[#061E29]' : 'bg-white text-[#061E29]'} border-b border-[#1D546D]/10 sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-500`}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className={`w-8 h-8 ${isMerchant ? 'bg-[#5F9598]' : 'bg-[#061E29]'} rounded-lg flex items-center justify-center shadow-md transition-colors`}>
            {isMerchant ? <Store size={16} className="text-[#061E29]" /> : <ShoppingBag size={16} className="text-white" />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight leading-none uppercase">
              {isMerchant ? 'Merchant Center' : 'shaileshbhai'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className={`w-1 h-1 ${isMerchant ? 'bg-emerald-500' : 'bg-[#5F9598]'} rounded-full animate-pulse`}></div>
              <span className={`text-[7px] font-black uppercase tracking-widest ${isMerchant ? 'text-[#5F9598]' : 'text-[#1D546D]/50'}`}>
                {isMerchant ? 'Business Hub' : 'Fresh Daily'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold uppercase active:scale-95 ${isMerchant ? 'bg-[#1D546D] text-white' : 'bg-[#F3F4F4] text-[#1D546D]'}`}>
              <Globe size={14} />
              {language}
            </button>
            <div className="absolute right-0 top-full mt-2 bg-white text-[#061E29] border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-32 py-2 overflow-hidden">
              <button onClick={() => setLanguage(Language.ENGLISH)} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F3F4F4] font-medium">English</button>
              <button onClick={() => setLanguage(Language.HINDI)} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F3F4F4] font-medium">हिन्दी</button>
              <button onClick={() => setLanguage(Language.GUJARATI)} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F3F4F4] font-medium">ગુજરાતી</button>
            </div>
          </div>

          <button 
            onClick={() => setRole(null)}
            className={`p-2 transition-all active:scale-90 ${isMerchant ? 'text-[#5F9598]' : 'text-[#1D546D]/30'}`}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
