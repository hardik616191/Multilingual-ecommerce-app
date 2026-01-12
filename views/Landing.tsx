
import React from 'react';
import { useApp } from '../App';
import { UserRole, Language } from '../types';
import { ShoppingBag, Store, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingView: React.FC<LandingProps> = ({ onSelectRole }) => {
  const { t, setHasConfirmedLanguage } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-[#061E29] leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-base text-[#1D546D] max-w-xs mx-auto">
          {t('heroSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        <motion.div 
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelectRole(UserRole.CUSTOMER)}
          className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-xl shadow-[#1D546D]/5 flex items-center gap-5 text-left"
        >
          <div className="w-16 h-16 bg-[#F3F4F4] rounded-3xl flex items-center justify-center text-[#1D546D] flex-shrink-0">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#061E29]">{t('customerName')}</h3>
            <p className="text-xs text-[#5F9598]">Browse local market</p>
          </div>
          <ArrowRight className="ml-auto text-[#1D546D]/30" size={20} />
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelectRole(UserRole.MERCHANT)}
          className="bg-[#061E29] p-6 rounded-[2.5rem] border border-[#1D546D]/20 shadow-xl shadow-[#061E29]/20 flex items-center gap-5 text-left"
        >
          <div className="w-16 h-16 bg-[#1D546D] rounded-3xl flex items-center justify-center text-[#5F9598] flex-shrink-0">
            <Store size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('merchantName')}</h3>
            <p className="text-xs text-[#5F9598]">Sell and Manage</p>
          </div>
          <ArrowRight className="ml-auto text-[#5F9598]/50" size={20} />
        </motion.div>
      </div>

      <button 
        onClick={() => setHasConfirmedLanguage(false)}
        className="flex items-center gap-2 text-[10px] font-black uppercase text-[#1D546D]/40 active:text-[#5F9598] transition-colors"
      >
        <RefreshCw size={12} />
        Change Language
      </button>

      <div className="pt-8 opacity-60 flex gap-8 items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D546D]">Gujarat Roots</span>
        <span className="w-1.5 h-1.5 bg-[#5F9598] rounded-full"></span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D546D]">Global Reach</span>
      </div>
    </div>
  );
};

export default LandingView;
