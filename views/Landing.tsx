
import React from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';
import { ShoppingBag, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingView: React.FC<LandingProps> = ({ onSelectRole }) => {
  const { setHasConfirmedLanguage, language } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="w-24 h-24 bg-[#061E29] rounded-[2.5rem] flex items-center justify-center text-[#5F9598] mx-auto shadow-2xl border border-[#1D546D]/20">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-black text-[#061E29] leading-tight tracking-tighter mt-6">
          shaileshbhai<span className="text-[#5F9598]">.store</span>
        </h1>
        <p className="text-sm font-bold text-[#1D546D] max-w-xs mx-auto opacity-70">
          Authentic Snacks & Local Favorites Delivered to Your Doorstep.
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 space-y-4 shadow-xl shadow-[#1D546D]/5">
           <div className="flex items-center gap-3 text-left">
             <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={14} />
             </div>
             <span className="text-[11px] font-bold text-[#061E29] uppercase tracking-wide">Instant Delivery</span>
           </div>
           <div className="flex items-center gap-3 text-left">
             <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={14} />
             </div>
             <span className="text-[11px] font-bold text-[#061E29] uppercase tracking-wide">Secure Payments</span>
           </div>
           <div className="flex items-center gap-3 text-left">
             <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={14} />
             </div>
             <span className="text-[11px] font-bold text-[#061E29] uppercase tracking-wide">Fresh Quality Guaranteed</span>
           </div>
        </div>

        <button 
          onClick={() => onSelectRole(UserRole.CUSTOMER)}
          className="w-full py-5 bg-[#061E29] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          Start Shopping
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={() => setHasConfirmedLanguage(false)}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-[#1D546D]/40 active:text-[#5F9598] transition-colors"
        >
          <Globe size={12} />
          Change Language ({language.toUpperCase()})
        </button>
      </div>
    </div>
  );
};

export default LandingView;
