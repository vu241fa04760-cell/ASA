import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Pin,
  Trash2,
  Edit3,
  Copy,
  Check,
  Search,
  Plus,
  Save,
  Lightbulb,
  FileDown,
  FileText,
  Layers,
  Tv,
  Play,
  Square,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Document, HeadingLevel, Packer, Paragraph } from 'docx';
import notesService from '../services/notesService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import CardTilt3D from '../components/3d/CardTilt3D';
import FloatingStudyObjectsScene from '../components/3d/FloatingStudyObjectsScene';
import { useSubjects } from '../context/SubjectContext';
import AddSubjectButton from '../components/common/AddSubjectButton';

const NotesGeneratorPage = () => {
  const { subjectNames: subjects, openAddSubjectModal, getYoutubeLink, openVideoPlayer } = useSubjects();
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(subjects[0] || 'Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStage, setStreamStage] = useState('');
  const [generatedNote, setGeneratedNote] = useState(null);

  // Saved Notes State
  const [savedNotes, setSavedNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  // Edit Note Modal State
  const [editingNote, setEditingNote] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const previewCardRef = useRef(null);
  const abortStreamRef = useRef(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchSavedNotes();
  }, [filterSubject, searchQuery]);

  const fetchSavedNotes = async () => {
    try {
      const res = await notesService.getNotes({
        subject: filterSubject,
        search: searchQuery,
      });
      if (res.success) {
        setSavedNotes(res.notes || []);
      }
    } catch (err) {
      console.warn('Failed to load saved notes:', err.message);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleStopGenerating = () => {
    abortStreamRef.current = true;
    setIsStreaming(false);
    setIsGenerating(false);
    setGeneratedNote((prev) => (prev ? { ...prev, isStreaming: false } : null));
    success('Note synthesis paused.');
  };

  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    abortStreamRef.current = false;
    setIsGenerating(true);
    setIsStreaming(true);
    setStreamStage('Connecting Neural Notes Generator...');

    // Initialize real-time streaming preview
    setGeneratedNote({
      title: `Mastery Notes: ${topic}`,
      summary: '',
      keyPoints: [],
      detailedExplanation: '',
      practicalExamples: [],
      isStreaming: true,
    });

    // Auto-scroll to preview card smoothly
    setTimeout(() => {
      previewCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    try {
      const res = await notesService.generateNotes({
        topic,
        subject,
        difficulty,
        saveDirectly: false,
      });

      if (res.success && res.data) {
        const full = res.data;

        // Stage 1: Stream Executive Summary word-by-word
        setStreamStage('Synthesizing Executive Summary...');
        const summaryWords = (full.summary || '').split(' ');
        let currentSummary = '';
        for (let i = 0; i < summaryWords.length; i++) {
          if (abortStreamRef.current) break;
          currentSummary += (i === 0 ? '' : ' ') + summaryWords[i];
          setGeneratedNote((prev) => ({
            ...prev,
            summary: currentSummary,
          }));
          await new Promise((r) => setTimeout(r, 18));
        }

        // Stage 2: Stream Key Points one-by-one
        setStreamStage('Extracting High-Yield Key Points...');
        const points = full.keyPoints || [];
        const currentPoints = [];
        for (let i = 0; i < points.length; i++) {
          if (abortStreamRef.current) break;
          currentPoints.push(points[i]);
          setGeneratedNote((prev) => ({
            ...prev,
            keyPoints: [...currentPoints],
          }));
          await new Promise((r) => setTimeout(r, 120));
        }

        // Stage 3: Stream Detailed Explanation in natural chunk cadence
        setStreamStage('Compiling Comprehensive Academic Breakdown...');
        const detailWords = (full.detailedExplanation || '').split(' ');
        let currentDetail = '';
        for (let i = 0; i < detailWords.length; i += 2) {
          if (abortStreamRef.current) break;
          currentDetail += (i === 0 ? '' : ' ') + detailWords.slice(i, i + 2).join(' ');
          setGeneratedNote((prev) => ({
            ...prev,
            detailedExplanation: currentDetail,
          }));
          await new Promise((r) => setTimeout(r, 18));
        }

        // Stage 4: Attach Practical Examples & Curated YouTube Links
        setStreamStage('Linking Curated YouTube Video Lectures...');
        const ytData = full.youtube || getYoutubeLink(subject, topic);

        setGeneratedNote({
          ...full,
          youtube: ytData,
          isStreaming: false,
        });

        success('Notes synthesized in real-time like ChatGPT!');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to generate study notes.');
      setGeneratedNote(null);
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!generatedNote) return;

    try {
      const res = await notesService.createNote({
        title: generatedNote.title || `Notes: ${topic}`,
        subject,
        topic,
        summary: generatedNote.summary,
        keyPoints: generatedNote.keyPoints,
        detailedExplanation: generatedNote.detailedExplanation,
        practicalExamples: generatedNote.practicalExamples,
        tags: generatedNote.tags || [subject.toLowerCase(), 'exam-prep'],
        youtube: generatedNote.youtube || getYoutubeLink(subject, topic),
      });

      if (res.success) {
        success('Note successfully saved to your collection!');
        setGeneratedNote(null);
        setTopic('');
        fetchSavedNotes();
      }
    } catch (err) {
      toastError('Failed to save note.');
    }
  };

  const handleDownloadNote = async (note, format) => {
    const filename = (note.title || 'study_notes').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const videoUrl = note.youtube?.primaryVideo?.url
      || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${note.subject} ${note.topic}`)}`;
    const sections = [
      { heading: 'Subject & Topic', paragraphs: [`Subject: ${note.subject || 'General'}`, `Topic: ${note.topic || 'Study Notes'}`] },
      { heading: 'Executive Summary', paragraphs: [note.summary || ''] },
      { heading: 'High-Yield Key Points', paragraphs: (note.keyPoints || []).map((point, index) => `${index + 1}. ${point}`) },
      { heading: 'Comprehensive Academic Breakdown', paragraphs: (note.detailedExplanation || '').split(/\r?\n/).filter(Boolean) },
      { heading: 'Real-World Examples', paragraphs: (note.practicalExamples || []).map((example) => `• ${example}`) },
      { heading: 'Recommended Video Lecture', paragraphs: [videoUrl] },
      { heading: 'Generated by EduPulse AI Study Assistant', paragraphs: [] },
    ];
    const cleanText = (text) => text
      .replace(/```[^\n]*\n?/g, '')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_~]/g, '')
      .trim();

    try {
      if (format === 'pdf') {
        const pdf = new jsPDF();
        const margin = 18;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let y = 22;
        const addText = (text, { size = 10, bold = false, gap = 5 } = {}) => {
          const cleaned = cleanText(text);
          if (!cleaned) return;
          pdf.setFont('helvetica', bold ? 'bold' : 'normal');
          pdf.setFontSize(size);
          const lines = pdf.splitTextToSize(cleaned, pageWidth - margin * 2);
          if (y + lines.length * (size * 0.45) > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(lines, margin, y);
          y += lines.length * (size * 0.45) + gap;
        };

        addText(note.title || 'Study Notes', { size: 20, bold: true, gap: 8 });
        sections.forEach(({ heading, paragraphs }) => {
          addText(heading, { size: 13, bold: true, gap: 3 });
          paragraphs.forEach((paragraph) => addText(paragraph));
          y += 3;
        });
        pdf.save(`${filename}.pdf`);
      } else {
        const children = [
          new Paragraph({ text: note.title || 'Study Notes', heading: HeadingLevel.TITLE }),
        ];
        sections.forEach(({ heading, paragraphs }) => {
          children.push(new Paragraph({ text: heading, heading: HeadingLevel.HEADING_1 }));
          paragraphs.forEach((paragraph) => {
            const text = cleanText(paragraph);
            if (text) children.push(new Paragraph({ text }));
          });
        });
        const wordDocument = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(wordDocument);
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `${filename}.docx`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      success(`Study note downloaded as ${format === 'pdf' ? 'PDF' : 'Word (.docx)'}.`);
    } catch (err) {
      console.error('Failed to export study note:', err);
      toastError(`Failed to export study note as ${format === 'pdf' ? 'PDF' : 'Word document'}.`);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await notesService.togglePin(id);
      if (res.success) {
        setSavedNotes((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isPinned: res.isPinned } : n))
        );
      }
    } catch (err) {
      toastError('Failed to toggle pin.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    try {
      const res = await notesService.deleteNote(id);
      if (res.success) {
        success('Note deleted.');
        setSavedNotes((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      toastError('Failed to delete note.');
    }
  };

  const handleCopyNote = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Notes copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUpdateNoteSubmit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const res = await notesService.updateNote(editingNote._id, {
        title: editingNote.title,
        subject: editingNote.subject,
        summary: editingNote.summary,
        detailedExplanation: editingNote.detailedExplanation,
      });

      if (res.success) {
        success('Note updated.');
        setSavedNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? res.note : n))
        );
        setEditingNote(null);
      }
    } catch (err) {
      toastError('Failed to update note.');
    }
  };

  const activeSubjectYT = getYoutubeLink(filterSubject !== 'all' ? filterSubject : subject);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-primary-500/15 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
            Neural Knowledge Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Real-Time AI Notes Generator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Synthesize exhaustive, structured academic notes in real-time with curated YouTube lectures
          </p>
        </div>

        {/* Small 3D Floating Book Preview */}
        <div className="w-40 h-28 hidden md:block">
          <FloatingStudyObjectsScene />
        </div>
      </div>

      {/* Generation Form Card with Glassmorphism */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-6">
        <form onSubmit={handleGenerateNotes} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Subject
                </label>
                <AddSubjectButton
                  variant="link"
                  label="+ Add Subject"
                  onSubjectAdded={(newSub) => setSubject(newSub)}
                />
              </div>
              <select
                value={subject}
                onChange={(e) => {
                  if (e.target.value === '__ADD_NEW__') {
                    openAddSubjectModal((newSub) => setSubject(newSub));
                  } else {
                    setSubject(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 rounded-2xl glass-cyber border border-blue-500/30 text-white bg-[#0A1026]/90 text-sm focus:outline-none focus:border-cyan-400 font-medium"
              >
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-[#050814] text-white">
                    {s}
                  </option>
                ))}
                <option value="__ADD_NEW__" className="bg-[#050814] text-cyan-400 font-bold">
                  + Add Custom Subject...
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                Topic Name *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Balanced Binary Search Trees (AVL & Red-Black)"
                className="w-full px-4 py-3 rounded-2xl glass-cyber border border-blue-500/30 text-white bg-[#0A1026]/90 placeholder-blue-300/40 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                Academic Rigor
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-cyber border border-blue-500/30 text-white bg-[#0A1026]/90 text-sm focus:outline-none focus:border-cyan-400 font-medium"
              >
                <option value="Beginner" className="bg-[#050814] text-white">Beginner (Foundations & Intuition)</option>
                <option value="Intermediate" className="bg-[#050814] text-white">Intermediate (Standard University)</option>
                <option value="Advanced" className="bg-[#050814] text-white">Advanced (Rigorous Proofs & Edge Cases)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const yt = getYoutubeLink(subject);
                openVideoPlayer({
                  url: yt.url,
                  title: yt.title,
                  subject,
                  channel: yt.channel,
                });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-900/30 hover:bg-blue-800/40 border border-blue-500/40 text-cyan-300 hover:text-white transition-all shadow-sm"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Watch {subject} Lectures</span>
            </button>

            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-rose-600/20 hover:bg-rose-600 border border-rose-500 text-rose-300 hover:text-white shadow-glow-rose transition-all flex items-center gap-2.5 animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Generating</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2.5 disabled:opacity-50 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate AI Study Notes</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Real-Time Live Streaming / Preview Card */}
      {generatedNote && (
        <div
          ref={previewCardRef}
          className="p-6 sm:p-8 rounded-3xl glass-cyber border-2 border-cyber-cyan/40 shadow-glow-cyan animate-slide-up space-y-6 relative overflow-hidden"
        >
          {/* Top Live Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-500/15 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan mb-2">
                <Sparkles className={`w-3.5 h-3.5 ${generatedNote.isStreaming ? 'animate-spin' : ''}`} />
                <span>
                  {generatedNote.isStreaming ? `Live Real-Time Synthesis • ${streamStage}` : 'AI Generated Study Guide'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {generatedNote.title}
                {generatedNote.isStreaming && (
                  <span className="inline-block w-2.5 h-5 ml-2 bg-cyber-cyan animate-pulse align-middle" />
                )}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {generatedNote.isStreaming ? (
                <button
                  onClick={handleStopGenerating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600/30 border border-rose-500 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleCopyNote(
                        `${generatedNote.title}\n\nSummary:\n${generatedNote.summary}\n\nKey Points:\n${generatedNote.keyPoints?.join('\n')}\n\nDetails:\n${generatedNote.detailedExplanation}`,
                        'preview'
                      )
                    }
                    className="px-4 py-2 rounded-xl text-xs font-bold glass-cyber border border-primary-500/30 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                  >
                    {copiedId === 'preview' ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDownloadNote(generatedNote, 'pdf')}
                    className="px-4 py-2 rounded-xl text-xs font-bold glass-cyber border border-primary-500/30 text-cyber-cyan hover:shadow-glow-cyan flex items-center gap-1.5 transition-all font-medium"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownloadNote(generatedNote, 'docx')}
                    className="px-4 py-2 rounded-xl text-xs font-bold glass-cyber border border-primary-500/30 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-all font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export Word</span>
                  </button>
                  <button
                    onClick={handleSaveToDatabase}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to MongoDB</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-cyber-cyan mb-2">
              Executive Summary
            </h4>
            <div className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed glass-cyber p-5 rounded-2xl border border-primary-500/20 font-medium bg-white/95 dark:bg-[#0D1126]/90">
              {generatedNote.summary || (generatedNote.isStreaming ? 'Synthesizing core concepts...' : '')}
              {generatedNote.isStreaming && !generatedNote.keyPoints?.length && (
                <span className="inline-block w-2 h-4 ml-1 bg-cyber-cyan animate-pulse align-middle" />
              )}
            </div>
          </div>

          {/* Key Points */}
          {generatedNote.keyPoints && generatedNote.keyPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-cyber-cyan mb-3">
                High-Yield Key Takeaways
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedNote.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl glass-cyber border border-primary-500/20 text-xs text-slate-800 dark:text-slate-100 font-medium animate-fade-in bg-white/95 dark:bg-[#0D1126]/90"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Explanation */}
          {generatedNote.detailedExplanation && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-cyber-cyan mb-2">
                Comprehensive Academic Breakdown
              </h4>
              <div className="p-5 rounded-2xl glass-cyber border border-primary-500/20 text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-normal bg-white/95 dark:bg-[#0D1126]/90">
                {generatedNote.detailedExplanation}
                {generatedNote.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-cyber-cyan animate-pulse align-middle" />
                )}
              </div>
            </div>
          )}

          {/* Curated YouTube Video Lectures Card */}
          {generatedNote.youtube && (
            <div className="p-5 rounded-3xl glass-cyber border border-red-500/30 bg-red-950/20 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                      Curated Video Lectures
                    </span>
                    <h4 className="text-sm font-bold text-white">Recommended YouTube Tutorials</h4>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Topic Specific Video */}
                <div className="p-4 rounded-2xl bg-cyber-dark/80 border border-red-500/25 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600/20 text-red-400">
                      Topic Walkthrough
                    </span>
                    <h5 className="text-xs font-bold text-white line-clamp-1 mt-1">
                      {topic} - Deep Dive Video Lecture
                    </h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Explore detailed step-by-step video proofs and algorithmic examples
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openVideoPlayer({
                          url: generatedNote.youtube.topicSearchUrl || getYoutubeLink(subject, topic).url,
                          title: `${topic} - Video Tutorial`,
                          subject,
                          channel: 'YouTube Curated Tutorial',
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch in App</span>
                    </button>
                    <a
                      href={generatedNote.youtube.topicSearchUrl || getYoutubeLink(subject, topic).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl glass-cyber border border-primary-500/30 text-gray-300 hover:text-white"
                      title="Open in YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Subject Foundation Masterclass */}
                <div className="p-4 rounded-2xl bg-cyber-dark/80 border border-red-500/25 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600/20 text-red-400">
                      Curriculum Foundation
                    </span>
                    <h5 className="text-xs font-bold text-white line-clamp-1 mt-1">
                      {generatedNote.youtube.primaryVideo?.title || `${subject} Masterclass`}
                    </h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Channel: {generatedNote.youtube.primaryVideo?.channel || 'Academic Lectures'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openVideoPlayer({
                          url: generatedNote.youtube.primaryVideo?.url,
                          title: generatedNote.youtube.primaryVideo?.title,
                          subject,
                          channel: generatedNote.youtube.primaryVideo?.channel,
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Masterclass</span>
                    </button>
                    <a
                      href={generatedNote.youtube.primaryVideo?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl glass-cyber border border-primary-500/30 text-gray-300 hover:text-white"
                      title="Open in YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practical Examples */}
          {generatedNote.practicalExamples && generatedNote.practicalExamples.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-accent-300 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Real-World Case Examples</span>
              </h4>
              <div className="space-y-2">
                {generatedNote.practicalExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl glass-cyber border border-accent-500/30 text-xs text-purple-200 leading-relaxed"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Notes Collection Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              My Saved Notes Collection ({savedNotes.length})
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Persistent storage saved to MongoDB</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="pl-9 pr-4 py-2 text-xs rounded-xl glass-cyber border border-primary-500/30 text-slate-900 dark:text-white bg-white/90 dark:bg-cyber-navy placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-cyber-cyan font-medium"
              />
            </div>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl glass-cyber border border-primary-500/30 text-slate-900 dark:text-white bg-white/90 dark:bg-cyber-navy focus:outline-none focus:border-cyber-cyan font-medium"
            >
              <option value="all" className="bg-white dark:bg-cyber-navy text-slate-900 dark:text-white">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-cyber-navy text-slate-900 dark:text-white">
                  {s}
                </option>
              ))}
            </select>

            {/* Direct YouTube link for filtered subject */}
            <button
              type="button"
              onClick={() => {
                openVideoPlayer({
                  url: activeSubjectYT.url,
                  title: activeSubjectYT.title,
                  subject: filterSubject !== 'all' ? filterSubject : subject,
                  channel: activeSubjectYT.channel,
                });
              }}
              className="py-2 px-3 text-xs rounded-xl font-bold bg-red-600/15 hover:bg-red-600/30 border border-red-500/40 text-red-600 dark:text-red-400 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Watch video lectures for selected subject"
            >
              <Tv className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              <span>Watch Lectures</span>
            </button>
          </div>
        </div>

        {loadingNotes ? (
          <LoadingSpinner size="md" text="Loading study notes..." />
        ) : savedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedNotes.map((note) => {
              const noteYT = getYoutubeLink(note.subject, note.topic);
              return (
                <CardTilt3D key={note._id} glowColor="rgba(99, 102, 241, 0.35)">
                  <div
                    className={`p-6 rounded-3xl glass-cyber border transition-all h-full flex flex-col justify-between bg-white/95 dark:bg-[#0D1126]/90 ${
                      note.isPinned
                        ? 'border-cyber-cyan/50 shadow-glow-cyan'
                        : 'border-primary-500/20 shadow-xl'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary-950/80 border border-primary-500/30 text-cyber-cyan">
                          {note.subject}
                        </span>
                        <button
                          onClick={() => handleTogglePin(note._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            note.isPinned
                              ? 'text-cyber-cyan bg-cyber-cyan/10'
                              : 'text-gray-400 hover:text-white'
                          }`}
                          title={note.isPinned ? 'Unpin note' : 'Pin to top'}
                        >
                          <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-cyber-cyan' : ''}`} />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mb-2">
                        {note.title}
                      </h3>

                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4 font-normal">
                        {note.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-primary-500/15 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* YouTube Lecture Button */}
                        <button
                          onClick={() => {
                            openVideoPlayer({
                              url: note.youtube?.primaryVideo?.url || noteYT.url,
                              title: `${note.topic} - Video Tutorial`,
                              subject: note.subject,
                              channel: note.youtube?.primaryVideo?.channel || noteYT.channel,
                            });
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-600/20 transition-colors"
                          title="Watch YouTube Lecture on this note"
                        >
                          <Tv className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownloadNote(note, 'pdf')}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-white/10 transition-colors"
                          title="Download PDF"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadNote(note, 'docx')}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-white/10 transition-colors"
                          title="Download Word document"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            handleCopyNote(
                              `${note.title}\n\n${note.summary}\n\n${note.keyPoints?.join('\n')}`,
                              note._id
                            )
                          }
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Copy Note Content"
                        >
                          {copiedId === note._id ? (
                            <Check className="w-4 h-4 text-cyber-cyan" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => setEditingNote(note)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-accent-400 hover:bg-white/10 transition-colors"
                          title="Edit Note"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                          title="Delete Note"
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
          <div className="p-12 text-center rounded-3xl glass-cyber border border-primary-500/20">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Study Notes Found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Generate notes above to start building your personal AI knowledge library
            </p>
          </div>
        )}

        {/* Edit Note Modal */}
        {editingNote && (
          <Modal
            isOpen={Boolean(editingNote)}
            onClose={() => setEditingNote(null)}
            title="Edit Study Note"
          >
            <form onSubmit={handleUpdateNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Subject
                  </label>
                  <AddSubjectButton
                    variant="link"
                    label="+ Add Subject"
                    onSubjectAdded={(newSub) => setEditingNote({ ...editingNote, subject: newSub })}
                  />
                </div>
                <select
                  value={editingNote.subject || subjects[0]}
                  onChange={(e) => {
                    if (e.target.value === '__ADD_NEW__') {
                      openAddSubjectModal((newSub) => setEditingNote({ ...editingNote, subject: newSub }));
                    } else {
                      setEditingNote({ ...editingNote, subject: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-cyber-navy text-white">
                      {s}
                    </option>
                  ))}
                  <option value="__ADD_NEW__" className="bg-cyber-dark text-cyber-cyan font-bold">
                    + Add Custom Subject...
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingNote.summary}
                  onChange={(e) => setEditingNote({ ...editingNote, summary: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  rows={5}
                  value={editingNote.detailedExplanation || ''}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, detailedExplanation: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl glass-cyber border border-primary-500/30 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default NotesGeneratorPage;
