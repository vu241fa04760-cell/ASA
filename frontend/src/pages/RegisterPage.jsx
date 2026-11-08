import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Building2, UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gradeLevel: 'College / Undergraduate',
    major: 'Computer Science & Engineering',
    institution: 'University of Technology',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const res = await register(formData);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="glass-cyber border border-blue-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-slide-up max-w-lg mx-auto text-white">
      {/* Decorative Top Glow Bar in Dark & Blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500" />

      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/30 border border-cyan-400/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Student Registration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
          Create Student Account
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Join thousands of students studying faster with 3D AI workflows
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jordan Lee"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
            Password * (min. 6 characters)
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
              Grade Level
            </label>
            <div className="relative">
              <GraduationCap className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#0A1026] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm appearance-none font-medium"
              >
                <option value="High School" className="bg-[#050814] text-white">High School</option>
                <option value="College / Undergraduate" className="bg-[#050814] text-white">College / Undergraduate</option>
                <option value="Graduate / Master" className="bg-[#050814] text-white">Graduate / Master</option>
                <option value="Postgraduate / PhD" className="bg-[#050814] text-white">Postgraduate / PhD</option>
                <option value="Lifelong Learner" className="bg-[#050814] text-white">Lifelong Learner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
              Major / Subject
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full px-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
            Institution / College
          </label>
          <div className="relative">
            <Building2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g. Stanford / MIT / State University"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#0A1026]/90 text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-glow-electric transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-300">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-cyber-cyan hover:text-white hover:underline transition-colors ml-1"
        >
          Sign In Here
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
