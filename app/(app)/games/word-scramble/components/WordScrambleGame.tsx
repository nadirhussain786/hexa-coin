"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, CheckCircle2, XCircle, Timer } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WORDS = [
  { word: "BITCOIN", hint: "First cryptocurrency" },
  { word: "WALLET", hint: "Stores your crypto" },
  { word: "BLOCKCHAIN", hint: "Distributed ledger" },
  { word: "MINING", hint: "Creating new coins" },
  { word: "TOKEN", hint: "Digital asset unit" },
  { word: "DEFI", hint: "Decentralized finance" },
  { word: "STAKING", hint: "Lock coins for rewards" },
  { word: "AIRDROP", hint: "Free token distribution" },
  { word: "LEDGER", hint: "Record of transactions" },
  { word: "HASHRATE", hint: "Mining power measure" },
  { word: "COSMOS", hint: "Interchain ecosystem" },
  { word: "POLYGON", hint: "Ethereum scaling network" },
];

const TOTAL = 5;
const TIME_PER_WORD = 20;

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("") === word ? scramble(word) : arr.join("");
}

function pickWords() {
  const pool = [...WORDS].sort(() => Math.random() - 0.5).slice(0, TOTAL);
  return pool.map((w) => ({ ...w, scrambled: scramble(w.word) }));
}

export default function WordScrambleGame() {
  const game = useMiniGame("word-scramble", TOTAL);
  const [words, setWords] = useState<Array<{ word: string; hint: string; scrambled: string }>>([]);
  const [wIndex, setWIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_WORD);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong" | "timeout">("idle");

  useEffect(() => {
    if (game.gameState !== "playing" || status !== "idle") return;
    if (timeLeft <= 0) { advance(false); return; }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [game.gameState, timeLeft, status]);

  const advance = (wasCorrect: boolean) => {
    const newCorrect = wasCorrect ? correct + 1 : correct;
    if (wasCorrect) setCorrect(newCorrect);
    setTimeout(() => {
      if (wIndex + 1 >= TOTAL) { game.finishGame(newCorrect); }
      else {
        setWIndex((i) => i + 1);
        setInput("");
        setStatus("idle");
        setTimeLeft(TIME_PER_WORD);
      }
    }, 900);
  };

  const handleStart = () => {
    const w = pickWords();
    setWords(w);
    setWIndex(0);
    setCorrect(0);
    setInput("");
    setStatus("idle");
    setTimeLeft(TIME_PER_WORD);
    game.startGame();
  };

  const handleSubmit = () => {
    const w = words[wIndex];
    if (input.trim().toUpperCase() === w.word) {
      setStatus("correct");
      advance(true);
    } else {
      setStatus("wrong");
      setTimeout(() => { setStatus("idle"); setInput(""); }, 800);
    }
  };

  const w = words[wIndex];
  const timePct = (timeLeft / TIME_PER_WORD) * 100;

  return (
    <GameAdGate gameType="word-scramble" gameTitle="Word Scramble" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-amber-400" />
            <span className="font-bold text-cosmic-text">Word Scramble</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-cosmic-muted">{wIndex + 1}/{TOTAL}</span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${timeLeft <= 5 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-cosmic-surface text-cosmic-text"}`}>
              <Timer className="h-3.5 w-3.5" /> {timeLeft}s
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timeLeft <= 5 ? "bg-red-500" : "bg-gradient-to-r from-amber-500 to-yellow-400"}`}
            style={{ width: `${timePct}%` }}
          />
        </div>

        {/* Score dots */}
        <div className="flex gap-2 mb-5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${
              i < wIndex ? (i < correct ? "bg-green-400" : "bg-red-400") :
              i === wIndex ? "bg-amber-400" : "bg-white/20"
            }`} />
          ))}
        </div>

        {w && (
          <AnimatePresence mode="wait">
            <motion.div key={wIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              {/* Scrambled word */}
              <div className="bg-gradient-to-br from-cosmic-surface to-cosmic-card border border-amber-500/20 rounded-2xl p-5 mb-4 text-center">
                <p className="text-xs text-cosmic-muted mb-2">Unscramble this crypto word:</p>
                <div className="flex justify-center gap-2 flex-wrap mb-3">
                  {w.scrambled.split("").map((ch, i) => (
                    <div key={i} className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-400/10 border border-amber-500/30 flex items-center justify-center text-lg font-bold text-cosmic-text">
                      {ch}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-cosmic-muted">Hint: {w.hint}</p>
              </div>

              {/* Input */}
              <div className="flex gap-2 mb-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className={`bg-cosmic-bg text-center text-lg font-bold tracking-widest uppercase ${
                    status === "correct" ? "border-green-500 text-green-400" :
                    status === "wrong" ? "border-red-500 text-red-400 animate-pulse" :
                    "border-amber-500/30 text-cosmic-text"
                  }`}
                  placeholder="TYPE YOUR ANSWER"
                  disabled={status === "correct"}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={status === "correct" || !input.trim()}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold px-4"
                >
                  {status === "correct" ? <CheckCircle2 className="h-4 w-4" /> :
                   status === "wrong" ? <XCircle className="h-4 w-4" /> : "→"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={TOTAL}
        gameName="Word Scramble"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
