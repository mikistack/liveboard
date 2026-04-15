import React from 'react';
import { ArrowLeft, Users, MoreVertical, Share2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TopBar = ({ title }) => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-6 left-6 right-6 flex items-center justify-between z-40"
    >
      <div className="flex items-center gap-4 bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-xl">
        <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-px h-6 bg-white/10" />
        <h1 className="text-white font-semibold text-sm tracking-wide cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors">
          {title || 'Untitled Board'}
        </h1>
      </div>

      <div className="flex items-center gap-3 bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
        <div className="flex items-center -space-x-2 mr-2 cursor-pointer relative group">
          {/* Mock active users avatars */}
          <div className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-emerald-500 flex items-center justify-center text-xs font-bold text-white z-20">A</div>
          <div className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-indigo-500 flex items-center justify-center text-xs font-bold text-white z-10">B</div>
          <div className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-[#0f172a] flex items-center justify-center text-xs font-bold text-slate-400 z-0">+2</div>
          <Users className="w-4 h-4 ml-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
        
        <div className="w-px h-6 bg-white/10" />
        
        <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-4 py-1.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-sky-500/20">
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <button className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
          <Download className="w-5 h-5" />
        </button>

        <button className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TopBar;
