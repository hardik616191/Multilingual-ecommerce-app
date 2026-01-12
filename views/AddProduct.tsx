
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, Package, Tag, Percent, IndianRupee, Layers, Plus, Trash2 } from 'lucide-react';
import { Language, Product, ProductVariant } from '../types';

const AddProduct: React.FC = () => {
  const { t, setView, addProduct, updateProduct, productToEdit, setProductToEdit } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);

  const [formData, setFormData] = useState({
    nameEn: '', nameHi: '', nameGu: '',
    descEn: '', descHi: '', descGu: '',
    price: '', stock: '', category: 'Clothing', imageUrl: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: ''
  });

  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  // Load existing product for editing
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nameEn: productToEdit.title[Language.ENGLISH] || '',
        nameHi: productToEdit.title[Language.HINDI] || '',
        nameGu: productToEdit.title[Language.GUJARATI] || '',
        descEn: productToEdit.description[Language.ENGLISH] || '',
        descHi: productToEdit.description[Language.HINDI] || '',
        descGu: productToEdit.description[Language.GUJARATI] || '',
        price: productToEdit.price.toString(),
        stock: productToEdit.stock.toString(),
        category: productToEdit.category,
        imageUrl: productToEdit.image,
        discountType: productToEdit.discountConfig?.type || 'percentage',
        discountValue: productToEdit.discountConfig?.value.toString() || ''
      });
      setHasDiscount(!!productToEdit.discountPrice);
      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setHasVariants(true);
        setVariants(productToEdit.variants);
      }
    }
  }, [productToEdit]);

  useEffect(() => {
    const p = Number(formData.price);
    const dVal = Number(formData.discountValue);
    if (!hasDiscount || !dVal || !p) {
      setCalculatedPrice(p);
      return;
    }

    if (formData.discountType === 'percentage') {
      setCalculatedPrice(p - (p * dVal / 100));
    } else {
      setCalculatedPrice(Math.max(0, p - dVal));
    }
  }, [formData.price, formData.discountValue, formData.discountType, hasDiscount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addVariantField = () => {
    setVariants([...variants, { id: Math.random().toString(), type: 'Size', value: '', priceDelta: 0, stock: 10, sku: '' }]);
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const p = Number(formData.price);
    const dVal = Number(formData.discountValue);

    const productData: Product = {
      id: productToEdit?.id || Math.random().toString(36).substr(2, 9),
      sku: productToEdit?.sku || ('SKU_' + Math.random().toString(36).substr(2, 6).toUpperCase()),
      brand: productToEdit?.brand || 'Shaileshbhai',
      status: productToEdit?.status || 'active',
      fulfillmentMode: productToEdit?.fulfillmentMode || 'SELLER_FULFILLED',
      title: {
        [Language.ENGLISH]: formData.nameEn,
        [Language.HINDI]: formData.nameHi || formData.nameEn,
        [Language.GUJARATI]: formData.nameGu || formData.nameEn
      },
      description: {
        [Language.ENGLISH]: formData.descEn || "No description provided.",
        [Language.HINDI]: formData.descHi || formData.descEn || "कोई विवरण प्रदान नहीं किया गया।",
        [Language.GUJARATI]: formData.descGu || formData.descEn || "કોઈ વર્ણન આપવામાં આવ્યું નથી."
      },
      price: p,
      discountPrice: hasDiscount ? calculatedPrice : undefined,
      discountConfig: hasDiscount ? { type: formData.discountType, value: dVal } : undefined,
      image: formData.imageUrl || 'https://picsum.photos/seed/' + Math.random() + '/400/400',
      category: formData.category,
      stock: Number(formData.stock),
      rating: productToEdit?.rating || 5.0,
      reviews: productToEdit?.reviews || [],
      merchantId: productToEdit?.merchantId || 'm1',
      variants: hasVariants ? variants as ProductVariant[] : undefined
    };

    setTimeout(() => {
      if (productToEdit) {
        updateProduct(productData);
      } else {
        addProduct(productData);
      }
      setLoading(false);
      setSuccess(true);
      setProductToEdit(null);
      setTimeout(() => setView('products'), 1500);
    }, 1200);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-[#5F9598]/20 text-[#5F9598] rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle size={56} />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#061E29] mb-2">{productToEdit ? 'Updated!' : 'Success!'}</h2>
        <p className="text-[#1D546D] font-medium">Your listing is {productToEdit ? 'updated' : 'live'}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={() => {
            setProductToEdit(null);
            setView('products');
          }} 
          className="p-2 -ml-2 rounded-full active:bg-[#1D546D]/10"
        >
          <ArrowLeft size={24} className="text-[#061E29]" />
        </button>
        <h2 className="text-xl font-bold text-[#061E29]">
          {productToEdit ? t('editProduct') : t('addProduct')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white p-4 rounded-3xl border border-[#1D546D]/10 shadow-sm space-y-4">
          <div className="aspect-video bg-[#F3F4F4] border-2 border-dashed border-[#1D546D]/20 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden group">
            {formData.imageUrl ? (
              <img src={formData.imageUrl} className="w-full h-full object-cover rounded-xl" alt="Preview" />
            ) : (
              <>
                <Upload size={32} className="text-[#1D546D]/30 mb-2" />
                <p className="text-[10px] text-[#1D546D] font-bold uppercase tracking-wider">{t('uploadText')}</p>
              </>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setFormData(prev => ({ ...prev, imageUrl: ev.target?.result as string }));
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#1D546D]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#5F9598] mb-2">
            <Package size={18} />
            <h3 className="font-bold text-sm uppercase tracking-widest">{t('productInfo')}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#1D546D] uppercase mb-1 ml-1">{t('productName')} ({t('english')})</label>
              <input required name="nameEn" value={formData.nameEn} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F3F4F4] border-none rounded-2xl focus:ring-2 focus:ring-[#5F9598] outline-none text-sm font-medium text-[#061E29]" placeholder="English name" />
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-white p-5 rounded-3xl border border-[#1D546D]/10 shadow-sm space-y-6">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#5F9598]">
                <Layers size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#061E29]">Variants</h3>
              </div>
               <button 
                 type="button"
                 onClick={() => {
                   setHasVariants(!hasVariants);
                   if (!hasVariants && variants.length === 0) addVariantField();
                 }}
                 className={`w-12 h-6 rounded-full transition-all relative ${hasVariants ? 'bg-[#5F9598]' : 'bg-[#1D546D]'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasVariants ? 'left-7' : 'left-1'}`}></div>
               </button>
           </div>

           <AnimatePresence>
             {hasVariants && (
               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="p-4 bg-[#F3F4F4] rounded-2xl border border-[#1D546D]/5 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-[#1D546D]">Variant #{idx + 1}</span>
                          <button type="button" onClick={() => removeVariant(v.id!)} className="text-rose-500"><Trash2 size={16}/></button>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] font-bold text-[#5F9598] uppercase mb-1">Type</label>
                            <select 
                              value={v.type} 
                              onChange={(e) => updateVariant(v.id!, 'type', e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl text-[10px] font-bold outline-none"
                            >
                              <option value="Size">Size</option>
                              <option value="Flavor">Flavor</option>
                              <option value="Weight">Weight</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-[#5F9598] uppercase mb-1">Value (e.g. XL, 500g)</label>
                            <input 
                              type="text" 
                              value={v.value} 
                              onChange={(e) => updateVariant(v.id!, 'value', e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl text-[10px] font-bold outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-[#5F9598] uppercase mb-1">Price Delta (₹)</label>
                            <input 
                              type="number" 
                              value={v.priceDelta} 
                              onChange={(e) => updateVariant(v.id!, 'priceDelta', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white rounded-xl text-[10px] font-bold outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-[#5F9598] uppercase mb-1">Stock</label>
                            <input 
                              type="number" 
                              value={v.stock} 
                              onChange={(e) => updateVariant(v.id!, 'stock', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white rounded-xl text-[10px] font-bold outline-none" 
                            />
                          </div>
                       </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addVariantField}
                    className="w-full py-3 border-2 border-dashed border-[#1D546D]/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[#1D546D]"
                  >
                    <Plus size={14}/> Add Another Variant
                  </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="bg-[#061E29] p-5 rounded-3xl border border-[#1D546D]/20 shadow-sm space-y-6">
           <div className="flex items-center gap-2 text-[#5F9598] mb-2">
            <Tag size={18} />
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">Value & Supply</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#5F9598] uppercase mb-1 ml-1">{t('priceLabel')}</label>
              <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1D546D]/20 border-none rounded-2xl focus:ring-2 focus:ring-[#5F9598] outline-none text-sm font-bold text-white placeholder-white/30" placeholder="0.00" />
            </div>
            {!hasVariants && (
              <div>
                <label className="block text-[10px] font-bold text-[#5F9598] uppercase mb-1 ml-1">{t('stockLabel')}</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1D546D]/20 border-none rounded-2xl focus:ring-2 focus:ring-[#5F9598] outline-none text-sm font-bold text-white placeholder-white/30" placeholder="0" />
              </div>
            )}
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
               <label className="text-xs font-bold text-white uppercase">Apply Discount</label>
               <button 
                 type="button"
                 onClick={() => setHasDiscount(!hasDiscount)}
                 className={`w-12 h-6 rounded-full transition-all relative ${hasDiscount ? 'bg-[#5F9598]' : 'bg-[#1D546D]'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasDiscount ? 'left-7' : 'left-1'}`}></div>
               </button>
            </div>

            {hasDiscount && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 overflow-hidden">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, discountType: 'percentage'})}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 border transition-all ${formData.discountType === 'percentage' ? 'bg-[#5F9598] text-[#061E29] border-[#5F9598]' : 'border-white/10 text-white/50'}`}
                  >
                    <Percent size={12}/> Percentage
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, discountType: 'fixed'})}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 border transition-all ${formData.discountType === 'fixed' ? 'bg-[#5F9598] text-[#061E29] border-[#5F9598]' : 'border-white/10 text-white/50'}`}
                  >
                    <IndianRupee size={12}/> Fixed Amt
                  </button>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-[#5F9598] uppercase mb-1 ml-1">Discount Value</label>
                   <input 
                    type="number" 
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1D546D]/20 border-none rounded-2xl focus:ring-2 focus:ring-[#5F9598] outline-none text-sm font-bold text-white placeholder-white/30" 
                    placeholder={formData.discountType === 'percentage' ? "Ex: 10%" : "Ex: 50"}
                  />
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] text-[#5F9598] font-bold uppercase mb-1">Final Selling Price</p>
                   <p className="text-xl font-bold text-white">₹{calculatedPrice.toFixed(0)}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#5F9598] text-[#061E29] rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#5F9598]/20 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-[#061E29]/30 border-t-[#061E29] rounded-full animate-spin"></div> : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
