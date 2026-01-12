
import React from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, ShoppingBag, Tag, Info, CheckCircle2 } from 'lucide-react';

const NotificationView: React.FC = () => {
  const { notifications, goBack, markAsRead, t } = useApp();

  const getIcon = (type: string) => {
    switch(type) {
      case 'order': return <ShoppingBag size={20} />;
      case 'deal': return <Tag size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 -ml-2 rounded-full active:bg-[#1D546D]/10 text-[#061E29]">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-black text-[#061E29] uppercase tracking-widest">{t('notifications')}</h2>
        </div>
        {notifications.some(n => !n.read) && (
          <button className="text-[10px] font-black text-[#5F9598] uppercase tracking-widest">Mark all as read</button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Bell size={48} className="mx-auto text-[#1D546D]/20" />
            <p className="text-sm text-[#1D546D] font-bold uppercase">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <motion.div 
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 rounded-[2.5rem] border border-[#1D546D]/5 flex gap-4 items-start transition-all ${n.read ? 'bg-white/50 opacity-60' : 'bg-white shadow-sm ring-2 ring-[#5F9598]/20'}`}
            >
              <div className={`p-3 rounded-2xl ${n.type === 'order' ? 'bg-[#5F9598]/10 text-[#5F9598]' : 'bg-[#1D546D]/10 text-[#1D546D]'}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#061E29]">{n.title}</h4>
                  <span className="text-[9px] text-[#1D546D]/40 font-bold">{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[#1D546D] font-medium leading-relaxed">{n.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center gap-4">
        <div className="p-3 bg-emerald-500 text-white rounded-2xl"><CheckCircle2 size={24}/></div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900 uppercase">Shaileshbhai verified</h4>
          <p className="text-[10px] text-emerald-700 font-bold uppercase">All snack items are prepared fresh daily.</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationView;
