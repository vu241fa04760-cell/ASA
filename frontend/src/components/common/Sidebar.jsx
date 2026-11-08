import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  HelpCircle,
  CalendarCheck,
  FileText,
  BarChart3,
  User,
  Settings,
  Flame,
  LogOut,
  Sparkles,
  X,
  ChevronRight,
  Plus,
  BookPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubjects } from '../../context/SubjectContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Chat Assistant', href: '/chat', icon: MessageSquare, badge: '3D AI' },
  { name: 'AI Notes Generator', href: '/notes', icon: BookOpen, badge: 'AI' },
  { name: 'AI Quiz Generator', href: '/quiz', icon: HelpCircle, badge: 'Interactive' },
  { name: 'Study Planner', href: '/planner', icon: CalendarCheck },
  { name: 'Document Summarizer', href: '/documents', icon: FileText, badge: 'PDF' },
  { name: 'Progress Tracking', href: '/progress', icon: BarChart3 },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { openAddSubjectModal } = useSubjects();
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 glass-cyber border-r border-primary-500/20 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-primary-500/15">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-electric transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
                EduPulse AI
              </span>
              <p className="text-[9px] uppercase tracking-widest font-bold text-cyan-400">
                Dark & Blue Edition
              </p>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Card */}
        {user && (
          <div className="p-3.5 mx-3 my-3 rounded-2xl glass-cyber border border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900/60 to-cyan-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-glow-electric">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400">
                    5-Day Streak Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`relative group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white shadow-glow-electric'
                    : 'text-slate-300 hover:text-white hover:bg-blue-600/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'text-blue-400 group-hover:text-cyan-300 group-hover:scale-110'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-950/80 border border-blue-500/30 text-cyan-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-primary-500/15 space-y-2">
          <button
            type="button"
            onClick={() => {
              openAddSubjectModal();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs font-bold rounded-xl glass-cyber border border-cyber-cyan/40 text-cyber-cyan hover:text-white hover:bg-cyber-cyan/20 hover:border-cyber-cyan shadow-sm transition-all active:scale-95"
          >
            <BookPlus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
