"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, Minus } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";
import { Button } from "@/components/ui/button";

type Choice = "rock" | "paper" | "scissors";
type RoundResult = "win" | "lose" | "draw";

const CHOICES: { value: Choice; emoji: string; label: string; beats: Choice }[] = [
  { value: "rock", emoji: "✊", label: "Rock", beats: "scissors" },
  { value: "paper", emoji: "✋", label: "Paper", beats: "rock" },
  { value: "scissors", emoji: "✌️", label: "Scissors", beats: "paper" },
];

const ROUNDS = 3;

function getRoundResult(player: Choice, cpu: Choice): RoundResult {
  if (player === cpu) return "draw";
  return CHOICES.find((c) => c.value === player)!.beats === cpu ? "win" : "lose";
}

function cpuChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * 3)].value;
}

export default function RPSGame() {
  const game = useMiniGame("rock-paper-scissors", ROUNDS);
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [cpuWins, setCpuWins] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [cpuChoiceVal, setCpuChoiceVal] = useState<Choice | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [showingResult, setShowingResult] = useState(false);
  const [history, setHistory] = useState<RoundResult[]>([]);

  const handleStart = () => {
    setRound(1);
    setPlayerWins(0);
    setCpuWins(0);
    setPlayerChoice(null);
    setCpuChoiceVal(null);
    setRoundResult(null);
    setShowingResult(false);
    setHistory([]);
    game.startGame();
  };

  const handlePick = (choice: Choice) => {
    if (showingResult) return;
    const cpu = cpuChoice();
    const result = getRoundResult(choice, cpu);
    setPlayerChoice(choice);
    setCpuChoiceVal(cpu);
    setRoundResult(result);
    setShowingResult(true);

    const newPlayerWins = result === "win" ? playerWins + 1 : playerWins;
    const newCpuWins = result === "lose" ? cpuWins + 1 : cpuWins;
    const newHistory = [...history, result];

    setPlayerWins(newPlayerWins);
    setCpuWins(newCpuWins);
    setHistory(newHistory);

    setTimeout(() => {
      if (round >= ROUNDS || newPlayerWins > ROUNDS / 2 || newCpuWins > ROUNDS / 2) {
        game.finishGame(newPlayerWins);
      } else {
        setRound((r) => r + 1);
        setPlayerChoice(null);
        setCpuChoiceVal(null);
        setRoundResult(null);
        setShowingResult(false);
      }
    }, 1400);
  };

  const cpuEmoji = cpuChoiceVal
    ? CHOICES.find((c) => c.value === cpuChoiceVal)!.emoji
    : "🤖";

  return (
    <GameAdGate gameType="rock-paper-scissors" gameTitle="Rock Paper Scissors" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-pink-400" />
            <span className="font-bold text-cosmic-text">Round {round}/{ROUNDS}</span>
          </div>
          <div className="flex items-center gap-3">
            {history.map((r, i) => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                r === "win" ? "bg-green-500/30 text-green-400" :
                r === "lose" ? "bg-red-500/30 text-red-400" :
                "bg-cosmic-muted/20 text-cosmic-muted"
              }`}>
                {r === "win" ? "W" : r === "lose" ? "L" : "D"}
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="w-full flex items-center justify-around mb-6">
          <div className="text-center">
            <p className="text-xs text-cosmic-muted mb-1">You</p>
            <p className="text-3xl font-extrabold text-green-400">{playerWins}</p>
          </div>
          <div className="text-cosmic-muted font-bold">VS</div>
          <div className="text-center">
            <p className="text-xs text-cosmic-muted mb-1">CPU</p>
            <p className="text-3xl font-extrabold text-red-400">{cpuWins}</p>
          </div>
        </div>

        {/* Battle area */}
        <div className="w-full rounded-2xl bg-gradient-to-br from-cosmic-surface to-cosmic-card border border-pink-500/20 p-5 mb-5 min-h-[120px] flex items-center justify-around">
          <AnimatePresence mode="wait">
            <motion.div
              key={playerChoice ?? "?"}
              initial={{ scale: 0.5, x: -30, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 1 }}
              className="text-center"
            >
              <div className="text-5xl mb-1">{playerChoice ? CHOICES.find((c) => c.value === playerChoice)!.emoji : "❓"}</div>
              <p className="text-xs text-cosmic-muted">You</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {roundResult && (
              <motion.div
                key={roundResult}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-sm font-bold px-2 py-1 rounded-lg ${
                  roundResult === "win" ? "bg-green-500/20 text-green-400" :
                  roundResult === "lose" ? "bg-red-500/20 text-red-400" :
                  "bg-cosmic-muted/20 text-cosmic-muted"
                }`}
              >
                {roundResult === "win" ? "WIN!" : roundResult === "lose" ? "LOSE" : "DRAW"}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={cpuChoiceVal ?? "?"}
              initial={{ scale: 0.5, x: 30, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 1 }}
              className="text-center"
            >
              <div className="text-5xl mb-1">{cpuEmoji}</div>
              <p className="text-xs text-cosmic-muted">CPU</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Choice buttons */}
        <div className="flex gap-3 w-full">
          {CHOICES.map((c) => (
            <motion.button
              key={c.value}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePick(c.value)}
              disabled={showingResult}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                playerChoice === c.value
                  ? "border-pink-500/60 bg-pink-500/20"
                  : "border-cosmic-border/50 bg-cosmic-surface hover:border-pink-500/40 hover:bg-pink-500/10"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-xs text-cosmic-muted">{c.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={ROUNDS}
        gameName="Rock Paper Scissors"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
