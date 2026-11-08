import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageSquare,
  HelpCircle,
  CalendarCheck,
  FileText,
  BarChart3,
  CheckCircle2,
  Zap,
  Cpu,
  Shield,
  Layers,
  ChevronRight,
  Tv,
  Check,
  BrainCircuit,
  GraduationCap,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CardTilt3D from '../components/3d/CardTilt3D';
import ParticleBackground from '../components/3d/ParticleBackground';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeDemoTab, setActiveDemoTab] = useState('tutor');
  const [quizSelected, setQuizSelected] = useState(2);

  const features = [
    {
      title: 'Neural AI Study Copilot',
      description: 'Engage with an intelligent AI tutor that breaks down complex university concepts into clear, step-by-step intuition.',
      icon: MessageSquare,
      badge: 'Live Gemini API',
      gradient: 'from-blue-600 to-cyan-500',
      glow: 'rgba(37, 99, 235, 0.4)',
    },
    {
      title: 'AI High-Yield Notes',
      description: 'Generate structured academic notes, executive summaries, and exam-focused takeaways in seconds with 1-click MongoDB save.',
      icon: BookOpen,
      badge: 'Smart Synthesis',
      gradient: 'from-blue-500 to-sky-400',
      glow: 'rgba(56, 189, 248, 0.4)',
    },
    {
      title: '4-Option AI Practice Quizzes',
      description: 'Practice with multiple-choice quizzes, instant score calculation, countdown timers, and pedagogical explanations.',
      icon: HelpCircle,
      badge: 'Interactive Testing',
      gradient: 'from-cyan-400 to-blue-600',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
    {
      title: 'PDF & TXT Document Analyzer',
      description: 'Upload textbooks and lecture slides. Automatically extract text, produce summaries, and query documents directly.',
      icon: FileText,
      badge: 'pdf-parse Engine',
      gradient: 'from-teal-400 to-blue-600',
      glow: 'rgba(20, 184, 166, 0.4)',
    },
    {
      title: 'Smart Schedule Planner',
      description: 'Organize study tasks, prioritize deadlines, track progress dynamically, and build unbroken learning streaks.',
      icon: CalendarCheck,
      badge: 'Adaptive Schedule',
      gradient: 'from-sky-400 to-blue-700',
      glow: 'rgba(14, 165, 233, 0.4)',
    },
    {
      title: 'Visual Learning Analytics',
      description: 'Inspect weekly study trends, topic mastery breakdowns, and unlocked achievement badges with interactive charts.',
      icon: BarChart3,
      badge: 'Recharts & Metrics',
      gradient: 'from-blue-700 to-cyan-500',
      glow: 'rgba(37, 99, 235, 0.45)',
    },
  ];

  return (
    <div className="relative min-h-screen bg-cyber-navy text-white selection:bg-cyan-500 selection:text-black overflow-hidden bg-mesh-dark">
      {/* 60fps Interactive Particle Field in Electric Blue & Cyan */}
      <ParticleBackground />

      {/* Top Floating Glow Orbs in Electric Blue & Cyan */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-cyber border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-electric transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
                EduPulse AI
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-cyan-400/90">
                AI Study Assistance Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative group px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-glow-electric transition-all flex items-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-14 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-8 text-center lg:text-left"
            >
              {/* Futuristic Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold glass-cyber border border-cyan-400/30 text-cyan-400 shadow-glow-cyan animate-pulse-slow">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Generation AI Study Companion</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                Learn Smarter.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 bg-clip-text text-transparent text-glow-cyan">
                  Study Faster.
                </span>{' '}
                Achieve More.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Your personal AI-powered study companion that transforms the way you learn. Synthesize notes, challenge yourself with 4-option quizzes, watch university YouTube lectures, and master difficult subjects in real-time.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#curriculum"
                  className="px-7 py-4 rounded-2xl font-bold text-sm glass-cyber hover:bg-blue-600/20 border border-blue-500/30 text-slate-200 hover:text-white transition-all flex items-center gap-2"
                >
                  <Tv className="w-4 h-4 text-cyan-400" />
                  <span>View Subjects & Lectures</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Real-time Gemini AI Tutor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Interactive 4-Option Quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Integrated YouTube Video Lectures</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Live Interactive AI Study Studio Preview (Replaced abstract rotating torus) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative w-full"
            >
              {/* Ambient Backlight Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-3xl blur-xl opacity-35 animate-pulse-slow" />

              <div className="relative rounded-3xl glass-cyber border border-blue-500/35 overflow-hidden shadow-2xl bg-[#0A1026]/95">
                {/* Studio Window Header */}
                <div className="px-5 py-3.5 border-b border-blue-500/20 bg-[#050814]/90 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 ml-2">EduPulse AI Studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono text-emerald-300 font-bold">Gemini AI Live</span>
                  </div>
                </div>

                {/* Interactive Tab Bar */}
                <div className="p-3 bg-[#050814]/50 border-b border-blue-500/15 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDemoTab('tutor')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeDemoTab === 'tutor'
                        ? 'bg-blue-600 text-white shadow-glow-electric'
                        : 'text-slate-400 hover:text-white glass-cyber border border-blue-500/20'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Tutor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDemoTab('notes')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeDemoTab === 'notes'
                        ? 'bg-blue-600 text-white shadow-glow-electric'
                        : 'text-slate-400 hover:text-white glass-cyber border border-blue-500/20'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDemoTab('quiz')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeDemoTab === 'quiz'
                        ? 'bg-blue-600 text-white shadow-glow-electric'
                        : 'text-slate-400 hover:text-white glass-cyber border border-blue-500/20'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>4-Option Quiz</span>
                  </button>
                </div>

                {/* Tab Contents with Educational Images */}
                <div className="p-5 min-h-[380px] flex flex-col justify-between">
                  {activeDemoTab === 'tutor' && (
                    <div className="space-y-3">
                      {/* Educational Image Banner for AI Tutor */}
                      <div className="relative rounded-2xl overflow-hidden border border-blue-500/25 h-28 sm:h-32 group shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                          alt="AI Computer Science Education"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/60 to-transparent" />
                        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[11px] font-bold text-white tracking-wide">Computer Science Algorithms Lab</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600/90 text-cyan-200 border border-blue-400/30">
                            Live Tutor
                          </span>
                        </div>
                      </div>

                      {/* Student Bubble */}
                      <div className="flex items-start justify-end gap-2.5">
                        <div className="max-w-[85%] p-2.5 rounded-2xl rounded-tr-none bg-blue-600 text-white text-xs font-medium shadow-md">
                          How does QuickSort partitioning work and what is its average-case recurrence?
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                          U
                        </div>
                      </div>

                      {/* AI Response Bubble */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-glow-cyan flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="max-w-[90%] p-3 rounded-2xl rounded-tl-none glass-cyber border border-blue-500/30 text-xs text-slate-200 space-y-1.5">
                          <p className="font-semibold text-white text-[11px]">
                            QuickSort partitions an array around a pivot so elements &lt; pivot move left:
                          </p>
                          <div className="p-2 rounded-lg bg-[#050814] border border-blue-500/25 font-mono text-[10px] text-cyan-300">
                            <code>{`int pivot = arr[high]; int i = (low - 1);`}</code>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            • Recurrence: <span className="font-mono text-cyan-400">T(n) = 2T(n/2) + O(n)</span> → <span className="font-bold text-white">O(n log n)</span> Average time complexity.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDemoTab === 'notes' && (
                    <div className="space-y-3">
                      {/* Educational Image Banner for AI Notes */}
                      <div className="relative rounded-2xl overflow-hidden border border-blue-500/25 h-28 sm:h-32 group shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80"
                          alt="Student Studying Notes and Textbooks"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/60 to-transparent" />
                        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-[11px] font-bold text-white tracking-wide">Structured Lecture Synthesis</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white border border-emerald-400/30">
                            High-Yield Notes
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-blue-500/20 pb-1.5">
                        <span className="text-xs font-bold text-white">Operating Systems: Virtual Memory & Paging</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold">
                          MongoDB Saved
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/20">
                          <p className="font-bold text-white text-[11px] flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
                            <span>1. Address Translation:</span>
                          </p>
                          <p className="text-[11px] text-slate-300 pl-5 mt-0.5">
                            Virtual Page Number (VPN) mapped to Physical Frame Number (PFN) via the MMU Page Table.
                          </p>
                        </div>

                        <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/20">
                          <p className="font-bold text-white text-[11px] flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
                            <span>2. Page Replacement:</span>
                          </p>
                          <p className="text-[11px] text-slate-300 pl-5 mt-0.5">
                            LRU replaces the page not used for the longest period, eliminating Belady’s Anomaly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDemoTab === 'quiz' && (
                    <div className="space-y-3">
                      {/* Educational Image Banner for Quiz */}
                      <div className="relative rounded-2xl overflow-hidden border border-blue-500/25 h-28 sm:h-32 group shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
                          alt="University Students Learning in Library"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/60 to-transparent" />
                        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px] font-bold text-white tracking-wide">Active Recall Quiz Arena</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-600/90 text-white border border-amber-400/30">
                            Exam Prep
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          Question 1 of 5 • Data Structures
                        </span>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                          ⏱ 00:45
                        </span>
                      </div>

                      <p className="text-xs font-bold text-white">
                        Which data structure is optimal for implementing a Priority Queue with O(log n) insertions?
                      </p>

                      <div className="space-y-1.5">
                        {[
                          { id: 0, text: 'A) Unsorted Array' },
                          { id: 1, text: 'B) Singly Linked List' },
                          { id: 2, text: 'C) Binary Heap (Min/Max Heap)', correct: true },
                          { id: 3, text: 'D) Hash Table' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setQuizSelected(opt.id)}
                            className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                              quizSelected === opt.id
                                ? opt.correct
                                  ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-glow-cyan'
                                  : 'bg-rose-950/70 border-rose-500 text-white'
                                : 'glass-cyber border-blue-500/20 text-slate-300 hover:border-cyan-400/50'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {quizSelected === opt.id && opt.correct && (
                              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Correct (+20 XP)
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Footer with 1-Click Launch */}
                  <div className="pt-3 mt-3 border-t border-blue-500/20 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Interactive Student Portal</span>
                    </div>
                    <Link
                      to="/register"
                      className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Launch AI Assistant</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Subject Curriculum & YouTube Lectures Hub (Replaced abstract rotating shapes) */}
      <section id="curriculum" className="relative z-10 py-16 border-y border-blue-500/20 glass-cyber overflow-hidden bg-[#050814]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                Course Curriculum & Lecture Integration
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Explore Subjects with AI & YouTube Video Lectures
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                Study any academic subject with integrated AI tutoring, chapter note synthesis, 4-option practice tests, and handpicked video lectures.
              </p>
            </div>
            <Link
              to="/register"
              className="self-start md:self-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2"
            >
              <span>Enroll Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Subject 1: Data Structures */}
            <div className="p-5 rounded-3xl glass-cyber border border-blue-500/25 bg-[#0A1026]/90 space-y-3.5 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-28 w-full border border-blue-500/20 group-hover:border-cyan-400/40 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80"
                    alt="Data Structures & Algorithms"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/40 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/30 text-cyan-300">
                    Core CS
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Data Structures & Algorithms
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Trees, Graphs, Dynamic Programming, Sorting algorithms, and asymptotic complexity analysis.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-blue-500/20">
                <div className="flex items-center gap-2 text-[11px] text-red-400 font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Abdul Bari & Striver Courses</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Notes + 4-Option Quizzes</span>
                </div>
              </div>
            </div>

            {/* Subject 2: Operating Systems */}
            <div className="p-5 rounded-3xl glass-cyber border border-blue-500/25 bg-[#0A1026]/90 space-y-3.5 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-28 w-full border border-blue-500/20 group-hover:border-cyan-400/40 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                    alt="Operating Systems"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/40 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    Systems
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Operating Systems
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Processes, threads, CPU scheduling, virtual memory, paging, and deadlock resolution algorithms.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-blue-500/20">
                <div className="flex items-center gap-2 text-[11px] text-red-400 font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Neso Academy Complete Series</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Step-by-Step AI Explanations</span>
                </div>
              </div>
            </div>

            {/* Subject 3: Database Management */}
            <div className="p-5 rounded-3xl glass-cyber border border-blue-500/25 bg-[#0A1026]/90 space-y-3.5 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-28 w-full border border-blue-500/20 group-hover:border-cyan-400/40 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80"
                    alt="Database Management Systems"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/40 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/30 text-cyan-300">
                    Data
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Database Management Systems
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Relational algebra, SQL, Normalization (1NF-BCNF), ACID properties, and indexing structures.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-blue-500/20">
                <div className="flex items-center gap-2 text-[11px] text-red-400 font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Gate Smashers DBMS Playlist</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant SQL Query Tutor</span>
                </div>
              </div>
            </div>

            {/* Subject 4: Computer Networks */}
            <div className="p-5 rounded-3xl glass-cyber border border-blue-500/25 bg-[#0A1026]/90 space-y-3.5 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-28 w-full border border-blue-500/20 group-hover:border-cyan-400/40 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
                    alt="Computer Networks"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026] via-[#0A1026]/40 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    Networking
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Computer Networks
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  OSI & TCP/IP stack, routing protocols, flow control, subnetting, and network security.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-blue-500/20">
                <div className="flex items-center gap-2 text-[11px] text-red-400 font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Kunal Kushwaha / Neso Academy</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Subnetting Calculation Tests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Features Grid */}
      <section id="features" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Next-Gen Study Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Built for Students Who Demand Excellence
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Hover over any card to experience responsive 3D perspective tilting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <CardTilt3D
                key={idx}
                glowColor={feat.glow}
                className="h-full"
              >
                <div className="h-full p-8 rounded-3xl glass-cyber border border-blue-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between group shadow-xl bg-[#0A1026]/90">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-300">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-blue-500/20 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    <span>Explore Module</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardTilt3D>
            );
          })}
        </div>
      </section>

      {/* Call-To-Action Banner */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl p-8 sm:p-14 glass-cyber border-2 border-blue-500/35 overflow-hidden text-center shadow-2xl bg-[#0A1026]/95">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-cyan-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Ready to Upgrade Your Learning Experience?
            </h2>
            <p className="text-sm text-slate-300">
              Join thousands of students studying faster with AI notes, custom quizzes, YouTube lectures, and personalized daily schedules.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Free Account</span>
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl font-bold text-sm glass-cyber hover:bg-blue-600/20 text-white border border-blue-500/30 transition-all"
              >
                Sign In with Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-blue-500/20 glass-cyber text-center text-xs text-slate-400 bg-[#050814]/90">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EduPulse AI. Next-Generation AI Study Assistance Platform.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Student Portal</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-cyan-400 transition-colors">Free Registration</Link>
            <span>•</span>
            <a href="#curriculum" className="hover:text-cyan-400 transition-colors">Courses & Lectures</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
