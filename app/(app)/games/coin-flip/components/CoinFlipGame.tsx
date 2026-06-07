"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";

type Side = "heads" | "tails";
type RoundState = "picking" | "flipping" | "result";

const ROUNDS = 3;

export default function CoinFlipGame() {
  const game = useMiniGame("coin-flip", ROUNDS);
  const [round, setRound] = useState(1);
  const [wins, setWins] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>("picking");
  const [playerPick, setPlayerPick] = useState<Side | null>(null);
  const [result, setResult] = useState<Side | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);
  const [flipping, setFlipping] = useState(false);

  const handleStart = () => {
    setRound(1);
    setWins(0);
    setRoundState("picking");
    setPlayerPick(null);
    setResult(null);
    setHistory([]);
    game.startGame();
  };

  const handlePick = (side: Side) => {
    if (roundState !== "picking") return;
    setPlayerPick(side);
    setRoundState("flipping");
    setFlipping(true);

    setTimeout(() => {
      const outcome: Side = Math.random() < 0.5 ? "heads" : "tails";
      const won = side === outcome;
      setResult(outcome);
      setFlipping(false);
      setRoundState("result");

      const newWins = won ? wins + 1 : wins;
      const newHistory = [...history, won];
      setWins(newWins);
      setHistory(newHistory);

      setTimeout(() => {
        if (round >= ROUNDS) {
          game.finishGame(newWins);
        } else {
          setRound((r) => r + 1);
          setRoundState("picking");
          setPlayerPick(null);
          setResult(null);
        }
      }, 1200);
    }, 1800);
  };

  const won = result !== null && playerPick === result;

  return (
    <GameAdGate gameType="coin-flip" gameTitle="Coin Flip" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="font-bold text-cosmic-text">Coin Flip</span>
          </div>
          <div className="flex gap-2">
            {history.map((w, i) => (
              <div key={i} className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${w ? "bg-green-500/25 text-green-400" : "bg-red-500/25 text-red-400"}`}>
                {w ? "W" : "L"}
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <p className="text-sm text-cosmic-muted mb-6">Round {round}/{ROUNDS} · {wins} wins</p>

        {/* Coin */}
        <div className="flex items-center justify-center mb-8" style={{ height: 160 }}>
          <AnimatePresence mode="wait">
            {flipping ? (
              <motion.div
                key="flipping"
                animate={{ rotateY: [0, 360, 720, 1080] }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-cosmic-gold to-[#FBBF24] flex items-center justify-center"
                style={{ boxShadow: "0 0 40px rgba(245,158,11,0.6)" }}
              >
                <span className="text-4xl">🪙</span>
              </motion.div>
            ) : result ? (
              <motion.div
                key={result}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${
                  won ? "border-green-400 bg-green-500/20" : "border-red-400 bg-red-500/20"
                }`}
                style={{ boxShadow: won ? "0 0 30px rgba(34,197,94,0.5)" : "0 0 30px rgba(239,68,68,0.4)" }}
              >
                <span className="text-4xl">{result === "heads" ? "👑" : "🔵"}</span>
                <p className="text-xs font-bold mt-1 capitalize text-cosmic-text">{result}</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-cosmic-gold to-[#FBBF24] flex flex-col items-center justify-center"
                style={{ boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
              >
                <span className="text-5xl">🪙</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result message */}
        <AnimatePresence>
          {result && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg font-bold mb-5 ${won ? "text-green-400" : "text-red-400"}`}
            >
              {won ? "🎉 You guessed right!" : "😔 Not this time…"}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Pick buttons */}
        {roundState === "picking" && (
          <div className="flex gap-4 w-full">
            {(["heads", "tails"] as Side[]).map((side) => (
              <motion.button
                key={side}
                whileTap={{ scale: 0.92 }}
                onClick={() => handlePick(side)}
                className="flex-1 py-4 rounded-2xl border border-cosmic-gold/30 bg-cosmic-gold/10 hover:bg-cosmic-gold/20 transition-all flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{side === "heads" ? "👑" : "🔵"}</span>
                <span className="text-sm font-bold capitalize text-cosmic-text">{side}</span>
              </motion.button>
            ))}
          </div>
        )}

        {roundState !== "picking" && (
          <p className="text-sm text-cosmic-muted">
            {flipping ? "Flipping…" : `You picked ${playerPick}`}
          </p>
        )}
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={ROUNDS}
        gameName="Coin Flip"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
