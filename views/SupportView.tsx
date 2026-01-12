
import React, { useState } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Phone, FileQuestion, ChevronRight, Send, User } from 'lucide-react';

const SupportView: React.FC = () => {
  const { goBack, t } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Kem cho! How can I help you with your order today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm checking that with Shaileshbhai for you...", sender: 'bot' }]);
    }, 1000);
  };

  const faqs = [
    { q: "Is delivery free?", a: "Yes, on orders above ₹500!" },
    { q: "Can I return fresh snacks?", a: "Fresh snacks are non-returnable but replaceable if damaged." },
    { q: "Where do you deliver?", a: "Across Ahmedabad, Rajkot, and Surat currently." }
  ];

  if (chatOpen) {
    return (
      <div className="flex flex-col h-[85vh]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setChatOpen(false)} className="p-2 -ml-2 rounded-full active:bg-[#1D546D]/10 text-[#061E29]">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5F9598] rounded-full flex items-center justify-center text-[#061E29] font-bold">S</div>
            <div>
              <h4 className="text-sm font-bold text-[#061E29]">SnackBot</h4>
              <p className="text-[9px] text-[#5F9598] font-bold uppercase">Always active</p>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-white rounded-[2.5rem] p-6 space-y-4 overflow-y-auto border border-[#1D546D]/10 shadow-inner">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-bold ${m.sender === 'user' ? 'bg-[#061E29] text-white rounded-tr-none' : 'bg-[#F3F4F4] text-[#061E29] rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your issue..."
            className="flex-grow px-6 py-4 rounded-3xl bg-white border border-[#1D546D]/10 outline-none text-sm font-bold focus:ring-2 focus:ring-[#5F9598]"
          />
          <button 
            onClick={sendMessage}
            className="w-14 h-14 bg-[#061E29] text-white rounded-3xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={goBack} className="p-2 -ml-2 rounded-full active:bg-[#1D546D]/10 text-[#061E29]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-[#061E29] uppercase tracking-widest">{t('helpCenter')}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setChatOpen(true)}
          className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/5 shadow-sm text-left flex flex-col gap-4 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 bg-[#5F9598]/10 text-[#5F9598] rounded-2xl flex items-center justify-center"><MessageSquare size={24}/></div>
          <h4 className="text-sm font-bold text-[#061E29]">Live Chat</h4>
        </button>
        <button className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/5 shadow-sm text-left flex flex-col gap-4 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-[#1D546D]/10 text-[#1D546D] rounded-2xl flex items-center justify-center"><Phone size={24}/></div>
          <h4 className="text-sm font-bold text-[#061E29]">Call Help</h4>
        </button>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-[#1D546D] uppercase tracking-widest px-2">Popular Questions</h3>
        <div className="bg-white rounded-[2.5rem] border border-[#1D546D]/10 overflow-hidden shadow-sm">
          {faqs.map((f, i) => (
            <div key={i} className={`p-6 border-b border-[#1D546D]/5 last:border-0`}>
              <h4 className="text-sm font-bold text-[#061E29] mb-1">{f.q}</h4>
              <p className="text-xs text-[#5F9598] font-bold">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-[#1D546D] uppercase tracking-widest px-2">Your Tickets</h3>
        <div className="bg-[#061E29] p-6 rounded-[2.5rem] flex items-center justify-between text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl"><FileQuestion size={20}/></div>
            <div>
              <h4 className="text-sm font-bold">Issue #9284</h4>
              <p className="text-[10px] text-[#5F9598] font-bold uppercase">Pending Response</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#5F9598]" />
        </div>
      </section>
    </div>
  );
};

export default SupportView;
