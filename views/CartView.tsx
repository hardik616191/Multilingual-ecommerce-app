
import React from 'react';
import { useApp } from '../App';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const CartView: React.FC = () => {
  const { cart, updateCartQty, removeFromCart, t, language, setView, products } = useApp();

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
        <div className="w-20 h-20 bg-[#1D546D]/10 text-[#1D546D] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold text-[#061E29] mb-2">{t('emptyCart')}</h2>
        <p className="text-sm text-[#1D546D] mb-8">Start adding some items to see them here.</p>
        <button 
          onClick={() => setView('home')}
          className="px-8 py-3 bg-[#061E29] text-white rounded-2xl font-bold active:scale-95 transition-all"
        >
          {t('customerHome')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <h2 className="text-2xl font-bold text-[#061E29] mb-4">{t('cart')}</h2>

      <div className="space-y-4">
        {cart.map((item) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;

          const variant = product.variants?.find(v => v.id === item.variantId);

          return (
            <motion.div 
              layout
              key={item.productId + (item.variantId || '')}
              className="bg-white p-4 rounded-3xl border border-[#1D546D]/10 flex gap-4 items-center"
            >
              <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" alt="Thumb" />
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-[#061E29] text-sm truncate">{product.title[language]}</h4>
                {variant && (
                  <p className="text-[10px] text-[#5F9598] font-bold uppercase">{variant.type}: {variant.value}</p>
                )}
                <p className="text-xs text-[#5F9598] font-bold mb-2">₹{item.price}</p>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F3F4F4] rounded-xl px-1">
                    <button 
                      onClick={() => updateCartQty(item.productId, item.quantity - 1, item.variantId)}
                      className="p-2 text-[#1D546D] active:scale-75 transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#061E29]">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.productId, item.quantity + 1, item.variantId)}
                      className="p-2 text-[#1D546D] active:scale-75 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.productId, item.variantId)}
                className="p-3 text-[#061E29]/20 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm space-y-3">
        <div className="flex justify-between text-sm text-[#1D546D] font-medium">
          <span>Subtotal</span>
          <span>₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-sm text-[#1D546D] font-medium">
          <span>Tax (GST 5%)</span>
          <span>₹{Math.floor(cartTotal * 0.05)}</span>
        </div>
        <div className="pt-3 border-t border-[#1D546D]/10 flex justify-between items-center">
          <span className="text-base font-bold text-[#061E29]">{t('total')}</span>
          <span className="text-xl font-bold text-[#061E29]">₹{cartTotal + Math.floor(cartTotal * 0.05)}</span>
        </div>
      </div>

      <div className="fixed bottom-20 left-4 right-4 z-40">
        <button 
          onClick={() => setView('checkout')}
          className="w-full py-4 bg-[#5F9598] text-[#061E29] rounded-[2rem] font-bold flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
        >
          {t('checkout')}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartView;
