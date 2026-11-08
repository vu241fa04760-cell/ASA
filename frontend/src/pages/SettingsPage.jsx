import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Cpu,
  ShieldCheck,
  Database,
  Info,
  CheckCircle2,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { success } = useToast();

  const [emailNotifications, setEmailNotifications] = useState(
    user?.learningPreferences?.emailNotifications !== false
  );
  const [preferredSubject, setPreferredSubject] = useState(
    user?.learningPreferences?.preferredSubject || 'Computer Science'
  );
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(
    user?.learningPreferences?.dailyGoalMinutes || 60
  );

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({
        learningPreferences: {
          emailNotifications,
          preferredSubject,
          dailyGoalMinutes: Number(dailyGoalMinutes),
          darkMode: true,
        },
      });

      if (res.success && res.user) {
        updateUser(res.user);
        success('Preferences saved successfully!');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
          System Preferences
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Settings & Configuration
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Customize your study experience, interface appearance, and AI copilot preferences
        </p>
      </div>

      {/* Appearance Section - Locked to Dark & Blue Cyber Theme */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl space-y-6 bg-[#0A1026]/90">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Theme & Interface</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-cyber border border-blue-500/20 bg-[#050814]/80">
          <div>
            <p className="text-sm font-bold text-white">
              Color Theme Mode
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              High-contrast futuristic Dark & Electric Blue mode (white mode permanently disabled for eye comfort)
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl text-xs font-bold border border-blue-500/30 bg-blue-600/20 text-cyan-300 flex items-center gap-2 self-start sm:self-auto shadow-glow-cyan">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Dark & Blue Theme Active</span>
          </div>
        </div>
      </div>

      {/* Study Preferences Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl space-y-6 bg-[#0A1026]/90">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Study Habits & Learning Goals</span>
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Default Primary Subject
              </label>
              <input
                type="text"
                value={preferredSubject}
                onChange={(e) => setPreferredSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-blue-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Daily Study Target (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="360"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-blue-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl glass-cyber border border-blue-500/20 bg-[#050814]/80">
            <div>
              <p className="text-sm font-bold text-white">
                Exam Reminders & Notifications
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Receive study streak alerts and upcoming task deadline reminders
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* AI Engine & System Status */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl space-y-4 bg-[#0A1026]/90">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>AI Engine & Backend Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl glass-cyber border border-blue-500/20 bg-[#050814]/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                AI Service
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                Connected
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Google Gemini Flash / Educational Engine
            </p>
            <p className="text-xs text-slate-400">
              Secured backend proxy with automatic fallback for zero quota disruption.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-cyber border border-blue-500/20 bg-[#050814]/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Database
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/30 text-cyan-300">
                MongoDB & Mongoose
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Full CRUD Persistence
            </p>
            <p className="text-xs text-slate-400">
              Users, Notes, Quizzes, StudyTasks, Documents, ChatHistory, UserProgress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
