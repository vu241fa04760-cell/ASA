import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Flame,
  ArrowRight,
  Plus,
  Sparkles,
  MessageSquare,
  FileText,
  Calendar,
  AlertCircle,
  Zap,
  Target,
  BrainCircuit,
  Compass,
  Tv,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import progressService from '../services/progressService';
import plannerService from '../services/plannerService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CardTilt3D from '../components/3d/CardTilt3D';
import AddSubjectButton from '../components/common/AddSubjectButton';
import { useSubjects } from '../context/SubjectContext';

const COLORS = ['#2563EB', '#06B6D4', '#38BDF8', '#60A5FA', '#0284C7'];

const DashboardPage = () => {
  const { user } = useAuth();
  const { getYoutubeLink, openVideoPlayer } = useSubjects();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const data = await progressService.getDashboardData();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.warn('Failed to load dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      await plannerService.toggleTaskStatus(taskId);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Initialising 3D Neural Study Copilot..." />;
  }

  const stats = dashboardData?.stats || {
    totalStudyHours: '8.5',
    completedTopicsCount: 14,
    pendingTasksCount: 3,
    averageQuizScore: 92,
    streakDays: 5,
  };

  const weeklyActivity = (dashboardData?.weeklyActivity || [
    { day: 'Mon', minutes: 45, tasksCompleted: 2 },
    { day: 'Tue', minutes: 60, tasksCompleted: 3 },
    { day: 'Wed', minutes: 30, tasksCompleted: 1 },
    { day: 'Thu', minutes: 90, tasksCompleted: 4 },
    { day: 'Fri', minutes: 75, tasksCompleted: 2 },
    { day: 'Sat', minutes: 40, tasksCompleted: 1 },
    { day: 'Sun', minutes: 60, tasksCompleted: 2 },
  ]).map((w) => ({
    name: w.day,
    minutes: w.minutes,
    tasks: w.tasksCompleted || 2,
  }));

  const subjectProgress = (dashboardData?.subjectProgress || [
    { subject: 'Data Structures & Algorithms', completionPercent: 82 },
    { subject: 'Operating Systems', completionPercent: 60 },
    { subject: 'Machine Learning & AI', completionPercent: 50 },
    { subject: 'Database Management', completionPercent: 55 },
  ]).map((s) => ({
    name: s.subject,
    value: s.completionPercent || 40,
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 3D Holographic Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-cyber border border-primary-500/25 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyber-cyan/15 via-accent-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold glass-cyber border border-amber-500/30 text-amber-300 shadow-glow-neon">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
              <span>{stats.streakDays || 5}-Day Active Learning Streak</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                {user?.name ? user.name.split(' ')[0] : 'Scholar'}
              </span>{' '}
              ⚡
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Your neural copilot is ready. You have{' '}
              <span className="text-cyan-400 font-bold">{stats.pendingTasksCount} study goals</span>{' '}
              scheduled and an average quiz mastery of{' '}
              <span className="text-blue-400 font-bold">{stats.averageQuizScore}%</span>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/chat"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch AI Tutor</span>
              </Link>
              <Link
                to="/notes"
                className="px-5 py-2.5 rounded-xl font-bold text-xs glass-cyber hover:bg-blue-600/20 text-white border border-blue-500/30 hover:border-cyan-400 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Generate Notes</span>
              </Link>
              <Link
                to="/quiz"
                className="px-5 py-2.5 rounded-xl font-bold text-xs glass-cyber hover:bg-blue-600/20 text-white border border-blue-500/30 hover:border-cyan-400 transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Practice Quiz</span>
              </Link>
            </div>
          </div>

          {/* AI Neural Copilot Status Hub (Replaces rotating 3D avatar) */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3">
            <div className="p-4 rounded-2xl glass-cyber border border-blue-500/25 bg-[#0A1026]/90 shadow-xl min-w-[220px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Copilot</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Active & Connected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-cyber border border-blue-500/25 bg-[#0A1026]/90 shadow-xl min-w-[220px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-blue-400 shadow-glow-electric">
                  <Zap className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Study Velocity</p>
                  <p className="text-xs font-bold text-cyan-300 mt-0.5">
                    {stats.completedTopicsCount} / {stats.completedTopicsCount + (stats.pendingTasksCount || 1)} Modules Cleared
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Animated 3D Tilting Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Study Hours */}
        <CardTilt3D glowColor="rgba(37, 99, 235, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-blue-500/25 h-full flex flex-col justify-between shadow-xl bg-[#0A1026]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Total Study Hours
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-white text-glow-cyan">
                {stats.totalStudyHours}
              </span>
              <span className="text-xs font-bold text-slate-400 ml-1.5">hours</span>
            </div>
            <p className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Optimal Learning Velocity</span>
            </p>
          </div>
        </CardTilt3D>

        {/* Completed Topics */}
        <CardTilt3D glowColor="rgba(6, 182, 212, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-blue-500/25 h-full flex flex-col justify-between shadow-xl bg-[#0A1026]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Completed Topics
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shadow-glow-cyan">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-white text-glow-electric">
                {stats.completedTopicsCount}
              </span>
              <span className="text-xs font-bold text-slate-400 ml-1.5">mastered</span>
            </div>
            <p className="text-xs text-sky-400 font-bold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>{stats.notesCount || 6} Guides Saved</span>
            </p>
          </div>
        </CardTilt3D>

        {/* Quiz Performance */}
        <CardTilt3D glowColor="rgba(56, 189, 248, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-blue-500/25 h-full flex flex-col justify-between shadow-xl bg-[#0A1026]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Quiz Performance
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <HelpCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-white text-glow-cyan">
                {stats.averageQuizScore}%
              </span>
              <span className="text-xs font-bold text-emerald-400 ml-1.5">Mastery</span>
            </div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.quizzesTaken || 5} Practice Tests Completed</span>
            </p>
          </div>
        </CardTilt3D>

        {/* Learning Progress / Pending Tasks */}
        <CardTilt3D glowColor="rgba(37, 99, 235, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-blue-500/25 h-full flex flex-col justify-between shadow-xl bg-[#0A1026]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Learning Progress
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-white">
                {stats.pendingTasksCount}
              </span>
              <span className="text-xs font-bold text-slate-400 ml-1.5">pending tasks</span>
            </div>
            <p className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{stats.completedTasksCount || 4} tasks done this week</span>
            </p>
          </div>
        </CardTilt3D>
      </div>

      {/* Interactive Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Minutes Recharts Area Chart */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl space-y-6 bg-[#0A1026]/90">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Study Velocity
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Weekly Study Time & Focus Duration
              </h2>
            </div>
            <Link
              to="/progress"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.15)" />
                <XAxis dataKey="name" stroke="#93C5FD" tick={{ fontSize: 11 }} />
                <YAxis stroke="#93C5FD" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1026',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMinutes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Mastery Doughnut Chart */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl flex flex-col justify-between space-y-4 bg-[#0A1026]/90">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Curriculum Scope
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Subject Mastery
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const topSubject = subjectProgress[0]?.name || 'Data Structures & Algorithms';
                  const yt = getYoutubeLink(topSubject);
                  openVideoPlayer({
                    url: yt.url,
                    title: yt.title,
                    subject: topSubject,
                    channel: yt.channel,
                  });
                }}
                className="p-1.5 rounded-xl glass-cyber border border-red-500/40 text-red-400 hover:text-white hover:bg-red-600/20 transition-all flex items-center gap-1 text-[11px] font-bold"
                title="Watch YouTube lectures"
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Lectures</span>
              </button>
              <AddSubjectButton variant="pill" label="+ Add Subject" />
            </div>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectProgress}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1026',
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-blue-500/20">
            {subjectProgress.slice(0, 3).map((sub, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300 truncate font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="truncate">{sub.name}</span>
                </span>
                <span className="font-bold text-white">{sub.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Study Recommendations & Upcoming Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Tasks with 1-click Toggle */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl space-y-5 bg-[#0A1026]/90">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                Action Items
              </span>
              <h2 className="text-lg font-black text-white">Upcoming Deadlines & Goals</h2>
            </div>
            <Link
              to="/planner"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage All</span>
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData?.upcomingTasks && dashboardData.upcomingTasks.length > 0 ? (
              dashboardData.upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 rounded-2xl glass-cyber border border-blue-500/20 hover:border-cyan-400/40 transition-all group bg-[#050814]/80"
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => handleToggleTask(task._id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        task.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-glow-cyan'
                          : 'border-slate-500 hover:border-cyan-400'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          task.status === 'completed'
                            ? 'line-through text-slate-500'
                            : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-cyan-400 font-medium">{task.subject}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      task.priority === 'high'
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30 font-bold'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-500/30 font-bold'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 font-medium">
                No pending tasks right now. Create one in Study Planner!
              </p>
            )}
          </div>
        </div>

        {/* AI Study Recommendations */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl glass-cyber border border-blue-500/25 shadow-2xl space-y-5 bg-[#0A1026]/90">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              Adaptive Intelligence
            </span>
            <h2 className="text-lg font-black text-white">AI Study Recommendations</h2>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl glass-cyber border border-blue-500/20 bg-gradient-to-r from-blue-950/40 to-[#0A1026]/80 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow-cyan">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white">
                  Reinforce Balanced BSTs (AVL Rotations)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-normal">
                  Your last quiz showed high recall on trees, but review LL and RL rotation invariants to guarantee a 100% exam score.
                </p>
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 mt-2 hover:underline"
                >
                  <span>Review Notes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-cyber border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-[#0A1026]/80 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow-cyan">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white">
                  Practice Dijkstra vs A* Search Quiz
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Test your grasp of heuristics, admissibility, and shortest-path tree bounds with an instant 5-question multiple choice test.
                </p>
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 mt-2 hover:underline"
                >
                  <span>Start Practice Quiz</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
