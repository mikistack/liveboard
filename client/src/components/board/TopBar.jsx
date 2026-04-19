import React, { useState } from 'react';
import { ArrowLeft, Users, MoreVertical, Share2, Download, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const TopBar = ({ board }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board?.title || '');
  
  const handleShare = () => {
    if (!board) return;
    const shareUrl = `${window.location.origin}/join/${board.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${board?.title || 'board'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleRename = async () => {
    if (!title.trim() || title === board.title) return setIsEditing(false);
    try {
      await api.patch(`/boards/${board.id}`, { title });
      setIsEditing(false);
    } catch (err) {
      console.error('Rename failed', err);
    }
  };

  const members = board?.members || [];
  const showMembers = members.slice(0, 3);
  const extraMembers = members.length - 3;
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
        {isEditing ? (
          <input
            autoFocus
            className="bg-transparent text-white font-semibold text-sm outline-none border-b border-sky-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          />
        ) : (
          <h1 
            onClick={() => setIsEditing(true)}
            className="text-white font-semibold text-sm tracking-wide cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors"
          >
            {title || board?.title || 'Untitled Board'}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3 bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
        <div className="flex items-center -space-x-2 mr-2 cursor-pointer relative group">
          {showMembers.map((m, i) => (
            <div key={m.id} className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-slate-700 flex items-center justify-center text-xs font-bold text-white z-20 overflow-hidden" style={{ zIndex: 30 - i }}>
              {m.user?.avatarUrl ? (
                <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                m.user?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          ))}
          {extraMembers > 0 && (
            <div className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-[#0f172a] flex items-center justify-center text-xs font-bold text-slate-400 z-0">
              +{extraMembers}
            </div>
          )}
          <Users className="w-4 h-4 ml-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
        
        <div className="w-px h-6 bg-white/10" />
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-4 py-1.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-sky-500/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied' : 'Share'}
        </button>

        <button 
          onClick={handleDownload}
          className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
          title="Download PNG"
        >
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
