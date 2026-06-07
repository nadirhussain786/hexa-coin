"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Brain } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";
import { Button } from "@/components/ui/button";

const EMOJIS = ["💎", "🚀", "🌙", "⚡", "🔥", "💰", "🎯", "🌟"];
const TOTAL_TIME = 60;

type Card = { id: number; emoji: string; matched: boolean; flipped: boolean };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function initCards(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i, emoji, matched: false, flipped: false,
  })));
}

export default function MemoryMatchGame() {
  const game = useMiniGame("memory-match", 8);
  const [cards, setCards] = useState<Card[]>(initCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // Timer
  useEffect(() => {
    if (game.gameState !== "playing") return;
    if (timeLeft <= 0) { game.finishGame(matches); return; }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [game.gameState, timeLeft, matches]);

  const handleStart = () => {
    setCards(initCards());
    setSelected([]);
    setTimeLeft(TOTAL_TIME);
    setMatches(0);
    game.startGame();
  };

  const handleFlip = useCallback((id: number) => {
    if (isChecking || selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched || card.flipped) return;

    const newCards = cards.map((c) => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      const [a, b] = newSelected.map((sid) => newCards.find((c) => c.id === sid)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          const updated = newCards.map((c) =>
            c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
          );
          setCards(updated);
          const newMatches = matches + 1;
          setMatches(newMatches);
          setSelected([]);
          setIsChecking(false);
          if (newMatches === EMOJIS.length) game.finishGame(newMatches);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(newCards.map((c) =>
            c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setIsChecking(false);
        }, 900);
      }
    }
  }, [cards, selected, isChecking, matches, game]);

  return (
    <GameAdGate gameType="memory-match" gameTitle="Memory Match" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-400" />
            <span className="font-bold text-cosmic-text">Memory Match</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-cosmic-muted">{matches}/{EMOJIS.length} pairs</span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${timeLeft <= 10 ? "bg-red-500/20 text-red-400" : "bg-cosmic-surface text-cosmic-text"}`}>
              <Timer className="h-3.5 w-3.5" />
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-purple-400 rounded-full"
            animate={{ width: `${(matches / EMOJIS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-2.5 w-full">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="aspect-square rounded-xl relative"
              whileTap={!card.flipped && !card.matched ? { scale: 0.92 } : {}}
            >
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-700/80 to-purple-900/80 border border-violet-500/30 flex items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-violet-400 text-lg font-bold">?</span>
                </div>
                {/* Front */}
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl border ${
                    card.matched
                      ? "bg-gradient-to-br from-green-600/30 to-emerald-500/20 border-green-500/40"
                      : "bg-gradient-to-br from-violet-600/30 to-purple-500/20 border-violet-400/40"
                  }`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {card.emoji}
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={EMOJIS.length}
        gameName="Memory Match"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
