import React, { useState, useEffect } from 'react';
import { 
  NoteItem, 
  VideoLesson, 
  SubjectName, 
  GradeLevel, 
  ChatMessage, 
  QuizSession, 
  FlashcardDeck,
  AppTab,
  DownloadedPdfRecord
} from './types';
import { INITIAL_NOTES, INITIAL_LESSONS } from './data/initialData';
import { HeaderNavbar } from './components/HeaderNavbar';
import { DashboardView } from './components/DashboardView';
import { NotesVaultView } from './components/NotesVaultView';
import { SubjectModulesView } from './components/SubjectModulesView';
import { AIGuruAssistant } from './components/AIGuruAssistant';
import { GamesUnlockView } from './components/GamesUnlockView';
import { DownloadsFolderView } from './components/DownloadsFolderView';
import { NoteDetailModal } from './components/NoteDetailModal';
import { CreateNoteModal } from './components/CreateNoteModal';
import { PracticeQuizModal } from './components/PracticeQuizModal';
import { FlashcardsModal } from './components/FlashcardsModal';
import { UploaderStudioView } from './components/UploaderStudioView';

export default function App() {
  // Navigation & Preferences State
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Class 10');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [streakDays, setStreakDays] = useState(5);

  // Notes State
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('byjus_hub_notes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved notes from localStorage:', e);
    }
    return INITIAL_NOTES;
  });

  useEffect(() => {
    try {
      // Strip large dataUrls from notes before storing in localStorage to prevent QuotaExceededError
      const lightNotes = notes.map((n) => {
        if (n.customPdfUrl && n.customPdfUrl.length > 300000) {
          const { customPdfUrl, ...rest } = n;
          return rest;
        }
        if (n.fileAttachment?.dataUrl && n.fileAttachment.dataUrl.length > 300000) {
          return {
            ...n,
            fileAttachment: {
              ...n.fileAttachment,
              dataUrl: undefined,
            },
            customPdfUrl: undefined,
          };
        }
        return n;
      });
      localStorage.setItem('byjus_hub_notes', JSON.stringify(lightNotes));
    } catch (e) {
      console.warn('Could not save notes to localStorage:', e);
    }
  }, [notes]);

  // Downloaded PDFs Records State
  const [downloadedRecords, setDownloadedRecords] = useState<DownloadedPdfRecord[]>(() => {
    try {
      const saved = localStorage.getItem('next_topper_downloads');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved downloads from localStorage:', e);
    }
    return [
      {
        id: 'dl-1',
        noteId: 'n-1',
        title: 'Electricity & Ohm\'s Law Revision Guide',
        subject: 'Physics',
        grade: 'Class 10',
        fileName: 'Electricity_Ohms_Law_NEXT_TOPPER.pdf',
        fileSizeKb: 184,
        downloadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('next_topper_downloads', JSON.stringify(downloadedRecords));
    } catch (e) {
      console.warn('Could not save downloads to localStorage:', e);
    }
  }, [downloadedRecords]);

  // Lessons State
  const [lessons] = useState<VideoLesson[]>(INITIAL_LESSONS);

  // AI Guru Messages State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('byjus_hub_messages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved messages from localStorage:', e);
    }
    return [
      {
        id: 'msg-1',
        role: 'assistant',
        text: `Namaste! I am Tomato Official AI Guru. I am here to answer your doubts in Class 10 Physics, Chemistry, Maths, and Biology, summarize your study notes, and generate custom practice tests! What would you like to revise today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('byjus_hub_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save messages to localStorage:', e);
    }
  }, [messages]);

  // Modals & Active Selections
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [activeQuizSession, setActiveQuizSession] = useState<QuizSession | null>(null);
  const [activeFlashcardDeck, setActiveFlashcardDeck] = useState<FlashcardDeck | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [presetGuruQuestion, setPresetGuruQuestion] = useState<string | null>(null);

  // --- Handlers ---

  // 0. Game Unlock & Download Tracking Handlers
  const handleUnlockNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isLocked: false } : n))
    );
  };

  const handleRecordDownload = (record: DownloadedPdfRecord) => {
    setDownloadedRecords((prev) => {
      if (prev.some((r) => r.noteId === record.noteId)) return prev;
      return [record, ...prev];
    });
  };

  const handleRemoveDownloadRecord = (id: string) => {
    setDownloadedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearDownloads = () => {
    setDownloadedRecords([]);
  };

  // 1. Create Note
  const handleSaveNote = (newNoteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  // 2. Delete Note
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  // 3. Toggle Pin
  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleToggleLockNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isLocked: !n.isLocked } : n))
    );
  };

  // 4. Update Note
  const handleUpdateNote = (updated: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setSelectedNote(updated);
  };

  // 5. Ask AI Guru
  const handleSendMessage = async (userMsg: string, noteContext?: string, language: 'hinglish' | 'english' = 'hinglish') => {
    const userMsgObj: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setIsLoadingAi(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: noteContext,
          studentGrade: selectedGrade,
          language,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      let aiText = data.text;
      if (!aiText) {
        aiText = `Dekho dosto, Tomato Official AI Guru is preparing your breakdown. Key concept: Always double-check your formula and draw clear diagrams in your CBSE answer sheet!`;
      }

      const assistantMsgObj: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsgObj]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: `Bhai! I am calculating the exact step-by-step solution. Tip: ${userMsg.toLowerCase().includes('physics') ? 'Force F = m * a where m is mass in kg.' : 'Make sure to write balanced chemical equations with state symbols!'}` ,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 6. AI Summarize Note
  const handleSummarizeNote = async (note: NoteItem) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteTitle: note.title,
          noteContent: note.content,
          subject: note.subject,
        }),
      });

      const summaryData = await res.json();
      if (summaryData.summary) {
        const updatedNote: NoteItem = { ...note, aiSummary: summaryData };
        handleUpdateNote(updatedNote);
      }
    } catch (e) {
      console.error(e);
      // Fallback summary
      const mockSummary = {
        summary: `Core concept analysis of ${note.title}: Focuses on key equations, real-world applications, and high-yield board exam topics.`,
        keyTakeaways: [
          `Understand the fundamental formula and SI units.`,
          `Practice drawing labeled diagrams for maximum board exam marks.`,
          `Revise numerical problems step-by-step.`
        ],
        keyFormulasOrTerms: [
          { term: "Key Principle", definition: "Core mathematical or physical relationship described in notes." }
        ],
        mindMapNodes: [
          { topic: note.title, subtopics: ["Definitions", "Formulas", "Applications"] }
        ],
        examTip: "Highlight formulas in a box in your exam answer sheet for quick examiner evaluation!"
      };
      handleUpdateNote({ ...note, aiSummary: mockSummary });
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 7. Start AI Quiz
  const handleStartQuizForNote = async (note: NoteItem) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteContent: note.content,
          subject: note.subject,
          grade: note.grade,
          topic: note.title,
          count: 5,
        }),
      });

      const quizData = await res.json();
      if (quizData.questions && quizData.questions.length > 0) {
        setActiveQuizSession({
          id: `quiz-${Date.now()}`,
          title: `Practice Test: ${note.title}`,
          subject: note.subject,
          grade: note.grade,
          noteId: note.id,
          questions: quizData.questions,
        });
      } else {
        throw new Error('No questions generated');
      }
    } catch (e) {
      console.error(e);
      // Fallback Quiz
      setActiveQuizSession({
        id: `quiz-${Date.now()}`,
        title: `Practice Test: ${note.title}`,
        subject: note.subject,
        grade: note.grade,
        noteId: note.id,
        questions: [
          {
            id: 1,
            question: `Which of the following best summarizes the main concept in "${note.title}"?`,
            options: [
              `The rate of change of momentum is proportional to applied force`,
              `The total energy in an isolated system remains constant`,
              `Current is inversely proportional to temperature`,
              `None of the above`
            ],
            correctIndex: 0,
            explanation: `Based on classical mechanics principles covered in your revision notes.`,
            difficulty: 'Medium'
          },
          {
            id: 2,
            question: `In CBSE board exams, why is drawing clear force/circuit diagrams recommended?`,
            options: [
              `It helps examiners evaluate step marks accurately`,
              `It reduces required calculation length`,
              `It doubles total time given`,
              `It replaces written definitions entirely`
            ],
            correctIndex: 0,
            explanation: `Visual diagrams demonstrate deep conceptual understanding in science & math exams.`,
            difficulty: 'Easy'
          }
        ]
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 8. Start Flashcards
  const handleStartFlashcardsForNote = async (note: NoteItem) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteContent: note.content,
          subject: note.subject,
        }),
      });

      const deckData = await res.json();
      if (deckData.cards && deckData.cards.length > 0) {
        setActiveFlashcardDeck({
          id: `deck-${Date.now()}`,
          noteId: note.id,
          title: `Revision Cards: ${note.title}`,
          subject: note.subject,
          cards: deckData.cards,
        });
      } else {
        throw new Error('No cards generated');
      }
    } catch (e) {
      console.error(e);
      setActiveFlashcardDeck({
        id: `deck-${Date.now()}`,
        noteId: note.id,
        title: `Revision Cards: ${note.title}`,
        subject: note.subject,
        cards: [
          { id: 1, front: `What is the core formula in ${note.title}?`, back: `Refer to your saved note formula section for exact SI units and variables.` },
          { id: 2, front: `State one real-world application of this concept.`, back: `Used in sports, engineering, and everyday phenomenon.` }
        ]
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  // 9. Save Lesson Key Notes to Vault
  const handleSaveLessonToNotes = (lesson: VideoLesson) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: `Lesson Notes: ${lesson.title}`,
      subject: lesson.subject,
      chapter: lesson.chapter,
      grade: selectedGrade,
      content: `# ${lesson.title}\n\n## Summary:\n${lesson.summary}\n\n## Key Revision Formula/Note:\n${lesson.keyNotesToSave}`,
      tags: [lesson.subject, 'VideoLesson', 'NEXT_TOPPER'],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isPinned: false,
      colorHex: '#FEF3C7',
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleAskGuruFromDashboard = (question: string) => {
    setPresetGuruQuestion(question);
    setActiveTab('ai-guru');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        onOpenCreateNote={() => setIsCreateNoteOpen(true)}
        streakDays={streakDays}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            notes={notes}
            lessons={lessons}
            selectedGrade={selectedGrade}
            onSelectTab={setActiveTab}
            onOpenCreateNote={() => setIsCreateNoteOpen(true)}
            onSelectNote={(n) => setSelectedNote(n)}
            onStartQuizForNote={handleStartQuizForNote}
            onAskGuruQuestion={handleAskGuruFromDashboard}
            streakDays={streakDays}
          />
        )}

        {activeTab === 'notes' && (
          <NotesVaultView
            notes={notes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            onOpenCreateNote={() => setIsCreateNoteOpen(true)}
            onSelectNote={(n) => setSelectedNote(n)}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onStartQuizForNote={handleStartQuizForNote}
            onStartFlashcardsForNote={handleStartFlashcardsForNote}
            onSummarizeNote={handleSummarizeNote}
            onGoToGames={() => setActiveTab('games')}
            isLoadingAi={isLoadingAi}
          />
        )}

        {activeTab === 'games' && (
          <GamesUnlockView
            notes={notes}
            onUnlockNote={handleUnlockNote}
            onRecordDownload={handleRecordDownload}
            onGoToDownloads={() => setActiveTab('downloads')}
            onSelectNote={(n) => setSelectedNote(n)}
          />
        )}

        {activeTab === 'downloads' && (
          <DownloadsFolderView
            downloadedRecords={downloadedRecords}
            allNotes={notes}
            onClearDownloads={handleClearDownloads}
            onRemoveRecord={handleRemoveDownloadRecord}
            onSelectNote={(n) => setSelectedNote(n)}
            onGoToGames={() => setActiveTab('games')}
          />
        )}

        {activeTab === 'uploader-studio' && (
          <UploaderStudioView
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onToggleLock={handleToggleLockNote}
            onTogglePin={handleTogglePin}
            onSwitchToStudentView={() => setActiveTab('dashboard')}
            onSelectNote={(n) => setSelectedNote(n)}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectModulesView
            lessons={lessons}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            onSaveLessonToNotes={handleSaveLessonToNotes}
            onAskGuruQuestion={handleAskGuruFromDashboard}
          />
        )}

        {activeTab === 'ai-guru' && (
          <AIGuruAssistant
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isLoadingAi}
            notes={notes}
            selectedGrade={selectedGrade}
            onClearHistory={() => setMessages([])}
            presetQuestion={presetGuruQuestion}
            onClearPresetQuestion={() => setPresetGuruQuestion(null)}
          />
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6 pb-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Tomato Official Practice & Test Series
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Select any saved note from your vault to generate an instant 5-question AI practice test or flashcard deck.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((n) => (
                <div key={n.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded">
                    {n.subject}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-sm line-clamp-1">{n.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{n.chapter}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleStartQuizForNote(n)}
                      className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2 rounded-xl text-center shadow-sm transition-colors"
                    >
                      Start AI Quiz
                    </button>
                    <button
                      onClick={() => handleStartFlashcardsForNote(n)}
                      className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl text-center shadow-sm transition-colors"
                    >
                      Flashcards
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- Modals --- */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onStartQuiz={handleStartQuizForNote}
          onStartFlashcards={handleStartFlashcardsForNote}
          onSummarizeNote={handleSummarizeNote}
          onAskGuruAboutNote={(n) => {
            setSelectedNote(null);
            handleAskGuruFromDashboard(`Explain "${n.title}" (${n.subject}) in simple terms.`);
          }}
          isLoadingAi={isLoadingAi}
        />
      )}

      {isCreateNoteOpen && (
        <CreateNoteModal
          onClose={() => setIsCreateNoteOpen(false)}
          onSaveNote={handleSaveNote}
          selectedGrade={selectedGrade}
        />
      )}

      {activeQuizSession && (
        <PracticeQuizModal
          quizSession={activeQuizSession}
          onClose={() => setActiveQuizSession(null)}
        />
      )}

      {activeFlashcardDeck && (
        <FlashcardsModal
          deck={activeFlashcardDeck}
          onClose={() => setActiveFlashcardDeck(null)}
        />
      )}
    </div>
  );
}
