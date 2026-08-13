import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Pin, 
  Brain, 
  Zap, 
  BookOpen, 
  Filter, 
  Download, 
  Layers, 
  Tag, 
  CheckCircle2, 
  Copy, 
  Share2,
  FileUp,
  Lock,
  Unlock,
  Gamepad2,
  FileDown
} from 'lucide-react';
import { NoteItem, SubjectName, GradeLevel } from '../types';
import { SUBJECT_COLOR_MAP } from '../data/initialData';
import { downloadNotePDFFile } from '../utils/pdfGenerator';

interface NotesVaultViewProps {
  notes: NoteItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSubject: SubjectName | 'All';
  setSelectedSubject: (s: SubjectName | 'All') => void;
  onOpenCreateNote: () => void;
  onSelectNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onStartQuizForNote: (note: NoteItem) => void;
  onStartFlashcardsForNote: (note: NoteItem) => void;
  onSummarizeNote: (note: NoteItem) => void;
  onGoToGames: () => void;
  isLoadingAi: boolean;
}

export const NotesVaultView: React.FC<NotesVaultViewProps> = ({
  notes,
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  onOpenCreateNote,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
  onStartQuizForNote,
  onStartFlashcardsForNote,
  onSummarizeNote,
  onGoToGames,
  isLoadingAi,
}) => {
  const subjectsList: Array<SubjectName | 'All'> = [
    'All',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Social Science',
    'English Literature',
  ];

  const filteredNotes = notes.filter((n) => {
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      !q || 
      n.title.toLowerCase().includes(q) || 
      n.chapter.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q));
    return matchesSubject && matchesQuery;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              My Notes Vault (Apne Revision Notes)
            </h1>
            <span className="bg-[#0F172A] text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {notes.length} Notes
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Store, search, and transform your school notes into AI summaries, practice quizzes & flashcards.
          </p>
        </div>

        <button
          onClick={onOpenCreateNote}
          className="bg-gradient-to-r from-amber-400 to-[#F89D2A] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Note</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by topic, keyword, formula or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-gray-900 pl-9 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Subject Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {subjectsList.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedSubject === sub
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300 space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800 text-base">No notes found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? `No notes matched "${searchQuery}". Try changing your search query or subject filter.`
              : 'You haven\'t added any notes yet. Create your first note or upload a text study guide!'}
          </p>
          <button
            onClick={onOpenCreateNote}
            className="bg-[#0F172A] text-amber-300 font-bold text-xs px-4 py-2 rounded-xl shadow inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Note</span>
          </button>
        </div>
      )}

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Pinned Core Notes ({pinnedNotes.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onSelectNote={onSelectNote}
                onDeleteNote={onDeleteNote}
                onTogglePin={onTogglePin}
                onStartQuizForNote={onStartQuizForNote}
                onStartFlashcardsForNote={onStartFlashcardsForNote}
                onSummarizeNote={onSummarizeNote}
                onGoToGames={onGoToGames}
                isLoadingAi={isLoadingAi}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Unpinned Notes */}
      {unpinnedNotes.length > 0 && (
        <div className="space-y-3">
          {pinnedNotes.length > 0 && (
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              All Notes ({unpinnedNotes.length})
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onSelectNote={onSelectNote}
                onDeleteNote={onDeleteNote}
                onTogglePin={onTogglePin}
                onStartQuizForNote={onStartQuizForNote}
                onStartFlashcardsForNote={onStartFlashcardsForNote}
                onSummarizeNote={onSummarizeNote}
                onGoToGames={onGoToGames}
                isLoadingAi={isLoadingAi}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface NoteCardProps {
  note: NoteItem;
  onSelectNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onStartQuizForNote: (note: NoteItem) => void;
  onStartFlashcardsForNote: (note: NoteItem) => void;
  onSummarizeNote: (note: NoteItem) => void;
  onGoToGames: () => void;
  isLoadingAi: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
  onStartQuizForNote,
  onStartFlashcardsForNote,
  onSummarizeNote,
  onGoToGames,
  isLoadingAi
}) => {
  const color = SUBJECT_COLOR_MAP[note.subject] || { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' };

  if (note.isLocked) {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${color.bg} ${color.text} border ${color.border}`}>
              {note.subject}
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Locked</span>
            </span>
          </div>

          <h3 className="font-extrabold text-gray-900 text-base mb-1.5 line-clamp-1">
            {note.title}
          </h3>

          <div className="text-[11px] text-gray-400 font-medium mb-3">
            {note.chapter} • {note.grade}
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-xs space-y-1 mb-4">
            <span className="font-extrabold text-amber-900 block flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{note.unlockRequirement?.gameName || 'Arcade Game'}</span>
            </span>
            <p className="text-[11px] text-amber-800">{note.unlockRequirement?.description}</p>
          </div>
        </div>

        <button
          onClick={onGoToGames}
          className="w-full text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-amber-300 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow"
        >
          <Gamepad2 className="w-4 h-4 text-amber-300" />
          <span>Play Game to Unlock Note & PDF</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${color.bg} ${color.text} border ${color.border}`}>
            {note.subject}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => downloadNotePDFFile(note)}
              title="Export as PDF"
              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTogglePin(note.id)}
              title={note.isPinned ? "Unpin Note" : "Pin Note"}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                note.isPinned ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteNote(note.id)}
              title="Delete Note"
              className="p-1 text-gray-300 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectNote(note)}
          className="font-extrabold text-gray-900 text-base mb-1.5 group-hover:text-blue-800 cursor-pointer line-clamp-1"
        >
          {note.title}
        </h3>

        <div className="text-[11px] text-gray-400 font-medium mb-3">
          {note.chapter} • {note.grade}
        </div>

        {/* Note Preview */}
        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {note.content.replace(/[#*$`]/g, '')}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* AI Summary Banner Indicator if available */}
        {note.aiSummary && (
          <div className="mb-3 bg-blue-50 border border-blue-200 p-2 rounded-lg text-[11px] text-blue-900 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="line-clamp-1">AI Summary & Mindmap ready</span>
          </div>
        )}
      </div>

      {/* AI Tool Actions */}
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onSummarizeNote(note)}
            title="AI Summarize Note"
            className="text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Summary</span>
          </button>

          <button
            onClick={() => onStartQuizForNote(note)}
            title="Generate AI Practice Quiz"
            className="text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-600" />
            <span>AI Quiz</span>
          </button>

          <button
            onClick={() => downloadNotePDFFile(note)}
            title="Export PDF Document"
            className="text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <FileDown className="w-3 h-3 text-emerald-600" />
            <span>PDF</span>
          </button>
        </div>

        <button
          onClick={() => onSelectNote(note)}
          className="w-full text-xs font-bold bg-gray-900 hover:bg-black text-white py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Open Full Note & Edit</span>
        </button>
      </div>
    </div>
  );
};
