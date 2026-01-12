
import React from 'react';
import { useApp } from '../App';
// Add missing icon imports: Ticket, Users
import { ShieldCheck, Store, MapPin, CreditCard, ChevronRight, UserCircle, LogOut, Bell, Globe, Ticket, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const BusinessSettings: React.FC = () => {
  const { t, businessInfo, setRole, language, setLanguage } = useApp();

  // Fix: Added 'icon' property to each item in the sections array to resolve property existence error
  const sections = [
    { title: t('storeSettings'), icon: Store, items: [
      { id: 'profile', label: 'Store Profile', desc: 'Logo, Name & Description', icon: UserCircle },
      { id: 'locations', label: 'Warehouse Addresses', desc: 'Pick-up points', icon: MapPin }
    ]},
    { title: 'Identity & Payouts', icon: ShieldCheck, items: [
      { id: 'kyc', label: t('kyc'), desc: 'PAN, Aadhaar & Business Docs', status: businessInfo.kycStatus, icon: ShieldCheck },
      { id: 'bank', label: t('bankDetails'), desc: 'Linked Bank Account', icon: CreditCard }
    ]},
    { title: 'Growth & Tools', icon: Bell, items: [
      { id: 'marketing', label: t('marketing'), desc: 'Coupons & Promos', icon: Ticket },
      { id: 'customers', label: t('customers'), desc: 'Buyer Insights', icon: Users }
    ]}
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4 px-2">
        <div className="w-16 h-16 bg-[#061E29] rounded-2xl flex items-center justify-center text-[#5F9598] shadow-lg">
          <Store size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#061E29]">{businessInfo.storeName}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ShieldCheck size={12} className={businessInfo.kycStatus === 'verified' ? 'text-emerald-500' : 'text-[#1D546D]/30'} />
            <span className={`text-[10px] font-bold uppercase ${businessInfo.kycStatus === 'verified' ? 'text-emerald-500' : 'text-[#1D546D]/50'}`}>
              {businessInfo.kycStatus} Seller
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#1D546D] uppercase tracking-widest px-3">{section.title}</h4>
            <div className="bg-white rounded-[2.5rem] border border-[#1D546D]/10 overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <button 
                  key={i} 
                  className={`w-full p-5 flex items-center justify-between text-left active:bg-[#F3F4F4] transition-colors ${i < section.items.length - 1 ? 'border-b border-[#1D546D]/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#F3F4F4] rounded-xl text-[#061E29]">
                      {/* item.icon now exists on all item variants */}
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#061E29]">{item.label}</h5>
                      <p className="text-[10px] text-[#1D546D]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {('status' in item && item.status) && (
                       <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${item.status === 'verified' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                         {item.status}
                       </span>
                    )}
                    <ChevronRight size={16} className="text-[#1D546D]/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-[#1D546D] uppercase tracking-widest px-3">App Preferences</h4>
        <div className="bg-white rounded-[2.5rem] border border-[#1D546D]/10 overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-[#1D546D]/5">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#F3F4F4] rounded-xl text-[#061E29]"><Globe size={18}/></div>
              <span className="text-sm font-bold">{t('language')}</span>
            </div>
            <div className="flex gap-2">
              {['en', 'hi', 'gu'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l as any)}
                  className={`w-8 h-8 rounded-full text-[10px] font-bold uppercase transition-all ${language === l ? 'bg-[#061E29] text-white shadow-md' : 'bg-[#F3F4F4] text-[#1D546D]'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setRole(null)}
            className="w-full p-5 flex items-center gap-4 text-rose-600 active:bg-rose-50 transition-all"
          >
            <div className="p-2.5 bg-rose-50 rounded-xl"><LogOut size={18}/></div>
            <span className="text-sm font-bold">{t('logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
