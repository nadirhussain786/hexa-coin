"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Disc3 } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";
import { Button } from "@/components/ui/button";

const SEGMENTS = [
  { label: "5 HXCO",  hxco: 5,  color: "#7C3AED", text: "#fff" },
  { label: "10 HXCO", hxco: 10, color: "#F43F5E", text: "#fff" },
  { label: "5 HXCO",  hxco: 5,  color: "#06B6D4", text: "#fff" },
  { label: "20 HXCO", hxco: 20, color: "#F59E0B", text: "#fff" },
  { label: "5 HXCO",  hxco: 5,  color: "#10B981", text: "#fff" },
  { label: "35 HXCO", hxco: 35, color: "#A855F7", text: "#fff" },
  { label: "10 HXCO", hxco: 10, color: "#EF4444", text: "#fff" },
  { label: "50 HXCO", hxco: 50, color: "#FBBF24", text: "#000" },
];

const N = SEGMENTS.length;
const SLICE_DEG = 360 / N;

export default function SpinWheelGame() {
  const game = useMiniGame("spin-wheel", 50);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [landed, setLanded] = useState<typeof SEGMENTS[0] | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const handleStart = () => {
    setSpinning(false);
    setRotation(0);
    setLanded(null);
    setHasSpun(false);
    game.startGame();
  };

  const handleSpin = () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setLanded(null);

    const extraSpins = (3 + Math.floor(Math.random() * 4)) * 360;
    const segIdx = Math.floor(Math.random() * N);
    const segCenter = segIdx * SLICE_DEG + SLICE_DEG / 2;
    const finalAngle = extraSpins + (360 - segCenter);
    const totalRotation = rotation + finalAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const seg = SEGMENTS[segIdx];
      setLanded(seg);
      setSpinning(false);
      setHasSpun(true);
      game.finishGame(seg.hxco);
    }, 4200);
  };

  const size = 280;
  const cx = size / 2;
  const r = size / 2 - 4;

  return (
    <GameAdGate gameType="spin-wheel" gameTitle="Spin the Wheel" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Disc3 className="h-5 w-5 text-fuchsia-400" />
            <span className="font-bold text-cosmic-text">Spin the Wheel</span>
          </div>
          <p className="text-xs text-cosmic-muted">1 spin per play</p>
        </div>

        {/* Pointer */}
        <div className="relative mb-1">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 w-0 h-0"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "22px solid #FBBF24",
              filter: "drop-shadow(0 2px 4px rgba(245,158,11,0.6))",
            }}
          />

          {/* Wheel SVG */}
          <motion.svg
            width={size}
            height={size}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.6, 0.3, 1] }}
            style={{ filter: spinning ? "drop-shadow(0 0 20px rgba(168,85,247,0.5))" : undefined }}
          >
            <g transform={`translate(${cx},${cx})`}>
              {SEGMENTS.map((seg, i) => {
                const startAngle = i * SLICE_DEG - 90;
                const endAngle = startAngle + SLICE_DEG;
                const toRad = (deg: number) => (deg * Math.PI) / 180;
                const x1 = r * Math.cos(toRad(startAngle));
                const y1 = r * Math.sin(toRad(startAngle));
                const x2 = r * Math.cos(toRad(endAngle));
                const y2 = r * Math.sin(toRad(endAngle));
                const mid = startAngle + SLICE_DEG / 2;
                const lx = (r * 0.65) * Math.cos(toRad(mid));
                const ly = (r * 0.65) * Math.sin(toRad(mid));
                return (
                  <g key={i}>
                    <path
                      d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                      fill={seg.color}
                      stroke="#0F0A1F"
                      strokeWidth="2"
                    />
                    <text
                      x={lx} y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${mid + 90},${lx},${ly})`}
                      fill={seg.text}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
              {/* Center cap */}
              <circle r={20} fill="#1A1438" stroke="#7C3AED" strokeWidth="3" />
            </g>
          </motion.svg>
        </div>

        {/* Result */}
        {landed && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 px-5 py-2 rounded-xl bg-cosmic-gold/15 border border-cosmic-gold/30 text-center"
          >
            <p className="text-lg font-extrabold text-gradient-gold">+{landed.hxco} HXCO!</p>
          </motion.div>
        )}

        <Button
          onClick={handleSpin}
          disabled={spinning || hasSpun}
          className="mt-5 w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold py-5 rounded-xl disabled:opacity-50"
          style={{ boxShadow: spinning ? "0 0 25px rgba(192,38,211,0.5)" : undefined }}
        >
          {spinning ? "Spinning…" : hasSpun ? "Spin used!" : "SPIN!"}
        </Button>
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.rewardHxco}
        maxScore={50}
        gameName="Spin the Wheel"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
      />
    </GameAdGate>
  );
}
