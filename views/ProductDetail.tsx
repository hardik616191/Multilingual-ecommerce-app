import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Check, Zap } from 'lucide-react';
import { ProductVariant } from '../types';

const ProductDetail: React.FC = () => {
  const { selectedProduct, setView, t, language, addToCart, toggleWishlist, wishlist, setBuyNowItem } = useApp();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();

  if (!selectedProduct) return null;

  const isLiked = wishlist.includes(selectedProduct.id);

  const selectedVariant = useMemo(() => {
    return selectedProduct.variants?.find(v => v.id === selectedVariantId);
  }, [selectedProduct.variants, selectedVariantId]);

  const currentPrice = useMemo(() => {
    const basePrice = selectedProduct.discountPrice || selectedProduct.price;
    return basePrice + (selectedVariant?.priceDelta || 0);
  }, [selectedProduct, selectedVariant]);

  const variantsByType = useMemo(() => {
    if (!selectedProduct.variants) return {};
    return selectedProduct.variants.reduce((acc, v) => {
      if (!acc[v.type]) acc[v.type] = [];
      acc[v.type].push(v);
      return acc;
    }, {} as Record<string, ProductVariant[]>);
  }, [selectedProduct.variants]);

  const validateSelection = () => {
    if (selectedProduct.variants && selectedProduct.variants.length > 0 && !selectedVariantId) {
      alert("Please select a variant first!");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addToCart(selectedProduct.id, currentPrice, selectedVariantId);
    setView('cart');
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    const variant = selectedProduct.variants?.find(v => v.id === selectedVariantId);
    const sku = variant?.sku || selectedProduct.sku || 'SKU_UNKNOWN';
    setBuyNowItem({
      productId: selectedProduct.id,
      quantity: 1,
      price: currentPrice,
      variantId: selectedVariantId,
      sku: sku
    });
    setView('checkout');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setView('home')} className="p-2 -ml-2 rounded-full active:bg-[#1D546D]/10 text-[#061E29]">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={() => toggleWishlist(selectedProduct.id)} className={`p-2 rounded-full active:scale-90 transition-all ${isLiked ? 'text-rose-500' : 'text-[#1D546D]'}`}>
            <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="p-2 text-[#1D546D] rounded-full active:scale-90">
            <Share2 size={22} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-[#1D546D]/5">
        <img src={selectedProduct.image} className="w-full aspect-square object-cover" alt="Product" />
      </div>

      <div className="px-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">{selectedProduct.category}</span>
            <h2 className="text-2xl font-bold text-[#061E29] leading-tight">{selectedProduct.title[language]}</h2>
            <p className="text-[10px] font-black text-[#5F9598] uppercase tracking-widest">Brand: {selectedProduct.brand}</p>
          </div>
          <div className="bg-[#5F9598]/10 text-[#5F9598] px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
            <Star size={14} fill="currentColor" />
            {selectedProduct.rating}
          </div>
        </div>

        <p className="text-[#1D546D] text-sm leading-relaxed">
          {selectedProduct.description[language]}
        </p>

        {/* Variants Selection UI */}
        {Object.keys(variantsByType).length > 0 && (
          <div className="space-y-4">
            {Object.entries(variantsByType).map(([type, options]) => (
              <div key={type} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#061E29] uppercase tracking-widest">Select {type}</h4>
                  <span className="text-[9px] font-bold text-[#5F9598] uppercase">Required</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Fix: Explicitly cast 'options' to ProductVariant[] to resolve 'Property map does not exist on type unknown' */}
                  {(options as ProductVariant[]).map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    const isOutOfStock = v.stock <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center min-w-[80px] ${
                          isSelected 
                            ? 'bg-[#061E29] text-white border-[#061E29] shadow-lg' 
                            : isOutOfStock 
                              ? 'bg-[#F3F4F4] text-[#1D546D]/20 border-[#1D546D]/5 cursor-not-allowed'
                              : 'bg-white text-[#061E29] border-[#1D546D]/10 hover:border-[#5F9598]'
                        }`}
                      >
                        <span>{v.value}</span>
                        {v.priceDelta !== 0 && (
                          <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-[#5F9598]' : 'text-[#5F9598]'}`}>
                            {v.priceDelta > 0 ? `+₹${v.priceDelta}` : `-₹${Math.abs(v.priceDelta)}`}
                          </span>
                        )}
                        {isOutOfStock && <span className="text-[8px] uppercase mt-1">OOS</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-[#5F9598] text-xs font-bold bg-[#5F9598]/5 p-3 rounded-2xl border border-[#5F9598]/10">
          <Check size={16} />
          {selectedVariant 
            ? selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock for this variant` : t('outOfStock')
            : selectedProduct.stock > 0 ? `${selectedProduct.stock} ${t('stockLabel')}` : t('outOfStock')}
        </div>

        <div className="pt-4 border-t border-[#1D546D]/5">
           <h4 className="text-xs font-bold text-[#1D546D] uppercase mb-4">{t('reviews')}</h4>
           <div className="space-y-4">
             <div className="bg-white p-4 rounded-2xl border border-[#1D546D]/5">
               <div className="flex justify-between mb-2">
                 <span className="text-xs font-bold text-[#061E29]">Rajesh K.</span>
                 <div className="flex gap-0.5 text-[#5F9598]">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor"/>)}
                 </div>
               </div>
               <p className="text-xs text-[#1D546D]">Excellent quality, fast delivery in Ahmedabad!</p>
             </div>
           </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-20 left-4 right-4 bg-[#061E29] rounded-[2rem] p-4 flex flex-col gap-3 shadow-2xl z-40 border border-[#1D546D]/20">
        <div className="flex items-center justify-between px-2">
          <div className="pl-2">
            <span className="text-[10px] text-[#5F9598] font-bold uppercase block">{t('total')}</span>
            <span className="text-xl font-bold text-white">₹{currentPrice}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="bg-white/10 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all border border-white/10"
            >
              <ShoppingCart size={18} />
              {t('addToCart')}
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-[#5F9598] text-[#061E29] px-6 py-3 rounded-2xl font-black uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#5F9598]/20"
            >
              <Zap size={18} fill="currentColor" />
              {t('buyNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;