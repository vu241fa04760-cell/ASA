import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getYouTubeEmbedUrl,
  getYouTubeExternalUrl,
  getYouTubeThumbnail,
  getYouTubeSearchUrl,
  isYouTubeUrl,
} from '../utils/youtubeUtils';

const SubjectContext = createContext(null);

export const DEFAULT_SUBJECTS = [
  {
    name: 'Data Structures & Algorithms',
    color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/40',
    badge: 'indigo',
    youtubeUrl: 'https://www.youtube.com/watch?v=RBSGKlAnoiM',
    youtubeTitle: 'Data Structures and Algorithms Full Course for Beginners',
    channel: 'freeCodeCamp.org',
  },
  {
    name: 'Operating Systems',
    color: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
    badge: 'purple',
    youtubeUrl: 'https://www.youtube.com/watch?v=26QPDBe-NB8',
    youtubeTitle: 'Introduction to Operating Systems (Complete University Series)',
    channel: 'Neso Academy',
  },
  {
    name: 'Database Management Systems',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
    badge: 'cyan',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    youtubeTitle: 'SQL & Relational Database Design Full Course',
    channel: 'freeCodeCamp.org',
  },
  {
    name: 'Machine Learning & AI',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
    badge: 'emerald',
    youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    youtubeTitle: 'Neural Networks & Deep Learning Visual Intuition',
    channel: '3Blue1Brown',
  },
  {
    name: 'Computer Networks',
    color: 'border-blue-500/40 text-blue-400 bg-blue-950/40',
    badge: 'blue',
    youtubeUrl: 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
    youtubeTitle: 'Computer Networking Complete Course (OSI, TCP/IP, DNS)',
    channel: 'NetworkChuck',
  },
  {
    name: 'Mathematics & Calculus',
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    badge: 'amber',
    youtubeUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    youtubeTitle: 'The Essence of Calculus (Full Visual Guide)',
    channel: '3Blue1Brown',
  },
  {
    name: 'Physics',
    color: 'border-rose-500/40 text-rose-400 bg-rose-950/40',
    badge: 'rose',
    youtubeUrl: 'https://www.youtube.com/watch?v=7uV8h5-s2sU',
    youtubeTitle: 'Classical Mechanics & Core Physics Masterclass',
    channel: 'MIT OpenCourseWare (Walter Lewin)',
  },
  {
    name: 'Chemistry',
    color: 'border-teal-500/40 text-teal-400 bg-teal-950/40',
    badge: 'teal',
    youtubeUrl: 'https://www.youtube.com/watch?v=FSyAehMdpyI',
    youtubeTitle: 'General Chemistry - Atomic Structure & Periodic Table',
    channel: 'CrashCourse',
  },
  {
    name: 'Biology',
    color: 'border-lime-500/40 text-lime-400 bg-lime-950/40',
    badge: 'lime',
    youtubeUrl: 'https://www.youtube.com/watch?v=QnQe0xW_JY4',
    youtubeTitle: 'Introduction to Biology: Cellular Mechanics & Genetics',
    channel: 'CrashCourse',
  },
  {
    name: 'General Study',
    color: 'border-gray-500/40 text-gray-400 bg-gray-950/40',
    badge: 'gray',
    youtubeUrl: 'https://www.youtube.com/watch?v=ukLnPbIffxE',
    youtubeTitle: 'How to Study & Learn Faster (Evidence-Based Revision Techniques)',
    channel: 'Ali Abdaal',
  },
];

export const COLOR_PALETTES = [
  { id: 'cyan', label: 'Cyber Cyan', class: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40', dot: 'bg-cyan-400' },
  { id: 'purple', label: 'Neon Purple', class: 'border-purple-500/40 text-purple-400 bg-purple-950/40', dot: 'bg-purple-400' },
  { id: 'indigo', label: 'Electric Indigo', class: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/40', dot: 'bg-indigo-400' },
  { id: 'emerald', label: 'Matrix Emerald', class: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40', dot: 'bg-emerald-400' },
  { id: 'amber', label: 'Solar Amber', class: 'border-amber-500/40 text-amber-400 bg-amber-950/40', dot: 'bg-amber-400' },
  { id: 'rose', label: 'Hyper Rose', class: 'border-rose-500/40 text-rose-400 bg-rose-950/40', dot: 'bg-rose-400' },
];

const STORAGE_KEY = 'edupulse_custom_subjects_v1';

export const SubjectProvider = ({ children }) => {
  const [customSubjects, setCustomSubjects] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to load custom subjects from localStorage:', e);
      return [];
    }
  });

  // Modal control state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState(null);

  // Global Video Player Modal State
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customSubjects));
    } catch (e) {
      console.warn('Failed to save custom subjects to localStorage:', e);
    }
  }, [customSubjects]);

  // Combined subject list
  const allSubjects = [
    ...DEFAULT_SUBJECTS,
    ...customSubjects,
  ];

  // Subject string names array (for simple dropdowns)
  const subjectNames = allSubjects.map((s) => s.name);

  const addSubject = ({ name, colorId = 'cyan', youtubeUrl = '' }) => {
    const trimmed = name?.trim();
    if (!trimmed) {
      return { success: false, message: 'Subject name cannot be empty.' };
    }

    if (trimmed.length > 50) {
      return { success: false, message: 'Subject name must be under 50 characters.' };
    }

    // Duplicate check
    const exists = allSubjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      return { success: false, message: `"${trimmed}" already exists in your subjects list.` };
    }

    const palette = COLOR_PALETTES.find((p) => p.id === colorId) || COLOR_PALETTES[0];
    const cleanUrl = youtubeUrl?.trim();
    if (cleanUrl && !isYouTubeUrl(cleanUrl)) {
      return { success: false, message: 'Please enter a valid YouTube video, playlist, or search link.' };
    }
    const newSub = {
      name: trimmed,
      color: palette.class,
      badge: palette.id,
      isCustom: true,
      youtubeUrl: cleanUrl || getYouTubeSearchUrl(`${trimmed} tutorial course`),
      youtubeTitle: `${trimmed} Masterclass Lecture`,
      channel: cleanUrl ? 'Curated Resource' : 'YouTube Educational Search',
      createdAt: new Date().toISOString(),
    };

    setCustomSubjects((prev) => [...prev, newSub]);

    return { success: true, subject: newSub };
  };

  const removeCustomSubject = (name) => {
    setCustomSubjects((prev) => prev.filter((s) => s.name.toLowerCase() !== name.toLowerCase()));
  };

  const getSubjectColor = (subjectName) => {
    const found = allSubjects.find((s) => s.name.toLowerCase() === subjectName?.toLowerCase());
    return found ? found.color : 'border-primary-500/40 text-primary-300 bg-primary-950/40';
  };

  const getSubjectInfo = (subjectName) => {
    const found = allSubjects.find((s) => s.name.toLowerCase() === subjectName?.toLowerCase());
    if (found) return found;
    return {
      name: subjectName,
      color: 'border-primary-500/40 text-primary-300 bg-primary-950/40',
      youtubeUrl: getYouTubeSearchUrl(`${subjectName} tutorial lecture`),
      youtubeTitle: `${subjectName} Lecture Series`,
      channel: 'YouTube Learning',
    };
  };

  const getYoutubeLink = (subjectName, topic = '') => {
    const subInfo = getSubjectInfo(subjectName);
    if (topic && topic.trim()) {
      return {
        url: getYouTubeSearchUrl(`${subjectName} ${topic} tutorial`),
        title: `${topic} - ${subjectName} Video Tutorial`,
        channel: 'YouTube Video Search',
        thumbnail: getYouTubeThumbnail(subInfo.youtubeUrl),
      };
    }
    return {
      url: subInfo.youtubeUrl,
      title: subInfo.youtubeTitle || `${subjectName} Lectures`,
      channel: subInfo.channel || 'Curated Lecture',
      thumbnail: getYouTubeThumbnail(subInfo.youtubeUrl),
    };
  };

  const openAddSubjectModal = (onAddedCallback) => {
    setModalCallback(() => onAddedCallback || null);
    setIsModalOpen(true);
  };

  const closeAddSubjectModal = () => {
    setIsModalOpen(false);
    setModalCallback(null);
  };

  const openVideoPlayer = ({ url, title, subject, channel }) => {
    const searchQuery = `${subject || ''} ${title || ''}`.trim() || 'educational videos';
    setActiveVideo({
      url: getYouTubeExternalUrl(url, searchQuery),
      embedUrl: getYouTubeEmbedUrl(url),
      title: title || `${subject || 'Subject'} Video Lecture`,
      subject: subject || 'Curriculum',
      channel: channel || 'YouTube',
    });
  };

  const closeVideoPlayer = () => {
    setActiveVideo(null);
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects: allSubjects,
        subjectNames,
        customSubjects,
        addSubject,
        removeCustomSubject,
        getSubjectColor,
        getSubjectInfo,
        getYoutubeLink,
        isModalOpen,
        openAddSubjectModal,
        closeAddSubjectModal,
        modalCallback,
        activeVideo,
        openVideoPlayer,
        closeVideoPlayer,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubjects must be used within a SubjectProvider');
  }
  return context;
};
