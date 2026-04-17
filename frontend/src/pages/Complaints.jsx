import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search, Filter, PlusSquare, Grid, List, Clock,
  CheckCircle2, AlertCircle, MoreVertical, ArrowRight, Loader2
} from "lucide-react";

const API = "http://localhost:5000";

const statusStyle = {
  Pending: "bg-red-50 text-red-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Resolved: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-slate-100 text-slate-500",
};

import { useSocket } from "../context/SocketContext";

export default function Complaints() {
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchComplaints();

    if (socket) {
      socket.on("new_complaint", (newC) => {
        // If it's a student, only add if it belongs to them
        if (isAdmin || newC.user?._id === user?._id) {
          setComplaints((prev) => [newC, ...prev]);
        }
      });
      
      socket.on("complaint_updated", (updatedC) => {
        setComplaints((prev) => prev.map(c => c._id === updatedC._id ? updatedC : c));
      });

      return () => {
        socket.off("new_complaint");
        socket.off("complaint_updated");
      };
    }
  }, [socket]);


  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/complaints`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchFilter =
      filter === "all" ||
      (filter === "pending" && c.status === "Pending") ||
      (filter === "resolved" && c.status === "Resolved");
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 w-full font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[7px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-1">
            {isAdmin ? "Manage Complaints" : "My Complaints"}
          </h1>
          <p className="text-slate-500 text-[13px] font-medium">
            {isAdmin ? "Review and resolve all student-reported issues." : "View and track all your submitted complaints."}
          </p>
        </div>

        {!isAdmin && (
          <Link to="/complaints/new" className="relative z-10">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="h-10 px-6 bg-[#1E40AF] text-white rounded-[7px] text-[13px] font-bold shadow-md hover:bg-blue-800 transition-all flex items-center gap-2"
            >
              <PlusSquare className="w-4 h-4" /> New Complaint
            </motion.button>
          </Link>
        )}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Admin Stats */}
      {isAdmin && complaints.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", val: complaints.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending", val: complaints.filter(c => c.status === "Pending").length, color: "text-red-600", bg: "bg-red-50" },
            { label: "In Progress", val: complaints.filter(c => c.status === "In Progress").length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Resolved", val: complaints.filter(c => c.status === "Resolved").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-[8px] p-4 flex items-center justify-between`}>
              <span className="text-[12px] font-semibold text-slate-600">{s.label}</span>
              <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full max-w-sm relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 px-10 bg-white border border-slate-200 rounded-[7px] text-[13px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-white p-1 rounded-[7px] border border-slate-200 shadow-sm">
            <button onClick={() => setView("grid")} className={`h-8 w-8 flex items-center justify-center rounded-[5px] transition-all ${view === "grid" ? "bg-[#1E40AF] text-white shadow" : "text-slate-500 hover:text-[#1E40AF]"}`}>
              <Grid size={15} />
            </button>
            <button onClick={() => setView("list")} className={`h-8 w-8 flex items-center justify-center rounded-[5px] transition-all ${view === "list" ? "bg-[#1E40AF] text-white shadow" : "text-slate-500 hover:text-[#1E40AF]"}`}>
              <List size={16} />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1" />

          <div className="flex items-center gap-2 bg-white p-1 rounded-[7px] border border-slate-200 shadow-sm shrink-0">
            {["All", "Pending", "Resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f.toLowerCase())}
                className={`h-8 px-4 rounded-[5px] text-[12px] font-bold transition-all ${filter === f.toLowerCase() ? "bg-blue-50 text-[#1E40AF]" : "text-slate-500 hover:text-slate-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-3" />
          <span className="text-[14px] font-semibold">Loading complaints...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-[14px] font-semibold">
            {complaints.length === 0 ? "No complaints submitted yet" : "No results for your search"}
          </p>
          {!isAdmin && complaints.length === 0 && (
            <Link to="/complaints/new" className="mt-4 h-9 px-5 bg-[#1E40AF] text-white rounded-[6px] text-[12px] font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
              <PlusSquare size={14} /> Submit First Complaint
            </Link>
          )}
        </div>
      )}

      {/* Data Display */}
      {!loading && filtered.length > 0 && (
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/complaints/${item._id}`)}
                  className="bg-white p-5 rounded-[7px] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-black tracking-widest uppercase ${statusStyle[item.status] || "bg-slate-100 text-slate-500"}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold text-slate-800 leading-tight mb-1">{item.title}</h3>
                    <p className="text-[12px] font-medium text-slate-500">
                      {isAdmin ? `By: ${item.user?.name}` : item.category} • #{item._id.slice(-5)}
                    </p>
                    {item.proofUrl && (
                      <div className="mt-3">
                        <img src={`${API}${item.proofUrl}`} alt="Evidence" className="w-full h-24 object-cover rounded-[6px] border border-slate-100" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#1E40AF] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white border border-slate-100 shadow-sm rounded-[7px] overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                <div className="col-span-2">ID</div>
                <div className="col-span-4">Subject</div>
                {isAdmin && <div className="col-span-2">Student</div>}
                <div className={isAdmin ? "col-span-2" : "col-span-3"}>Date</div>
                <div className={isAdmin ? "col-span-1 text-right" : "col-span-2 text-right"}>Status</div>
                <div className="col-span-1"></div>
              </div>
              <div className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/complaints/${item._id}`)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  >
                    <div className="col-span-2 text-[12px] font-black text-slate-600">#{item._id.slice(-5)}</div>
                    <div className={`${isAdmin ? "col-span-4" : "col-span-4"} flex items-center gap-3`}>
                      <div className="shrink-0 w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-slate-800 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500">{item.category}</span>
                      </div>
                    </div>
                    {isAdmin && <div className="col-span-2 text-[12px] text-slate-600 font-medium">{item.user?.name}</div>}
                    <div className={isAdmin ? "col-span-2 text-[11px] font-bold text-slate-500" : "col-span-3 text-[11px] font-bold text-slate-500"}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className={isAdmin ? "col-span-1 flex justify-end" : "col-span-2 flex justify-end"}>
                      <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-black uppercase ${statusStyle[item.status] || "bg-slate-100 text-slate-500"}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="col-span-1 hidden md:flex justify-end text-slate-300 group-hover:text-[#1E40AF]">
                      <MoreVertical className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
