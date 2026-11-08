import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  AlertCircle,
  Filter,
  Check,
  CalendarCheck,
  Zap,
  Flame,
  Layers,
  Tv,
  Play,
} from 'lucide-react';
import plannerService from '../services/plannerService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import CardTilt3D from '../components/3d/CardTilt3D';
import { useSubjects } from '../context/SubjectContext';
import AddSubjectButton from '../components/common/AddSubjectButton';

const StudyPlannerPage = () => {
  const { subjects, getSubjectColor, openAddSubjectModal, getYoutubeLink, openVideoPlayer } = useSubjects();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDay, setSelectedDay] = useState(null);

  // Modal State for New / Edit Task
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Data Structures & Algorithms',
    description: '',
    targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedMinutes: 45,
    priority: 'medium',
  });

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const res = await plannerService.getTasks({
        status: statusFilter,
      });
      if (res.success) {
        setTasks(res.tasks);
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Could not fetch planner tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      subject: 'Data Structures & Algorithms',
      description: '',
      targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedMinutes: 45,
      priority: 'medium',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      subject: task.subject,
      description: task.description || '',
      targetDate: new Date(task.targetDate).toISOString().split('T')[0],
      estimatedMinutes: task.estimatedMinutes || 45,
      priority: task.priority || 'medium',
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Please enter a task title.');
      return;
    }

    try {
      if (editingTask) {
        const res = await plannerService.updateTask(editingTask._id, formData);
        if (res.success) {
          success('Study task updated!');
        }
      } else {
        const res = await plannerService.createTask(formData);
        if (res.success) {
          success('Study goal added to planner!');
        }
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save task.');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const res = await plannerService.toggleTaskStatus(id);
      if (res.success) {
        success(res.message);
        fetchTasks();
      }
    } catch (err) {
      toastError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this study goal?')) return;
    try {
      const res = await plannerService.deleteTask(id);
      if (res.success) {
        success('Task removed.');
        fetchTasks();
      }
    } catch (err) {
      toastError('Failed to delete task.');
    }
  };

  // Generate Current Week Calendar Days (Mon - Sun)
  const currentWeekDays = React.useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sun
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        dateStr: d.toISOString().split('T')[0],
        dayNum: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
      });
    }
    return days;
  }, []);

  const filteredTasks = selectedDay
    ? tasks.filter((t) => t.targetDate.startsWith(selectedDay))
    : tasks;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
            Adaptive Schedule
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Smart Study Planner
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Organize daily revision, prioritize upcoming exams, and maintain unbroken study momentum
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              const yt = getYoutubeLink(subjects[0]?.name || 'Data Structures & Algorithms');
              openVideoPlayer({
                url: yt.url,
                title: yt.title,
                subject: subjects[0]?.name,
                channel: yt.channel,
              });
            }}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold bg-red-600/15 hover:bg-red-600/30 border border-red-500/40 text-red-400 hover:text-white transition-all shadow-sm active:scale-95"
            title="Watch YouTube Lectures"
          >
            <Tv className="w-4 h-4 text-red-400" />
            <span>YouTube Lectures</span>
          </button>
          <AddSubjectButton
            variant="button"
            label="+ Add Subject"
            className="px-5 py-3 rounded-2xl font-bold text-xs"
          />
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Goal</span>
          </button>
        </div>
      </div>

      {/* Interactive Weekly Calendar Strip */}
      <div className="p-4 sm:p-6 rounded-3xl glass-cyber border border-primary-500/25 shadow-xl space-y-4 bg-white/95 dark:bg-[#0D1126]/95">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Calendar Schedule (Click to Filter by Day)
          </span>
          {selectedDay && (
            <button
              onClick={() => setSelectedDay(null)}
              className="text-xs text-cyber-cyan font-bold hover:underline"
            >
              Clear Day Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {currentWeekDays.map((d) => {
            const isSelected = selectedDay === d.dateStr;
            const tasksOnThisDay = tasks.filter((t) => t.targetDate.startsWith(d.dateStr));

            return (
              <div
                key={d.dateStr}
                onClick={() => setSelectedDay(isSelected ? null : d.dateStr)}
                className={`p-3 sm:p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyber-cyan bg-cyber-cyan/15 text-slate-900 dark:text-white shadow-glow-cyan'
                    : d.isToday
                    ? 'border-primary-500/50 bg-primary-950/40 text-slate-900 dark:text-white'
                    : 'glass-cyber border-primary-500/20 text-slate-700 dark:text-slate-200 hover:border-primary-500/40 hover:bg-black/5 dark:hover:bg-white/5 bg-white/90 dark:bg-[#0D1126]/90'
                }`}
              >
                <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">{d.dayName}</p>
                <p className="text-base sm:text-lg font-black my-1 text-slate-900 dark:text-white">{d.dayNum}</p>
                <div className="flex justify-center items-center gap-1">
                  {tasksOnThisDay.length > 0 ? (
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-cyber border border-primary-500/20 shadow-xl bg-white/95 dark:bg-[#0D1126]/90">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Goals</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 text-glow-cyan">{stats.total}</p>
        </div>
        <div className="p-5 rounded-3xl glass-cyber border border-primary-500/20 shadow-xl bg-white/95 dark:bg-[#0D1126]/90">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">Pending</p>
          <p className="text-3xl font-black text-amber-500 dark:text-amber-400 mt-1">{stats.pending}</p>
        </div>
        <div className="p-5 rounded-3xl glass-cyber border border-primary-500/20 shadow-xl bg-white/95 dark:bg-[#0D1126]/90">
          <p className="text-[10px] font-black uppercase tracking-wider text-cyber-cyan">In Progress</p>
          <p className="text-3xl font-black text-cyber-cyan mt-1">{stats.inProgress}</p>
        </div>
        <div className="p-5 rounded-3xl glass-cyber border border-primary-500/20 shadow-xl bg-white/95 dark:bg-[#0D1126]/90">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500 dark:text-emerald-400">Completed</p>
          <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400 mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: 'All Tasks', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Completed', value: 'completed' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === tab.value
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric'
                : 'glass-cyber border border-primary-500/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-cyber-navy/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <LoadingSpinner size="md" text="Loading study schedules..." />
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-3.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isPastDeadline =
              new Date(task.targetDate) < new Date() && !isCompleted;
            const badgeColor = getSubjectColor(task.subject);

            return (
              <CardTilt3D key={task._id} glowColor="rgba(34, 211, 238, 0.25)">
                <div
                  className={`p-5 rounded-3xl glass-cyber border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 dark:bg-[#0D1126]/90 ${
                    isCompleted
                      ? 'border-emerald-500/30 opacity-80'
                      : isPastDeadline
                      ? 'border-rose-500/40 shadow-glow-cyan'
                      : 'border-primary-500/20 shadow-xl'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTask(task._id)}
                      className={`w-7 h-7 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-glow-cyan'
                          : 'border-slate-400 dark:border-gray-500 hover:border-cyber-cyan'
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badgeColor}`}
                        >
                          {task.subject}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            task.priority === 'high'
                              ? 'border-rose-500/30 bg-rose-950/80 text-rose-400 font-bold'
                              : 'border-amber-500/30 bg-amber-950/80 text-amber-400 font-bold'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* YouTube Lecture Link Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const yt = getYoutubeLink(task.subject, task.title);
                            openVideoPlayer({
                              url: yt.url,
                              title: `${task.title} - ${task.subject} Video Lecture`,
                              subject: task.subject,
                              channel: yt.channel,
                            });
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600/10 hover:bg-red-600/25 border border-red-500/30 text-red-600 dark:text-red-400 hover:text-white transition-all ml-1"
                          title="Watch YouTube Lecture for this goal"
                        >
                          <Tv className="w-3 h-3 text-red-500 dark:text-red-400" />
                          <span>YouTube</span>
                        </button>
                      </div>

                      <h3
                        className={`text-base font-bold ${
                          isCompleted ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-normal">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pl-11 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-0 border-primary-500/15">
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                        <span>{new Date(task.targetDate).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent-500 dark:text-accent-400" />
                        <span>{task.estimatedMinutes}m</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardTilt3D>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl glass-cyber border border-primary-500/20">
          <CalendarCheck className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No study goals found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            All goals complete! Click "New Study Goal" above to schedule tasks for your upcoming exam.
          </p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingTask ? 'Edit Study Goal' : 'Add New Study Goal'}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Goal / Topic Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Master Tree Traversals (Inorder, Preorder, Postorder)"
                className="w-full px-4 py-2.5 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Subject
                  </label>
                  <AddSubjectButton
                    variant="link"
                    label="+ Add Subject"
                    onSubjectAdded={(newSub) => setFormData((prev) => ({ ...prev, subject: newSub }))}
                  />
                </div>
                <select
                  value={formData.subject}
                  onChange={(e) => {
                    if (e.target.value === '__ADD_NEW__') {
                      openAddSubjectModal((newSub) => setFormData((prev) => ({ ...prev, subject: newSub })));
                    } else {
                      setFormData({ ...formData, subject: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.name} value={s.name} className="bg-cyber-navy text-white">
                      {s.name}
                    </option>
                  ))}
                  <option value="__ADD_NEW__" className="bg-cyber-dark text-cyber-cyan font-bold">
                    + Add Custom Subject...
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                >
                  <option value="low" className="bg-cyber-navy text-white">Low</option>
                  <option value="medium" className="bg-cyber-navy text-white">Medium</option>
                  <option value="high" className="bg-cyber-navy text-white">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Target Deadline Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Estimated Minutes
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Description / Checklist Notes
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Solve 3 LeetCode problems and write revision summary"
                className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudyPlannerPage;
