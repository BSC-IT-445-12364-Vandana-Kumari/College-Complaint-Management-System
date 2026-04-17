import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import {
  Bell, Calendar, Megaphone, Download, Eye, Zap, ShieldCheck,
  Clock, X, Plus, Search, Trash2, CheckCircle2, Send, Loader2
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000";

const categories = ["All", "Academic", "Facilities", "Events"];

const priorityStyle = {
  CRITICAL: "bg-red-50 text-red-600",
  HIGH: "bg-amber-50 text-amber-600",
  MEDIUM: "bg-indigo-50 text-indigo-600",
  NORMAL: "bg-slate-100 text-slate-500",
};

const categoryIcon = {
  Academic: Calendar,
  Facilities: Zap,
  Events: Megaphone,
  General: Bell,
};
const categoryColor = {
  Academic: "text-blue-600",
  Facilities: "text-amber-600",
  Events: "text-indigo-600",
  General: "text-slate-500",
};
const categoryBg = {
  Academic: "bg-blue-100/50",
  Facilities: "bg-amber-100/50",
  Events: "bg-indigo-100/50",
  General: "bg-slate-100/50",
};

// ── Notice Detail Modal ──────────────────────────────────────────────────────
function NoticeModal({ notice, onClose, onDelete, isAdmin }) {
  if (!notice) return null;
  const Icon = categoryIcon[notice.category] || Bell;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[12px] shadow-2xl w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>

        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 ${categoryBg[notice.category] || "bg-slate-100"} rounded-full flex items-center justify-center ${categoryColor[notice.category] || "text-slate-500"} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${priorityStyle[notice.priority] || "bg-slate-100 text-slate-500"}`}>
              {notice.priority || "NORMAL"}
            </span>
            <h2 className="text-[18px] font-bold text-slate-900 mt-2 leading-tight">{notice.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-[12px] text-slate-400">
              <span className="font-semibold text-[#1E40AF]">{notice.category}</span>
              <span>•</span>
              <span>By: {notice.author?.name || "Admin"}</span>
              <span>•</span>
              <Clock size={12} /> {new Date(notice.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <p className="text-[14px] text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{notice.content}</p>

        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
          <div className="flex gap-2">
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${notice.title}\n\n${notice.content}\n\nDate: ${new Date(notice.createdAt).toLocaleDateString()}\nCategory: ${notice.category}`)}`}
              download={`Notice-${notice._id}.txt`}
              className="h-9 px-4 bg-slate-100 text-slate-600 rounded-[6px] text-[12px] font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Download size={14} /> Download
            </a>
            {isAdmin && (
              <button
                onClick={() => { onDelete(notice._id); onClose(); }}
                className="h-9 px-4 bg-red-50 text-red-600 rounded-[6px] text-[12px] font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
          <button onClick={onClose} className="h-9 px-4 bg-[#1E40AF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-blue-800 transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Post Notice Modal (Admin Only) ───────────────────────────────────────────
function PostModal({ onClose, onPost }) {
  const [form, setForm] = useState({ title: "", content: "", category: "Academic", priority: "NORMAL" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);
    await onPost(form);
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[12px] shadow-2xl w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
        <h2 className="text-[18px] font-bold text-slate-800 mb-5">Post New Notice</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter notice title..." className="w-full h-10 px-4 border border-slate-200 rounded-[7px] text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Content *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the full notice content..." rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-[7px] text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-4 border border-slate-200 rounded-[7px] text-[13px] outline-none focus:border-blue-500 bg-white">
                {["Academic", "Facilities", "Events", "General"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full h-10 px-4 border border-slate-200 rounded-[7px] text-[13px] outline-none focus:border-blue-500 bg-white">
                {["NORMAL", "MEDIUM", "HIGH", "CRITICAL"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="h-9 px-4 bg-slate-100 text-slate-600 rounded-[6px] text-[12px] font-semibold hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!form.title.trim() || !form.content.trim() || loading} className="h-9 px-5 bg-[#1E40AF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-blue-800 disabled:opacity-40 transition-colors flex items-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Post Notice
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Notices() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [readIds, setReadIds] = useState(() => JSON.parse(localStorage.getItem("readNotices") || "[]"));

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/notices`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setNotices(data);
    } catch (err) {
      console.error("Failed to load notices", err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = (id) => {
    const updated = [...new Set([...readIds, id])];
    setReadIds(updated);
    localStorage.setItem("readNotices", JSON.stringify(updated));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setNotices(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handlePost = async (form) => {
    try {
      const { data } = await axios.post(`${API}/api/notices`, form, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setNotices(prev => [data, ...prev]);
    } catch (err) {
      console.error("Post failed", err);
    }
  };

  const filtered = notices.filter(n => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const unread = isAdmin ? 0 : notices.filter(n => !readIds.includes(n._id)).length;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 w-full font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-[10px] border border-slate-200 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-1">
            {isAdmin ? "Notice Management" : "Notice Board"}
          </h1>
          <p className="text-slate-500 text-[13px] font-medium">
            {isAdmin ? "Post and manage campus-wide announcements for students." : "Stay updated with the latest campus announcements."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!isAdmin && unread > 0 && (
            <div className="h-9 px-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-[6px] text-[12px] font-bold flex items-center gap-2">
              <Bell className="w-4 h-4" /> {unread} Unread
            </div>
          )}
          {isAdmin && (
            <button onClick={() => setShowPost(true)} className="h-9 px-4 bg-[#1E40AF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-blue-800 active:scale-95 transition-all flex items-center gap-2">
              <Plus size={15} /> Post New Notice
            </button>
          )}
        </div>
        <div className="absolute -right-10 -top-20 w-48 h-48 bg-amber-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Admin Stats */}
      {isAdmin && notices.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", val: notices.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Critical", val: notices.filter(n => n.priority === "CRITICAL").length, color: "text-red-600", bg: "bg-red-50" },
            { label: "High", val: notices.filter(n => n.priority === "HIGH").length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Events", val: notices.filter(n => n.category === "Events").length, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-[8px] p-4 flex items-center justify-between`}>
              <span className="text-[12px] font-semibold text-slate-600">{s.label}</span>
              <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices..." className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-[7px] text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-[7px] border border-slate-200 shadow-sm w-full sm:w-auto overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-[5px] text-[12px] font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? "bg-[#1E40AF] text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-3" />
          <span className="text-[14px] font-semibold">Loading notices...</span>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-[14px] font-semibold">{notices.length === 0 ? "No notices posted yet" : "No notices found"}</p>
              </div>
            )}
            {filtered.map((notice, i) => {
              const Icon = categoryIcon[notice.category] || Bell;
              const isRead = isAdmin || readIds.includes(notice._id);
              return (
                <motion.div
                  key={notice._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className={`bg-white p-5 rounded-[10px] border shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer ${!isRead ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"}`}
                  onClick={() => { setSelectedNotice(notice); markRead(notice._id); }}
                >
                  {!isRead && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />}

                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 ${categoryBg[notice.category] || "bg-slate-100"} rounded-full flex items-center justify-center ${categoryColor[notice.category] || "text-slate-500"} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${priorityStyle[notice.priority] || "bg-slate-100 text-slate-500"}`}>
                        {notice.priority || "NORMAL"}
                      </span>
                      <h4 className="text-[14px] font-bold text-slate-800 leading-tight mt-2 group-hover:text-[#1E40AF] transition-colors">{notice.title}</h4>
                      <p className="text-[12px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{notice.content}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#1E40AF]">{notice.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setSelectedNotice(notice); markRead(notice._id); }} className="w-7 h-7 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1E40AF] rounded flex items-center justify-center transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      {!isRead && !isAdmin && (
                        <button onClick={() => markRead(notice._id)} className="w-7 h-7 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded flex items-center justify-center transition-colors" title="Mark as Read">
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDelete(notice._id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded flex items-center justify-center transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedNotice && (
          <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} onDelete={handleDelete} isAdmin={isAdmin} />
        )}
        {showPost && isAdmin && (
          <PostModal onClose={() => setShowPost(false)} onPost={handlePost} />
        )}
      </AnimatePresence>
    </div>
  );
}
