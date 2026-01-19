
import React, { useState } from 'react';
import { useApp } from '../App';
import { Search, Star, Filter, Heart, Plus, TrendingUp, Clock, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerHome: React.FC = () => {
  const { t, language, setSelectedProduct, setView, wishlist, toggleWishlist, products, recentlyViewed, notifications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;
  const cats = ['All', 'Clothing', 'Electronics', 'Foods'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title[language].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCat === 'All' || p.category === activeCat;
    return matchesSearch && matchesCat;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
           <div>
            <h2 className="text-2xl font-black text-[#061E29] leading-tight">shaileshbhai</h2>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">{t('welcome')}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('notifications')}
              className="relative w-10 h-10 bg-white rounded-2xl shadow-sm border border-[#1D546D]/5 flex items-center justify-center text-[#061E29]"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F9598]" size={18} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 rounded-[1.5rem] bg-white border border-[#1D546D]/10 focus:ring-2 focus:ring-[#5F9598] outline-none text-sm shadow-sm placeholder-[#1D546D]/30 text-[#061E29]"
          />
        </div>
      </motion.div>

      {/* Categories Bar */}
      <div className="sticky top-0 z-40 -mx-4 px-4 py-2 bg-[#F3F4F4]/90 backdrop-blur-md">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-carousel">
          {cats.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all snap-item shadow-sm border ${
                activeCat === cat ? 'bg-[#061E29] text-white border-[#061E29]' : 'bg-white text-[#1D546D] border-[#1D546D]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h3 className="text-base font-black text-[#061E29] uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-[#5F9598]" /> {t('recentlyViewed')}
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-carousel">
            {recentlyViewed.map(id => {
              const p = products.find(prod => prod.id === id);
              if (!p) return null;
              return (
                <motion.div 
                  key={id} 
                  whileHover={{ y: -5 }}
                  onClick={() => { setSelectedProduct(p); setView('product-detail', true, true); }}
                  className="min-w-[90px] text-center space-y-2 snap-item transition-all cursor-pointer"
                >
                  <div className="relative">
                    <img src={p.image} className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md mx-auto" alt="" />
                    <div className="absolute inset-0 rounded-full bg-[#061E29]/5"></div>
                  </div>
                  <p className="text-[9px] font-bold text-[#1D546D] truncate">{p.title[language]}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Trending Now / Grid */}
      <section className="space-y-4 px-1">
        <h3 className="text-base font-black text-[#061E29] uppercase tracking-wider flex items-center gap-2 px-1">
          <TrendingUp size={16} className="text-[#5F9598]" /> {t('trendingNow')}
        </h3>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={containerVariants}
          className="grid grid-cols-4 gap-4"
        >
          {filteredProducts.slice(0, 40).map(product => {
            const isLiked = wishlist.includes(product.id);
            return (
              <motion.div 
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                key={product.id} 
                className="bg-white rounded-[1rem] shadow-sm border border-[#1D546D]/5 overflow-hidden flex flex-col relative transition-all duration-300 h-full"
              >
                <div className="relative aspect-square cursor-pointer" onClick={() => { setSelectedProduct(product); setView('product-detail', true, true); }}>
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover" 
                    alt=""
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className={`absolute top-1 right-1 p-1 rounded-full backdrop-blur-md transition-all z-10 ${
                      isLiked ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 text-[#1D546D]'
                    }`}
                  >
                    <Heart size={10} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="p-1.5 flex flex-col flex-grow">
                  <h4 className="font-bold text-[#061E29] text-[9px] line-clamp-2 leading-tight min-h-[1.75em]">{product.title[language]}</h4>
                  <div className="flex items-center gap-0.5 text-[8px] text-[#5F9598] font-bold mt-0.5">
                    <Star size={8} className="fill-[#5F9598]" /> {product.rating.toFixed(1)}
                  </div>
                  <div className="mt-auto pt-1 flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#061E29]">₹{product.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="w-5 h-5 bg-[#061E29] text-white rounded-lg flex items-center justify-center active:scale-75 transition-transform"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default CustomerHome;
