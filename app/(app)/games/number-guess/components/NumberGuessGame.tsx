"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Thermometer } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_GUESSES = 7;
const MAX_NUMBER = 100;

type Hint = { guess: number; result: "correct" | "hot" | "warm" | "cold" };

function getHint(guess: number, target: number): Hint["result"] {
  if (guess === target) return "correct";
  const diff = Math.abs(guess - target);
  if (diff <= 5) return "hot";
  if (diff <= 15) return "warm";
  return "cold";
}

const HINT_CONFIG = {
  hot:     { label: "🔥 Very Hot!", color: "text-red-400",    bg: "bg-red-500/20 border-red-500/30" },
  warm:    { label: "☀️ Warm",      color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30" },
  cold:    { label: "❄️ Cold",      color: "text-blue-400",   bg: "bg-blue-500/20 border-blue-500/30" },
  correct: { label: "✅ Correct!",  color: "text-green-400",  bg: "bg-green-500/20 border-green-500/30" },
};

export default function NumberGuessGame() {
  const game = useMiniGame("number-guess", MAX_GUESSES);
  const [target, setTarget] = useState(0);
  const [input, setInput] = useState("");
  const [hints, setHints] = useState<Hint[]>([]);
  const [done, setDone] = useState(false);

  const handleStart = () => {
    const t = Math.floor(Math.random() * MAX_NUMBER) + 1;
    setTarget(t);
    setInput("");
    setHints([]);
    setDone(false);
    game.startGame();
  };

  const handleGuess = () => {
    const g = parseInt(input.trim());
    if (isNaN(g) || g < 1 || g > MAX_NUMBER) return;
    if (hints.find((h) => h.guess === g)) return;
    const result = getHint(g, target);
    const newHints = [...hints, { guess: g, result }];
    setHints(newHints);
    setInput("");

    if (result === "correct") {
      setDone(true);
      const score = MAX_GUESSES - (newHints.length - 1);
      game.finishGame(Math.max(0, score));
    } else if (newHints.length >= MAX_GUESSES) {
      setDone(true);
      game.finishGame(0);
    }
  };

  const guessesLeft = MAX_GUESSES - hints.length;

  return (
    <GameAdGate gameType="number-guess" gameTitle="Number Guess" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-cosmic-text">Number Guess</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-cosmic-muted" />
            <span className="text-sm text-cosmic-muted">{guessesLeft} guesses left</span>
          </div>
        </div>

        {/* Attempts bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
            animate={{ width: `${((MAX_GUESSES - hints.length) / MAX_GUESSES) * 100}%` }}
          />
        </div>

        {/* Target range */}
        <div className="w-full bg-gradient-to-br from-cosmic-surface to-cosmic-card border border-indigo-500/20 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs text-cosmic-muted mb-1">Guess a number between</p>
          <p className="text-2xl font-extrabold text-cosmic-text">1 — {MAX_NUMBER}</p>
          {done && !hints.find((h) => h.result === "correct") && (
            <p className="text-sm text-cosmic-muted mt-2">The number was <span className="text-cosmic-accent font-bold">{target}</span></p>
          )}
        </div>

        {/* Input */}
        {!done && (
          <div className="flex gap-2 w-full mb-4">
            <Input
              type="number"
              min="1"
              max={MAX_NUMBER}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()}
              className="bg-cosmic-bg border-indigo-500/30 text-cosmic-text text-center text-xl font-bold"
              placeholder="?"
            />
            <Button onClick={handleGuess} className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5">
              Guess
            </Button>
          </div>
        )}

        {/* Hint history */}
        <div className="w-full space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">
          <AnimatePresence>
            {[...hints].reverse().map((h, i) => {
              const cfg = HINT_CONFIG[h.result];
              return (
                <motion.div
                  key={h.guess}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between px-4 py-2 rounded-xl border ${cfg.bg}`}
                >
                  <span className="text-lg font-bold text-cosmic-text">{h.guess}</span>
                  <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={MAX_GUESSES}
        gameName="Number Guess"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
