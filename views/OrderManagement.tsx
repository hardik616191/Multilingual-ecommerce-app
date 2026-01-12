
import React, { useState } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle, Search, Clock, FileText, Printer, MoreVertical, PackageCheck } from 'lucide-react';
import { OrderStatus } from '../types';

const OrderManagement: React.FC = () => {
  const { orders, t, updateOrderStatus, language } = useApp();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('pending');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => 
    (filter === 'all' || o.status === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || (o.customerName?.toLowerCase() || '').includes(search.toLowerCase()))
  );

  const StatusIcon = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={16} />;
      case 'confirmed': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'shipped': return <Truck className="text-[#1D546D]" size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#061E29] tracking-tight">{t('orders')}</h2>
          <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-[0.15em]">{orders.length} Total Manifests</p>
        </div>
        <button className="w-10 h-10 bg-white rounded-2xl border border-[#1D546D]/10 flex items-center justify-center text-[#061E29] shadow-sm">
          <Printer size={18} />
        </button>
      </div>

      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F9598]" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Buyer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-[#1D546D]/10 rounded-[1.5rem] focus:ring-2 focus:ring-[#5F9598] outline-none text-xs font-bold text-[#061E29] shadow-sm"
          />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'].map(s => (
          <button 
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all border ${
              filter === s ? 'bg-[#061E29] text-white border-[#061E29] shadow-lg shadow-[#061E29]/10' : 'bg-white text-[#1D546D] border-[#1D546D]/10'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-[#1D546D]/5">
              <Package size={48} className="mx-auto text-[#1D546D]/10 mb-4" />
              <p className="text-xs text-[#1D546D] font-black uppercase tracking-widest">Zero Orders In {filter}</p>
            </div>
          ) : (
            filtered.map(order => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={order.id}
                className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-[#061E29] text-sm uppercase">Order #{order.id}</h4>
                    <p className="text-[10px] text-[#5F9598] font-bold uppercase tracking-wider">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F4] rounded-xl border border-[#1D546D]/5">
                    <StatusIcon status={order.status} />
                    <span className="text-[10px] font-black text-[#061E29] uppercase">{order.status}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#F3F4F4]/50 rounded-2xl border border-[#1D546D]/5 space-y-3">
                   {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#061E29] font-black uppercase text-[10px]">SKU: {item.sku || 'SKU_PRD'}</span>
                        <span className="text-[#1D546D] font-medium">Quantity: {item.quantity}</span>
                      </div>
                      <span className="font-black text-[#061E29]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-[#1D546D]/10 flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#5F9598] uppercase">Total Payout</span>
                    <span className="text-sm font-black text-emerald-600">₹{order.total}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-[#5F9598]">Buyer: {order.customerName || 'Amazon Customer'}</span>
                    <span className="text-[#1D546D] bg-[#1D546D]/5 px-2 py-0.5 rounded-md">Standard Shipping</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="flex-grow py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <PackageCheck size={16}/> {t('confirmOrder')}
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="flex-grow py-3.5 bg-[#061E29] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#061E29]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Printer size={16}/> {t('shipOrder')}
                      </button>
                    )}
                    <button className="w-12 h-12 bg-[#F3F4F4] text-[#061E29] rounded-2xl flex items-center justify-center border border-[#1D546D]/5">
                      <FileText size={18}/>
                    </button>
                    <button className="w-12 h-12 bg-[#F3F4F4] text-[#061E29] rounded-2xl flex items-center justify-center border border-[#1D546D]/5">
                      <MoreVertical size={18}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderManagement;
