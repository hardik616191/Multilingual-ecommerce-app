
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../App';
import { Language } from '../types';
import { Globe, ArrowRight } from 'lucide-react';

const LanguageSelectionView: React.FC = () => {
  const { setLanguage, setHasConfirmedLanguage } = useApp();

  const options = [
    { code: Language.ENGLISH, label: 'English', greeting: 'Welcome', sub: 'The Global Language' },
    { code: Language.GUJARATI, label: 'ગુજરાતી', greeting: 'કેમ છો', sub: 'આપણી સંસ્કૃતિ, આપણી ભાષા' },
    { code: Language.HINDI, label: 'हिन्दी', greeting: 'नमस्ते', sub: 'भारत की शान' }
  ];

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setHasConfirmedLanguage(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 space-y-12 bg-transparent">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-4"
      >
        <div className="w-20 h-20 bg-[#061E29] rounded-[2.5rem] flex items-center justify-center text-[#5F9598] mx-auto shadow-2xl shadow-[#061E29]/20 border border-[#1D546D]/20">
          <Globe size={40} />
        </div>
        <h1 className="text-3xl font-black text-[#061E29] tracking-tight mt-6 uppercase">
          Choose Language
        </h1>
        <p className="text-[#1D546D] font-bold text-[10px] uppercase tracking-[0.2em]">
          ભાષા પસંદ કરો • भाषा चुनें
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        {options.map((opt, idx) => (
          <motion.button
            key={opt.code}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(opt.code)}
            className="w-full bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-xl shadow-[#1D546D]/5 flex items-center justify-between group active:bg-[#F3F4F4]"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-black text-[#5F9598] uppercase tracking-widest mb-1">
                {opt.greeting}
              </span>
              <h3 className="text-xl font-black text-[#061E29] group-hover:text-[#1D546D] transition-colors">
                {opt.label}
              </h3>
              <p className="text-[9px] font-bold text-[#1D546D]/40 uppercase mt-1">
                {opt.sub}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#F3F4F4] rounded-2xl flex items-center justify-center text-[#1D546D] group-hover:bg-[#061E29] group-hover:text-white transition-all">
              <ArrowRight size={20} />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="pt-8 opacity-30 flex gap-6 items-center justify-center">
        <span className="text-[8px] font-black uppercase tracking-widest text-[#1D546D]">Authentic Roots</span>
        <span className="w-1.5 h-1.5 bg-[#5F9598] rounded-full"></span>
        <span className="text-[8px] font-black uppercase tracking-widest text-[#1D546D]">Multi-Cuisine Hub</span>
      </div>
    </div>
  );
};

export default LanguageSelectionView;
