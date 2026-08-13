import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileUp, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Download, 
  BarChart3, 
  Gamepad2, 
  BookOpen, 
  Search, 
  KeyRound, 
  AlertCircle,
  FolderDown,
  Layers
} from 'lucide-react';
import { NoteItem, SubjectName, GradeLevel, GameType } from '../types';
import { downloadNotePDFFile } from '../utils/pdfGenerator';

interface UploaderStudioViewProps {
  notes: NoteItem[];
  onSaveNote: (newNoteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onToggleLock: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSwitchToStudentView: () => void;
  onSelectNote: (note: NoteItem) => void;
}

export const UploaderStudioView: React.FC<UploaderStudioViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onToggleLock,
  onTogglePin,
  onSwitchToStudentView,
  onSelectNote
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tomato_uploader_authed') === 'true';
  });
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Note Upload Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectName>('Physics');
  const [chapter, setChapter] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Class 10');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isGameLocked, setIsGameLocked] = useState(false);
  const [gameType, setGameType] = useState<GameType>('quiz-battle');
  
  // Uploader Password Requirement
  const [uploadPassword, setUploadPassword] = useState('');
  const [uploadPasswordError, setUploadPasswordError] = useState('');

  // Attached PDF File State
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [customPdfDataUrl, setCustomPdfDataUrl] = useState<string | null>(null);

  // Search & Filter state for manager
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [publishSuccessMessage, setPublishSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword.trim().toLowerCase() === 'nexttopper') {
      setIsAuthenticated(true);
      localStorage.setItem('tomato_uploader_authed', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password! Access denied.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    setAttachedFile({
      name: file.name,
      size: sizeStr,
      type: file.type || 'PDF',
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomPdfDataUrl(dataUrl);

        if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          const textReader = new FileReader();
          textReader.onload = (txtEv) => {
            const txt = txtEv.target?.result as string;
            if (txt && !content) {
              setContent(txt);
            }
          };
          textReader.readAsText(file);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadPassword.trim().toLowerCase() !== 'nexttopper') {
      setUploadPasswordError('Incorrect password! Verification failed.');
      return;
    }

    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const noteContent = content.trim() || (attachedFile
      ? `Uploaded PDF: ${attachedFile.name}. Students can download the complete original document.`
      : 'Comprehensive revision guide uploaded by Tomato Educator.');

    let gameDesc = '';
    let gameName = '';
    if (gameType === 'quiz-battle') {
      gameName = 'Quiz Battle Arena';
      gameDesc = 'Score 80%+ in 5 physics & chemistry questions to unlock.';
    } else if (gameType === 'memory-match') {
      gameName = 'Concept Matcher';
      gameDesc = 'Match formula pairs under 60 seconds to unlock.';
    } else if (gameType === 'formula-scramble') {
      gameName = 'Formula Scramble';
      gameDesc = 'Unscramble key science formulas to unlock.';
    } else if (gameType === 'video-game') {
      gameName = 'Tomato Space Runner Video Game';
      gameDesc = 'Score 100+ points in the 2D Tomato Space Runner Video Game to unlock!';
    } else {
      gameName = 'Trivia Tower';
      gameDesc = 'Climb 5 trivia levels without failing to unlock.';
    }

    onSaveNote({
      title,
      subject,
      chapter: chapter || 'Chapter Notes',
      grade,
      content: noteContent,
      tags: tags.length > 0 ? tags : [subject, 'TomatoOfficial', grade],
      isPinned: false,
      isLocked: isGameLocked,
      colorHex: '#FEF3C7',
      customPdfUrl: customPdfDataUrl || undefined,
      ...(isGameLocked ? {
        unlockRequirement: {
          gameType,
          gameName,
          requiredScore: 80,
          description: gameDesc
        }
      } : {}),
      ...(attachedFile ? {
        fileAttachment: {
          name: attachedFile.name,
          size: attachedFile.size,
          type: attachedFile.type,
          dataUrl: customPdfDataUrl || undefined
        }
      } : {})
    });

    // Reset Form
    setTitle('');
    setChapter('');
    setContent('');
    setTagsInput('');
    setAttachedFile(null);
    setCustomPdfDataUrl(null);
    setIsGameLocked(false);
    setUploadPassword('');
    setUploadPasswordError('');

    setPublishSuccessMessage('Successfully published new PDF study note to Tomato Student Portal!');
    setTimeout(() => setPublishSuccessMessage(''), 5000);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const totalPDFsWithAttachment = notes.filter((n) => n.customPdfUrl || n.fileAttachment).length;
  const totalLockedNotes = notes.filter((n) => n.isLocked).length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-rose-500/30">
              Tomato Educator Studio
            </span>
            <h1 className="text-2xl font-black mt-2 text-white">Tomato Official Uploader Portal</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Welcome Educator! Enter your administrator password to manage notes, upload PDF documents, and configure game unlocks for students.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-amber-300 block mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Enter Uploader Password *</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter administrator password"
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                  setAuthError('');
                }}
                className="w-full text-xs font-bold p-3 bg-slate-900 text-white border border-slate-700 rounded-xl outline-none focus:border-red-500 transition-all"
              />
            </div>

            {authError && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Uploader Studio</span>
            </button>
          </form>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <span>Looking for student study notes?</span>
            <button
              onClick={onSwitchToStudentView}
              className="text-amber-400 hover:underline font-bold"
            >
              Go to Tomato Student Portal &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-500 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0 font-black">
            <Upload className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Tomato Official Uploader Studio</h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                Educator Control
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Upload class PDF notes, configure game-based student unlocks, and publish directly to Tomato Student Portal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSwitchToStudentView}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Switch to Tomato Student View</span>
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('tomato_uploader_authed');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            Lock Studio
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{notes.length}</div>
            <div className="text-xs font-semibold text-gray-500">Published Notes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FolderDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{totalPDFsWithAttachment}</div>
            <div className="text-xs font-semibold text-gray-500">Custom Uploaded PDFs</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{totalLockedNotes}</div>
            <div className="text-xs font-semibold text-gray-500">Game-Locked Notes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">Active</div>
            <div className="text-xs font-semibold text-gray-500">Tomato Official Password Mode</div>
          </div>
        </div>
      </div>

      {publishSuccessMessage && (
        <div className="bg-emerald-500 text-slate-950 p-4 rounded-2xl font-extrabold text-xs shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 stroke-[3]" />
            <span>{publishSuccessMessage}</span>
          </div>
          <button
            onClick={onSwitchToStudentView}
            className="underline font-black text-slate-900 hover:text-white"
          >
            Preview in Student Portal &rarr;
          </button>
        </div>
      )}

      {/* Main Grid: Upload Form + Content Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-lg space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-100 text-red-600 font-bold">
                <FileUp className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-gray-900">Upload PDF & Publish Note</h2>
                <p className="text-xs text-gray-500">Security password required</p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePublishNote} className="space-y-4">
            {/* Password input */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-black text-amber-300 flex items-center justify-between">
                <span>Verification Password *</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter security password"
                value={uploadPassword}
                onChange={(e) => {
                  setUploadPassword(e.target.value);
                  setUploadPasswordError('');
                }}
                className={`w-full text-xs font-bold p-2.5 bg-slate-950 text-white border rounded-xl outline-none ${
                  uploadPasswordError ? 'border-red-500 text-red-200' : 'border-slate-700 focus:border-amber-400'
                }`}
              />
              {uploadPasswordError && (
                <p className="text-[10px] text-red-400 font-bold">{uploadPasswordError}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-extrabold text-gray-800 block mb-1">Note Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Optics & Ray Diagrams Master Class"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-red-600"
              />
            </div>

            {/* Subject & Grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-gray-800 block mb-1">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectName)}
                  className="w-full text-xs font-bold p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-red-600"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Social Science">Social Science</option>
                  <option value="English Literature">English Literature</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-800 block mb-1">Class / Grade *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full text-xs font-bold p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-red-600"
                >
                  <option value="Class 10">Class 10</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 9">Class 9</option>
                  <option value="JEE Mains & Advanced">JEE Mains & Advanced</option>
                  <option value="NEET UG Prep">NEET UG Prep</option>
                </select>
              </div>
            </div>

            {/* Chapter */}
            <div>
              <label className="text-xs font-extrabold text-gray-800 block mb-1">Chapter Name</label>
              <input
                type="text"
                placeholder="e.g., Chapter 10: Light Reflection & Refraction"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-red-600"
              />
            </div>

            {/* Custom PDF Upload Dropzone */}
            <div className="bg-red-50/60 border-2 border-dashed border-red-300 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black text-gray-900 block">Attach Custom PDF Document</span>
                  <span className="text-[11px] text-gray-600">
                    {attachedFile
                      ? `Selected: ${attachedFile.name} (${attachedFile.size})`
                      : 'Upload your PDF so students download your exact file!'}
                  </span>
                </div>

                <label className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs px-3.5 py-2 rounded-xl cursor-pointer transition-colors shrink-0 shadow">
                  <span>{attachedFile ? 'Change PDF' : 'Upload PDF'}</span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {attachedFile && (
                <div className="bg-emerald-100 border border-emerald-300 p-2 rounded-xl text-[11px] font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>PDF Document ready for publication!</span>
                </div>
              )}
            </div>

            {/* Game Unlock Configuration */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-amber-600" />
                  <span>Require Arcade Game to Unlock PDF?</span>
                </label>
                <input
                  type="checkbox"
                  checked={isGameLocked}
                  onChange={(e) => setIsGameLocked(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {isGameLocked && (
                <div className="pt-2 space-y-2 border-t border-amber-200/80">
                  <label className="text-[11px] font-bold text-amber-900 block">Select Arcade Unlock Game:</label>
                  <select
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value as GameType)}
                    className="w-full text-xs font-bold p-2 bg-white text-gray-900 border border-amber-300 rounded-lg outline-none"
                  >
                    <option value="video-game">🎮 Tomato Space Runner Video Game (2D Canvas)</option>
                    <option value="quiz-battle">Quiz Battle Arena (MCQ Test)</option>
                    <option value="memory-match">Concept Matcher (Formula Pairs)</option>
                    <option value="formula-scramble">Formula Scramble (Word Puzzle)</option>
                    <option value="trivia-tower">Trivia Tower (Rapid Fire)</option>
                  </select>
                  <p className="text-[10px] text-amber-800">
                    Students must win this game in the Arcade to download this PDF note.
                  </p>
                </div>
              )}
            </div>

            {/* Content / Summary */}
            <div>
              <label className="text-xs font-extrabold text-gray-800 block mb-1">
                Note Summary / Key Points {attachedFile ? '(Optional)' : '*'}
              </label>
              <textarea
                rows={4}
                placeholder="Type additional summary, key formulas, or exam tips for students..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Publish Note to Tomato Student Portal</span>
            </button>
          </form>
        </div>

        {/* Right Column: Manage Uploaded Notes Directory */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Manage Published Content</h2>
              <p className="text-xs text-gray-500">Tomato Official Content Directory ({notes.length} items)</p>
            </div>

            {/* Subject filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedSubject === subj
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search published notes by title, chapter, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-xs font-semibold text-gray-800 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-600"
            />
          </div>

          {/* Table of Notes */}
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs font-bold">
                No matching published notes found.
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className="py-4 hover:bg-slate-50/60 p-3 rounded-2xl transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {note.subject} • {note.grade}
                      </span>
                      {note.isLocked ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Game Locked</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>Unlocked (Free)</span>
                        </span>
                      )}

                      {note.fileAttachment && (
                        <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-red-600" />
                          <span>Custom PDF</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-sm">{note.title}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {note.chapter} • Published {note.createdAt}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onToggleLock(note.id)}
                      title={note.isLocked ? "Unlock Note for All" : "Lock with Game Requirement"}
                      className={`p-2 rounded-xl text-xs font-bold transition-all ${
                        note.isLocked
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {note.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => downloadNotePDFFile(note)}
                      title="Test Download PDF"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectNote(note)}
                      title="Preview Note"
                      className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      title="Delete Published Note"
                      className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
