"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Diamond } from "lucide-react";
import { useUser } from "@/contexts/user-context";

interface HexHeaderProps {
  userName: string;
  profileUrl?: string;
  title: string;
}

const HexHeader: React.FC<HexHeaderProps> = ({ userName, profileUrl, title }) => {
  const { balance } = useUser();
  const [imageError, setImageError] = useState(false);
  const initialLetter = userName?.charAt(0).toUpperCase() || "U";
  const hxco = Number(balance?.balance_hxco ?? 0);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div
        className="px-4 py-2.5 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(8,5,20,0.92) 0%, rgba(8,5,20,0.78) 100%)",
          borderBottom: "1px solid rgba(124,58,237,0.18)",
          boxShadow: "0 1px 0 rgba(124,58,237,0.08), 0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Logo + title */}
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="relative h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #F43F5E)",
                boxShadow: "0 0 16px rgba(124,58,237,0.6), 0 0 32px rgba(124,58,237,0.2)",
              }}
            >
              <Sparkles className="h-[18px] w-[18px] text-white" />
              <span className="absolute inset-0 rounded-xl animate-ping-slow opacity-30 bg-cosmic-accent" />
            </motion.div>
            <h1
              className="text-[15px] font-extrabold tracking-tight text-gradient"
            >
              {title}
            </h1>
          </div>

          {/* HXCO balance + avatar */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={hxco}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shimmer-card"
                style={{
                  background: "linear-gradient(135deg, rgba(26,20,56,0.95), rgba(17,13,42,0.9))",
                  border: "1px solid rgba(245,158,11,0.28)",
                  boxShadow: "0 0 14px rgba(245,158,11,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <Diamond className="h-3 w-3 text-cosmic-gold flex-shrink-0" />
                <span className="text-xs font-extrabold text-gradient-gold leading-none">
                  {hxco.toLocaleString()}
                </span>
                <span className="text-[9px] text-cosmic-muted leading-none font-medium">HXCO</span>
              </motion.div>
            </AnimatePresence>

            {/* Avatar */}
            <button
              type="button"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #F43F5E)",
                boxShadow: "0 0 12px rgba(124,58,237,0.5), 0 2px 8px rgba(0,0,0,0.4)",
              }}
              aria-label={`${userName}'s profile`}
            >
              {profileUrl && !imageError ? (
                <img
                  src={profileUrl}
                  alt={`${userName}'s profile`}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="text-sm font-bold">{initialLetter}</span>
              )}
              {/* Online indicator */}
              <span
                className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-[1.5px] border-cosmic-bg"
                style={{ background: "#22c55e", boxShadow: "0 0 5px rgba(34,197,94,0.7)" }}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Gradient accent line */}
      <div
        className="h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.5) 40%, rgba(6,182,212,0.4) 70%, transparent 100%)" }}
      />
    </header>
  );
};

export default HexHeader;
