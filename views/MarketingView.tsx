
import React, { useState } from 'react';
import { useApp } from '../App';
import { Ticket, Plus, Trash2, CheckCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MarketingView: React.FC = () => {
  const { t, coupons, addCoupon } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', value: '' });

  const handleAdd = () => {
    if (!newCoupon.code) return;
    // Fix: Added missing usageCount property to the Coupon object
    addCoupon({
      id: Math.random().toString(),
      code: newCoupon.code.toUpperCase(),
      discountType: 'percentage',
      value: Number(newCoupon.value),
      active: true,
      usageCount: 0
    });
    setNewCoupon({ code: '', value: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#061E29]">{t('marketing')}</h2>
          <p className="text-xs text-[#1D546D]">Boost sales with discounts</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-3 bg-[#061E29] text-white rounded-2xl shadow-lg shadow-[#061E29]/20"
        >
          <Plus size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-5 rounded-3xl border border-[#5F9598] space-y-4 overflow-hidden"
          >
            <h4 className="text-sm font-bold text-[#061E29]">Create New Coupon</h4>
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="CODE10" 
                value={newCoupon.code}
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                className="px-4 py-3 bg-[#F3F4F4] rounded-2xl outline-none text-xs font-bold uppercase" 
              />
              <input 
                type="number" 
                placeholder="Value %" 
                value={newCoupon.value}
                onChange={e => setNewCoupon({...newCoupon, value: e.target.value})}
                className="px-4 py-3 bg-[#F3F4F4] rounded-2xl outline-none text-xs font-bold" 
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleAdd} className="flex-grow py-3 bg-[#5F9598] text-[#061E29] rounded-2xl font-bold text-xs">Save Coupon</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-3 bg-[#F3F4F4] text-[#1D546D] rounded-2xl font-bold text-xs">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {coupons.length === 0 && !showAdd ? (
          <div className="py-20 text-center opacity-40">
            <Tag size={48} className="mx-auto mb-4" />
            <p className="text-sm font-bold uppercase">No active campaigns</p>
          </div>
        ) : (
          coupons.map(c => (
            <div key={c.id} className="bg-white border-2 border-dashed border-[#1D546D]/10 rounded-[2rem] p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F3F4F4] rounded-2xl flex items-center justify-center text-[#5F9598]">
                  <Ticket size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#061E29]">{c.code}</h4>
                  <p className="text-[10px] text-[#5F9598] font-bold uppercase">{c.value}% Flat Discount</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <CheckCircle size={18} />
                </div>
                <button className="p-2 text-rose-300 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketingView;
