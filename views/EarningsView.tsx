
import React from 'react';
import { useApp } from '../App';
import { Wallet, ArrowUpRight, Clock, CheckCircle, TrendingUp, Download, Building2, Receipt, PieChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { MOCK_SALES_DATA } from '../constants';
import { motion } from 'framer-motion';

const EarningsView: React.FC = () => {
  const { t, payouts, businessInfo } = useApp();

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#061E29] tracking-tight">{t('payment')}</h2>
          <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">Payout Cycle: Weekly</p>
        </div>
        <button className="w-10 h-10 bg-white rounded-2xl border border-[#1D546D]/10 flex items-center justify-center text-[#061E29] shadow-sm">
          <Download size={18} />
        </button>
      </div>

      {/* Hero Wallet Card */}
      <div className="bg-[#061E29] p-7 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#5F9598]"></span>
            <p className="text-[10px] font-black text-[#5F9598] uppercase tracking-[0.2em]">Next Disbursement</p>
          </div>
          <h3 className="text-4xl font-black mb-8 tracking-tighter">₹24,850.50</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <p className="text-[9px] font-black text-[#5F9598] uppercase mb-1">Unsettled Sales</p>
              <p className="text-base font-black">₹4,200</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <p className="text-[9px] font-black text-[#5F9598] uppercase mb-1">Marketplace Fees</p>
              <p className="text-base font-black text-rose-400">- ₹840</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#5F9598] rounded-full blur-[100px] opacity-20 -translate-y-10 translate-x-10"></div>
      </div>

      {/* Financial Health Charts */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-black text-[#061E29] uppercase tracking-widest flex items-center gap-2">
                <PieChart size={14} className="text-[#5F9598]"/> Settlement Trends
              </h4>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+18% MoM</span>
           </div>
           <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_DATA}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5F9598" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#5F9598" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#F3F4F4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#5F9598', fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 15px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} 
                />
                <Area type="monotone" dataKey="sales" stroke="#5F9598" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Statement History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h4 className="text-xs font-black text-[#061E29] uppercase tracking-widest">{t('settlements')}</h4>
           <button className="text-[10px] font-black text-[#1D546D] uppercase underline">All Statements</button>
        </div>
        <div className="space-y-3">
          {payouts.map(p => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={p.id} 
              className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/5 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {p.status === 'completed' ? <CheckCircle size={24}/> : <Clock size={24}/>}
                </div>
                <div>
                  <h5 className="font-black text-[#061E29] text-base">₹{p.amount.toLocaleString()}</h5>
                  <p className="text-[10px] text-[#5F9598] font-bold uppercase">{new Date(p.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <button className="w-10 h-10 bg-[#F3F4F4] rounded-xl flex items-center justify-center text-[#061E29] active:bg-[#1D546D] active:text-white transition-colors">
                <Receipt size={18}/>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bank & Tax Info View */}
      <div className="bg-[#061E29] p-6 rounded-[2.5rem] border border-[#1D546D]/20 text-white flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-[#5F9598]" />
          <h4 className="text-xs font-black uppercase tracking-widest">Active Payout Method</h4>
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-sm font-black text-white">{businessInfo.bankAccount.bankName || 'ICICI BANK LTD'}</p>
            <p className="text-[10px] text-[#5F9598] font-bold tracking-widest">A/C: ****{businessInfo.bankAccount.accountNumber.slice(-4) || '9284'}</p>
          </div>
          <div className="flex gap-2">
             <span className="text-[8px] font-black uppercase bg-[#5F9598]/20 text-[#5F9598] px-2 py-1 rounded-lg border border-[#5F9598]/20">Active</span>
             <span className="text-[8px] font-black uppercase bg-[#5F9598]/20 text-[#5F9598] px-2 py-1 rounded-lg border border-[#5F9598]/20">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsView;
