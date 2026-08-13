import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RefreshCw, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  FileText
} from 'lucide-react';
import { QuizSession, QuizQuestion } from '../types';

interface PracticeQuizModalProps {
  quizSession: QuizSession;
  onClose: () => void;
}

export const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({
  quizSession,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<{ questionId: number; selected: number; isCorrect: boolean }>>([]);

  const currentQ: QuizQuestion = quizSession.questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) setScore((prev) => prev + 1);

    setUserAnswers((prev) => [
      ...prev,
      { questionId: currentQ.id, selected: idx, isCorrect }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < quizSession.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setUserAnswers([]);
  };

  const percentage = Math.round((score / quizSession.questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                Tomato Official Practice Test
              </span>
              <span className="text-xs text-blue-200">{quizSession.subject} • {quizSession.grade}</span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-1 leading-tight">
              {quizSession.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Progress Bar & Question Counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Question {currentIndex + 1} of {quizSession.questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#F89D2A] transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / quizSession.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  {currentQ.difficulty || 'Medium'} Difficulty
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-gray-800";
                  
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200";
                    } else if (idx === selectedOption) {
                      btnStyle = "border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-200";
                    } else {
                      btnStyle = "border-gray-200 bg-gray-50 opacity-60 text-gray-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between font-medium ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center border border-gray-200">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1 animate-fade-in">
                  <div className="font-extrabold flex items-center gap-1.5 text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    <span>Tomato Official Explanation:</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="bg-[#0F172A] hover:bg-slate-800 text-amber-300 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow flex items-center gap-2 transition-all"
                  >
                    <span>{currentIndex < quizSession.questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10 stroke-[2]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900">Quiz Completed!</h3>
                <p className="text-xs text-gray-500 mt-1">Here is your Tomato Official practice performance summary</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 max-w-sm mx-auto space-y-2">
                <div className="text-4xl font-black text-blue-950">{percentage}%</div>
                <p className="text-xs font-bold text-blue-800">
                  You scored {score} out of {quizSession.questions.length} correct!
                </p>
                <div className="text-[11px] text-blue-700">
                  {percentage >= 80 ? '🌟 Outstanding performance! Ready for Board Exams.' : '👍 Good attempt! Revise your notes to boost score.'}
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>

                <button
                  onClick={onClose}
                  className="bg-[#0F172A] text-amber-300 font-extrabold text-xs px-6 py-2.5 rounded-xl shadow hover:bg-slate-800 transition-colors"
                >
                  Back to Notes Vault
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
