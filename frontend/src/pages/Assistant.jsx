import { useState, useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Sparkles, Loader2, RefreshCcw, 
  Globe, Zap, Languages, FileText, HelpCircle, 
  ChevronRight, Search, Activity
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:5000";

export default function Assistant() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your Advanced CIMAGE AI. I can help you solve problems, translate languages, or even write complaints for you. How can I help today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const chatWindowRef = useRef(null);

  const chips = [
    { label: "Translate: Hindi to English", icon: Languages, prompt: "Translate this from Hindi to English: " },
    { label: "Write a Complaint", icon: FileText, prompt: "Help me write a professional complaint about " },
    { label: "Campus Rules", icon: HelpCircle, prompt: "What are the core campus rules at CIMAGE?" },
    { label: "Generate Smart Prompt", icon: Zap, prompt: "Give me 5 smart prompts to ask an AI about college life." }
  ];

  useEffect(() => {
    if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customPrompt) => {
    const textToSend = typeof customPrompt === 'string' ? customPrompt : input;
    if (!textToSend.trim() || loading) return;
    
    const userMessage = { role: "user", content: textToSend };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API}/api/ai/chat`,
        { 
          messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
          online: isOnline // Passing online mode to backend
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages([...currentMessages, data]);
    } catch (err) {
      setMessages([...currentMessages, { 
        role: "assistant", 
        content: "Oops! My neural links are fuzzy right now. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
     setMessages([{ role: "assistant", content: "Chat reset! I'm ready for new instructions." }]);
  }

  return (
    <div className="animate-in fade-in duration-700 w-full h-[calc(100vh-140px)] flex flex-col font-sans max-w-6xl mx-auto">
      
      {/* 🚀 Header & Mode Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden shrink-0">
        <div className="flex items-center gap-5 relative z-10">
           <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100">
              <Bot className="w-8 h-8" />
           </div>
           <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">CIMAGE Advanced AI</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                   {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-slate-500 text-[13px] font-bold flex items-center gap-2 mt-1">
                 <Activity className={`w-3 h-3 ${isOnline ? 'text-emerald-500' : 'text-slate-300'}`} /> Node-Alpha-9 Processor
              </p>
           </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="flex items-center bg-slate-50 p-1 rounded-full border border-slate-100 shadow-inner">
              <button 
                onClick={() => setIsOnline(false)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase transition-all ${!isOnline ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
              >
                Offline
              </button>
              <button 
                onClick={() => setIsOnline(true)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase transition-all ${isOnline ? 'bg-[#1E40AF] text-white shadow-lg' : 'text-slate-400'}`}
              >
                Online
              </button>
           </div>
           <button onClick={resetChat} className="p-2.5 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-100 rounded-xl shadow-sm">
              <RefreshCcw size={18} />
           </button>
        </div>

        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>

      {/* 💬 Main Chat Interface */}
      <div className="flex-1 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col lg:flex-row overflow-hidden relative">
         
         {/* Sidebar for Presets (Desktop) */}
         <div className="w-full lg:w-72 border-b lg:border-r lg:border-b-0 border-slate-50 p-6 space-y-4 shrink-0 bg-slate-50/30">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
            {chips.map((chip, i) => (
              <button 
                key={i}
                onClick={() => handleSend(chip.prompt)}
                disabled={loading}
                className="w-full p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-start gap-3 group active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <chip.icon size={16} />
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-700 leading-tight mb-1">{chip.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Auto-generate prompt</p>
                </div>
              </button>
            ))}
         </div>

         <div className="flex-1 flex flex-col h-full bg-slate-50/20">
            {/* Messages Pane */}
            <div 
              ref={chatWindowRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
            >
               {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-2xl flex flex-shrink-0 items-center justify-center border shadow-sm ${msg.role === 'user' ? 'bg-[#1E40AF] text-white' : 'bg-white text-indigo-600 border-indigo-100'}`}>
                           {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        
                        <div className={`p-5 rounded-2xl shadow-sm text-[14px] leading-relaxed font-medium ${msg.role === 'user' ? 'bg-[#1E40AF] text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                           {msg.content}
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               {loading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white px-6 py-4 rounded-full border border-indigo-100 shadow-sm flex items-center gap-3">
                       <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                       <span className="text-[11px] font-black text-indigo-500 tracking-widest uppercase">Thinking Deeply...</span>
                    </div>
                 </motion.div>
               )}
            </div>

            {/* Input & Tools */}
            <div className="p-6 bg-white border-t border-slate-50">
               <form 
                 onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                 className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 transition-all shadow-inner"
               >
                  <input 
                    type="text" 
                    disabled={loading}
                    placeholder="Message CIMAGE AI Node Alpha..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 h-12 bg-transparent px-4 font-bold text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-12 w-12 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all disabled:opacity-50 active:scale-95"
                  >
                     <Send size={20} />
                  </button>
               </form>
               <div className="flex justify-between items-center mt-4 px-2">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                     <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GPT-4o Enhanced Processing
                  </p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                     Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
