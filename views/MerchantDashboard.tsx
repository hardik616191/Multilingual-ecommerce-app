
import React from 'react';
import { useApp } from '../App';
import { MOCK_SALES_DATA } from '../constants';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Clock, DollarSign, Plus, Package, TrendingUp, Users, Ticket, ArrowUpRight, ShieldCheck, Activity, BarChart3, AlertCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const MerchantDashboard: React.FC = () => {
  const { t, setView, orders, products, businessInfo } = useApp();

  const pending = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: t('revenue'), value: '₹4,85,200', change: '+22%', icon: <DollarSign size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('orders'), value: orders.length.toString(), change: '+14', icon: <Package size={18}/>, color: 'text-[#1D546D]', bg: 'bg-[#1D546D]/10' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-[#061E29] tracking-tight">{t('merchantDash')}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-[0.15em]">Live Storefront: {businessInfo.storeName}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="h-10 px-3 bg-[#5F9598]/10 rounded-2xl border border-[#5F9598]/20 flex items-center gap-2 text-[#5F9598] shadow-sm">
             <Database size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">DB Active</span>
           </div>
           <button onClick={() => setView('notifications')} className="w-10 h-10 bg-white rounded-2xl border border-[#1D546D]/10 flex items-center justify-center text-[#061E29] shadow-sm relative">
            <Activity size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Account Health Quick View */}
      <section className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
               <ShieldCheck size={28} />
            </div>
            <div>
               <h4 className="text-sm font-black text-[#061E29] uppercase">{t('accountHealth')}</h4>
               <p className="text-[10px] text-[#5F9598] font-bold">Excellent: 0% Defect Rate</p>
            </div>
         </div>
         <button onClick={() => setView('settings')} className="text-[10px] font-black text-[#1D546D] uppercase border-b-2 border-[#1D546D]/20">Details</button>
      </section>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            whileHover={{ y: -4 }}
            key={idx} 
            className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold ${stat.color} flex items-center bg-white shadow-sm px-2 py-0.5 rounded-full`}>
                <TrendingUp size={10} className="mr-0.5" /> {stat.change}
              </span>
            </div>
            <p className="text-[#1D546D] text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-[#061E29]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Critical Action Center */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          <motion.div 
            onClick={() => setView('orders')}
            className="flex-shrink-0 bg-[#061E29] p-5 rounded-[2.5rem] flex items-center gap-4 text-white min-w-[200px] shadow-xl shadow-[#061E29]/20"
          >
            <div className="w-10 h-10 bg-[#1D546D] text-[#5F9598] rounded-2xl flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold">{pending} {t('pendingOrders')}</h4>
              <p className="text-[9px] text-[#5F9598] font-bold uppercase">Awaiting Manifest</p>
            </div>
          </motion.div>

          <motion.div 
            onClick={() => setView('products')}
            className="flex-shrink-0 bg-white border border-rose-100 p-5 rounded-[2.5rem] flex items-center gap-4 min-w-[200px] shadow-sm"
          >
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-600">{lowStock} {t('lowStock')}</h4>
              <p className="text-[9px] text-rose-400 font-bold uppercase">Potential Stockout</p>
            </div>
          </motion.div>
      </div>

      {/* Analytics Card */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-black text-[#061E29] uppercase tracking-widest">{t('sales')} Performance</h3>
            <p className="text-[9px] text-[#5F9598] font-bold">Daily orders across all SKUs</p>
          </div>
          <div className="bg-[#F3F4F4] px-4 py-1.5 rounded-full text-[10px] font-black text-[#061E29] uppercase border border-[#1D546D]/5">7 Days</div>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_SALES_DATA}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D546D" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1D546D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F3F4F4" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#5F9598', fontWeight: 'bold'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{ stroke: '#5F9598', strokeWidth: 2 }}
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}} 
              />
              <Area type="monotone" dataKey="sales" stroke="#1D546D" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Batch Action */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setView('add-product')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#061E29] text-white rounded-[2rem] shadow-2xl flex items-center justify-center z-50 border-4 border-white active:bg-[#1D546D] transition-colors"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
};

export default MerchantDashboard;
