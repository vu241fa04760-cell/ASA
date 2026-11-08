import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';

const UserProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    gradeLevel: user?.gradeLevel || 'College / Undergraduate',
    major: user?.major || 'Computer Science',
    institution: user?.institution || 'University of Technology',
    dailyGoalMinutes: user?.learningPreferences?.dailyGoalMinutes || 60,
    preferredSubject: user?.learningPreferences?.preferredSubject || 'Computer Science',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        gradeLevel: user.gradeLevel || 'College / Undergraduate',
        major: user.major || 'Computer Science',
        institution: user.institution || 'University of Technology',
        dailyGoalMinutes: user.learningPreferences?.dailyGoalMinutes || 60,
        preferredSubject: user.learningPreferences?.preferredSubject || 'Computer Science',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const res = await authService.updateProfile({
        name: formData.name,
        bio: formData.bio,
        gradeLevel: formData.gradeLevel,
        major: formData.major,
        institution: formData.institution,
        learningPreferences: {
          dailyGoalMinutes: Number(formData.dailyGoalMinutes),
          preferredSubject: formData.preferredSubject,
        },
      });

      if (res.success && res.user) {
        updateUser(res.user);
        success('Profile updated successfully!');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toastError('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toastError('New password must be at least 6 characters.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
          Student Identity
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Student Profile & Identity
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Manage your personal credentials, university information, and account security
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-600 via-accent-500 to-cyber-cyan text-white flex items-center justify-center font-black text-3xl shadow-glow-electric flex-shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
            <h2 className="text-2xl font-black text-white">
              {user?.name}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary-950/80 border border-primary-500/30 text-cyber-cyan">
              {user?.gradeLevel || 'College / Undergraduate'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2 font-mono">
            {user?.email} • {user?.institution || 'University of Technology'}
          </p>
          <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
            {user?.bio || 'Passionate student mastering computer science and core academic concepts.'}
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-6">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyber-cyan" />
          <span>Academic & Personal Information</span>
        </h3>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Email Address (Primary Identity)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/20 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Academic Grade Level
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              >
                <option value="High School" className="bg-cyber-navy text-white">High School</option>
                <option value="College / Undergraduate" className="bg-cyber-navy text-white">College / Undergraduate</option>
                <option value="Graduate / Master" className="bg-cyber-navy text-white">Graduate / Master</option>
                <option value="Postgraduate / PhD" className="bg-cyber-navy text-white">Postgraduate / PhD</option>
                <option value="Lifelong Learner" className="bg-cyber-navy text-white">Lifelong Learner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Major / Degree Specialization
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Institution / University
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Daily Study Goal (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="360"
                value={formData.dailyGoalMinutes}
                onChange={(e) => setFormData({ ...formData, dailyGoalMinutes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Bio / Study Motivation
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric flex items-center gap-2"
            >
              {isUpdatingProfile ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-6">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-400" />
          <span>Security & Password Management</span>
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                New Password (min. 6 characters)
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-6 py-2.5 rounded-xl font-bold text-xs glass-cyber hover:bg-white/10 text-white border border-primary-500/30 flex items-center gap-2"
            >
              {isUpdatingPassword ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
