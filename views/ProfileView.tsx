
import React from 'react';
import { useApp } from '../App';
// Added missing CheckCircle2 import
import { Package, MapPin, Heart, Bell, Shield, LogOut, ChevronRight, User, Mail, Globe, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView: React.FC = () => {
  const { t, setRole, orders, user, language, setView, setSelectedOrder } = useApp();

  const menu = [
    { id: 'wishlist', icon: Heart, label: t('wishlist') },
    { id: 'addresses', icon: MapPin, label: t('addresses') },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  const handleTrackOrder = (order: any) => {
    setSelectedOrder(order);
    setView('tracking', true, true);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header Section */}
      <div className="flex items-center gap-5 px-2">
        <div className="w-20 h-20 bg-[#061E29] rounded-[2.5rem] flex items-center justify-center text-[#5F9598] shadow-2xl border-4 border-white">
          <span className="text-3xl font-black">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'JK'}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#061E29] tracking-tight">{user?.name || 'Jatin Kumar'}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <section className="space-y-4 px-1">
        <h3 className="text-xs font-black text-[#061E29] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
          <User size={14} className="text-[#5F9598]" /> {t('profile')} Details
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-[#1D546D]/10 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F3F4F4] rounded-2xl text-[#1D546D]">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#5F9598] uppercase">Email Address</p>
                <p className="text-sm font-bold text-[#061E29]">{user?.email || 'jatin.k@example.com'}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#1D546D]/20" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F3F4F4] rounded-2xl text-[#1D546D]">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#5F9598] uppercase">Preferred Language</p>
                <p className="text-sm font-bold text-[#061E29] capitalize">{language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Gujarati'}</p>
              </div>
            </div>
            <button 
              onClick={() => setView('home')} 
              className="text-[10px] font-black text-[#5F9598] uppercase underline"
            >
              Change
            </button>
          </div>
        </div>
      </section>

      {/* Order Tracking Section */}
      <section className="space-y-4 px-1">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-[#061E29] uppercase tracking-[0.2em] flex items-center gap-2">
            <Package size={14} className="text-[#5F9598]" /> {t('yourOrders')}
          </h3>
          {orders.length > 0 && (
             <span className="text-[10px] font-black text-[#5F9598] uppercase">{orders.length} Active</span>
          )}
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-[#1D546D]/10 text-center space-y-3">
            <div className="w-16 h-16 bg-[#F3F4F4] rounded-full flex items-center justify-center mx-auto text-[#1D546D]/20">
              <Package size={32} />
            </div>
            <p className="text-xs font-bold text-[#1D546D]/50 uppercase tracking-widest">No recent orders</p>
            <button onClick={() => setView('home')} className="text-xs font-black text-[#5F9598] uppercase underline">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={o.id} 
                onClick={() => handleTrackOrder(o)}
                className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/10 shadow-sm flex items-center justify-between group cursor-pointer active:bg-[#F3F4F4] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {/* Fixed missing icon CheckCircle2 */}
                    {o.status === 'delivered' ? <CheckCircle2 size={24}/> : <Truck size={24}/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-black text-[#061E29] text-sm uppercase">Order #{o.id}</h5>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${o.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {o.status}
                      </span>
                      <span className="text-[9px] text-[#5F9598] font-bold uppercase flex items-center gap-1">
                        <Clock size={10} /> {new Date(o.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-black text-[#061E29]">₹{o.total}</span>
                  <span className="text-[8px] font-black text-[#5F9598] uppercase tracking-widest flex items-center gap-1 group-hover:text-[#061E29] transition-colors">
                    Track <ChevronRight size={10} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Settings Menu */}
      <section className="space-y-4 px-1">
        <h3 className="text-xs font-black text-[#061E29] uppercase tracking-[0.2em] px-2">Account Settings</h3>
        <div className="space-y-3">
          {menu.map((item) => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={item.id}
              className="bg-white p-4 rounded-[2rem] border border-[#1D546D]/5 flex items-center gap-4 shadow-sm cursor-pointer active:bg-[#F3F4F4] transition-all"
            >
              <div className="p-3 bg-[#F3F4F4] rounded-2xl text-[#061E29]">
                <item.icon size={18} />
              </div>
              <span className="flex-grow font-bold text-sm text-[#061E29]">{item.label}</span>
              <ChevronRight size={18} className="text-[#1D546D]/20" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Logout */}
      <div className="px-1">
        <button 
          onClick={() => setRole(null)}
          className="w-full py-5 bg-[#061E29] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:bg-rose-600 transition-all border-b-4 border-black/20"
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
