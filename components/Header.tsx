
import React from 'react';
import { useApp } from '../App';
import { Language } from '../types';
import { Globe, LogOut, Radio } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage, setRole, setView } = useApp();

  return (
    <header className="bg-[#061E29] text-white border-b border-[#1D546D]/20 sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-[#5F9598] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-[#061E29] font-bold text-sm">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none">shaileshbhai</span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[7px] font-black uppercase text-[#5F9598] tracking-widest">Live Sync</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-white bg-[#1D546D] px-3 py-1.5 rounded-full transition-all text-xs font-bold uppercase active:scale-95">
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
            className="p-2 text-[#5F9598] hover:text-white active:scale-90 transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
