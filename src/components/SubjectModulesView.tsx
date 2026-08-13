import React, { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  FileText, 
  ArrowRight,
  GraduationCap,
  BookmarkPlus
} from 'lucide-react';
import { VideoLesson, SubjectName, GradeLevel } from '../types';
import { SUBJECT_COLOR_MAP } from '../data/initialData';

interface SubjectModulesViewProps {
  lessons: VideoLesson[];
  selectedGrade: GradeLevel;
  setSelectedGrade: (g: GradeLevel) => void;
  onSaveLessonToNotes: (lesson: VideoLesson) => void;
  onAskGuruQuestion: (q: string) => void;
}

export const SubjectModulesView: React.FC<SubjectModulesViewProps> = ({
  lessons,
  selectedGrade,
  setSelectedGrade,
  onSaveLessonToNotes,
  onAskGuruQuestion,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');
  const [activeLesson, setActiveLesson] = useState<VideoLesson | null>(lessons[0] || null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const subjectsList: Array<SubjectName | 'All'> = [
    'All',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Social Science',
    'English Literature',
  ];

  const filteredLessons = lessons.filter(
    (l) => selectedSubject === 'All' || l.subject === selectedSubject
  );

  const handleSaveTakeaway = (lesson: VideoLesson) => {
    onSaveLessonToNotes(lesson);
    setSavedSuccessMsg(`Key notes from "${lesson.title}" saved to your Notes Vault!`);
    setTimeout(() => setSavedSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0F172A] text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-md">
              Tomato Official Visual Curriculum
            </span>
            <span className="text-xs font-semibold text-gray-500">• {selectedGrade}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
            Subjects & 3D Interactive Lessons
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Watch animated concept videos, study chapter key points, and convert takeaways into your personal notes.
          </p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
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

      {savedSuccessMsg && (
        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Main Active Video Player & Lesson Breakdown */}
      {activeLesson && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-800 relative group">
              <div className="relative aspect-video bg-gray-950 flex items-center justify-center">
                <img
                  src={activeLesson.thumbnailUrl}
                  alt={activeLesson.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Simulated Play Button */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </div>

                <div className="absolute top-4 left-4 bg-[#0F172A] text-amber-300 text-xs font-extrabold px-3 py-1 rounded-md shadow">
                  {activeLesson.subject}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h2 className="text-lg font-bold drop-shadow-md">
                    {activeLesson.title}
                  </h2>
                  <p className="text-xs text-gray-200 line-clamp-1">
                    Chapter: {activeLesson.chapter} • Duration: {activeLesson.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Summary & Key Notes */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-gray-900 text-base">
                  Concept Overview & Notes
                </h3>
                <button
                  onClick={() => handleSaveTakeaway(activeLesson)}
                  className="bg-gradient-to-r from-amber-400 to-[#F89D2A] text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow hover:shadow-md flex items-center gap-1.5 transition-all"
                >
                  <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Key Notes to My Vault</span>
                </button>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {activeLesson.summary}
              </p>

              {/* Saved Takeaways Highlight */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
                <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Tomato Official Key Revision Formula / Note:</span>
                </div>
                <p className="text-xs font-mono text-amber-950 bg-white p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                  {activeLesson.keyNotesToSave}
                </p>
              </div>

              {/* Ask Guru AI About this Lesson */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Have a doubt regarding this lesson?</span>
                <button
                  onClick={() => onAskGuruQuestion(`Please explain the lesson "${activeLesson.title}" (${activeLesson.subject}) in simple terms with an example.`)}
                  className="text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ask AI Guru to Explain</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timestamps & Course Sidebar */}
          <div className="space-y-4">
            {/* Timestamps list */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>Video Chapter Timestamps</span>
              </h3>

              <div className="space-y-2">
                {activeLesson.keyTimestamps.map((ts, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-900">
                      {ts.topic}
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                      {ts.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Video Modules */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-gray-900 text-sm">
                More {selectedSubject === 'All' ? 'Popular' : selectedSubject} Lessons
              </h3>

              <div className="space-y-3">
                {filteredLessons.map((les) => {
                  const isCurrent = activeLesson?.id === les.id;
                  const color = SUBJECT_COLOR_MAP[les.subject] || { bg: 'bg-gray-50', text: 'text-gray-800' };
                  return (
                    <div
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="w-16 h-12 rounded-lg bg-gray-900 overflow-hidden shrink-0 relative">
                        <img src={les.thumbnailUrl} alt={les.title} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${color.bg} ${color.text}`}>
                          {les.subject}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">
                          {les.title}
                        </h4>
                        <span className="text-[10px] text-gray-400">{les.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
