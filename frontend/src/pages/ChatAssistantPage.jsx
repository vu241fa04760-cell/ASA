import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Trash2,
  Lightbulb,
  CheckCircle2,
  Copy,
  RotateCcw,
  Check,
  ToggleLeft,
  ToggleRight,
  Zap,
  Tv,
  Play,
  Square,
  ExternalLink,
} from 'lucide-react';
import chatService from '../services/chatService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HologramAvatarScene from '../components/3d/HologramAvatarScene';
import { useSubjects } from '../context/SubjectContext';
import AddSubjectButton from '../components/common/AddSubjectButton';

const suggestedQuestions = [
  'Explain Dijkstra vs A* search with a real-world analogy',
  'How does neural network backpropagation work step by step?',
  'What are the 4 ACID database transaction isolation levels?',
  'Explain Big O notation and why space complexity matters',
  'How does Virtual Memory and Paging work in modern OS?',
];

const ChatAssistantPage = () => {
  const { subjectNames: subjects, openAddSubjectModal, getYoutubeLink, openVideoPlayer } = useSubjects();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || 'Data Structures & Algorithms');
  const [simplify, setSimplify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);
  const abortStreamRef = useRef(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const fetchSessions = async () => {
    try {
      const res = await chatService.getSessions();
      if (res.success && res.sessions.length > 0) {
        setSessions(res.sessions);
        handleSelectSession(res.sessions[0]._id);
      } else {
        handleStartNewSession();
      }
    } catch (err) {
      console.warn('Failed to load chat sessions:', err.message);
      handleStartNewSession();
    }
  };

  const handleSelectSession = async (id) => {
    setActiveSessionId(id);
    setMessages([]);
    try {
      const res = await chatService.getSessionById(id);
      if (res.success && res.session) {
        setMessages(
          res.session.messages.length > 0
            ? res.session.messages
            : [
                {
                  sender: 'assistant',
                  content: `Greetings! I am your **3D Neural Study Copilot**. Ask me any question, request step-by-step mathematical proofs or code walk-throughs, or toggle "Explain Simply" for intuitive analogies. What subject shall we master today?`,
                  conceptBreakdown: [
                    'Choose a subject from the selector above.',
                    'Toggle "Explain Simply" for intuitive, beginner-friendly explanations.',
                    'Click "Watch Lectures" to study alongside curated YouTube courses.',
                  ],
                  timestamp: new Date(),
                },
              ]
        );
        if (res.session.subject) setSelectedSubject(res.session.subject);
      }
    } catch (err) {
      toastError('Failed to load conversation history.');
    }
  };

  const handleStartNewSession = () => {
    setActiveSessionId(null);
    setMessages([
      {
        sender: 'assistant',
        content: `New study session initiated! What topic or problem would you like to explore in **${selectedSubject}**?`,
        conceptBreakdown: [
          'Real-time streaming answers like ChatGPT',
          'Integrated YouTube lecture video links',
          'Step-by-step derivations & code explanations',
        ],
        timestamp: new Date(),
      },
    ]);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    try {
      await chatService.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      if (activeSessionId === id) {
        handleStartNewSession();
      }
    } catch (err) {
      toastError('Failed to delete chat session.');
    }
  };

  const handleStopGenerating = () => {
    abortStreamRef.current = true;
    setIsStreaming(false);
    setLoading(false);
  };

  const handleSendMessage = async (e, customText) => {
    if (e) e.preventDefault();
    const query = customText || inputMessage;
    if (!query.trim() || isStreaming) return;

    abortStreamRef.current = false;

    const userMsg = {
      sender: 'user',
      content: query,
      timestamp: new Date(),
    };

    // Pre-create streaming assistant placeholder
    const streamingPlaceholder = {
      sender: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date(),
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMsg, streamingPlaceholder]);
    setInputMessage('');
    setLoading(true);
    setIsStreaming(true);

    try {
      const res = await chatService.sendMessage({
        message: query,
        subject: selectedSubject,
        sessionId: activeSessionId,
        simplify,
      });

      if (res.success && res.reply) {
        const fullContent = res.reply.content || '';
        const words = fullContent.split(' ');
        let currentText = '';

        // Token-by-token real-time streaming like ChatGPT
        for (let i = 0; i < words.length; i++) {
          if (abortStreamRef.current) break;

          currentText += (i === 0 ? '' : ' ') + words[i];

          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.sender === 'assistant') {
              next[next.length - 1] = {
                ...last,
                content: currentText,
                isStreaming: true,
              };
            }
            return next;
          });

          // Small typing pause (approx. 20ms per token)
          await new Promise((r) => setTimeout(r, 20));
        }

        // Attach full completed payload with concepts, examples, and YouTube links
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...res.reply,
            content: abortStreamRef.current ? currentText : fullContent,
            isStreaming: false,
          };
          return next;
        });

        if (!activeSessionId && res.sessionId) {
          setActiveSessionId(res.sessionId);
          setSessions((prev) => [
            {
              _id: res.sessionId,
              title: res.sessionTitle || query.slice(0, 30),
              subject: selectedSubject,
              updatedAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'AI assistant encountered an error. Please try again.');
      setMessages((prev) => prev.slice(0, -1)); // remove placeholder on error
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleCopyMessage = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    success('Message copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const handleRegenerateLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(null, lastUserMsg.content);
    }
  };

  const activeSubjectYT = getYoutubeLink(selectedSubject);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8.5rem)] animate-fade-in">
      {/* Session History Sidebar */}
      <div className="w-full lg:w-72 glass-cyber rounded-3xl border border-primary-500/25 p-4 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Study Threads
          </span>
          <button
            onClick={handleStartNewSession}
            className="p-1.5 rounded-xl glass-cyber border border-primary-500/30 text-cyber-cyan hover:shadow-glow-cyan transition-all"
            title="Start New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sessions.map((sess) => (
            <div
              key={sess._id}
              onClick={() => handleSelectSession(sess._id)}
              className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer text-xs transition-all ${
                activeSessionId === sess._id
                  ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/30 border border-cyan-400/60 text-white shadow-glow-cyan'
                  : 'glass-cyber border border-blue-500/20 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-600/10'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 animate-pulse" />
                <div className="overflow-hidden">
                  <p className="font-bold truncate text-white">{sess.title}</p>
                  <p className="text-[10px] text-blue-300/80 truncate">
                    {sess.subject || 'General'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteSession(e, sess._id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                title="Delete Session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-cyber rounded-3xl border border-primary-500/25 flex flex-col shadow-2xl overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-primary-500/15 flex flex-wrap items-center justify-between gap-4 glass-cyber">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl glass-cyber border border-primary-500/30 flex items-center justify-center relative overflow-hidden">
              <HologramAvatarScene isThinking={loading || isStreaming} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 dark:text-white">Quantum Study Copilot</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                  {isStreaming ? 'Streaming...' : loading ? 'Synthesizing...' : 'Live Ready'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    if (e.target.value === '__ADD_NEW__') {
                      openAddSubjectModal((newSub) => setSelectedSubject(newSub));
                    } else {
                      setSelectedSubject(e.target.value);
                    }
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl glass-cyber border border-primary-500/30 text-slate-900 dark:text-white bg-white/90 dark:bg-cyber-navy focus:outline-none focus:border-cyber-cyan"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-white dark:bg-cyber-navy text-slate-900 dark:text-white">
                      {s}
                    </option>
                  ))}
                  <option value="__ADD_NEW__" className="bg-cyber-dark text-cyber-cyan font-bold">
                    + Add Custom Subject...
                  </option>
                </select>

                <AddSubjectButton
                  variant="pill"
                  label="+ Add Subject"
                  onSubjectAdded={(newSub) => setSelectedSubject(newSub)}
                  className="py-0.5 px-2 text-[10px]"
                />

                {/* YouTube Link Button for Active Subject */}
                <button
                  type="button"
                  onClick={() =>
                    openVideoPlayer({
                      url: activeSubjectYT.url,
                      title: activeSubjectYT.title,
                      subject: selectedSubject,
                      channel: activeSubjectYT.channel,
                    })
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-red-600/15 hover:bg-red-600/30 border border-red-500/40 text-red-600 dark:text-red-400 hover:text-white transition-all shadow-sm active:scale-95"
                  title="Watch curated YouTube video lectures for this subject"
                >
                  <Tv className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span>YouTube Lectures</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSimplify(!simplify)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                simplify
                  ? 'glass-cyber border-cyber-cyan text-cyber-cyan shadow-glow-cyan'
                  : 'glass-cyber border-primary-500/25 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Lightbulb className={`w-3.5 h-3.5 ${simplify ? 'text-amber-400' : 'text-gray-400'}`} />
              <span>Explain Simply</span>
              {simplify ? <ToggleRight className="w-4 h-4 text-cyber-cyan" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isCurrentlyStreaming = msg.isStreaming && isStreaming;

            return (
              <div
                key={idx}
                className={`flex gap-3 sm:gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-electric ${
                    isUser
                      ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                      : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 text-white'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Body with Glassmorphism & High-Contrast Typography */}
                <div
                  className={`rounded-3xl p-5 text-sm leading-relaxed border transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white border-blue-400/40 shadow-glow-electric font-medium'
                      : 'glass-cyber border-blue-500/30 bg-[#0A1026]/90 text-slate-100 shadow-xl'
                  }`}
                >
                  {/* Real-time Streaming Content with High-Visibility Markdown Elements */}
                  <div className="font-normal leading-relaxed">
                    {msg.content ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3.5 last:mb-0 text-slate-100 font-normal leading-relaxed text-[14px]">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-xl sm:text-2xl font-black mt-4 mb-2.5 text-white tracking-tight border-b border-blue-500/25 pb-1.5 flex items-center gap-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg sm:text-xl font-extrabold mt-3.5 mb-2 text-cyan-400 tracking-tight">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base font-bold mt-3 mb-1.5 text-blue-300">
                              {children}
                            </h3>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-cyan-300 bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-500/40">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-sky-300 font-medium">
                              {children}
                            </em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 mb-3.5 space-y-1.5 text-slate-200">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 mb-3.5 space-y-1.5 text-slate-200">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed pl-0.5 marker:text-cyan-400">
                              {children}
                            </li>
                          ),
                          pre: ({ children }) => (
                            <pre className="overflow-x-auto rounded-2xl bg-[#030612] border border-blue-500/30 p-4 my-3.5 text-xs text-cyan-300 font-mono shadow-inner leading-normal">
                              {children}
                            </pre>
                          ),
                          code: ({ children, className }) => (
                            <code className={`${className || ''} rounded-md bg-blue-950/80 border border-blue-500/40 px-1.5 py-0.5 font-mono text-cyan-300 text-xs font-semibold`}>
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-cyan-400 bg-blue-950/40 px-4 py-2 my-2.5 rounded-r-xl text-slate-200 italic font-medium">
                              {children}
                            </blockquote>
                          ),
                          a: ({ children, href }) => (
                            <a href={href} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-200 underline font-semibold transition-colors">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      isCurrentlyStreaming ? (
                        <span className="text-cyber-cyan font-semibold">Synthesizing real-time explanation...</span>
                      ) : ''
                    )}
                    {isCurrentlyStreaming && (
                      <span className="inline-block w-2 h-4 ml-1.5 bg-cyber-cyan animate-pulse align-middle" />
                    )}
                  </div>

                  {/* Concept Breakdown Box */}
                  {msg.conceptBreakdown && msg.conceptBreakdown.length > 0 && !isCurrentlyStreaming && (
                    <div className="mt-4 p-4 rounded-2xl glass-cyber border border-blue-500/30 bg-blue-950/20 animate-fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400 mb-2.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Core Concept Breakdown</span>
                      </div>
                      <ul className="space-y-2">
                        {msg.conceptBreakdown.map((item, i) => (
                          <li key={i} className="text-xs text-slate-100 font-medium flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples Box */}
                  {msg.examples && msg.examples.length > 0 && !isCurrentlyStreaming && (
                    <div className="mt-3.5 p-4 rounded-2xl glass-cyber border border-blue-500/30 bg-blue-950/30 animate-fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 mb-2">
                        <Lightbulb className="w-4 h-4 text-cyan-400" />
                        <span>Real-World Practical Example</span>
                      </div>
                      <ul className="space-y-1.5">
                        {msg.examples.map((item, i) => (
                          <li key={i} className="text-xs text-slate-100 font-medium leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* YouTube Lecture Link / Embedded Card */}
                  {msg.youtube && !isCurrentlyStreaming && (
                    <div className="mt-3.5 p-3.5 rounded-2xl glass-cyber border border-red-500/30 bg-red-950/20 flex items-center justify-between gap-3 animate-fade-in">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center flex-shrink-0">
                          <Tv className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400 block">
                            Recommended YouTube Lecture
                          </span>
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {msg.youtube.primaryVideo?.title || `${selectedSubject} Video Tutorial`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            openVideoPlayer({
                              url: msg.youtube.primaryVideo?.url || msg.youtube.topicSearchUrl,
                              title: msg.youtube.primaryVideo?.title,
                              subject: selectedSubject,
                              channel: msg.youtube.primaryVideo?.channel,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions (Copy / Regenerate) for Assistant Messages */}
                  {!isUser && !isCurrentlyStreaming && (
                    <div className="pt-3 mt-3 border-t border-primary-500/15 flex items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() => handleCopyMessage(msg.content, idx)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-medium"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>

                      {idx === messages.length - 1 && (
                        <button
                          onClick={handleRegenerateLast}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-cyber-cyan hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-medium"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Regenerate</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Horizon */}
        {messages.length <= 2 && !isStreaming && (
          <div className="px-4 py-3 border-t border-primary-500/15 flex gap-2 overflow-x-auto glass-cyber">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(null, q)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs glass-cyber border border-primary-500/25 hover:border-cyber-cyan text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex-shrink-0 shadow-sm font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Form with Glowing Border & Stop Generating Control */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-500/20 glass-cyber flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              disabled={isStreaming}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask a question about ${selectedSubject}...`}
              className="w-full px-5 py-3.5 rounded-2xl glass-cyber border border-blue-500/35 text-white bg-[#0A1026]/90 placeholder-blue-300/40 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan text-sm transition-all disabled:opacity-60 font-medium"
            />
          </div>

          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopGenerating}
              className="px-5 py-3.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500 text-rose-300 hover:text-white font-bold text-sm shadow-glow-rose transition-all flex items-center gap-2 active:scale-95 animate-pulse"
              title="Stop Generating"
            >
              <Square className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-electric disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatAssistantPage;
