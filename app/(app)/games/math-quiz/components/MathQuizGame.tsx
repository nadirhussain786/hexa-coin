"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, CheckCircle2, XCircle, Timer } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";
import { Button } from "@/components/ui/button";

const TOTAL_QUESTIONS = 5;
const TIME_PER_QUESTION = 10;

type Op = "+" | "-" | "×";

interface Question { a: number; b: number; op: Op; answer: number; choices: number[] }

function genQuestion(): Question {
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") { a = rnd(10, 50); b = rnd(10, 50); answer = a + b; }
  else if (op === "-") { a = rnd(20, 80); b = rnd(5, a - 1); answer = a - b; }
  else { a = rnd(2, 12); b = rnd(2, 12); answer = a * b; }

  const choices = new Set([answer]);
  while (choices.size < 4) {
    const offset = rnd(-15, 15);
    if (offset !== 0) choices.add(answer + offset);
  }
  return { a, b, op, answer, choices: shuffle([...choices]) };
}

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function MathQuizGame() {
  const game = useMiniGame("math-quiz", TOTAL_QUESTIONS);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const advance = useCallback((wasCorrect: boolean) => {
    const newCorrect = wasCorrect ? correct + 1 : correct;
    if (qIndex + 1 >= TOTAL_QUESTIONS) {
      setTimeout(() => game.finishGame(newCorrect), 800);
    } else {
      setTimeout(() => {
        setQIndex((q) => q + 1);
        setSelected(null);
        setAnswered(false);
        setTimeLeft(TIME_PER_QUESTION);
      }, 800);
    }
    if (wasCorrect) setCorrect(newCorrect);
  }, [correct, qIndex, game]);

  useEffect(() => {
    if (game.gameState !== "playing") return;
    if (answered) return;
    if (timeLeft <= 0) { setAnswered(true); advance(false); return; }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [game.gameState, timeLeft, answered, advance]);

  const handleStart = () => {
    const qs = Array.from({ length: TOTAL_QUESTIONS }, genQuestion);
    setQuestions(qs);
    setQIndex(0);
    setCorrect(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setAnswered(false);
    game.startGame();
  };

  const handleAnswer = (choice: number) => {
    if (answered) return;
    const q = questions[qIndex];
    const isCorrect = choice === q.answer;
    setSelected(choice);
    setAnswered(true);
    advance(isCorrect);
  };

  const q = questions[qIndex];
  const timePct = (timeLeft / TIME_PER_QUESTION) * 100;

  return (
    <GameAdGate gameType="math-quiz" gameTitle="Math Quiz" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-cosmic-text">Math Quiz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-cosmic-muted">{qIndex + 1}/{TOTAL_QUESTIONS}</span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${timeLeft <= 3 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-cosmic-surface text-cosmic-text"}`}>
              <Timer className="h-3.5 w-3.5" /> {timeLeft}s
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all ${timeLeft <= 3 ? "bg-red-500" : "bg-gradient-to-r from-cyan-500 to-teal-400"}`}
            style={{ width: `${timePct}%` }}
          />
        </div>

        {/* Score dots */}
        <div className="flex gap-2 mb-5">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${
              i < qIndex ? (i < correct || (i === qIndex - 1 && answered && selected === q?.answer) ? "bg-green-400" : "bg-red-400") :
              i === qIndex ? "bg-cyan-400" : "bg-white/20"
            }`} />
          ))}
        </div>

        {/* Question */}
        {q && (
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full"
            >
              <div className="bg-gradient-to-br from-cosmic-surface to-cosmic-card border border-cyan-500/20 rounded-2xl p-6 text-center mb-5">
                <p className="text-4xl font-extrabold text-cosmic-text">
                  {q.a} {q.op} {q.b} = ?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {q.choices.map((choice) => {
                  const isCorrect = choice === q.answer;
                  const isSelected = choice === selected;
                  return (
                    <motion.button
                      key={choice}
                      whileTap={!answered ? { scale: 0.95 } : {}}
                      onClick={() => handleAnswer(choice)}
                      disabled={answered}
                      className={`py-4 rounded-xl text-lg font-bold border transition-all ${
                        answered && isCorrect
                          ? "bg-green-500/25 border-green-500/50 text-green-400"
                          : answered && isSelected && !isCorrect
                          ? "bg-red-500/25 border-red-500/50 text-red-400"
                          : "bg-cosmic-surface border-cosmic-border/50 text-cosmic-text hover:border-cyan-500/40 hover:bg-cyan-500/10"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {answered && isCorrect && <CheckCircle2 className="h-4 w-4" />}
                        {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4" />}
                        {choice}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={TOTAL_QUESTIONS}
        gameName="Math Quiz"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
