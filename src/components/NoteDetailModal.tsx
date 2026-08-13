import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Save, 
  FileText, 
  Zap, 
  Layers, 
  BrainCircuit, 
  Copy, 
  Check, 
  Pin, 
  Trash2, 
  Tag, 
  BookOpen,
  FileDown
} from 'lucide-react';
import { NoteItem, SubjectName, GradeLevel } from '../types';
import { SUBJECT_COLOR_MAP } from '../data/initialData';
import { downloadNotePDFFile } from '../utils/pdfGenerator';

interface NoteDetailModalProps {
  note: NoteItem;
  onClose: () => void;
  onUpdateNote: (updated: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onStartQuiz: (note: NoteItem) => void;
  onStartFlashcards: (note: NoteItem) => void;
  onSummarizeNote: (note: NoteItem) => void;
  onAskGuruAboutNote: (note: NoteItem) => void;
  isLoadingAi: boolean;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  note,
  onClose,
  onUpdateNote,
  onDeleteNote,
  onStartQuiz,
  onStartFlashcards,
  onSummarizeNote,
  onAskGuruAboutNote,
  isLoadingAi,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'summary'>('content');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [chapter, setChapter] = useState(note.chapter);
  const [content, setContent] = useState(note.content);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    onUpdateNote({
      ...note,
      title,
      chapter,
      content,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const color = SUBJECT_COLOR_MAP[note.subject] || { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 space-y-0">
        {/* Modal Top Bar */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${color.bg} ${color.text}`}>
              {note.subject}
            </span>
            <span className="text-xs text-blue-200 font-medium">{note.grade}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-blue-50/80 px-6 py-3 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3">
          {/* View Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'content'
                  ? 'bg-[#0F172A] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Full Note
            </button>
            <button
              onClick={() => {
                setActiveTab('summary');
                if (!note.aiSummary) onSummarizeNote(note);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'summary'
                  ? 'bg-[#0F172A] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Summary & Mindmap</span>
            </button>
          </div>

          {/* AI Tools CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadNotePDFFile(note)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => onStartQuiz(note)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Take AI Quiz</span>
            </button>

            <button
              onClick={() => onStartFlashcards(note)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => onAskGuruAboutNote(note)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-blue-700" />
              <span>Ask Guru AI</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {activeTab === 'content' && (
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-sm font-bold text-gray-900 p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Chapter</label>
                    <input
                      type="text"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Content (Markdown / Text)</label>
                    <textarea
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs font-mono text-gray-900 p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs font-bold px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-xs font-bold px-4 py-2 rounded-xl bg-[#0F172A] text-amber-300 hover:bg-slate-800 shadow flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-gray-900">{note.title}</h2>
                      <p className="text-xs text-gray-500 font-medium">Chapter: {note.chapter}</p>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                    >
                      Edit Note
                    </button>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 whitespace-pre-wrap font-sans text-xs sm:text-sm text-gray-800 leading-relaxed min-h-[220px]">
                    {note.content}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              {isLoadingAi && (
                <div className="p-8 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-blue-700 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-blue-900">
                    Tomato Official AI is analyzing your notes and generating mindmaps...
                  </p>
                </div>
              )}

              {note.aiSummary && !isLoadingAi && (
                <div className="space-y-4">
                  {/* Summary Box */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-1">
                    <h3 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      <span>Core Concept Summary</span>
                    </h3>
                    <p className="text-xs text-blue-900 leading-relaxed">
                      {note.aiSummary.summary}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                    <h3 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                      Key Exam Takeaways
                    </h3>
                    <ul className="space-y-1.5">
                      {note.aiSummary.keyTakeaways.map((kt, i) => (
                        <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{kt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formulas & Terms */}
                  {note.aiSummary.keyFormulasOrTerms?.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                      <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                        Key Formulas & Definitions
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {note.aiSummary.keyFormulasOrTerms.map((f, i) => (
                          <div key={i} className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
                            <span className="font-extrabold text-purple-900 block">{f.term}</span>
                            <span className="text-gray-600">{f.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exam Secret Tip */}
                  {note.aiSummary.examTip && (
                    <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                      💡 <strong className="text-emerald-900">Exam Tip:</strong> {note.aiSummary.examTip}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
