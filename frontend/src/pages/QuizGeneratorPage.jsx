import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Clock,
  Play,
  Trash2,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import quizService from '../services/quizService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CardTilt3D from '../components/3d/CardTilt3D';
import { useSubjects } from '../context/SubjectContext';
import AddSubjectButton from '../components/common/AddSubjectButton';

const QuizGeneratorPage = () => {
  const { subjectNames: subjects, openAddSubjectModal } = useSubjects();
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(subjects[0] || 'Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Available Quizzes & History
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizTimer, setQuizTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchQuizzesAndHistory();
  }, []);

  useEffect(() => {
    let interval = null;
    if (activeQuiz && !quizResult) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuiz, quizResult]);

  const fetchQuizzesAndHistory = async () => {
    try {
      const [quizRes, attemptRes] = await Promise.all([
        quizService.getQuizzes(),
        quizService.getAttemptsHistory(),
      ]);

      if (quizRes.success) setQuizzes(quizRes.quizzes);
      if (attemptRes.success) setAttempts(attemptRes.attempts);
    } catch (err) {
      console.warn('Error fetching quizzes:', err.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toastError('Please enter a topic to generate a quiz.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await quizService.generateQuiz({
        topic,
        subject,
        difficulty,
        count: Number(count),
      });

      if (res.success && res.quiz) {
        success('Quiz created! Launching interactive 3D test session...');
        setQuizzes((prev) => [res.quiz, ...prev]);
        startTakingQuiz(res.quiz);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to generate practice quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startTakingQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setQuizResult(null);
    setQuizTimer(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (questionIdx, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    const totalQ = activeQuiz.questions.length;
    const answeredCount = Object.keys(userAnswers).length;

    if (answeredCount < totalQ) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQ} questions. Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    try {
      const res = await quizService.submitQuiz(activeQuiz._id, {
        answers: userAnswers,
        timeSpentSeconds: quizTimer,
      });

      if (res.success) {
        setQuizResult(res.result);
        success(`Quiz completed! You scored ${res.result.percentage}%.`);

        if (res.result.percentage >= 60) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        }

        fetchQuizzesAndHistory();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to submit quiz attempt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      const res = await quizService.deleteQuiz(id);
      if (res.success) {
        success('Quiz deleted.');
        setQuizzes((prev) => prev.filter((q) => q._id !== id));
      }
    } catch (err) {
      toastError('Failed to delete quiz.');
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
          Evaluative Testing Matrix
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Interactive AI Quiz Generator
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Challenge your conceptual recall with 4-option multiple-choice examinations crafted for deep university testing
        </p>
      </div>

      {/* Active Quiz Test Taking View */}
      {activeQuiz && !quizResult && (
        <div className="p-6 sm:p-10 rounded-3xl glass-cyber border-2 border-primary-500/40 shadow-glow-electric animate-slide-up space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary-500/15 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary-950/80 border border-primary-500/30 text-cyber-cyan font-bold">
                  {activeQuiz.subject}
                </span>
                <span className="text-xs font-bold text-accent-500 dark:text-accent-400">
                  • {activeQuiz.difficulty} Difficulty
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-cyber border border-primary-500/30 text-xs font-mono text-slate-900 dark:text-white font-bold">
                <Clock className="w-4 h-4 text-cyber-cyan" />
                <span>{formatSeconds(quizTimer)}</span>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Exit Session
              </button>
            </div>
          </div>

          {/* Question Index Progress Dots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              <span>Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
              <span>{Math.round(((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100)}% Completed</span>
            </div>
            {/* Animated Progress Bar */}
            <div className="w-full h-2 rounded-full bg-blue-950/80 border border-blue-500/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Question Body */}
          {activeQuiz.questions[currentQuestionIdx] && (
            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow-electric">
                  Q{currentQuestionIdx + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {activeQuiz.questions[currentQuestionIdx].questionText}
                </h3>
              </div>

              {/* 4 Multiple Choice Options in Dark & Blue */}
              <div className="grid grid-cols-1 gap-3.5">
                {activeQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={`p-5 rounded-2xl border text-sm font-medium cursor-pointer transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-cyan-400 bg-blue-950/40 text-white shadow-glow-cyan'
                          : 'glass-cyber border-blue-500/25 text-slate-100 hover:border-blue-400/50 hover:bg-blue-600/10 bg-[#0A1026]/80'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950 font-black shadow-glow-cyan'
                            : 'glass-cyber border border-blue-500/30 text-blue-200'
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </div>
                      <span className="flex-1 leading-relaxed font-semibold">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation & Submit Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-blue-500/20">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white glass-cyber border border-blue-500/20 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIdx((prev) =>
                        Math.min(activeQuiz.questions.length - 1, prev + 1)
                      )
                    }
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-glow-electric flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitQuiz}
                    className="px-7 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Final Test</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Results Screen */}
      {quizResult && (
        <div className="p-6 sm:p-10 rounded-3xl glass-cyber border border-primary-500/30 shadow-2xl animate-slide-up space-y-8 bg-white/95 dark:bg-[#0D1126]/95">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-black text-cyber-cyan text-glow-cyan">
                {quizResult.score} / {quizResult.totalQuestions}
              </span>
              <span className="text-xl font-bold text-slate-600 dark:text-slate-400">
                ({quizResult.percentage}%)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Time taken: {formatSeconds(quizResult.timeSpentSeconds)} • Progress recorded to student analytics
            </p>
          </div>

          {/* Question by Question Detailed Review */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Answer Review & Rationales
            </h3>

            {quizResult.userAnswers.map((ua, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${
                  ua.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/20'
                    : 'border-rose-500/30 bg-rose-950/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {ua.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      Q{idx + 1}: {ua.questionText}
                    </p>

                    <div className="text-xs space-y-1 mb-3">
                      <p className={ua.isCorrect ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-rose-500 dark:text-rose-400 font-bold'}>
                        Your Answer: Option {['A', 'B', 'C', 'D'][ua.selectedOption]} {ua.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </p>
                      {!ua.isCorrect && (
                        <p className="text-emerald-500 dark:text-emerald-400 font-bold">
                          Correct Answer: Option {['A', 'B', 'C', 'D'][ua.correctOption]}
                        </p>
                      )}
                    </div>

                    {ua.explanation && (
                      <div className="p-3.5 rounded-xl glass-cyber border border-primary-500/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-white/90 dark:bg-cyber-dark/80">
                        <span className="font-bold text-cyber-cyan block mb-0.5">
                          Pedagogical Explanation:
                        </span>
                        {ua.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => startTakingQuiz(activeQuiz)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => {
                setActiveQuiz(null);
                setQuizResult(null);
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs glass-cyber hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-primary-500/30"
            >
              Back to Available Quizzes
            </button>
          </div>
        </div>
      )}

      {/* Quiz Generator Input Form */}
      {!activeQuiz && !quizResult && (
        <div className="p-6 sm:p-8 rounded-3xl glass-cyber border border-primary-500/25 shadow-2xl bg-white/95 dark:bg-[#0D1126]/95">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyber-cyan" />
            <span>Generate New 4-Option Practice Test</span>
          </h2>

          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  className="w-full px-4 py-3 rounded-2xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Quiz Topic *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Dijkstra"
                  className="w-full px-4 py-3 rounded-2xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="Easy" className="bg-cyber-navy text-white">Easy (Recall & Concept Definitions)</option>
                  <option value="Medium" className="bg-cyber-navy text-white">Medium (Practical Logic & Problem Solving)</option>
                  <option value="Hard" className="bg-cyber-navy text-white">Hard (Edge-Cases & Mathematical Invariants)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Questions
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-cyber border border-primary-500/30 text-white text-sm focus:outline-none focus:border-cyber-cyan"
                >
                  <option value={5} className="bg-cyber-navy text-white">5 Questions</option>
                  <option value={10} className="bg-cyber-navy text-white">10 Questions</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-primary-600 via-accent-600 to-cyber-cyan text-white shadow-glow-electric hover:shadow-glow-cyan transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing 4-Option Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyber-cyan" />
                    <span>Generate & Launch Quiz</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Available Quizzes Cards */}
      {!activeQuiz && !quizResult && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white">
            Available Practice Quizzes ({quizzes.length})
          </h2>

          {loadingList ? (
            <LoadingSpinner size="md" text="Loading practice tests..." />
          ) : quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((q) => (
                <CardTilt3D key={q._id} glowColor="rgba(34, 211, 238, 0.35)">
                  <div className="p-6 rounded-3xl glass-cyber border border-primary-500/25 h-full flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary-950/80 border border-primary-500/30 text-cyber-cyan">
                          {q.subject}
                        </span>
                        <span className="text-[10px] font-bold text-accent-400">
                          {q.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                        {q.title}
                      </h3>
                      <p className="text-xs text-gray-300 mb-4">
                        {q.questions ? q.questions.length : 5} multiple-choice questions with answers & explanations
                      </p>
                    </div>

                    <div className="pt-4 border-t border-primary-500/15 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteQuiz(q._id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-400"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => startTakingQuiz(q)}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-electric flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Launch Quiz</span>
                      </button>
                    </div>
                  </div>
                </CardTilt3D>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl glass-cyber border border-primary-500/20">
              <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No practice quizzes yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Generate your first quiz above to start testing!
              </p>
            </div>
          )}

          {/* Past Quiz Attempt Scores Table */}
          {attempts.length > 0 && (
            <div className="pt-6 space-y-4">
              <h2 className="text-lg font-black text-white">
                Attempt Score History
              </h2>

              <div className="rounded-2xl glass-cyber border border-primary-500/25 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="glass-cyber text-gray-400 font-bold uppercase tracking-wider border-b border-primary-500/20">
                    <tr>
                      <th className="px-5 py-3">Quiz Title</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Score</th>
                      <th className="px-5 py-3">Mastery</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-500/15">
                    {attempts.slice(0, 8).map((att) => (
                      <tr key={att._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 font-semibold text-white">
                          {att.quizTitle || 'Practice Test'}
                        </td>
                        <td className="px-5 py-3 text-gray-300">{att.subject || 'General'}</td>
                        <td className="px-5 py-3 font-bold text-cyber-cyan">
                          {att.score} / {att.totalQuestions}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-black text-[10px] ${
                              att.percentage >= 80
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : att.percentage >= 60
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400">
                          {new Date(att.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGeneratorPage;
