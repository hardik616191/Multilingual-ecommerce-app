
import React, { useState } from 'react';
import { useApp } from '../App';
import { MOCK_PRODUCTS } from '../constants';
import { Search, SlidersHorizontal, Star } from 'lucide-react';

const CustomerHome: React.FC = () => {
  const { t, language, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.title[language].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search & Hero */}
      <div className="relative rounded-3xl overflow-hidden h-[300px] flex flex-col justify-center px-12 text-white bg-indigo-900">
        <img 
          src="https://picsum.photos/seed/marketplace/1200/400" 
          className="absolute inset-0 object-cover opacity-40 mix-blend-overlay"
          alt="Marketplace"
        />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-bold mb-4">{t('welcome')}</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6">
          <div>
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <SlidersHorizontal size={18} /> {t('categories')}
            </h4>
            <div className="space-y-2">
              {['All', 'Clothing', 'Grocery', 'Electronics', 'Decor'].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{t('featuredProducts')}</h3>
            <span className="text-gray-500 text-sm">{filteredProducts.length} items found</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-md transition-all">
                <div className="relative h-64">
                  <img 
                    src={product.image} 
                    alt={product.title[language]} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold shadow-sm">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    {product.rating}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">{product.category}</p>
                  <h4 className="font-bold text-gray-900 mb-2 truncate">{product.title[language]}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description[language]}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      {product.discountPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">₹{product.discountPrice}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => addToCart(product.id, product.price)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
