import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request token, 2 = reset password
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const { success } = useToast();
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await authService.forgotPassword(email);
      setLoading(false);
      if (res.success) {
        setToken(res.resetToken);
        setStep(2);
        setInfoMessage('Reset token generated! Enter your new password below.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.response?.data?.message || 'Failed to request password reset.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setErrorMessage('Please fill in both token and new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await authService.resetPassword({ resetToken: token, newPassword });
      setLoading(false);
      if (res.success) {
        success('Password reset successful! Please sign in with your new password.');
        navigate('/login');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.response?.data?.message || 'Password reset failed.');
    }
  };

  return (
    <div className="glass-cyber border border-primary-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-slide-up text-white">
      {/* Decorative Top Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyber-cyan to-accent-500" />

      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-cyan hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/25 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Recovery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-primary-100 to-cyber-cyan bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-sm text-gray-300 mt-1.5">
          {step === 1
            ? 'Enter your email to receive a secure recovery code.'
            : 'Enter the recovery code and create your new password.'}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {infoMessage && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-3 text-emerald-300 text-sm shadow-lg">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
          <span>{infoMessage}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestToken} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary-500/30 bg-cyber-dark/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-primary-600 via-accent-500 to-cyber-cyan hover:from-primary-500 hover:to-cyber-cyan text-white shadow-glow-electric transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Generate Recovery Token</span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-200 mb-1.5">
              Reset Token
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste reset token here"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary-500/30 bg-cyber-dark/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-200 mb-1.5">
              New Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary-500/30 bg-cyber-dark/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-primary-600 via-accent-500 to-cyber-cyan hover:from-primary-500 hover:to-cyber-cyan text-white shadow-glow-electric transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Confirm & Reset Password</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
