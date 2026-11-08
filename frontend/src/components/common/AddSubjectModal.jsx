import React, { useState } from 'react';
import { BookPlus, Sparkles, X, Plus, Check, Trash2, Tag, Tv, Play } from 'lucide-react';
import { useSubjects, COLOR_PALETTES } from '../../context/SubjectContext';
import { useToast } from '../../context/ToastContext';

const QUICK_SUGGESTIONS = [
  'Software Engineering',
  'Cybersecurity',
  'Discrete Mathematics',
  'Neuroscience',
  'World History',
  'Organic Chemistry',
  'Statistics & Probability',
  'Microeconomics',
  'Quantum Computing',
  'Bioinformatics',
];

const AddSubjectModal = () => {
  const {
    isModalOpen,
    closeAddSubjectModal,
    addSubject,
    customSubjects,
    removeCustomSubject,
    modalCallback,
    openVideoPlayer,
  } = useSubjects();

  const { success, error: toastError } = useToast();

  const [subjectName, setSubjectName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('cyan');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setErrorMsg('Please enter a subject name.');
      return;
    }

    const res = addSubject({ name: subjectName, colorId: selectedColor, youtubeUrl });
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    success(`Subject "${res.subject.name}" added to curriculum!`);

    // If caller provided a callback, notify it with new subject name
    if (typeof modalCallback === 'function') {
      modalCallback(res.subject.name);
    }

    setSubjectName('');
    setYoutubeUrl('');
    setErrorMsg('');
    closeAddSubjectModal();
  };

  const handleSelectSuggestion = (suggestion) => {
    setSubjectName(suggestion);
    setErrorMsg('');
  };

  const activePalette = COLOR_PALETTES.find((p) => p.id === selectedColor) || COLOR_PALETTES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl glass-cyber border border-primary-500/30 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-white animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyber-cyan to-accent-500" />

        {/* Close Button */}
        <button
          onClick={closeAddSubjectModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 via-accent-500 to-cyber-cyan flex items-center justify-center text-white shadow-glow-electric">
            <BookPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Add New Subject</h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                Custom
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              Add a specialized subject to notes, quizzes, planner, and AI tutor
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-200 mb-1.5">
              Subject Name *
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. Software Architecture & Design Patterns"
                className="w-full px-4 py-3 rounded-2xl glass-cyber border border-primary-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/30 transition-all"
                maxLength={50}
              />
            </div>
          </div>

          {/* YouTube Link Input (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-200 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span>YouTube Lecture / Playlist Link</span>
              </label>
              <span className="text-[10px] text-gray-400">Optional • auto-generates if empty</span>
            </div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=... or playlist link"
              className="w-full px-4 py-2.5 rounded-2xl glass-cyber border border-primary-500/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-200 mb-1.5">
              Theme Accent
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = selectedColor === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setSelectedColor(palette.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? `${palette.class} ring-2 ring-cyber-cyan shadow-glow-cyan`
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${palette.dot}`} />
                    <span>{palette.label.split(' ')[1]}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Popular Academic Presets:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="text-[11px] px-2.5 py-1 rounded-lg glass-cyber border border-primary-500/20 text-gray-300 hover:text-white hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Pill */}
          <div className="p-3 rounded-2xl bg-cyber-dark/60 border border-primary-500/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Live Badge Preview
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold">
              <span className={`w-2 h-2 rounded-full ${activePalette.dot}`} />
              <span className={activePalette.class}>
                {subjectName.trim() || 'Your Subject Name'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeAddSubjectModal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-primary-600 via-accent-600 to-cyber-cyan text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>
        </form>

        {/* List of Custom Subjects (if any) */}
        {customSubjects.length > 0 && (
          <div className="mt-6 pt-5 border-t border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Your Custom Subjects ({customSubjects.length})</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
              {customSubjects.map((sub) => (
                <div
                  key={sub.name}
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-medium ${sub.color}`}
                >
                  <span>{sub.name}</span>
                  {sub.youtubeUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        openVideoPlayer({
                          url: sub.youtubeUrl,
                          title: sub.youtubeTitle,
                          subject: sub.name,
                          channel: sub.channel,
                        })
                      }
                      className="text-red-400 hover:text-red-300 transition-colors p-0.5 rounded-md hover:bg-red-500/10"
                      title="Watch YouTube Lecture"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      removeCustomSubject(sub.name);
                      success(`Removed "${sub.name}".`);
                    }}
                    className="text-gray-400 hover:text-rose-400 transition-colors p-0.5 rounded-md hover:bg-rose-500/10"
                    title="Delete custom subject"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSubjectModal;
