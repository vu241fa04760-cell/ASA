import React, { useState, useEffect } from 'react';
import {
  Menu,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSubjects } from '../../context/SubjectContext';
import AddSubjectButton from './AddSubjectButton';
import progressService from '../../services/progressService';

const Navbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { success } = useToast();
  const { subjectNames: subjects, openAddSubjectModal } = useSubjects();

  // Focus Timer State (25 mins Pomodoro)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerSubject, setTimerSubject] = useState('Data Structures & Algorithms');

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleLogFocusSession(25);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleLogFocusSession = async (mins) => {
    try {
      await progressService.logStudyTime({ minutes: mins, subject: timerSubject });
      success(`Great focus session! Logged ${mins} minutes to your study progress.`);
      setTimerSeconds(25 * 60);
    } catch (err) {
      console.warn('Could not log focus time:', err.message);
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 glass-cyber border-b border-primary-500/15 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold px-3 py-1.5 glass-cyber text-cyber-cyan rounded-full border border-cyber-cyan/30 shadow-glow-cyan">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
          <span>AI Neural Engine Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Pomodoro Focus Timer Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTimerModal(!showTimerModal)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl glass-cyber border border-primary-500/30 text-slate-900 dark:text-white hover:border-cyber-cyan/50 shadow-soft transition-all"
          >
            <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-cyber-cyan animate-pulse' : 'text-primary-400'}`} />
            <span className="font-mono text-xs">{formatTimer(timerSeconds)}</span>
          </button>

          {showTimerModal && (
            <div className="absolute right-0 mt-3 w-72 glass-cyber rounded-3xl border border-primary-500/30 p-5 z-50 shadow-2xl animate-slide-up bg-white/95 dark:bg-[#0D1126]/95">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyber-cyan">
                  Pomodoro Focus Session
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Target Subject
                  </label>
                  <AddSubjectButton
                    variant="link"
                    label="+ Add"
                    onSubjectAdded={(newSub) => setTimerSubject(newSub)}
                  />
                </div>
                <select
                  value={timerSubject}
                  onChange={(e) => {
                    if (e.target.value === '__ADD_NEW__') {
                      openAddSubjectModal((newSub) => setTimerSubject(newSub));
                    } else {
                      setTimerSubject(e.target.value);
                    }
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-primary-500/30 bg-white dark:bg-cyber-navy/80 text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-white dark:bg-cyber-navy text-slate-900 dark:text-white">
                      {s}
                    </option>
                  ))}
                  <option value="__ADD_NEW__" className="bg-cyber-dark text-cyber-cyan font-bold">
                    + Add Custom Subject...
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white shadow-glow-electric transition-all ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(25 * 60);
                  }}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>


        {/* User Avatar Mini */}
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-blue-500/25">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-glow-electric">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden md:block text-xs font-bold text-white truncate max-w-[120px]">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
