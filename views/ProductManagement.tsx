
import React, { useState } from 'react';
import { useApp } from '../App';
import { Plus, Search, Edit2, Trash2, Eye, Tag, FileDown, UploadCloud, Layers, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement: React.FC = () => {
  const { t, language, setView, products, setProductToEdit } = useApp();
  const [search, setSearch] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const filtered = products.filter(p => 
    p.title[language].toLowerCase().includes(search.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (product: any) => {
    setProductToEdit(product);
    setView('add-product');
  };

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
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#061E29] tracking-tight">{t('inventory')}</h2>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">{products.length} {t('skus')} Active</p>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={() => setShowBulk(!showBulk)}
              className="w-10 h-10 bg-white text-[#1D546D] rounded-2xl border border-[#1D546D]/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <UploadCloud size={18} />
            </button>
            <button 
              onClick={() => {
                setProductToEdit(null);
                setView('add-product');
              }}
              className="flex items-center gap-2 bg-[#061E29] text-white px-5 py-2.5 rounded-2xl font-bold text-xs uppercase shadow-lg shadow-[#061E29]/20 active:scale-95 transition-all"
            >
              <Plus size={16} /> {t('addProduct')}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F9598]" size={18} />
          <input 
            type="text" 
            placeholder="Search by SKU, Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-[#1D546D]/10 rounded-[1.5rem] focus:ring-2 focus:ring-[#5F9598] outline-none text-xs font-bold text-[#061E29] shadow-sm"
          />
        </div>
      </div>

      <AnimatePresence>
        {showBulk && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#061E29] rounded-[2rem] p-6 text-white overflow-hidden space-y-4 shadow-xl"
          >
             <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold uppercase tracking-widest">{t('bulkUpload')}</h4>
                <button className="text-[10px] font-bold text-[#5F9598] flex items-center gap-1"><FileDown size={14}/> Template</button>
             </div>
             <div className="border-2 border-dashed border-[#1D546D] rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center gap-3">
                <UploadCloud size={32} className="text-[#5F9598]" />
                <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">Drop CSV or Excel files here</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 gap-4"
      >
        {filtered.map(product => {
          const hasDiscount = !!product.discountPrice;
          const isLowStock = product.stock < 10;

          return (
            <motion.div 
              variants={itemVariants}
              layout
              key={product.id}
              className="bg-white p-4 rounded-[2rem] border border-[#1D546D]/5 shadow-sm space-y-4"
            >
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                  {product.variants && (
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#061E29] text-[#5F9598] rounded-xl flex items-center justify-center border-2 border-white shadow-sm">
                      <Layers size={14}/>
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-[#061E29] text-sm truncate uppercase tracking-tight">{product.title[language]}</h4>
                      <p className="text-[9px] font-bold text-[#5F9598] uppercase tracking-[0.2em] mt-0.5">SKU: {product.sku || 'SKU_001'}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${product.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {product.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className={`text-sm font-black ${hasDiscount ? 'text-emerald-600' : 'text-[#061E29]'}`}>₹{product.discountPrice || product.price}</span>
                       {hasDiscount && <span className="text-[10px] text-[#5F9598] line-through font-bold">₹{product.price}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${isLowStock ? 'text-rose-600' : 'text-[#5F9598]'}`}>
                        {product.stock} {t('stockLabel')}
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#1D546D]/5">
                <button 
                  onClick={() => handleEdit(product)}
                  className="flex-1 py-3 bg-[#F3F4F4] rounded-xl text-[10px] font-black uppercase text-[#061E29] flex items-center justify-center gap-2 active:bg-[#1D546D] active:text-white transition-all"
                >
                   <Edit2 size={12}/> {t('editProduct')}
                </button>
                <button className="flex-1 py-3 bg-[#F3F4F4] rounded-xl text-[10px] font-black uppercase text-[#061E29] flex items-center justify-center gap-2">
                   <BarChart3 size={12}/> Analytics
                </button>
                <button className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
                   <Trash2 size={16}/>
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProductManagement;
