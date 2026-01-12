
import React from 'react';
import { useApp } from '../App';
import { UserCircle, ShoppingBag, TrendingUp, Search, Mail } from 'lucide-react';

const CustomerManagement: React.FC = () => {
  const { t } = useApp();

  const mockCustomers = [
    { name: 'Rajesh K.', orders: 15, value: '₹22,400', last: '2 days ago' },
    { name: 'Priya S.', orders: 8, value: '₹12,100', last: '5 days ago' },
    { name: 'Amit G.', orders: 4, value: '₹3,500', last: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#061E29]">{t('customers')}</h2>
        <p className="text-xs text-[#1D546D]">Insights into your best buyers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1D546D]/40" size={18} />
        <input 
          type="text" 
          placeholder="Search customers..." 
          className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white border border-[#1D546D]/10 text-sm focus:ring-2 focus:ring-[#5F9598] outline-none"
        />
      </div>

      <div className="space-y-4">
        {mockCustomers.map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F3F4F4] rounded-2xl flex items-center justify-center text-[#061E29]">
                  <UserCircle size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-[#061E29]">{c.name}</h4>
                  <p className="text-[10px] text-[#5F9598] font-bold uppercase">Last active {c.last}</p>
                </div>
              </div>
              <button className="p-2.5 bg-[#5F9598]/10 text-[#5F9598] rounded-xl"><Mail size={18}/></button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1D546D]/5">
              <div>
                <p className="text-[9px] font-bold text-[#1D546D] uppercase">Orders</p>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-[#1D546D]" />
                  <span className="text-sm font-bold text-[#061E29]">{c.orders}</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#1D546D] uppercase">Lifetime Value</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#5F9598]" />
                  <span className="text-sm font-bold text-[#061E29]">{c.value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;
