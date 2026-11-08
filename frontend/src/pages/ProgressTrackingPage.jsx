import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Flame,
  BookOpen,
  HelpCircle,
  Zap,
  Target,
  Trophy,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import progressService from '../services/progressService';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CardTilt3D from '../components/3d/CardTilt3D';
import AddSubjectButton from '../components/common/AddSubjectButton';

const ProgressTrackingPage = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressService.getDashboardData();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Failed to load progress data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Compiling quantum analytics..." />;
  }

  const stats = data?.stats || {
    totalStudyHours: '8.5',
    completedTopicsCount: 14,
    averageQuizScore: 92,
    quizzesTaken: 6,
    streakDays: 5,
  };

  const weeklyActivity = (data?.weeklyActivity || [
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

  const subjectProgress = data?.subjectProgress || [
    { subject: 'Data Structures & Algorithms', completionPercent: 82, notesCount: 5, quizzesCount: 3 },
    { subject: 'Operating Systems', completionPercent: 60, notesCount: 3, quizzesCount: 2 },
    { subject: 'Machine Learning & AI', completionPercent: 50, notesCount: 2, quizzesCount: 1 },
    { subject: 'Database Management', completionPercent: 55, notesCount: 3, quizzesCount: 2 },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
          Telemetric Diagnostics
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Learning Progress & Analytics
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Detailed metrics tracking your study consistency, quiz scores, and subject milestones
        </p>
      </div>

      {/* Top 4 Performance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardTilt3D glowColor="rgba(99, 102, 241, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-primary-500/25 h-full flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Hours</span>
              <Clock className="w-5 h-5 text-cyber-cyan" />
            </div>
            <p className="text-4xl font-black text-white mt-2 text-glow-cyan">
              {stats.totalStudyHours} <span className="text-xs font-bold text-gray-400">hrs</span>
            </p>
            <p className="text-xs text-cyber-cyan font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Optimal Learning Velocity</span>
            </p>
          </div>
        </CardTilt3D>

        <CardTilt3D glowColor="rgba(168, 85, 247, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-primary-500/25 h-full flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Average Score</span>
              <Award className="w-5 h-5 text-accent-400" />
            </div>
            <p className="text-4xl font-black text-white mt-2 text-glow-neon">
              {stats.averageQuizScore}%
            </p>
            <p className="text-xs text-accent-400 font-bold mt-2">
              Across {stats.quizzesTaken} test attempts
            </p>
          </div>
        </CardTilt3D>

        <CardTilt3D glowColor="rgba(34, 211, 238, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-primary-500/25 h-full flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Topics Mastered</span>
              <BookOpen className="w-5 h-5 text-cyber-cyan" />
            </div>
            <p className="text-4xl font-black text-white mt-2 text-glow-cyan">
              {stats.completedTopicsCount}
            </p>
            <p className="text-xs text-cyber-cyan font-bold mt-2">
              Synthesized notes & tests
            </p>
          </div>
        </CardTilt3D>

        <CardTilt3D glowColor="rgba(245, 158, 11, 0.4)">
          <div className="p-6 rounded-3xl glass-cyber border border-primary-500/25 h-full flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Streak</span>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-4xl font-black text-white mt-2 text-amber-400">
              {stats.streakDays} <span className="text-xs font-bold text-gray-400">Days</span>
            </p>
            <p className="text-xs text-amber-400 font-bold mt-2">
              Consistency level: Elite
            </p>
          </div>
        </CardTilt3D>
      </div>

      {/* Visual Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Minutes Bar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
              Daily Volume
            </span>
            <h3 className="text-base font-black text-white mt-0.5">
              Daily Study Minutes (Weekly Trend)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.15)" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1126',
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="minutes" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completed Goals Trend Line Chart */}
        <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Task Velocity
            </span>
            <h3 className="text-base font-black text-white mt-0.5">
              Goals Completed Per Day
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.15)" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1126',
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-400">
              Competency Matrix
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Subject Mastery Breakdown
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Calculated across notes generated, study focus time, and quiz attempts
            </p>
          </div>
          <AddSubjectButton variant="pill" label="+ Add Subject" />
        </div>

        <div className="space-y-6">
          {subjectProgress.map((sub, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white font-bold">{sub.subject}</span>
                <span className="text-cyber-cyan font-bold">
                  {sub.completionPercent}% Mastery
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-cyber-navy border border-primary-500/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 via-accent-500 to-cyber-cyan rounded-full transition-all duration-700 shadow-glow-cyan"
                  style={{ width: `${Math.min(100, sub.completionPercent)}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-400 font-mono">
                <span>{sub.notesCount || 2} notes synthesized</span>
                <span>• {sub.quizzesCount || 1} quizzes taken</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Milestones */}
      <div className="p-6 sm:p-10 rounded-3xl glass-cyber border border-primary-500/30 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
            Student Milestones
          </span>
          <h3 className="text-xl font-black text-white mt-0.5">Unlocked Study Badges</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-cyber border border-amber-500/30 text-center shadow-glow-neon">
            <Flame className="w-8 h-8 text-amber-400 mx-auto mb-2 fill-amber-400 animate-bounce" />
            <p className="text-xs font-bold text-white">5-Day Flame</p>
            <p className="text-[10px] text-amber-300 mt-0.5">Continuous study</p>
          </div>
          <div className="p-5 rounded-2xl glass-cyber border border-cyber-cyan/30 text-center shadow-glow-cyan">
            <Trophy className="w-8 h-8 text-cyber-cyan mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Quiz Prodigy</p>
            <p className="text-[10px] text-cyan-300 mt-0.5">90%+ avg score</p>
          </div>
          <div className="p-5 rounded-2xl glass-cyber border border-primary-500/30 text-center">
            <BookOpen className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Note Scholar</p>
            <p className="text-[10px] text-primary-300 mt-0.5">5+ guides saved</p>
          </div>
          <div className="p-5 rounded-2xl glass-cyber border border-accent-500/30 text-center">
            <Zap className="w-8 h-8 text-accent-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">AI Power User</p>
            <p className="text-[10px] text-accent-300 mt-0.5">Copilot chats & Q&A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingPage;
