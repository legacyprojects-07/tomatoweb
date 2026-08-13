import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Languages, 
  GraduationCap, 
  FileText, 
  Trash2, 
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { ChatMessage, NoteItem, GradeLevel, SubjectName } from '../types';

interface AIGuruAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string, noteContext?: string, lang?: 'hinglish' | 'english') => Promise<void>;
  isThinking: boolean;
  notes: NoteItem[];
  selectedGrade: GradeLevel;
  onClearHistory: () => void;
  presetQuestion?: string | null;
  onClearPresetQuestion?: () => void;
}

export const AIGuruAssistant: React.FC<AIGuruAssistantProps> = ({
  messages,
  onSendMessage,
  isThinking,
  notes,
  selectedGrade,
  onClearHistory,
  presetQuestion,
  onClearPresetQuestion,
}) => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'hinglish' | 'english'>('hinglish');
  const [selectedNoteContextId, setSelectedNoteContextId] = useState<string>('none');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (presetQuestion) {
      setInputText(presetQuestion);
      if (onClearPresetQuestion) onClearPresetQuestion();
    }
  }, [presetQuestion]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const query = inputText;
    setInputText('');

    let noteTextContext = '';
    if (selectedNoteContextId !== 'none') {
      const foundNote = notes.find((n) => n.id === selectedNoteContextId);
      if (foundNote) {
        noteTextContext = `Title: ${foundNote.title}\nSubject: ${foundNote.subject}\nContent:\n${foundNote.content}`;
      }
    }

    await onSendMessage(query, noteTextContext, language);
  };

  const handleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*$`]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    "Newton ke 3 laws cricket examples ke saath samjhao",
    "How to make a 7-day revision plan for Board Exams?",
    "Chemical Bonding me Ionic vs Covalent ka shortcut trick",
    "Trigonometry formulas list for Class 10",
    "Photosynthesis step-by-step breakdown"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0B132B] text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <Bot className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Tomato Official AI Guru Study Assistant
              </h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Active 24/7
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Ask doubts, understand complex concepts, create study schedules, and revise your notes!
            </p>
          </div>
        </div>

        {/* Controls: Language & History Clear */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            <Languages className="w-3.5 h-3.5 text-blue-300 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                language === 'hinglish'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                language === 'english'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={onClearHistory}
            title="Clear Chat History"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Note Context Selector Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <FileText className="w-4 h-4 text-blue-700 shrink-0" />
        <span className="text-xs font-bold text-gray-700 shrink-0">
          Attach Note Context:
        </span>
        <select
          value={selectedNoteContextId}
          onChange={(e) => setSelectedNoteContextId(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-lg px-3 py-1.5 outline-none focus:border-blue-600 font-medium"
        >
          <option value="none">-- No note selected (General Doubt Solving) --</option>
          {notes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title} ({n.subject})
            </option>
          ))}
        </select>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-800">
              <Sparkles className="w-8 h-8 text-blue-700" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">
              Namaste Student! How can I guide you today?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              I am your Tomato Official AI Guru. Ask me any doubt in {selectedGrade}, request formula shortcuts, or choose a quick topic below:
            </p>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(p)}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold px-3 py-1.5 rounded-xl transition-all text-left"
                >
                  💡 {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#0F172A] text-white rounded-tr-none'
                  : 'bg-gray-50 text-gray-900 border border-gray-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {msg.role === 'assistant' && (
                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleSpeech(msg.id, msg.text)}
                    className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors bg-blue-100/60 px-2 py-0.5 rounded"
                  >
                    {speakingMsgId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Listen Voice</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                You
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-100 border border-gray-200 text-gray-600 text-xs px-4 py-3 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-700 animate-spin" />
              <span>Tomato Official AI Guru is preparing step-by-step breakdown...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleFormSubmit} className="bg-white p-3 rounded-2xl border border-gray-200 shadow-md flex items-center gap-2">
        <input
          type="text"
          placeholder={
            language === 'hinglish'
              ? "Bhai koi bhi doubt puchho (e.g., Photosynthesis step-by-step batao)..."
              : "Ask any doubt or question (e.g. Explain Quadratic Equations)..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isThinking}
          className="flex-1 text-xs sm:text-sm text-gray-900 px-4 py-2.5 outline-none font-medium placeholder-gray-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="bg-gradient-to-r from-amber-400 to-[#F89D2A] hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all shrink-0"
        >
          <span>Ask</span>
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};
