import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality, Type, LiveServerMessage } from '@google/genai';
import { useApp } from '../App';
import { 
  Sparkles, MessageSquare, Mic, Image as ImageIcon, Video, 
  Brain, Search, MapPin, Send, Trash2, StopCircle, Play, 
  Download, Loader2, Camera, Info, Languages, ShieldCheck, 
  Upload, Scissors, Wand2, RefreshCw, Smartphone, Database, Table as TableIcon
} from 'lucide-react';
import { db } from '../db';

const AIHub: React.FC = () => {
  const { language, t } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'vision' | 'create' | 'voice' | 'db'>('chat');
  const [loading, setLoading] = useState(false);

  // Chat/Think State
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string, type?: 'search'|'maps'|'thinking'}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Image/Video Gen State
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [uploadRefImg, setUploadRefImg] = useState<string | null>(null);

  // Vision State
  const [visionImg, setVisionImg] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState('');

  // Voice/Live State
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const liveSessionRef = useRef<any>(null);

  // DB Explorer State
  const [selectedTable, setSelectedTable] = useState<any>('products');

  const checkApiKey = async () => {
    if (!(window as any).aistudio?.hasSelectedApiKey || !(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio?.openSelectKey();
    }
  };

  const callGemini = async (task: string, options: any = {}) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: options.model || 'gemini-3-flash-preview',
        contents: options.contents || task,
        config: options.config
      });
      return response;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSearchThink = async (mode: 'search' | 'think' | 'normal') => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    let model = 'gemini-3-flash-preview';
    let config: any = {};
    
    if (mode === 'think') {
      model = 'gemini-3-pro-preview';
      config = { thinkingConfig: { thinkingBudget: 32768 } };
      setIsThinking(true);
    } else if (mode === 'search') {
      config = { tools: [{ googleSearch: {} }] };
    }

    const res = await callGemini(userMsg, { model, config });
    if (res) {
      const messageType = mode === 'think' ? 'thinking' : (mode === 'search' ? 'search' : undefined);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: res.text || 'No response.', 
        type: messageType as any
      }]);
    }
    setIsThinking(false);
  };

  const handleImageGen = async () => {
    await checkApiKey();
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio, imageSize: imageSize as any }
        }
      });
      
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoGen = async () => {
    await checkApiKey();
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fix: Add 'numberOfVideos: 1' to the config as required by @google/genai guidelines.
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: uploadRefImg ? { imageBytes: uploadRefImg.split(',')[1], mimeType: 'image/png' } : undefined,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16' }
      });
      
      while (!op.done) {
        await new Promise(r => setTimeout(r, 10000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }
      
      const link = op.response?.generatedVideos?.[0]?.video?.uri;
      const res = await fetch(`${link}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      setGeneratedVideo(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVision = async () => {
    if (!visionImg) return;
    const res = await callGemini('Analyze this image in detail.', {
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [
          { inlineData: { data: visionImg.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "What's in this photo? Be descriptive." }
        ] 
      }
    });
    if (res) setVisionResult(res.text);
  };

  const toggleLive = async () => {
    if (isLive) {
      liveSessionRef.current?.close();
      setIsLive(false);
      return;
    }
    setIsLive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    liveSessionRef.current = await ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => console.log('Live connected'),
        onmessage: async (msg: LiveServerMessage) => {
          if (msg.serverContent?.outputTranscription) {
            setTranscription(prev => prev + ' ' + msg.serverContent!.outputTranscription!.text);
          }
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {}
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderDBExplorer = () => {
    const tableData = db.select(selectedTable);
    return (
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['products', 'orders', 'merchants', 'coupons', 'payouts'].map(t => (
            <button 
              key={t}
              onClick={() => setSelectedTable(t as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedTable === t ? 'bg-[#5F9598] text-[#061E29]' : 'bg-white/5 text-white/60 border border-white/10'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
             <h4 className="text-sm font-bold uppercase tracking-widest text-[#5F9598]">Table: {selectedTable}</h4>
             <button onClick={() => db.reset()} className="text-[10px] font-black text-rose-500 uppercase">Wipe DB</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
             <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap">
               {JSON.stringify(tableData, null, 2)}
             </pre>
          </div>
        </div>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
           <Info size={20} className="text-amber-500 shrink-0" />
           <p className="text-[10px] font-bold text-amber-500 uppercase leading-relaxed">
             ACID Transaction Simulator Active. Orders will atomically update multiple tables (orders, products) to maintain referential integrity.
           </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#061E29] -m-4 p-4 text-white overflow-hidden">
      <div className="flex items-center justify-between mb-6 pt-4 px-2">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Sparkles className="text-[#5F9598]" /> AI Hub
          </h2>
          <p className="text-[10px] font-bold text-[#5F9598] uppercase tracking-widest">Intelligence & Data Control</p>
        </div>
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-6 mx-2 overflow-x-auto">
        {[
          { id: 'chat', icon: MessageSquare, label: 'Assistant' },
          { id: 'create', icon: Wand2, label: 'Create' },
          { id: 'vision', icon: Camera, label: 'Vision' },
          { id: 'voice', icon: Mic, label: 'Voice' },
          { id: 'db', icon: Database, label: 'SQL' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-none sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${
              activeTab === t.id ? 'bg-[#5F9598] text-[#061E29]' : 'text-white/60'
            }`}
          >
            <t.icon size={16} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto px-2 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full space-y-4">
              <div className="flex-grow space-y-4 min-h-[300px]">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4 pt-12">
                    <Brain size={64} />
                    <p className="text-sm font-bold uppercase tracking-widest">How can I help you today?</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${
                      m.role === 'user' ? 'bg-[#1D546D] text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none border border-white/10'
                    }`}>
                      {m.type === 'thinking' && <div className="text-[10px] text-[#5F9598] font-bold mb-2 flex items-center gap-1"><Brain size={12}/> THOUGHTFUL RESPONSE</div>}
                      {m.type === 'search' && <div className="text-[10px] text-[#5F9598] font-bold mb-2 flex items-center gap-1"><Search size={12}/> SEARCH GROUNDED</div>}
                      {m.text}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-3xl flex items-center gap-3">
                      <Loader2 className="animate-spin text-[#5F9598]" size={16} />
                      <span className="text-[10px] font-bold uppercase text-[#5F9598]">Gemini is thinking deeply...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-[#061E29] pt-4 space-y-3">
                <div className="flex gap-2">
                  <button onClick={() => handleSearchThink('think')} className="flex-1 py-2 bg-white/5 rounded-xl text-[8px] font-black uppercase border border-white/10 flex items-center justify-center gap-1"><Brain size={12}/> Think</button>
                  <button onClick={() => handleSearchThink('search')} className="flex-1 py-2 bg-white/5 rounded-xl text-[8px] font-black uppercase border border-white/10 flex items-center justify-center gap-1"><Search size={12}/> Search</button>
                  <button onClick={() => handleSearchThink('normal')} className="flex-1 py-2 bg-white/5 rounded-xl text-[8px] font-black uppercase border border-white/10 flex items-center justify-center gap-1"><RefreshCw size={12}/> Fast</button>
                </div>
                <div className="flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask Gemini anything..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5F9598] text-sm"/>
                  <button onClick={() => handleSearchThink('normal')} className="bg-[#5F9598] text-[#061E29] p-4 rounded-2xl active:scale-95 transition-all"><Send size={20}/></button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-[#5F9598]">Generation Prompt</h4>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A cinematic drone shot..." className="w-full bg-transparent border-none outline-none text-base resize-none min-h-[100px]"/>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleImageGen} disabled={loading} className="flex-1 py-4 bg-[#5F9598] text-[#061E29] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#5F9598]/20">
                    {loading ? <Loader2 className="animate-spin"/> : <ImageIcon size={18}/>} Generate Image
                  </button>
                  <button onClick={handleVideoGen} disabled={loading} className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin"/> : <Video size={18}/>} Create Video
                  </button>
                </div>
              </div>
              {generatedImage && <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative group"><img src={generatedImage} className="w-full rounded-[2.5rem] shadow-2xl border border-white/10" alt="Generated" /><button onClick={() => setGeneratedImage(null)} className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white"><Trash2 size={20}/></button></motion.div>}
              {generatedVideo && <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative"><video src={generatedVideo} controls className="w-full rounded-[2.5rem] shadow-2xl border border-white/10" /><button onClick={() => setGeneratedVideo(null)} className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white"><Trash2 size={20}/></button></motion.div>}
            </motion.div>
          )}

          {activeTab === 'vision' && (
            <motion.div key="vision" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-6">
                {!visionImg ? (
                  <label className="w-full aspect-video border-2 border-dashed border-white/20 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer active:scale-[0.98] transition-all">
                    <Camera size={48} className="text-[#5F9598]"/><span className="text-xs font-bold uppercase tracking-widest text-[#5F9598]">Upload Photo to Analyze</span><input type="file" className="hidden" onChange={e => handleFileUpload(e, setVisionImg)} accept="image/*" />
                  </label>
                ) : (
                  <div className="relative w-full"><img src={visionImg} className="w-full aspect-video object-cover rounded-[2rem]" alt="Target" /><button onClick={() => setVisionImg(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-xl"><RefreshCw size={16}/></button></div>
                )}
                <button onClick={handleVision} disabled={!visionImg || loading} className="w-full py-4 bg-[#5F9598] text-[#061E29] rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 transition-all flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin"/> : <Search size={18}/>} Run Deep Analysis</button>
              </div>
              {visionResult && <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10"><h4 className="text-[10px] font-black uppercase text-[#5F9598] mb-4 flex items-center gap-2"><Smartphone size={14}/> Result from Gemini Pro</h4><p className="text-sm leading-relaxed text-white/90">{visionResult}</p></div>}
            </motion.div>
          )}

          {activeTab === 'voice' && (
            <motion.div key="voice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-[50vh] space-y-8">
              <div className="relative"><motion.div animate={{ scale: isLive ? [1, 1.2, 1] : 1, opacity: isLive ? [0.3, 0.1, 0.3] : 0 }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-[#5F9598] rounded-full"/><button onClick={toggleLive} className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all ${isLive ? 'bg-rose-500 text-white' : 'bg-[#5F9598] text-[#061E29]'}`}>{isLive ? <StopCircle size={48} /> : <Mic size={48} />}</button></div>
              <div className="text-center space-y-2"><h3 className="text-xl font-bold">{isLive ? 'Listening...' : 'Native Voice Chat'}</h3><p className="text-xs text-[#5F9598] font-bold uppercase tracking-widest">Low Latency Live API</p></div>
              {transcription && <div className="w-full bg-white/5 p-6 rounded-[2.5rem] border border-white/10 max-h-[150px] overflow-y-auto"><p className="text-xs italic text-white/60">"{transcription}"</p></div>}
            </motion.div>
          )}

          {activeTab === 'db' && (
            <motion.div key="db" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              {renderDBExplorer()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIHub;