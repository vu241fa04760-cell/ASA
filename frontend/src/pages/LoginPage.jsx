import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.message || 'Invalid email or password.');
    }
  };

  const handleFillDemo = () => {
    setEmail('alex@studyai.edu');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="glass-cyber border border-blue-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-slide-up text-white">
      {/* Decorative Top Glow Bar in Dark & Blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500" />

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/30 border border-cyan-400/30 mb-3">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Neural Authentication Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-300 mt-1.5">
          Sign in to access your 3D AI study notes, quizzes & smart planner
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="mb-6 p-3.5 rounded-2xl glass-cyber border border-blue-500/30 bg-blue-950/40 flex items-center justify-between gap-2 shadow-inner">
        <div className="text-xs">
          <div className="flex items-center gap-1 text-blue-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo Student Access</span>
          </div>
          <p className="text-slate-300 text-[11px] font-mono mt-0.5">
            alex@studyai.edu • password123
          </p>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-glow-electric transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Auto Fill</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@studyai.edu"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-200">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-cyan-400 hover:underline hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-glow-electric transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to EduPulse AI</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-slate-300">
        Don't have an account yet?{' '}
        <Link
          to="/register"
          className="font-bold text-cyan-400 hover:text-white hover:underline transition-colors ml-1"
        >
          Register for Free
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
