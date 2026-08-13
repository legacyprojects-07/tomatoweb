import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Lock, 
  Unlock, 
  Trophy, 
  Sparkles, 
  Zap, 
  Brain, 
  RotateCcw, 
  CheckCircle2, 
  Timer, 
  FileDown, 
  Flame, 
  ChevronRight,
  HelpCircle,
  Dumbbell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NoteItem, GameType, DownloadedPdfRecord } from '../types';
import { downloadNotePDFFile } from '../utils/pdfGenerator';

interface GamesUnlockViewProps {
  notes: NoteItem[];
  onUnlockNote: (noteId: string) => void;
  onRecordDownload: (record: DownloadedPdfRecord) => void;
  onSelectNote: (note: NoteItem) => void;
  onGoToDownloads: () => void;
}

// Memory Match Game Types
interface MemoryCard {
  id: number;
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface TomatoVideoGameProps {
  requiredScore: number;
  onWin: (score: number) => void;
  unlockedNote: NoteItem | null;
  onDownloadPDF: (note: NoteItem) => void;
  onSelectNote: (note: NoteItem) => void;
}

const TomatoSpaceRunnerVideoGame: React.FC<TomatoVideoGameProps> = ({
  requiredScore,
  onWin,
  unlockedNote,
  onDownloadPDF,
  onSelectNote,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [gameState, setGameState] = React.useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');

  const gameRef = React.useRef({
    playerX: 260,
    playerY: 320,
    playerWidth: 40,
    playerHeight: 40,
    speed: 8,
    items: [] as Array<{
      id: number;
      x: number;
      y: number;
      radius: number;
      dy: number;
      type: 'orb' | 'star' | 'asteroid';
    }>,
    particles: [] as Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      color: string;
      life: number;
    }>,
    score: 0,
    lives: 3,
    animationId: 0,
    keys: { left: false, right: false },
  });

  const startGame = () => {
    gameRef.current.score = 0;
    gameRef.current.lives = 3;
    gameRef.current.playerX = 260;
    gameRef.current.items = [];
    gameRef.current.particles = [];
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  React.useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let spawnTimer = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') gameRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') gameRef.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') gameRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') gameRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#94A3B8';
      for (let i = 0; i < 30; i++) {
        const sx = (i * 37 + Date.now() / 40) % canvas.width;
        const sy = (i * 53) % canvas.height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      if (gameRef.current.keys.left) {
        gameRef.current.playerX = Math.max(10, gameRef.current.playerX - gameRef.current.speed);
      }
      if (gameRef.current.keys.right) {
        gameRef.current.playerX = Math.min(canvas.width - gameRef.current.playerWidth - 10, gameRef.current.playerX + gameRef.current.speed);
      }

      const px = gameRef.current.playerX;
      const py = gameRef.current.playerY;

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(px + 12, py + 36);
      ctx.lineTo(px + 20, py + 36 + Math.random() * 14);
      ctx.lineTo(px + 28, py + 36);
      ctx.fill();

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(px + 20, py + 20, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(px + 20, py + 2);
      ctx.lineTo(px + 10, py + 10);
      ctx.lineTo(px + 30, py + 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(px + 20, py + 16, 6, 0, Math.PI * 2);
      ctx.fill();

      spawnTimer++;
      if (spawnTimer % 28 === 0) {
        const rand = Math.random();
        const type = rand < 0.55 ? 'orb' : rand < 0.75 ? 'star' : 'asteroid';
        gameRef.current.items.push({
          id: Math.random(),
          x: Math.random() * (canvas.width - 50) + 25,
          y: -20,
          radius: type === 'asteroid' ? 16 : 12,
          dy: type === 'asteroid' ? 3.8 : 3.0,
          type,
        });
      }

      for (let i = gameRef.current.items.length - 1; i >= 0; i--) {
        const item = gameRef.current.items[i];
        item.y += item.dy;

        if (item.type === 'orb') {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', item.x, item.y + 3);
        } else if (item.type === 'star') {
          ctx.fillStyle = '#EC4899';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius + 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFF';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⭐', item.x, item.y + 4);
        } else {
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💣', item.x, item.y + 3);
        }

        const dist = Math.hypot(item.x - (px + 20), item.y - (py + 20));
        if (dist < item.radius + 18) {
          if (item.type === 'orb' || item.type === 'star') {
            const added = item.type === 'star' ? 25 : 10;
            gameRef.current.score += added;
            setScore(gameRef.current.score);

            for (let p = 0; p < 8; p++) {
              gameRef.current.particles.push({
                x: item.x,
                y: item.y,
                dx: (Math.random() - 0.5) * 6,
                dy: (Math.random() - 0.5) * 6,
                color: item.type === 'star' ? '#EC4899' : '#F59E0B',
                life: 18,
              });
            }

            if (gameRef.current.score >= requiredScore) {
              setGameState('victory');
              onWin(gameRef.current.score);
              return;
            }
          } else {
            gameRef.current.lives -= 1;
            setLives(gameRef.current.lives);

            for (let p = 0; p < 12; p++) {
              gameRef.current.particles.push({
                x: item.x,
                y: item.y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                color: '#EF4444',
                life: 22,
              });
            }

            if (gameRef.current.lives <= 0) {
              setGameState('gameover');
              return;
            }
          }

          gameRef.current.items.splice(i, 1);
          continue;
        }

        if (item.y > canvas.height + 30) {
          gameRef.current.items.splice(i, 1);
        }
      }

      for (let p = gameRef.current.particles.length - 1; p >= 0; p--) {
        const particle = gameRef.current.particles[p];
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;

        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 4, 4);

        if (particle.life <= 0) {
          gameRef.current.particles.splice(p, 1);
        }
      }

      gameRef.current.animationId = requestAnimationFrame(loop);
    };

    gameRef.current.animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameRef.current.animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, requiredScore, onWin]);

  return (
    <div className="space-y-4 max-w-lg mx-auto text-center">
      <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 shadow">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold">Target:</span>
          <span className="font-black text-amber-400">{requiredScore} Pts</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-400 mr-1">Shields:</span>
          {Array.from({ length: 3 }).map((_, idx) => (
            <span key={idx} className="text-sm">
              {idx < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold">Score:</span>
          <span className="font-black text-emerald-400 text-sm">{score}</span>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-[#0F172A]">
        <canvas
          ref={canvasRef}
          width={540}
          height={360}
          className="w-full h-[320px] object-contain block"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-amber-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-300">Tomato Space Runner Video Game</h3>
              <p className="text-xs text-slate-300 max-w-xs mt-1">
                Collect Energy Orbs (+10) and Stars (+25) while dodging Asteroid Bombs to unlock your note!
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all transform hover:scale-105"
            >
              🎮 START VIDEO GAME
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white space-y-4">
            <div className="text-4xl">💥</div>
            <h3 className="text-2xl font-black text-rose-300">GAME OVER</h3>
            <p className="text-xs text-rose-200">
              Asteroid impact! You scored <span className="font-extrabold text-amber-300">{score}</span> / {requiredScore} pts.
            </p>
            <button
              onClick={startGame}
              className="bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg hover:bg-amber-300"
            >
              🔄 TRY AGAIN
            </button>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white space-y-4">
            <div className="text-4xl animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-emerald-300">VICTORY! NOTE UNLOCKED! 🎉</h3>
            <p className="text-xs text-emerald-200">
              Incredible flying! You reached <span className="font-extrabold text-amber-300">{score} Pts</span> and unlocked the secret study PDF!
            </p>

            {unlockedNote && (
              <div className="bg-slate-900/90 border border-emerald-500/50 p-4 rounded-2xl space-y-3 w-full max-w-xs text-left">
                <div className="text-xs font-extrabold text-emerald-300 truncate">{unlockedNote.title}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDownloadPDF(unlockedNote)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl text-center"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => onSelectNote(unlockedNote)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 rounded-xl text-center"
                  >
                    Read Note
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            onMouseDown={() => (gameRef.current.keys.left = true)}
            onMouseUp={() => (gameRef.current.keys.left = false)}
            onTouchStart={() => (gameRef.current.keys.left = true)}
            onTouchEnd={() => (gameRef.current.keys.left = false)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-red-600 text-white font-extrabold text-xs px-6 py-3 rounded-2xl border border-slate-700 shadow select-none"
          >
            ◀ LEFT
          </button>
          <span className="text-[10px] font-bold text-gray-500">Arrow Keys / Buttons</span>
          <button
            onMouseDown={() => (gameRef.current.keys.right = true)}
            onMouseUp={() => (gameRef.current.keys.right = false)}
            onTouchStart={() => (gameRef.current.keys.right = true)}
            onTouchEnd={() => (gameRef.current.keys.right = false)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-red-600 text-white font-extrabold text-xs px-6 py-3 rounded-2xl border border-slate-700 shadow select-none"
          >
            RIGHT ▶
          </button>
        </div>
      )}
    </div>
  );
};

export const GamesUnlockView: React.FC<GamesUnlockViewProps> = ({
  notes,
  onUnlockNote,
  onRecordDownload,
  onSelectNote,
  onGoToDownloads
}) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [selectedNoteForGame, setSelectedNoteForGame] = useState<NoteItem | null>(null);

  // Unlocked celebration state
  const [unlockedJustNow, setUnlockedJustNow] = useState<NoteItem | null>(null);

  // ---------------------------------------------------------------------------
  // GAME 1: Quiz Mastery Arena State
  // ---------------------------------------------------------------------------
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimer, setQuizTimer] = useState(15);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

  const QUIZ_BATTLE_QUESTIONS = [
    {
      q: "What is the SI unit of Electric Resistivity (ρ)?",
      opts: ["Ohm (Ω)", "Ohm-meter (Ω·m)", "Volt / Ampere", "Watt"],
      ans: 1,
      exp: "Resistivity formula ρ = R*A/l gives unit Ω*m²/m = Ω·m."
    },
    {
      q: "If length of a conductor is doubled, what happens to its Resistance (R)?",
      opts: ["Becomes 1/2", "Remains same", "Doubles (2x)", "Quadruples (4x)"],
      ans: 2,
      exp: "Resistance is directly proportional to length (R ∝ l)."
    },
    {
      q: "In a Parallel circuit, which quantity remains identical across all components?",
      opts: ["Current (I)", "Voltage (V)", "Resistance (R)", "Electric Heat"],
      ans: 1,
      exp: "Parallel connections maintain constant potential difference V across all branches."
    },
    {
      q: "How many Joules are there in 1 kWh (Kilowatt-hour)?",
      opts: ["3.6 × 10³ J", "3.6 × 10⁶ J", "1000 J", "360 J"],
      ans: 1,
      exp: "1 kWh = 1000 W * 3600 s = 3,600,000 Joules = 3.6 × 10⁶ J."
    }
  ];

  // ---------------------------------------------------------------------------
  // GAME 2: Memory Match State
  // ---------------------------------------------------------------------------
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchTurns, setMatchTurns] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [memoryFinished, setMemoryFinished] = useState(false);

  const MEMORY_PAIRS = [
    { pairId: 1, textA: "Esterification", textB: "Fruity Smell" },
    { pairId: 2, textA: "Ohm's Law", textB: "V = I × R" },
    { pairId: 3, textA: "Reflex Arc", textB: "Spinal Cord" },
    { pairId: 4, textA: "Photosynthesis", textB: "Chloroplast Stroma" }
  ];

  const initMemoryGame = () => {
    let cardList: MemoryCard[] = [];
    let idCounter = 1;
    MEMORY_PAIRS.forEach((p) => {
      cardList.push({ id: idCounter++, pairId: p.pairId, content: p.textA, isFlipped: false, isMatched: false });
      cardList.push({ id: idCounter++, pairId: p.pairId, content: p.textB, isFlipped: false, isMatched: false });
    });
    // Shuffle cards
    cardList.sort(() => Math.random() - 0.5);
    setCards(cardList);
    setFlippedCards([]);
    setMatchTurns(0);
    setMatchedPairsCount(0);
    setMemoryFinished(false);
  };

  // ---------------------------------------------------------------------------
  // GAME 3: Formula & Word Scramble State
  // ---------------------------------------------------------------------------
  const SCRAMBLE_WORDS = [
    { scrambled: "H O M S L A W", correct: "OHMSLAW", hint: "V = I * R Circuit rule" },
    { scrambled: "P H O T O S Y N T H E S I S", correct: "PHOTOSYNTHESIS", hint: "Plant food making process" },
    { scrambled: "R E F L E X A R C", correct: "REFLEXARC", hint: "Spinal cord instantaneous response" }
  ];
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleInput, setScrambleInput] = useState("");
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleTimeLeft, setScrambleTimeLeft] = useState(25);
  const [scrambleFinished, setScrambleFinished] = useState(false);

  // ---------------------------------------------------------------------------
  // GAME 4: Trivia Tower State
  // ---------------------------------------------------------------------------
  const TOWER_FLOORS = [
    {
      floor: 1,
      q: "True or False: Angle of elevation always equals angle of depression by alternate interior angles.",
      isTrue: true,
      exp: "Line of sight angles measured from horizontal are equal."
    },
    {
      floor: 2,
      q: "True or False: In a 45°-45°-90° triangle, height and base lengths are always equal.",
      isTrue: true,
      exp: "Isosceles right triangle has equal legs."
    },
    {
      floor: 3,
      q: "True or False: Pulmonary Vein carries deoxygenated blood to lungs.",
      isTrue: false,
      exp: "Pulmonary Vein carries OXYGENATED blood from lungs to left atrium."
    },
    {
      floor: 4,
      q: "True or False: Soaps form fruit-smelling esters when mixed with ethanol.",
      isTrue: false,
      exp: "Esterification requires Ethanoic acid and Ethanol with H2SO4 catalyst."
    }
  ];
  const [towerFloor, setTowerFloor] = useState(0);
  const [towerScore, setTowerScore] = useState(0);
  const [towerFinished, setTowerFinished] = useState(false);

  // Timers for Quiz and Scramble
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeGame === 'quiz-battle' && !quizFinished) {
      interval = setInterval(() => {
        setQuizTimer((prev) => {
          if (prev <= 1) {
            handleQuizNextOption(-1);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, quizIdx, quizFinished]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeGame === 'formula-scramble' && !scrambleFinished) {
      interval = setInterval(() => {
        setScrambleTimeLeft((prev) => {
          if (prev <= 1) {
            handleScrambleSubmit(true); // force fail current word
            return 25;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, scrambleIdx, scrambleFinished]);

  // Handle Quiz Battle selection
  const handleQuizNextOption = (optIdx: number) => {
    setQuizSelectedOption(optIdx);
    const curr = QUIZ_BATTLE_QUESTIONS[quizIdx];
    let newScore = quizScore;
    if (optIdx === curr.ans) {
      newScore += 1;
      setQuizScore(newScore);
    }

    setTimeout(() => {
      setQuizSelectedOption(null);
      if (quizIdx + 1 < QUIZ_BATTLE_QUESTIONS.length) {
        setQuizIdx(quizIdx + 1);
        setQuizTimer(15);
      } else {
        setQuizFinished(true);
        checkAndTriggerUnlock(selectedNoteForGame, newScore);
      }
    }, 1000);
  };

  // Handle Memory Card Click
  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMatchTurns((t) => t + 1);
      const card1 = newCards.find((c) => c.id === newFlipped[0]);
      const card2 = newCards.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Matched!
        setTimeout(() => {
          const matchedCards = newCards.map((c) =>
            c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          const newMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchedCount);

          if (newMatchedCount === MEMORY_PAIRS.length) {
            setMemoryFinished(true);
            checkAndTriggerUnlock(selectedNoteForGame, newMatchedCount);
          }
        }, 600);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          setCards(newCards.map((c) => (newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c)));
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  // Handle Scramble Submission
  const handleScrambleSubmit = (timedOut = false) => {
    const current = SCRAMBLE_WORDS[scrambleIdx];
    const cleanUser = scrambleInput.toUpperCase().replace(/\s/g, '');
    let newScore = scrambleScore;

    if (!timedOut && cleanUser === current.correct) {
      newScore += 1;
      setScrambleScore(newScore);
    }

    setScrambleInput("");
    if (scrambleIdx + 1 < SCRAMBLE_WORDS.length) {
      setScrambleIdx(scrambleIdx + 1);
      setScrambleTimeLeft(25);
    } else {
      setScrambleFinished(true);
      checkAndTriggerUnlock(selectedNoteForGame, newScore);
    }
  };

  // Handle Trivia Tower Answer
  const handleTowerAnswer = (userChoice: boolean) => {
    const current = TOWER_FLOORS[towerFloor];
    let newScore = towerScore;

    if (userChoice === current.isTrue) {
      newScore += 1;
      setTowerScore(newScore);
    }

    if (towerFloor + 1 < TOWER_FLOORS.length) {
      setTowerFloor(towerFloor + 1);
    } else {
      setTowerFinished(true);
      checkAndTriggerUnlock(selectedNoteForGame, newScore);
    }
  };

  // Check victory condition and trigger celebration / unlock note
  const checkAndTriggerUnlock = (targetNote: NoteItem | null, scoreAchieved: number) => {
    if (!targetNote || !targetNote.unlockRequirement) return;

    if (scoreAchieved >= targetNote.unlockRequirement.requiredScore) {
      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }

      onUnlockNote(targetNote.id);
      setUnlockedJustNow(targetNote);
    }
  };

  const handleStartGame = (gameType: GameType, targetNote: NoteItem) => {
    setSelectedNoteForGame(targetNote);
    setActiveGame(gameType);
    setUnlockedJustNow(null);

    if (gameType === 'quiz-battle') {
      setQuizIdx(0);
      setQuizScore(0);
      setQuizTimer(15);
      setQuizFinished(false);
    } else if (gameType === 'memory-match') {
      initMemoryGame();
    } else if (gameType === 'formula-scramble') {
      setScrambleIdx(0);
      setScrambleScore(0);
      setScrambleInput("");
      setScrambleTimeLeft(25);
      setScrambleFinished(false);
    } else if (gameType === 'trivia-tower') {
      setTowerFloor(0);
      setTowerScore(0);
      setTowerFinished(false);
    }
  };

  const handleDownloadPDFAndRecord = (note: NoteItem) => {
    const filename = downloadNotePDFFile(note);
    const newRecord: DownloadedPdfRecord = {
      id: `dl-${Date.now()}`,
      noteId: note.id,
      title: note.title,
      subject: note.subject,
      grade: note.grade,
      downloadedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      fileSizeKb: Math.floor(Math.random() * 80) + 120,
      fileName: filename,
      unlockedViaGame: note.unlockRequirement?.gameName || 'Arcade Game'
    };
    onRecordDownload(newRecord);
  };

  const lockedNotes = notes.filter((n) => n.isLocked);
  const unlockedNotes = notes.filter((n) => !n.isLocked);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0B132B] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Tomato Official Arcade
            </span>
            <span className="text-xs text-blue-200 font-medium">
              Gamified Knowledge Arena
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Play Educational Mini-Games to Unlock Secret Topper Notes & PDFs!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Test your knowledge in Quiz Battles, Memory Concept Matcher, Formula Scramble, or Trivia Tower. Win games to earn permanent access and downloadable PDFs!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <div className="bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-lg font-black text-amber-300">{lockedNotes.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Locked Notes</div>
            </div>
          </div>

          <button
            onClick={onGoToDownloads}
            className="bg-gradient-to-r from-amber-400 to-[#F89D2A] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
          >
            <FileDown className="w-4 h-4 stroke-[2.5]" />
            <span>Downloads Folder</span>
          </button>
        </div>
      </div>

      {/* Main View Grid: Game Active Modal/Screen OR List of Lock Games */}
      {activeGame ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {selectedNoteForGame?.unlockRequirement?.gameName}
                </h2>
                <p className="text-xs text-gray-500">
                  Target: {selectedNoteForGame?.unlockRequirement?.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveGame(null);
                setUnlockedJustNow(null);
              }}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              Exit Arena
            </button>
          </div>

          {/* GAME 1: QUIZ BATTLE */}
          {activeGame === 'quiz-battle' && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              {!quizFinished ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-blue-50/80 p-4 rounded-2xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-900">
                      Question {quizIdx + 1} of {QUIZ_BATTLE_QUESTIONS.length}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                      <Timer className="w-4 h-4 text-amber-700 animate-spin" />
                      <span>{quizTimer}s</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2">
                    <h3 className="text-base font-extrabold text-gray-900">
                      {QUIZ_BATTLE_QUESTIONS[quizIdx].q}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUIZ_BATTLE_QUESTIONS[quizIdx].opts.map((opt, idx) => {
                      let style = "bg-white border-gray-200 hover:border-blue-500 text-gray-800";
                      if (quizSelectedOption !== null) {
                        if (idx === QUIZ_BATTLE_QUESTIONS[quizIdx].ans) {
                          style = "bg-emerald-500 text-white border-emerald-600 font-bold";
                        } else if (idx === quizSelectedOption) {
                          style = "bg-rose-500 text-white border-rose-600 font-bold";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizSelectedOption !== null}
                          onClick={() => handleQuizNextOption(idx)}
                          className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all shadow-sm ${style}`}
                        >
                          <span className="font-extrabold mr-2">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-5">
                  <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Quiz Battle Completed!</h3>
                  <p className="text-xs text-gray-600 font-semibold">
                    You scored <span className="text-amber-800 font-extrabold text-sm">{quizScore}</span> / {QUIZ_BATTLE_QUESTIONS.length}
                  </p>

                  {unlockedJustNow ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm uppercase">
                        <Unlock className="w-5 h-5 text-emerald-600" />
                        <span>NOTE UNLOCKED SUCCESSFULLY! 🎉</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm">{unlockedJustNow.title}</h4>
                      <p className="text-xs text-gray-600">The note is now permanent in your vault and available in PDF format!</p>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => handleDownloadPDFAndRecord(unlockedJustNow)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>Download PDF</span>
                        </button>

                        <button
                          onClick={() => onSelectNote(unlockedJustNow)}
                          className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                        >
                          Read Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 max-w-md mx-auto">
                      Score required: {selectedNoteForGame?.unlockRequirement?.requiredScore}. Try again to unlock!
                      <button
                        onClick={() => handleStartGame('quiz-battle', selectedNoteForGame!)}
                        className="mt-3 bg-rose-700 text-white font-bold px-4 py-2 rounded-xl block mx-auto hover:bg-rose-800"
                      >
                        Retry Game
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* GAME 2: MEMORY CONCEPT MATCHER */}
          {activeGame === 'memory-match' && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              {!memoryFinished ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    <span>Matched Pairs: {matchedPairsCount} / {MEMORY_PAIRS.length}</span>
                    <span>Turns Taken: {matchTurns}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                        className={`h-28 rounded-2xl p-3 border-2 flex items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-sm ${
                          card.isFlipped || card.isMatched
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-black text-xs scale-105'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-400 text-xl font-mono'
                        }`}
                      >
                        {card.isFlipped || card.isMatched ? (
                          <span className="leading-snug">{card.content}</span>
                        ) : (
                          <Brain className="w-8 h-8 text-amber-400/80" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-5">
                  <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Concept Matcher Completed!</h3>
                  <p className="text-xs text-gray-600 font-semibold">
                    Finished in <span className="text-amber-800 font-extrabold text-sm">{matchTurns}</span> turns!
                  </p>

                  {unlockedJustNow ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm uppercase">
                        <Unlock className="w-5 h-5 text-emerald-600" />
                        <span>NOTE UNLOCKED SUCCESSFULLY! 🎉</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm">{unlockedJustNow.title}</h4>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => handleDownloadPDFAndRecord(unlockedJustNow)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>Download PDF</span>
                        </button>
                        <button
                          onClick={() => onSelectNote(unlockedJustNow)}
                          className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                        >
                          Read Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartGame('memory-match', selectedNoteForGame!)}
                      className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-400"
                    >
                      Play Again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* GAME 3: WORD & FORMULA SCRAMBLE */}
          {activeGame === 'formula-scramble' && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              {!scrambleFinished ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <span className="text-xs font-bold text-purple-900">
                      Word {scrambleIdx + 1} of {SCRAMBLE_WORDS.length}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                      <Timer className="w-4 h-4 text-rose-600 animate-spin" />
                      <span>{scrambleTimeLeft}s</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 text-center space-y-3 shadow-inner">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Hint: {SCRAMBLE_WORDS[scrambleIdx].hint}
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider">
                      {SCRAMBLE_WORDS[scrambleIdx].scrambled}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleScrambleSubmit(false);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Type correct word (no spaces e.g. OHMSLAW)..."
                      value={scrambleInput}
                      onChange={(e) => setScrambleInput(e.target.value)}
                      className="w-full text-center text-sm font-mono font-bold p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-amber-500 uppercase"
                    />

                    <button
                      type="submit"
                      disabled={!scrambleInput.trim()}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-300 font-extrabold text-xs py-3 rounded-xl shadow transition-all"
                    >
                      Submit Answer
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-5">
                  <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Formula Scramble Completed!</h3>
                  <p className="text-xs text-gray-600 font-semibold">
                    Score: <span className="text-amber-800 font-extrabold text-sm">{scrambleScore}</span> / {SCRAMBLE_WORDS.length}
                  </p>

                  {unlockedJustNow ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm uppercase">
                        <Unlock className="w-5 h-5 text-emerald-600" />
                        <span>NOTE UNLOCKED SUCCESSFULLY! 🎉</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm">{unlockedJustNow.title}</h4>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => handleDownloadPDFAndRecord(unlockedJustNow)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>Download PDF</span>
                        </button>
                        <button
                          onClick={() => onSelectNote(unlockedJustNow)}
                          className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                        >
                          Read Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartGame('formula-scramble', selectedNoteForGame!)}
                      className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-400"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* GAME 4: TRIVIA TOWER */}
          {activeGame === 'trivia-tower' && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              {!towerFinished ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      Tower Floor: {towerFloor + 1} / {TOWER_FLOORS.length}
                    </span>
                    <span className="text-xs text-slate-300">Score: {towerScore}</span>
                  </div>

                  <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 space-y-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">
                      {TOWER_FLOORS[towerFloor].q}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleTowerAnswer(true)}
                      className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow transition-all"
                    >
                      TRUE ✅
                    </button>
                    <button
                      onClick={() => handleTowerAnswer(false)}
                      className="p-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow transition-all"
                    >
                      FALSE ❌
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-5">
                  <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Trivia Tower Climbed!</h3>
                  <p className="text-xs text-gray-600 font-semibold">
                    Climbed <span className="text-amber-800 font-extrabold text-sm">{towerScore}</span> floors!
                  </p>

                  {unlockedJustNow ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm uppercase">
                        <Unlock className="w-5 h-5 text-emerald-600" />
                        <span>NOTE UNLOCKED SUCCESSFULLY! 🎉</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm">{unlockedJustNow.title}</h4>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => handleDownloadPDFAndRecord(unlockedJustNow)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>Download PDF</span>
                        </button>
                        <button
                          onClick={() => onSelectNote(unlockedJustNow)}
                          className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800"
                        >
                          Read Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartGame('trivia-tower', selectedNoteForGame!)}
                      className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-400"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* GAME 5: TOMATO SPACE RUNNER VIDEO GAME */}
          {activeGame === 'video-game' && (
            <div className="py-4">
              <TomatoSpaceRunnerVideoGame
                requiredScore={selectedNoteForGame?.unlockRequirement?.requiredScore || 50}
                onWin={(finalScore) => checkAndTriggerUnlock(selectedNoteForGame, finalScore)}
                unlockedNote={unlockedJustNow}
                onDownloadPDF={(note) => handleDownloadPDFAndRecord(note)}
                onSelectNote={(note) => onSelectNote(note)}
              />
            </div>
          )}
        </div>
      ) : (
        /* LOCKED NOTES & GAME SELECTION CARDS */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              <span>Secret Topper Notes Waiting to be Unlocked ({lockedNotes.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lockedNotes.map((note) => {
              const req = note.unlockRequirement;
              return (
                <div
                  key={note.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-900 text-amber-300 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wide">
                      {note.subject} • {note.grade}
                    </span>
                    <div className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked Note</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900 text-base group-hover:text-amber-800 transition-colors line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {note.aiSummary?.summary || note.content.slice(0, 100)}...
                    </p>
                  </div>

                  {/* Unlock Game Box */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Gamepad2 className="w-4 h-4 text-amber-600" />
                        <span>{req?.gameName || 'Arcade Mini Game'}</span>
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Target Score: {req?.requiredScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{req?.description}</p>
                  </div>

                  <button
                    onClick={() => handleStartGame(req?.gameType || 'quiz-battle', note)}
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-amber-300 font-extrabold text-xs py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  >
                    <Zap className="w-4 h-4 stroke-[2.5]" />
                    <span>Play {req?.gameName} & Unlock PDF</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* UNLOCKED REVISION NOTES READY FOR DOWNLOAD */}
          <div className="pt-8 space-y-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Unlock className="w-5 h-5 text-emerald-600" />
              <span>Already Unlocked Notes Ready for PDF Download ({unlockedNotes.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:border-blue-300 transition-all"
                >
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded">
                    {note.subject}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-sm line-clamp-1">{note.title}</h3>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleDownloadPDFAndRecord(note)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 shadow-sm transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                    <button
                      onClick={() => onSelectNote(note)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                    >
                      View Note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
