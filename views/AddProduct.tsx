
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, Package, Tag, IndianRupee, Layers, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { Language, Product, ProductVariant } from '../types';
import { GoogleGenAI } from "@google/genai";
import { db } from '../db';

const AddProduct: React.FC = () => {
  const { t, setView, addProduct, updateProduct, productToEdit, setProductToEdit } = useApp();
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nameEn: '', nameHi: '', nameGu: '',
    descEn: '', descHi: '', descGu: '',
    price: '', stock: '', category: 'Clothing', imageUrl: ''
  });

  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);

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
        imageUrl: productToEdit.image
      });
      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setHasVariants(true);
        setVariants(productToEdit.variants);
      }
    }
  }, [productToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            imageUrl: event.target?.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateAIImage = async () => {
    if (!formData.nameEn.trim()) {
      alert("Please enter a product name first.");
      return;
    }
    
    setGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Professional product photo of ${formData.nameEn}. Category: ${formData.category}. Studio lighting, clean background.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imagePart?.inlineData?.data) {
        setFormData(prev => ({
          ...prev,
          imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const addVariantField = () => {
    const variantType = formData.category === 'Clothing' ? 'Size' : (formData.category === 'Electronics' ? 'Size' : 'Flavor');
    setVariants([...variants, { id: Math.random().toString(), type: variantType as any, value: '', priceDelta: 0, stock: 10, sku: '' }]);
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        [Language.ENGLISH]: formData.descEn || "Description",
        [Language.HINDI]: formData.descHi || formData.descEn || "विवरण",
        [Language.GUJARATI]: formData.descGu || formData.descEn || "વર્ણન"
      },
      price: Number(formData.price),
      image: formData.imageUrl || 'https://picsum.photos/seed/prd/400/400',
      category: formData.category,
      stock: Number(formData.stock),
      rating: productToEdit?.rating || 5.0,
      reviews: productToEdit?.reviews || [],
      merchantId: productToEdit?.merchantId || 'm1',
      variants: hasVariants ? variants as ProductVariant[] : undefined
    };

    if (productToEdit) updateProduct(productData);
    else addProduct(productData);

    // Sync to Supabase Merchant Table
    await db.syncProductToCloud(productData);

    setLoading(false);
    setSuccess(true);
    setProductToEdit(null);
    setTimeout(() => setView('products'), 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-[#5F9598]/20 text-[#5F9598] rounded-full flex items-center justify-center mb-8">
          <CheckCircle size={56} />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#061E29] mb-2">Listing Saved!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => { setProductToEdit(null); setView('products'); }} className="p-2 -ml-2 rounded-full"><ArrowLeft size={24} /></button>
        <h2 className="text-xl font-bold text-[#061E29]">{productToEdit ? t('editProduct') : t('addProduct')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white p-4 rounded-3xl border border-[#1D546D]/10 shadow-sm space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <div 
            onClick={triggerFileUpload}
            className="relative aspect-video bg-[#F3F4F4] border-2 border-dashed border-[#1D546D]/20 rounded-2xl flex items-center justify-center p-4 cursor-pointer overflow-hidden active:scale-[0.98] transition-all"
          >
            {generatingImage ? (
              <Loader2 className="animate-spin text-[#5F9598]" />
            ) : formData.imageUrl ? (
              <img src={formData.imageUrl} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-[#1D546D]/30" />
                <span className="text-[10px] font-bold text-[#1D546D]/30 uppercase tracking-widest">Tap to Upload</span>
              </div>
            )}
          </div>
          <button type="button" onClick={handleGenerateAIImage} className="w-full py-3 bg-[#061E29] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:bg-[#1D546D] transition-colors">
            <Sparkles size={14} /> Generate AI Photo
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#1D546D]/10 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#1D546D] uppercase mb-1">Product Name</label>
              <input required name="nameEn" value={formData.nameEn} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F3F4F4] rounded-2xl outline-none text-sm font-medium" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#1D546D] uppercase mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F3F4F4] rounded-2xl outline-none text-sm font-medium">
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Foods">Foods</option>
              </select>
            </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#1D546D]/10 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest">Enable Variants</h3>
              <button type="button" onClick={() => setHasVariants(!hasVariants)} className={`w-12 h-6 rounded-full relative transition-colors ${hasVariants ? 'bg-[#5F9598]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasVariants ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           {hasVariants && (
             <div className="space-y-3">
               {variants.map(v => (
                 <div key={v.id} className="p-3 bg-gray-50 rounded-xl flex items-center gap-2">
                   <input placeholder="Value" className="w-1/2 p-2 bg-white rounded-lg text-xs" value={v.value} onChange={e => updateVariant(v.id!, 'value', e.target.value)} />
                   <input type="number" placeholder="Price +" className="w-1/4 p-2 bg-white rounded-lg text-xs" value={v.priceDelta} onChange={e => updateVariant(v.id!, 'priceDelta', Number(e.target.value))} />
                   <button type="button" onClick={() => removeVariant(v.id!)} className="text-red-500"><Trash2 size={14}/></button>
                 </div>
               ))}
               <button type="button" onClick={addVariantField} className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs uppercase font-bold text-gray-500">+ Add</button>
             </div>
           )}
        </div>

        <div className="bg-[#061E29] p-5 rounded-3xl text-white space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#5F9598] uppercase mb-1">Base Price (₹)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 rounded-2xl outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5F9598] uppercase mb-1">Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 rounded-2xl outline-none text-sm font-bold" />
              </div>
            </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-[#5F9598] text-[#061E29] rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
          {loading ? <Loader2 className="animate-spin" /> : t('save')}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
