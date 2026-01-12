
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, Truck, Ticket, Tag, X, IndianRupee } from 'lucide-react';

const CheckoutView: React.FC = () => {
  const { cart, buyNowItem, placeOrder, t, setView, coupons } = useApp();
  const [step, setStep] = useState(1);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  // Use either buyNowItem (if direct checkout) or the full cart
  const itemsToCheckout = useMemo(() => {
    return buyNowItem ? [buyNowItem] : cart;
  }, [buyNowItem, cart]);

  const subtotal = useMemo(() => itemsToCheckout.reduce((acc, item) => acc + (item.price * item.quantity), 0), [itemsToCheckout]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.floor(subtotal * (appliedCoupon.value / 100));
    }
    return Math.min(subtotal, appliedCoupon.value);
  }, [subtotal, appliedCoupon]);

  const finalTotal = subtotal - discountAmount;

  const steps = [
    { id: 1, label: t('shipping'), icon: MapPin },
    { id: 2, label: t('payment'), icon: CreditCard },
    { id: 3, label: t('summary'), icon: CheckCircle2 },
  ];

  const applyCoupon = () => {
    setCouponError('');
    const found = coupons.find(c => c.code.toLowerCase() === couponInput.toLowerCase() && c.active);
    if (found) {
      setAppliedCoupon(found);
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const handlePlaceOrder = () => {
    placeOrder({
      id: Math.random().toString(36).substr(2, 9),
      customerId: 'u1',
      merchantId: 'm1',
      items: [...itemsToCheckout],
      subtotal: subtotal,
      commission: 0,
      tax: Math.floor(subtotal * 0.05),
      total: finalTotal,
      discountApplied: discountAmount,
      status: 'pending',
      date: new Date().toISOString(),
      address: { id: 'a1', type: 'Home', name: 'User', street: 'MG Road', city: 'Ahmedabad', zip: '380001' },
      fulfillmentMode: 'SELLER_FULFILLED'
    });
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-[#061E29]">{t('checkout')}</h2>
      </div>

      {/* Progress Tracker */}
      <div className="flex justify-between px-4">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= s.id ? 'bg-[#5F9598] text-white shadow-lg shadow-[#5F9598]/20' : 'bg-[#1D546D]/10 text-[#1D546D]'}`}>
              <s.icon size={18} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${step >= s.id ? 'text-[#061E29]' : 'text-[#1D546D]/50'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-[#5F9598] shadow-sm relative">
              <div className="absolute top-4 right-4 bg-[#5F9598] text-[#061E29] p-1 rounded-full"><CheckCircle2 size={12}/></div>
              <h4 className="font-bold text-sm text-[#061E29] mb-1">Home Address</h4>
              <p className="text-xs text-[#1D546D]">123 Sapphire Ave, Satellite, Ahmedabad, Gujarat - 380015</p>
            </div>
            <button className="w-full py-4 border-2 border-dashed border-[#1D546D]/20 rounded-3xl text-xs font-bold text-[#1D546D] uppercase active:scale-[0.98] transition-all">+ Add New Address</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#5F9598] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-[#5F9598]/10 p-3 rounded-2xl text-[#5F9598]"><IndianRupee size={20}/></div>
                <div>
                  <h4 className="font-bold text-sm text-[#061E29]">UPI / Google Pay</h4>
                  <p className="text-[10px] text-[#5F9598] font-bold uppercase">Fastest Payment</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-[#5F9598] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#5F9598] rounded-full"></div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#1D546D]/10 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="bg-[#F3F4F4] p-3 rounded-2xl text-[#1D546D]"><Truck size={20}/></div>
                <h4 className="font-bold text-sm text-[#061E29]">Cash on Delivery</h4>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            {/* Coupon Section */}
            <div className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm space-y-4">
               <div className="flex items-center gap-2 text-[#061E29]">
                  <Ticket size={18} className="text-[#5F9598]" />
                  <h4 className="font-bold text-sm uppercase tracking-wider">Apply Promo Code</h4>
               </div>

               {appliedCoupon ? (
                 <div className="bg-[#5F9598]/10 p-4 rounded-2xl border border-dashed border-[#5F9598] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Tag size={16} className="text-[#5F9598]" />
                       <div>
                          <p className="text-xs font-bold text-[#061E29] uppercase tracking-widest">{appliedCoupon.code}</p>
                          <p className="text-[10px] text-[#5F9598] font-bold">DISCOUNT APPLIED: ₹{discountAmount}</p>
                       </div>
                    </div>
                    <button onClick={removeCoupon} className="p-1.5 text-rose-500 bg-rose-50 rounded-lg active:scale-90 transition-transform">
                       <X size={16} />
                    </button>
                 </div>
               ) : (
                 <div className="flex gap-2">
                   <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="w-full px-4 py-3 bg-[#F3F4F4] rounded-2xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[#5F9598] transition-all"
                      />
                      {couponError && <p className="absolute -bottom-5 left-1 text-[9px] text-rose-500 font-bold">{couponError}</p>}
                   </div>
                   <button 
                    onClick={applyCoupon}
                    disabled={!couponInput}
                    className="px-6 py-3 bg-[#061E29] text-white rounded-2xl text-xs font-bold uppercase active:scale-95 transition-all disabled:opacity-50"
                  >
                    Apply
                   </button>
                 </div>
               )}
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm space-y-4">
               <h4 className="font-extrabold text-[#061E29] uppercase text-xs tracking-widest mb-4">Order Summary</h4>
               <div className="flex justify-between text-sm">
                 <span className="text-[#1D546D] font-medium">Items ({itemsToCheckout.length})</span>
                 <span className="font-bold text-[#061E29]">₹{subtotal}</span>
               </div>
               {discountAmount > 0 && (
                 <div className="flex justify-between text-sm text-emerald-600 font-bold">
                   <span className="flex items-center gap-1">Promo Discount <Tag size={12}/></span>
                   <span>- ₹{discountAmount}</span>
                 </div>
               )}
               <div className="flex justify-between text-sm">
                 <span className="text-[#1D546D] font-medium">Shipping</span>
                 <span className="text-emerald-600 font-bold uppercase text-[10px]">Free Delivery</span>
               </div>
               <div className="pt-4 border-t border-[#1D546D]/10 flex justify-between items-center">
                 <span className="font-black text-[#061E29] text-sm uppercase">Total Payable</span>
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
          {step === 3 ? t('placeOrder') : 'Next: ' + steps[step].label}
          {step < 3 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CheckoutView;
