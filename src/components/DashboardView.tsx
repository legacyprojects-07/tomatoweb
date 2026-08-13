import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  FileText, 
  BrainCircuit, 
  Play, 
  ArrowRight, 
  Target, 
  Flame, 
  Zap,
  HelpCircle,
  Clock,
  CheckCircle2,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Globe,
  BookMarked,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { NoteItem, VideoLesson, SubjectName, GradeLevel } from '../types';
import { SUBJECT_COLOR_MAP } from '../data/initialData';

interface DashboardViewProps {
  notes: NoteItem[];
  lessons: VideoLesson[];
  selectedGrade: GradeLevel;
  onSelectTab: (tab: 'dashboard' | 'notes' | 'subjects' | 'ai-guru' | 'practice' | 'uploader-studio') => void;
  onOpenCreateNote: () => void;
  onSelectNote: (note: NoteItem) => void;
  onStartQuizForNote: (note: NoteItem) => void;
  onAskGuruQuestion: (question: string) => void;
  streakDays: number;
}

const SUBJECT_ICONS: Record<SubjectName, React.ReactNode> = {
  Physics: <Atom className="w-5 h-5 text-cyan-600" />,
  Chemistry: <FlaskConical className="w-5 h-5 text-emerald-600" />,
  Mathematics: <Calculator className="w-5 h-5 text-amber-600" />,
  Biology: <Dna className="w-5 h-5 text-rose-600" />,
  'Social Science': <Globe className="w-5 h-5 text-purple-600" />,
  'English Literature': <BookMarked className="w-5 h-5 text-indigo-600" />
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  lessons,
  selectedGrade,
  onSelectTab,
  onOpenCreateNote,
  onSelectNote,
  onStartQuizForNote,
  onAskGuruQuestion,
  streakDays
}) => {
  const [quickDoubtInput, setQuickDoubtInput] = useState('');

  // Homescreen Educator Password Bar State
  const [uploaderPass, setUploaderPass] = useState('');
  const [showUploaderPass, setShowUploaderPass] = useState(true); // visible while writing password as requested
  const [uploaderPassError, setUploaderPassError] = useState('');

  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDoubtInput.trim()) return;
    onAskGuruQuestion(quickDoubtInput);
    setQuickDoubtInput('');
  };

  const handleUploaderPassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderPass.trim()) return;
    if (uploaderPass.trim().toLowerCase() === 'nexttopper') {
      localStorage.setItem('tomato_uploader_authed', 'true');
      setUploaderPassError('');
      onSelectTab('uploader-studio');
    } else {
      setUploaderPassError('Incorrect password! Access denied.');
    }
  };

  const subjectList: SubjectName[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Social Science', 'English Literature'];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0B132B] text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BrainCircuit className="w-96 h-96 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Welcome back, Student! • {selectedGrade}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Learn Faster, Revise Smartly & <span className="text-amber-300 underline decoration-amber-400 decoration-wavy">Master Board Exams</span>
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Upload or write your personal class notes, download custom PDFs, play arcade games to unlock notes, and clear doubts 24/7 with your personal Tomato Official AI Guru.
          </p>

          {/* Quick CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCreateNote}
              className="bg-gradient-to-r from-amber-400 to-[#F89D2A] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Upload / Add My Notes</span>
            </button>

            <button
              onClick={() => onSelectTab('notes')}
              className="bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Browse Notes Vault ({notes.length})</span>
            </button>

            <button
              onClick={() => onSelectTab('ai-guru')}
              className="bg-blue-950/90 hover:bg-black/40 text-amber-300 font-bold text-sm px-4 py-3 rounded-xl border border-amber-400/30 flex items-center gap-2 transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Ask Guru AI</span>
            </button>
          </div>
        </div>

        {/* Bottom Banner Stats bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-black text-xl">
              <Flame className="w-5 h-5 fill-amber-300" />
              <span>{streakDays} Days</span>
            </div>
            <p className="text-[11px] text-blue-200 uppercase font-medium">Study Streak</p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
            <div className="text-amber-300 font-black text-xl">{notes.length} Notes</div>
            <p className="text-[11px] text-blue-200 uppercase font-medium">Saved in Vault</p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
            <div className="text-amber-300 font-black text-xl">6 Subjects</div>
            <p className="text-[11px] text-blue-200 uppercase font-medium">Class Syllabus</p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
            <div className="text-amber-300 font-black text-xl">24/7</div>
            <p className="text-[11px] text-blue-200 uppercase font-medium">AI Guru Assistance</p>
          </div>
        </div>
      </div>

      {/* Instant Doubt Solver Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-blue-50 p-5 rounded-2xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
          <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>Quick Doubt Solver • Type any question or formula</span>
        </div>
        <form onSubmit={handleDoubtSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. Why does a rainbow form? Or explain F=ma with cricket example..."
            value={quickDoubtInput}
            onChange={(e) => setQuickDoubtInput(e.target.value)}
            className="flex-1 bg-white text-gray-900 text-sm px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            className="bg-[#0F172A] hover:bg-slate-800 text-amber-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ask AI Guru</span>
          </button>
        </form>
      </div>

      {/* Homescreen Password Filling Bar for Educator Uploader Studio Access */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">🔒 Educator Uploader Studio Access Bar</h3>
              <p className="text-[11px] text-slate-300">Enter administrator password to open Tomato Uploader Studio</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowUploaderPass(!showUploaderPass)}
            className="text-[11px] font-bold text-amber-300 hover:underline flex items-center gap-1"
          >
            {showUploaderPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showUploaderPass ? 'Mask characters' : 'Show characters while typing'}</span>
          </button>
        </div>

        <form onSubmit={handleUploaderPassSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type={showUploaderPass ? 'text' : 'password'}
              placeholder="Enter administrator password..."
              value={uploaderPass}
              onChange={(e) => {
                setUploaderPass(e.target.value);
                setUploaderPassError('');
              }}
              className="w-full bg-slate-950 text-white text-xs font-mono font-bold pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Uploader Studio</span>
          </button>
        </form>

        {uploaderPassError && (
          <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{uploaderPassError}</span>
          </p>
        )}
      </div>

      {/* Subject Wise Explorer */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Subject Learning Hub
            </h2>
            <p className="text-xs text-gray-500">
              Select a subject to view curriculum, video modules, and saved notes.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('subjects')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>View All Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {subjectList.map((sub) => {
            const color = SUBJECT_COLOR_MAP[sub];
            const subjectNotesCount = notes.filter((n) => n.subject === sub).length;
            return (
              <div
                key={sub}
                onClick={() => onSelectTab('subjects')}
                className={`${color.bg} ${color.border} border p-4 rounded-xl cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    {SUBJECT_ICONS[sub]}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">
                    {sub}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-gray-600">
                  <span>{subjectNotesCount} Notes</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Notes & AI Notes Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Recent Notes (Apne Revision Notes)
            </h2>
            <p className="text-xs text-gray-500">
              Your saved notes with instant AI summaries and auto-generated quizzes.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('notes')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Open Notes Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.slice(0, 3).map((note) => {
            const color = SUBJECT_COLOR_MAP[note.subject] || { bg: 'bg-gray-50', border: 'border-gray-200' };
            return (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${color.bg} ${color.text} border ${color.border}`}>
                      {note.subject}
                    </span>
                    <span className="text-[11px] text-gray-400">{note.chapter}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectNote(note)}
                    className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-700 cursor-pointer line-clamp-1"
                  >
                    {note.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {note.content.replace(/[#*$`]/g, '')}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectNote(note)}
                    className="text-xs font-semibold text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Note</span>
                  </button>

                  <button
                    onClick={() => onStartQuizForNote(note)}
                    className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>AI Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Video Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Tomato Official Visual Video Lessons
            </h2>
            <p className="text-xs text-gray-500">
              Interactive video concept explainer modules with key takeaways.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('subjects')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Explore All Lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {lessons.map((les) => (
            <div
              key={les.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img
                  src={les.thumbnailUrl}
                  alt={les.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {les.duration}
                </div>
                <div className="absolute top-2 left-2 bg-[#0F172A] text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {les.subject}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                  {les.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {les.summary}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-blue-800 font-semibold">
                  <span>{les.keyTimestamps.length} Key Concepts</span>
                  <button
                    onClick={() => onSelectTab('subjects')}
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>Watch & Learn</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
