import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Shield } from 'lucide-react';
import ParticleBackground from '../components/3d/ParticleBackground';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-cyber-navy text-white bg-mesh-dark flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      <ParticleBackground />

      {/* Glow Orbs in Electric Blue & Cyan */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-electric transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
              EduPulse AI
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="px-3.5 py-1.5 rounded-xl glass-cyber border border-blue-500/25 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md mx-auto my-8 relative z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 relative z-10 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-cyan-400" />
        <span>© 2026 EduPulse AI • Secure Neural Study Platform</span>
      </div>
    </div>
  );
};

export default AuthLayout;
