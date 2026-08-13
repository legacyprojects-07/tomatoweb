export type GradeLevel = 
  | 'Class 6' 
  | 'Class 7' 
  | 'Class 8' 
  | 'Class 9' 
  | 'Class 10' 
  | 'Class 11' 
  | 'Class 12' 
  | 'JEE Mains & Advanced' 
  | 'NEET UG Prep';

export type SubjectName = 
  | 'Physics' 
  | 'Chemistry' 
  | 'Mathematics' 
  | 'Biology' 
  | 'Social Science' 
  | 'English Literature';

export type PortalMode = 'user' | 'uploader';

export type AppTab = 
  | 'dashboard' 
  | 'notes' 
  | 'subjects' 
  | 'ai-guru' 
  | 'practice' 
  | 'games' 
  | 'downloads'
  | 'uploader-studio';

export type GameType = 'quiz-battle' | 'memory-match' | 'formula-scramble' | 'trivia-tower' | 'video-game';

export interface UnlockGameRequirement {
  gameType: GameType;
  gameName: string;
  requiredScore: number;
  description: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: SubjectName;
  chapter: string;
  grade: GradeLevel;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  isLocked?: boolean; // Locked notes require playing games to unlock
  unlockRequirement?: UnlockGameRequirement;
  unlockedAt?: string;
  downloadCount?: number;
  colorHex?: string;
  fileAttachment?: {
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  };
  customPdfUrl?: string;
  aiSummary?: {
    summary: string;
    keyTakeaways: string[];
    keyFormulasOrTerms: Array<{ term: string; definition: string }>;
    mindMapNodes: Array<{ topic: string; subtopics: string[] }>;
    examTip: string;
  };
}

export interface DownloadedPdfRecord {
  id: string;
  noteId: string;
  title: string;
  subject: SubjectName;
  grade: GradeLevel;
  downloadedAt: string;
  fileSizeKb: number;
  fileName: string;
  unlockedViaGame?: string;
}

export interface Flashcard {
  id: number | string;
  front: string;
  back: string;
  hint?: string;
}

export interface FlashcardDeck {
  id: string;
  noteId?: string;
  title: string;
  subject: SubjectName;
  cards: Flashcard[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizSession {
  id: string;
  title: string;
  subject: SubjectName;
  grade: GradeLevel;
  noteId?: string;
  questions: QuizQuestion[];
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: SubjectName;
  chapter: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  summary: string;
  keyTimestamps: Array<{ time: string; topic: string }>;
  keyNotesToSave: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedNoteTitle?: string;
  suggestedQuestions?: string[];
}

export interface StudentStats {
  studyStreakDays: number;
  notesCreated: number;
  quizzesCompleted: number;
  accuracyPercentage: number;
  doubtsSolved: number;
}
