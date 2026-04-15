import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBar = ({ zoom = 100 }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-40 pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl shadow-xl flex items-center gap-3">
        <button className="text-slate-400 hover:text-white transition-colors" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-slate-300 min-w-[3rem] text-center">{zoom}%</span>
        <button className="text-slate-400 hover:text-white transition-colors" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button className="text-slate-400 hover:text-white transition-colors" title="Fit to Screen">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div className="pointer-events-auto bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-slate-300">Syncing</span>
        <div className="flex gap-1 ml-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse delay-150"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse delay-300"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;
