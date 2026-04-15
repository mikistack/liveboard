import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Layout, LogOut, Plus, Search, Grid, List, MoreVertical } from 'lucide-react';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-['Inter']">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden md:block">LiveBoard</span>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search boards..."
                className="w-full bg-[#0f172a]/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium text-white">{user?.username || 'User'}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.email}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-sky-500">{user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Boards</h1>
            <p className="text-slate-400 text-sm mt-1">Manage and collaborate on your ideas.</p>
          </div>
          <button className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all">
            <Plus className="w-5 h-5" />
            New Board
          </button>
        </div>

        {/* Empty State / Placeholder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="aspect-video bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-sky-500/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-sky-500/10 transition-all">
              <Plus className="w-6 h-6 text-slate-500 group-hover:text-sky-400 transition-all" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Create your first board</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
