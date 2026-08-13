import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Flame, 
  Plus, 
  Search, 
  GraduationCap, 
  Bot, 
  FileText, 
  LayoutDashboard, 
  Award,
  ChevronDown,
  Gamepad2,
  FolderDown,
  ShieldCheck,
  Share2,
  Check
} from 'lucide-react';
import { GradeLevel, AppTab } from '../types';

interface HeaderNavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  onOpenCreateNote: () => void;
  streakDays: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const GRADES: GradeLevel[] = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'JEE Mains & Advanced',
  'NEET UG Prep'
];

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedGrade,
  setSelectedGrade,
  onOpenCreateNote,
  streakDays,
  searchQuery,
  setSearchQuery,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareWebsite = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Tomato Official - Student & Educator Learning Hub',
        text: 'Access free topper study notes, video modules, PDF uploads, and AI Guru doubt solving on Tomato Official!',
        url: url,
      }).catch(() => {
        // Fallback to clipboard copy
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white shadow-md border-b border-slate-800">
      {/* Top Banner Bar */}
      <div className="bg-[#0B132B] px-4 py-1.5 text-xs font-medium flex items-center justify-between text-blue-100">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">
            TOMATO OFFICIAL
          </span>
          <span className="hidden sm:inline">Official Learning Portal & Educator PDF Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShareWebsite}
            className="flex items-center gap-1 bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow transition-all"
            title="Share website link with friends"
          >
            {copiedLink ? <Check className="w-3 h-3 text-white" /> : <Share2 className="w-3 h-3 text-white" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Website 🔗'}</span>
          </button>
          <button
            onClick={() => setActiveTab('uploader-studio')}
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border transition-all ${
              activeTab === 'uploader-studio'
                ? 'bg-red-500 text-white border-red-400'
                : 'bg-slate-800 text-amber-300 border-amber-400/40 hover:bg-slate-700'
            }`}
          >
            🔒 Educator Uploader Studio
          </button>
          <div className="flex items-center gap-1 bg-slate-800/90 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{streakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 via-rose-500 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  TOMATO
                </span>
                <span className="text-xs bg-red-600 text-white font-black px-1.5 py-0.5 rounded font-mono">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[10px] text-rose-200 tracking-wider font-medium uppercase">
                Student & Uploader Hub
              </p>
            </div>
          </div>

          {/* Grade Selector & Search Bar */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-4">
            {/* Grade Selector Dropdown */}
            <div className="relative group shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 text-slate-100 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700/60 cursor-pointer shadow-inner">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>{selectedGrade}</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-300 ml-1" />
              </div>
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-white py-1">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Search Notes & Topics */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes, chapters, formulas or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/60 focus:bg-slate-900 text-white text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-700/60 focus:border-amber-400 outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Actions: Create Note & AI Guru Floating Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWebsite}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
              title="Copy share link to clipboard"
            >
              {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onOpenCreateNote}
              className="bg-gradient-to-r from-amber-400 to-[#F89D2A] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Note</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-guru')}
              className={`text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all border ${
                activeTab === 'ai-guru'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-blue-900/80 text-blue-100 hover:bg-blue-900 border-blue-800'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Guru AI</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'notes'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Notes Vault (Apne Notes)</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'subjects'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subjects & Video Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'practice'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Test Series & Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-guru')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'ai-guru'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Guru Doubt Solver</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'games'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Unlock Games Arcade</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'downloads'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-300" />
            <span>Download Folder (PDFs)</span>
          </button>

          <button
            onClick={() => setActiveTab('uploader-studio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === 'uploader-studio'
                ? 'bg-red-600 text-white border-red-500 shadow-sm'
                : 'bg-slate-800/80 text-rose-300 border-rose-500/30 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Uploader Studio (Educator)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
