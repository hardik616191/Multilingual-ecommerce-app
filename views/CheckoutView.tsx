
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, Truck, IndianRupee, Zap, ShoppingBag } from 'lucide-react';

const CheckoutView: React.FC = () => {
  const { cart, buyNowItem, placeOrder, t, products, language } = useApp();
  const [step, setStep] = useState(1);

  const isBuyNow = !!buyNowItem;

  const itemsToCheckout = useMemo(() => {
    return isBuyNow ? [buyNowItem] : cart;
  }, [buyNowItem, cart, isBuyNow]);

  const subtotal = useMemo(() => itemsToCheckout.reduce((acc, item) => acc + (item.price * item.quantity), 0), [itemsToCheckout]);

  const tax = Math.floor(subtotal * 0.05);
  const finalTotal = subtotal + tax;

  const steps = [
    { id: 1, label: t('shipping'), icon: MapPin },
    { id: 2, label: t('payment'), icon: CreditCard },
    { id: 3, label: t('summary'), icon: CheckCircle2 },
  ];

  const handlePlaceOrder = () => {
    placeOrder({
      id: Math.random().toString(36).substr(2, 9),
      customerId: 'u1',
      merchantId: 'm1',
      items: [...itemsToCheckout],
      subtotal: subtotal,
      commission: 0,
      tax: tax,
      total: finalTotal,
      status: 'pending',
      date: new Date().toISOString(),
      address: { id: 'a1', type: 'Home', name: 'User', street: 'MG Road', city: 'Ahmedabad', zip: '380001' },
      fulfillmentMode: 'SELLER_FULFILLED'
    });
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-[#061E29]">{t('checkout')}</h2>
        {isBuyNow && (
          <div className="flex items-center gap-1.5 bg-[#5F9598]/10 text-[#5F9598] px-3 py-1.5 rounded-full">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Buy Now</span>
          </div>
        )}
      </div>

      <div className="flex justify-between px-4">
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= s.id ? 'bg-[#5F9598] text-white shadow-lg' : 'bg-[#1D546D]/10 text-[#1D546D]'}`}>
              <s.icon size={18} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${step >= s.id ? 'text-[#061E29]' : 'text-[#1D546D]/50'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-[#5F9598] relative">
              <h4 className="font-bold text-sm text-[#061E29] mb-1">Home Address</h4>
              <p className="text-xs text-[#1D546D]">123 Sapphire Ave, Satellite, Ahmedabad</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#5F9598] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#5F9598]/10 p-3 rounded-2xl text-[#5F9598]"><IndianRupee size={20}/></div>
                <div>
                  <h4 className="font-bold text-sm text-[#061E29]">UPI / Card</h4>
                  <p className="text-[10px] text-[#5F9598] font-bold uppercase">Secure Payment</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white p-5 rounded-[2rem] border border-[#1D546D]/5 shadow-sm space-y-3">
              <h4 className="text-[10px] font-black uppercase text-[#5F9598] tracking-widest flex items-center gap-2">
                <ShoppingBag size={14}/> Purchase Preview
              </h4>
              {itemsToCheckout.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={idx} className="flex gap-4 items-center py-2 border-b border-[#F3F4F4] last:border-0">
                    <img src={product?.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-grow">
                      <p className="text-xs font-bold text-[#061E29] truncate">{product?.title[language]}</p>
                      <p className="text-[10px] text-[#5F9598] font-medium uppercase">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-[#061E29]">₹{item.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm space-y-4">
               <h4 className="font-extrabold text-[#061E29] uppercase text-xs tracking-widest mb-4">Final Summary</h4>
               <div className="flex justify-between text-sm">
                 <span className="text-[#1D546D] font-medium">Subtotal</span>
                 <span className="font-bold text-[#061E29]">₹{subtotal}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-[#1D546D] font-medium">Tax (5%)</span>
                 <span className="font-bold text-[#061E29]">₹{tax}</span>
               </div>
               <div className="pt-4 border-t border-[#1D546D]/10 flex justify-between items-center">
                 <span className="font-black text-[#061E29] text-sm uppercase">Amount Payable</span>
                 <span className="text-2xl font-black text-[#061E29]">₹{finalTotal}</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-20 left-4 right-4 z-40">
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : handlePlaceOrder()}
          className="w-full py-5 bg-[#061E29] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border border-[#1D546D]/20"
        >
          {step === 3 ? t('placeOrder') : 'Continue to ' + steps[step].label}
          {step < 3 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CheckoutView;
