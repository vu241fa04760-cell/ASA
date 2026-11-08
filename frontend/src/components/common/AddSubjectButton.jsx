import React from 'react';
import { Plus, BookPlus } from 'lucide-react';
import { useSubjects } from '../../context/SubjectContext';

const AddSubjectButton = ({
  onSubjectAdded,
  variant = 'pill', // 'pill' | 'button' | 'icon' | 'link'
  className = '',
  label = 'Add Subject',
}) => {
  const { openAddSubjectModal } = useSubjects();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAddSubjectModal(onSubjectAdded);
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold glass-cyber border border-cyber-cyan/40 text-cyber-cyan hover:text-white hover:border-cyber-cyan hover:bg-cyber-cyan/15 shadow-sm transition-all flex items-center gap-1.5 active:scale-95 ${className}`}
        title="Add a new custom subject"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-xl glass-cyber border border-primary-500/30 text-cyber-cyan hover:text-white hover:border-cyber-cyan hover:bg-cyber-cyan/20 transition-all ${className}`}
        title="Add Subject"
        aria-label="Add Subject"
      >
        <Plus className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 text-[11px] font-bold text-cyber-cyan hover:text-white hover:underline transition-colors ${className}`}
      >
        <Plus className="w-3 h-3" />
        <span>{label}</span>
      </button>
    );
  }

  // Default 'pill' variant
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan hover:text-white transition-all shadow-sm active:scale-95 ${className}`}
      title="Add a custom subject to your curriculum"
    >
      <BookPlus className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export default AddSubjectButton;
