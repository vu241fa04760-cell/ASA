import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  HelpCircle,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import documentService from '../services/documentService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CardTilt3D from '../components/3d/CardTilt3D';
import { useSubjects } from '../context/SubjectContext';
import AddSubjectButton from '../components/common/AddSubjectButton';

const DocumentSummarizerPage = () => {
  const { subjectNames: subjects, openAddSubjectModal } = useSubjects();
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState(subjects[0] || 'Operating Systems');
  const [isUploading, setIsUploading] = useState(false);

  // Documents Library
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Active Doc Q&A State
  const [docQuestion, setDocQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [docChatHistory, setDocChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      if (res.success) {
        setDocuments(res.documents);
        if (res.documents.length > 0 && !activeDoc) {
          setActiveDoc(res.documents[0]);
        }
      }
    } catch (err) {
      console.warn('Could not fetch documents:', err.message);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'text/plain', 'text/markdown'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|txt|md)$/i)) {
        toastError('Please select a valid PDF or TXT file.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAndSummarize = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toastError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subject', subject);

    setIsUploading(true);
    try {
      const res = await documentService.uploadDocument(formData);
      if (res.success && res.document) {
        success('Document extracted and summarized successfully!');
        setDocuments((prev) => [res.document, ...prev]);
        setActiveDoc(res.document);
        setSelectedFile(null);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to upload and summarize document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!docQuestion.trim() || !activeDoc) return;

    const userQ = docQuestion;
    setDocChatHistory((prev) => [...prev, { sender: 'user', text: userQ }]);
    setDocQuestion('');
    setIsAsking(true);

    try {
      const res = await documentService.askQuestion(activeDoc._id, userQ);
      if (res.success) {
        setDocChatHistory((prev) => [
          ...prev,
          { sender: 'assistant', text: res.answer, aiProvider: res.aiProvider },
        ]);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to answer question on document.');
    } finally {
      setIsAsking(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Delete this uploaded study document?')) return;
    try {
      const res = await documentService.deleteDocument(id);
      if (res.success) {
        success('Document deleted.');
        setDocuments((prev) => prev.filter((d) => d._id !== id));
        if (activeDoc?._id === id) {
          setActiveDoc(null);
        }
      }
    } catch (err) {
      toastError('Failed to delete document.');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
          Document Intelligence
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Document Upload & AI Summarizer
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Upload PDF lecture slides, articles, and textbooks. Extract high-yield insights and query documents in real-time
        </p>
      </div>

      {/* Upload Dropzone Card with Glassmorphism */}
      <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl space-y-6">
        <form onSubmit={handleUploadAndSummarize} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Upload Document (PDF or TXT) *
              </label>
              <div className="relative border-2 border-dashed border-primary-500/30 hover:border-cyber-cyan rounded-3xl p-8 text-center cursor-pointer transition-colors glass-cyber">
                <input
                  type="file"
                  accept=".pdf,.txt,.text,.md"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 text-white flex items-center justify-center shadow-glow-electric">
                    <Upload className="w-7 h-7" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-bold text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-cyber-cyan font-mono mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-gray-200">
                        Click to browse or drag and drop your study document
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports PDF and TXT files up to 15MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
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
                className="w-full px-4 py-3 rounded-2xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan mb-5"
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

              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-primary-600 via-accent-600 to-cyber-cyan text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Parsing & Summarizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyber-cyan" />
                    <span>Upload & Summarize</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Document Inspector View */}
      {activeDoc && (
        <div className="p-6 sm:p-10 rounded-3xl glass-cyber border-2 border-primary-500/30 shadow-2xl animate-slide-up space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-500/15 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                  {activeDoc.fileType.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-cyber-cyan">
                  {activeDoc.subject}
                </span>
                <span className="text-xs text-gray-400">
                  • {(activeDoc.fileSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeDoc.originalName}
              </h2>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 glass-cyber p-1.5 rounded-2xl self-start sm:self-auto border border-primary-500/20">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'summary'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Executive Summary
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Flashcards
              </button>
              <button
                onClick={() => setActiveTab('ask')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ask'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Ask Document</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Executive Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  AI Synthesized Summary
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed glass-cyber p-5 rounded-2xl border border-primary-500/20">
                  {activeDoc.summary}
                </p>
              </div>

              {activeDoc.keyTakeaways && activeDoc.keyTakeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyber-cyan mb-3">
                    5 Essential High-Yield Takeaways
                  </h4>
                  <div className="space-y-3">
                    {activeDoc.keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-4 rounded-2xl glass-cyber border border-primary-500/20 text-xs text-gray-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Q&A Flashcard Pairs */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Core Questions & Answers Extracted from Document
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDoc.qaPairs && activeDoc.qaPairs.length > 0 ? (
                  activeDoc.qaPairs.map((qa, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl glass-cyber border border-primary-500/20 space-y-2.5"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyber-cyan">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Question {idx + 1}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {qa.question}
                      </p>
                      <div className="pt-2 border-t border-primary-500/15 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {qa.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">No flashcard pairs generated yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Interactive Ask AI on Document */}
          {activeTab === 'ask' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-cyber border border-primary-500/30 text-xs text-indigo-700 dark:text-primary-200 font-medium bg-white/95 dark:bg-[#0D1126]/90">
                Ask any specific question strictly based on{' '}
                <span className="font-bold text-slate-900 dark:text-white">{activeDoc.originalName}</span>.
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 max-h-72 overflow-y-auto p-2">
                {docChatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl text-xs max-w-xl ${
                      msg.sender === 'user'
                        ? 'ml-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-glow-electric font-medium'
                        : 'mr-auto glass-cyber border border-blue-500/30 text-slate-100 bg-[#0A1026]/90 font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}

                {isAsking && (
                  <div className="p-4 rounded-2xl text-xs mr-auto glass-cyber border border-cyan-400/30 text-cyan-400 animate-pulse flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Searching document context and generating answer...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskQuestion} className="flex gap-2.5">
                <input
                  type="text"
                  value={docQuestion}
                  onChange={(e) => setDocQuestion(e.target.value)}
                  placeholder={`Ask a question about ${activeDoc.originalName}...`}
                  className="flex-1 px-4 py-3 rounded-2xl glass-cyber border border-blue-500/30 text-white bg-[#0A1026]/90 placeholder-blue-300/40 text-xs focus:outline-none focus:border-cyan-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={isAsking || !docQuestion.trim()}
                  className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-glow-electric disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Documents Library Grid */}
      <div className="space-y-6 pt-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          My Uploaded Documents ({documents.length})
        </h2>

        {loadingDocs ? (
          <LoadingSpinner size="md" text="Loading study documents..." />
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const isSelected = activeDoc?._id === doc._id;

              return (
                <CardTilt3D key={doc._id} glowColor="rgba(34, 211, 238, 0.3)">
                  <div
                    onClick={() => {
                      setActiveDoc(doc);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className={`p-6 rounded-3xl glass-cyber border transition-all cursor-pointer flex flex-col justify-between h-full ${
                      isSelected
                        ? 'border-cyber-cyan shadow-glow-cyan'
                        : 'border-primary-500/20 shadow-xl'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary-950/80 border border-primary-500/30 text-cyber-cyan">
                          {doc.subject}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-gray-400">
                          {doc.fileType.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-1 mb-1.5">
                        {doc.originalName}
                      </h3>

                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
                        {doc.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-primary-500/15 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc._id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-400"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardTilt3D>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl glass-cyber border border-primary-500/20">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">No study documents uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Upload a lecture slide PDF or TXT above to analyze!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSummarizerPage;
