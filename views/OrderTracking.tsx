
import React from 'react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Phone, MessageCircle } from 'lucide-react';

const OrderTracking: React.FC = () => {
  const { selectedOrder, goBack, t } = useApp();

  if (!selectedOrder) return null;

  const steps = selectedOrder.trackingSteps || [];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={goBack} className="p-2 -ml-2 rounded-full active:bg-[#1D546D]/10 text-[#061E29]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-[#061E29] uppercase tracking-widest">{t('trackMyNasta')}</h2>
      </div>

      {/* Map Simulation */}
      <div className="h-48 bg-[#1D546D]/10 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center border-2 border-white shadow-inner">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i13!2i5914!3i3694!2m3!1e0!2sm!3i637021312!3m8!2sen!3sin!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] bg-center bg-cover"></div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-[#061E29] rounded-full flex items-center justify-center text-[#5F9598] shadow-2xl animate-bounce">
            <Truck size={24} />
          </div>
          <span className="bg-[#061E29] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full">Arriving in 15 mins</span>
        </div>
      </div>

      {/* Delivery Partner Info */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-[#1D546D]/5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#F3F4F4] rounded-2xl flex items-center justify-center text-[#061E29]">
            <CheckCircle size={32} className="text-[#5F9598]" />
          </div>
          <div>
            <h4 className="font-bold text-[#061E29]">Kishore Bhai</h4>
            <p className="text-[10px] text-[#5F9598] font-bold uppercase">Delivery Partner</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-[#1D546D]/5 text-[#061E29] rounded-xl flex items-center justify-center"><Phone size={18} /></button>
          <button className="w-10 h-10 bg-[#1D546D]/5 text-[#061E29] rounded-xl flex items-center justify-center"><MessageCircle size={18} /></button>
        </div>
      </div>

      {/* Progress Vertical Steps */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-[#1D546D]/5 shadow-sm space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-6 relative">
            {idx < steps.length - 1 && (
              <div className={`absolute left-[13px] top-8 w-0.5 h-12 ${step.completed ? 'bg-[#5F9598]' : 'bg-[#1D546D]/10'}`}></div>
            )}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-[#5F9598] text-[#061E29] shadow-lg shadow-[#5F9598]/20' : 'bg-[#1D546D]/10 text-[#1D546D]'}`}>
              {step.completed ? <CheckCircle size={16} /> : <div className="w-2 h-2 bg-current rounded-full"></div>}
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold uppercase ${step.completed ? 'text-[#061E29]' : 'text-[#1D546D]/40'}`}>{step.status}</h4>
              <p className="text-[10px] text-[#5F9598] font-bold uppercase">{step.location}</p>
              {step.timestamp && <p className="text-[9px] text-[#1D546D]/30">{new Date(step.timestamp).toLocaleTimeString()}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Detail */}
      <div className="p-4 bg-[#F3F4F4] rounded-3xl border border-[#1D546D]/10">
        <h5 className="text-[10px] font-black uppercase text-[#1D546D] mb-2">Delivery To</h5>
        <div className="flex items-center gap-2 text-xs font-bold text-[#061E29]">
          <MapPin size={14} className="text-[#5F9598]" />
          {selectedOrder.address.street}, {selectedOrder.address.city}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
