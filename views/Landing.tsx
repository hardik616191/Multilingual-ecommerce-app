
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole, Language } from '../types';
import { ShoppingBag, Store, ArrowRight, RefreshCw, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingView: React.FC<LandingProps> = ({ onSelectRole }) => {
  const { t, setHasConfirmedLanguage, language } = useApp();
  const [selectedFlow, setSelectedFlow] = useState<UserRole | null>(null);

  const flows = [
    {
      id: UserRole.CUSTOMER,
      title: "I want to Shop",
      subtitle: "Browse authentic snacks & local favorites",
      icon: ShoppingBag,
      color: "bg-emerald-500",
      accent: "text-emerald-500",
      features: ["Instant Delivery", "Secure Payments", "Local Market"],
      buttonText: "Enter Marketplace"
    },
    {
      id: UserRole.MERCHANT,
      title: "I want to Sell",
      subtitle: "Scale your business with advanced seller tools",
      icon: Store,
      color: "bg-[#061E29]",
      accent: "text-[#5F9598]",
      features: ["Inventory Tracking", "Sales Analytics", "Bulk Management"],
      buttonText: "Merchant Portal"
    }
  ];

  if (selectedFlow) {
    const flow = flows.find(f => f.id === selectedFlow)!;
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedFlow(null)}
          className="absolute top-6 left-6 p-2 text-[#1D546D]/50 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
        >
          <ArrowRight size={14} className="rotate-180" /> Back
        </motion.button>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className={`w-20 h-20 ${flow.color} rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl`}>
            <flow.icon size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#061E29]">{flow.title}</h2>
            <p className="text-sm text-[#1D546D]">{flow.subtitle}</p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 space-y-4">
             {flow.features.map((f, i) => (
               <div key={i} className="flex items-center gap-3 text-left">
                 <div className={`w-6 h-6 ${flow.color}/10 ${flow.accent} rounded-full flex items-center justify-center`}>
                    <ShieldCheck size={14} />
                 </div>
                 <span className="text-[11px] font-bold text-[#061E29] uppercase tracking-wide">{f}</span>
               </div>
             ))}
          </div>

          <button 
            onClick={() => onSelectRole(selectedFlow)}
            className={`w-full py-5 ${flow.color} text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all`}
          >
            {flow.buttonText}
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-black text-[#061E29] leading-tight tracking-tighter">
          shaileshbhai<span className="text-[#5F9598]">.store</span>
        </h1>
        <p className="text-sm font-bold text-[#1D546D] max-w-xs mx-auto opacity-70">
          The Multilingual Hub for Local Merchants & Global Customers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        {flows.map((flow) => (
          <motion.div 
            key={flow.id}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(29, 84, 109, 0.1)" }}
            onClick={() => setSelectedFlow(flow.id)}
            className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-xl shadow-[#1D546D]/5 flex items-center gap-5 text-left cursor-pointer transition-all duration-300"
          >
            <div className={`w-16 h-16 ${flow.id === UserRole.MERCHANT ? 'bg-[#061E29]' : 'bg-emerald-500'} rounded-3xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
              <flow.icon size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#061E29] uppercase tracking-tight">{flow.id === UserRole.MERCHANT ? t('merchantName') : t('customerName')}</h3>
              <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">{flow.id === UserRole.MERCHANT ? 'Seller Dashboard' : 'Shopping Experience'}</p>
            </div>
            <ArrowRight className="ml-auto text-[#1D546D]/20" size={20} />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={() => setHasConfirmedLanguage(false)}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-[#1D546D]/40 active:text-[#5F9598] transition-colors"
        >
          <Globe size={12} />
          Change Language ({language.toUpperCase()})
        </button>

        <div className="opacity-40 flex gap-8 items-center justify-center">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1D546D]">Secure</span>
          <span className="w-1 h-1 bg-[#5F9598] rounded-full"></span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1D546D]">Fast</span>
          <span className="w-1 h-1 bg-[#5F9598] rounded-full"></span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1D546D]">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
