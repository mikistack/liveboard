import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, ArrowRight, Shield, Zap, Share2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-['Inter'] overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">LiveBoard</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/auth" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/auth" className="bg-sky-500 hover:bg-sky-400 px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-sky-500/20">
              Start Drawing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-sky-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/20 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Think together,<br />in real time.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Collaborative whiteboard for modern teams. Draw, brainstorm, and build together with instant synchronization and zero latency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 px-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-sky-500/25">
                Register for free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/5 px-8 py-4 rounded-xl text-lg font-bold transition-all">
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-sky-500/20 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-all">
              <Zap className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Instant Sync</h3>
            <p className="text-slate-400 leading-relaxed">
              Every stroke and movement is broadcast to all users in under 50ms using optimized WebSockets.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all">
              <Share2 className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">One-Click Sharing</h3>
            <p className="text-slate-400 leading-relaxed">
              Invite your team with a simple link. Control roles between viewers, editors, and owners instantly.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Bank-Grade Security</h3>
            <p className="text-slate-400 leading-relaxed">
              JWT authentication, refresh token rotation, and strict CSP headers ensure your data stays yours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
