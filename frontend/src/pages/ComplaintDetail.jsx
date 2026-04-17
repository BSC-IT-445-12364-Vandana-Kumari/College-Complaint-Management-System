import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useContext } from "react";
import { 
  ArrowLeft, MessageSquare, Clock, CheckCircle2, ShieldAlert, 
  Paperclip, MoreVertical, Send, User, Bot, Zap, Layers, 
  Activity, ShieldCheck, XCircle, AlertTriangle, Printer, Trash2, 
  Loader2, Image as ImageIcon
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:5000";

const statusStyle = {
  Pending: "bg-red-50 text-red-600 border-red-100",
  "In Progress": "bg-amber-50 text-amber-600 border-amber-100",
  Resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Rejected: "bg-slate-100 text-slate-500 border-slate-200",
};

import { useSocket } from "../context/SocketContext";

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const isAdmin = user?.role === "admin" || user?.role === "teacher";
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchComplaint();

    if (socket) {
      socket.emit("join_room", `complaint_${id}`);
      socket.on("new_message", (updatedC) => {
        setComplaint(updatedC);
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [id, socket]);


  useEffect(() => {
    scrollToBottom();
  }, [complaint?.messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaint details");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { data } = await axios.patch(
        `${API}/api/complaints/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComplaint(data);
      setDropdownOpen(false);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await axios.post(
        `${API}/api/complaints/${id}/message`,
        { text: message },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComplaint(data);
      setMessage("");
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-[14px] font-bold uppercase tracking-widest">Loading Details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-slate-400">
        <AlertTriangle className="w-10 h-10 mb-4 text-red-400" />
        <p className="text-[14px] font-bold text-red-500 uppercase tracking-widest">{error || "Complaint not found"}</p>
        <Link to="/complaints" className="mt-4 text-[#1E40AF] text-[12px] font-bold uppercase underline">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 w-full font-sans tracking-normal bg-white/50 p-6 rounded-[12px] border border-slate-100">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2 shrink-0">
          <Link to="/complaints" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-700 font-bold text-[11px] uppercase tracking-wider transition-all group mb-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Complaints
          </Link>
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shadow-sm border ${statusStyle[complaint.status]}`}>
                <ShieldAlert size={22} />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Ticket #{complaint._id.slice(-6).toUpperCase()}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest ${statusStyle[complaint.status]}`}>
                    {complaint.status}
                  </span>
                  <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                    Priority: <span className="text-slate-600">{complaint.priority}</span>
                  </span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
           {isAdmin && (
             <>
               {complaint.status !== 'Resolved' && (
                 <button 
                   onClick={() => updateStatus('Resolved')}
                   className="h-9 px-5 bg-emerald-600 text-white rounded-[7px] text-[12px] font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
                 >
                    <CheckCircle2 size={15} /> Resolve
                 </button>
               )}
               {complaint.status === 'Resolved' && (
                 <button 
                   onClick={() => updateStatus('In Progress')}
                   className="h-9 px-5 bg-slate-200 text-slate-600 rounded-[7px] text-[12px] font-bold hover:bg-slate-300 active:scale-95 transition-all flex items-center gap-2"
                 >
                    <XCircle size={15} /> Re-Open
                 </button>
               )}
               <button 
                 onClick={() => updateStatus('In Progress')}
                 className={`h-9 px-5 bg-amber-500 text-white rounded-[7px] text-[12px] font-bold shadow-md hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-2 ${complaint.status === 'In Progress' ? 'opacity-50 pointer-events-none' : ''}`}
               >
                  <Activity size={15} /> In Progress
               </button>
             </>
           )}

           <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`h-9 w-9 rounded-[7px] border flex items-center justify-center transition-all ${dropdownOpen ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:text-[#1E40AF] hover:border-blue-200'}`}
              >
                 <MoreVertical size={16} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-[10px] shadow-2xl z-50 overflow-hidden"
                  >
                     <button className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors text-left">
                        <Printer size={15} className="text-slate-400" /> Save as PDF
                     </button>
                     {isAdmin && (
                       <button onClick={() => updateStatus('Rejected')} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors text-left border-t border-slate-50">
                          <Trash2 size={15} /> Reject & Close
                       </button>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="w-full">
        
        {/* Chat / Messages */}
        <div className="flex flex-col h-[600px] bg-slate-50/50 rounded-[15px] border border-slate-200 shadow-inner relative overflow-hidden">

           
           <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                    <MessageSquare size={14} className="text-[#1E40AF]" />
                 </div>
                 <div>
                    <span className="text-[13px] font-black text-slate-800 tracking-tight block">Communication Thread</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Active Resolution Channel</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Initial Problem Post */}
              <div className="flex items-start gap-4">
                 <div className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                    <User size={16} />
                 </div>
                 <div className="space-y-2 max-w-[90%]">
                    <div className="bg-white p-5 border border-slate-200 rounded-[12px] rounded-tl-none shadow-sm">
                       <h4 className="text-[14px] font-black text-slate-900 mb-2">{complaint.title}</h4>
                       <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                       
                       {complaint.proofUrl && (
                         <div className="mt-4 border-t border-slate-100 pt-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                               <ImageIcon size={12} /> Evidence attached
                            </p>
                            <a href={`${API}${complaint.proofUrl}`} target="_blank" rel="noreferrer" className="block rounded-[8px] overflow-hidden border border-slate-200 transition-transform active:scale-95 group relative">
                               <img src={`${API}${complaint.proofUrl}`} alt="Evidence" className="w-full max-h-64 object-cover" />
                               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="bg-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-2xl">View Full Size</span>
                               </div>
                            </a>
                         </div>
                       )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                       <span>{complaint.user?.name}</span>
                       <span>•</span>
                       <span>{new Date(complaint.createdAt).toLocaleString([], { hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric' })}</span>
                    </div>
                 </div>
              </div>

              {/* Chat History */}
              {complaint.messages?.map((msg, i) => {
                const isMyMessage = msg.sender?._id === user?._id;
                const senderRole = msg.sender?.role;
                const isAdminMsg = senderRole === 'admin' || senderRole === 'teacher';

                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-4 ${isMyMessage ? 'flex-row-reverse text-right' : 'text-left'} max-w-[90%] ${isMyMessage ? 'ml-auto' : ''}`}
                  >
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${isAdminMsg ? 'bg-[#1E40AF] text-white border-blue-800' : 'bg-white text-slate-500 border-slate-200'}`}>
                        {isAdminMsg ? <Bot size={14} /> : <User size={14} />}
                     </div>
                     <div className="space-y-1.5">
                        <div className={`p-4 rounded-[12px] shadow-sm text-left ${isMyMessage ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                           <p className="text-[13px] leading-relaxed">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                           <span>{msg.sender?.name} {isAdminMsg && "(Support)"}</span>
                           <span>•</span>
                           <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                        </div>
                     </div>
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
           </div>

           {/* Input */}
           <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                 <button type="button" className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full flex items-center justify-center transition-all bg-slate-50">
                    <Paperclip size={18} />
                 </button>
                 <input 
                   type="text" 
                   value={message}
                   onChange={e => setMessage(e.target.value)}
                   disabled={sending}
                   placeholder="Type your response here..."
                   className="flex-1 h-11 px-5 bg-slate-50 border border-slate-200 rounded-[10px] text-[13px] font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                 />
                 <button 
                   type="submit" 
                   disabled={!message.trim() || sending}
                   className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-800 text-white text-[13px] font-black rounded-[10px] flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-blue-500/10 active:scale-95 uppercase tracking-widest"
                 >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <>Send <Send size={15} /></>}
                 </button>
              </form>
           </div>
        </div>

      </div>


    </div>
  );
}
