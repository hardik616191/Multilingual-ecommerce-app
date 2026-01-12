
import React from 'react';
import { useApp } from '../App';
import { Package, MapPin, Heart, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView: React.FC = () => {
  const { t, setRole, orders } = useApp();

  const menu = [
    { id: 'orders', icon: Package, label: t('yourOrders'), badge: orders.length },
    { id: 'wishlist', icon: Heart, label: t('wishlist') },
    { id: 'addresses', icon: MapPin, label: t('addresses') },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-5 mb-8 px-2">
        <div className="w-20 h-20 bg-[#061E29] rounded-[2rem] flex items-center justify-center text-[#5F9598] shadow-xl">
          <span className="text-3xl font-bold">JK</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#061E29]">Jatin Kumar</h2>
          <p className="text-sm text-[#1D546D]">jatin.k@example.com</p>
        </div>
      </div>

      <div className="space-y-3">
        {menu.map((item) => (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            key={item.id}
            className="bg-white p-4 rounded-[2rem] border border-[#1D546D]/5 flex items-center gap-4 shadow-sm"
          >
            <div className="p-3 bg-[#F3F4F4] rounded-2xl text-[#061E29]">
              <item.icon size={20} />
            </div>
            <span className="flex-grow font-bold text-[#061E29]">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-[#5F9598] text-[#061E29] text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
            <ChevronRight size={18} className="text-[#1D546D]/20" />
          </motion.div>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="mt-8 space-y-4 px-2">
          <h3 className="text-sm font-bold text-[#1D546D] uppercase tracking-widest">Recent Orders</h3>
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded-3xl border border-[#1D546D]/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#061E29]">ID: #{o.id}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#5F9598]/20 text-[#5F9598] rounded-full">{o.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1D546D]">{new Date(o.date).toLocaleDateString()}</span>
                <span className="text-sm font-bold text-[#061E29]">₹{o.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={() => setRole(null)}
        className="w-full mt-6 py-4 bg-[#1D546D]/10 text-[#061E29] rounded-[2rem] font-bold flex items-center justify-center gap-3 active:bg-rose-50 active:text-rose-600 transition-all"
      >
        <LogOut size={20} />
        {t('logout')}
      </button>
    </div>
  );
};

export default ProfileView;
