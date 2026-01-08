
import React from 'react';
import { useApp } from '../App';
import { MOCK_SALES_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MerchantDashboard: React.FC = () => {
  const { t } = useApp();

  const stats = [
    { label: t('revenue'), value: '₹45,231', change: '+12.5%', icon: <DollarSign />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('activeProducts'), value: '142', change: '+2', icon: <Package />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('pendingOrders'), value: '12', change: '-4', icon: <Clock />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t('sales'), value: '₹8,920', change: '+18.2%', icon: <TrendingUp />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('merchantDash')}</h2>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">{t('bulkUpload')}</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">{t('addProduct')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                {stat.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-6">{t('sales')} Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-6">{t('topSelling')}</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <img src={`https://picsum.photos/seed/${i*10}/100`} className="w-12 h-12 rounded-lg object-cover" alt="Product" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900">Premium Cotton Kurta</h4>
                  <p className="text-sm text-gray-500">Clothing • 42 sales this week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹24,200</p>
                  <p className="text-xs text-emerald-600 font-medium">+5.4%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
