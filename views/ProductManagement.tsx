
import React from 'react';
import { useApp } from '../App';
import { MOCK_PRODUCTS } from '../constants';
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';

const ProductManagement: React.FC = () => {
  const { t, language } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('inventory')}</h2>
          <p className="text-gray-500">Manage your product catalog and stock levels.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          <Plus size={20} /> {t('addProduct')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="flex-grow md:flex-grow-0 border rounded-lg px-3 py-2 text-sm">
              <option>All Categories</option>
              <option>Clothing</option>
              <option>Grocery</option>
            </select>
            <select className="flex-grow md:flex-grow-0 border rounded-lg px-3 py-2 text-sm">
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRODUCTS.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} className="w-10 h-10 rounded-lg object-cover" alt={product.title[language]} />
                      <div>
                        <div className="font-semibold text-gray-900">{product.title[language]}</div>
                        <div className="text-xs text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      <span className="text-sm font-medium">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Active</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Eye size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit2 size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <p>Showing 1-10 of 142 products</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border bg-white rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border bg-white rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
