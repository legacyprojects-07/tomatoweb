import React, { useState } from 'react';
import { X, RotateCw, ChevronLeft, ChevronRight, Sparkles, Layers, HelpCircle } from 'lucide-react';
import { FlashcardDeck } from '../types';

interface FlashcardsModalProps {
  deck: FlashcardDeck;
  onClose: () => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  deck,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentCard = deck.cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden space-y-0">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                {deck.title}
              </h2>
              <p className="text-[11px] text-blue-200">{deck.subject} Revision Flashcards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Card Counter */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>Card {currentIndex + 1} of {deck.cards.length}</span>
            <span className="text-blue-700">Click card to flip</span>
          </div>

          {/* Flashcard 3D Interactive Flip Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[240px] bg-gradient-to-br from-blue-50 via-white to-amber-50 rounded-2xl border-2 border-blue-200 p-8 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-center relative group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-blue-800">
              <span className="bg-blue-100 px-2.5 py-1 rounded-md uppercase">
                {isFlipped ? 'Answer / Explanation' : 'Question / Prompt'}
              </span>
              <RotateCw className="w-4 h-4 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
            </div>

            <div className="py-6 my-auto">
              <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                {isFlipped ? currentCard?.back : currentCard?.front}
              </p>
            </div>

            {currentCard?.hint && !isFlipped && (
              <div className="text-[11px] text-amber-800 font-semibold bg-amber-100/80 p-2 rounded-lg">
                💡 Hint: {currentCard.hint}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>

            <button
              disabled={currentIndex === deck.cards.length - 1}
              onClick={handleNext}
              className="bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 shadow transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
