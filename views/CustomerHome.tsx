
import React, { useState } from 'react';
import { useApp } from '../App';
import { Search, Star, Filter, Heart, Plus, Tag, Zap, TrendingUp, Clock, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerHome: React.FC = () => {
  const { t, language, setSelectedProduct, setView, wishlist, toggleWishlist, products, recentlyViewed, notifications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;
  const cats = ['All', 'Snacks', 'Grocery', 'Sweets', 'Pickles'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title[language].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCat === 'All' || p.category === activeCat;
    return matchesSearch && matchesCat;
  });

  const deals = products.filter(p => !!p.discountPrice).slice(0, 4);
  const trending = products.slice(0, 6).sort((a, b) => b.rating - a.rating);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
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
            <div className="w-10 h-10 bg-white rounded-2xl shadow-sm border border-[#1D546D]/5 flex items-center justify-center text-[#061E29]">
              <Filter size={18} />
            </div>
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

      {/* Hero Banner / Promotion */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-[#061E29] p-6 rounded-[2.5rem] text-white flex items-center justify-between relative overflow-hidden shadow-xl"
      >
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F9598]">Flash Deal</span>
          <h3 className="text-xl font-bold">Sunday Specials</h3>
          <p className="text-xs text-[#5F9598] font-bold">Up to 40% Off on Namkeen</p>
          <button className="bg-[#5F9598] text-[#061E29] text-[10px] font-black uppercase px-4 py-2 rounded-xl mt-2">Claim Offer</button>
        </div>
        <Zap size={64} className="text-[#1D546D] opacity-20 absolute -right-2 top-0" />
      </motion.div>

      {/* Sticky Categories Bar */}
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

      {/* Deals of the Day - Horizontal Scroll */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="space-y-4"
      >
        <div className="flex justify-between items-center px-1">
          <h3 className="text-base font-black text-[#061E29] uppercase tracking-wider flex items-center gap-2">
            <Zap size={16} className="text-amber-500" /> {t('dealsOfTheDay')}
          </h3>
          <span className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">End in 04:22:10</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-carousel">
          {deals.map(p => (
            <motion.div 
              variants={itemVariants}
              key={p.id} 
              onClick={() => { setSelectedProduct(p); setView('product-detail'); }}
              className="min-w-[160px] bg-white rounded-3xl p-3 border border-[#1D546D]/5 shadow-sm snap-item active:scale-95 transition-transform"
            >
              <div className="relative aspect-square mb-2 overflow-hidden rounded-2xl">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg">-{p.discountConfig?.value}%</div>
              </div>
              <h4 className="text-[10px] font-bold text-[#061E29] truncate">{p.title[language]}</h4>
              <p className="text-xs font-black text-[#061E29]">₹{p.discountPrice}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

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
                <div 
                  key={id} 
                  onClick={() => { setSelectedProduct(p); setView('product-detail'); }}
                  className="min-w-[80px] text-center space-y-2 snap-item active:scale-90 transition-transform"
                >
                  <div className="relative">
                    <img src={p.image} className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md mx-auto" alt="" />
                    <div className="absolute inset-0 rounded-full bg-[#061E29]/5"></div>
                  </div>
                  <p className="text-[9px] font-bold text-[#1D546D] truncate">{p.title[language]}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Trending Now / Grid */}
      <section className="space-y-4">
        <h3 className="text-base font-black text-[#061E29] uppercase tracking-wider flex items-center gap-2 px-1">
          <TrendingUp size={16} className="text-[#5F9598]" /> {t('trendingNow')}
        </h3>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={containerVariants}
          className="grid grid-cols-2 gap-4"
        >
          {trending.map(product => {
            const isLiked = wishlist.includes(product.id);
            return (
              <motion.div 
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                key={product.id} 
                className="bg-white rounded-[2rem] shadow-sm border border-[#1D546D]/5 overflow-hidden flex flex-col relative"
              >
                <div className="relative aspect-square">
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover" 
                    onClick={() => { setSelectedProduct(product); setView('product-detail'); }}
                  />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                      isLiked ? 'bg-rose-500 text-white' : 'bg-white/80 text-[#1D546D]'
                    }`}
                  >
                    <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-[#061E29] text-xs line-clamp-1">{product.title[language]}</h4>
                  <div className="flex items-center gap-1 text-[9px] text-[#5F9598] font-bold mt-1">
                    <Star size={10} className="fill-[#5F9598]" /> {product.rating}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-[#061E29]">₹{product.discountPrice || product.price}</span>
                    <button className="w-8 h-8 bg-[#061E29] text-white rounded-xl flex items-center justify-center active:scale-75 transition-transform">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
      
      {/* Infinite Scroll Indicator Placeholder */}
      <div className="py-8 flex justify-center opacity-30">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#1D546D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-[#1D546D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-[#1D546D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
