"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
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
    <header className="fixed top-0 z-50 w-full px-4 py-3 border-b border-cosmic-border/40 backdrop-blur-md bg-cosmic-bg/70 shadow-[0_1px_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo + page title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cosmic-text to-cosmic-highlight">
            {title}
          </h1>
        </div>

        {/* Balance + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-cosmic-surface/80 px-3 py-1 rounded-full border border-cosmic-gold/20 gap-1">
            <span className="text-sm font-bold text-gradient-gold">
              {hxco.toLocaleString()}
            </span>
            <span className="text-[10px] text-cosmic-muted">HXCO</span>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cosmic-accent/20 hover:shadow-cosmic-accent/40 transition-shadow overflow-hidden"
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
              <span>{initialLetter}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default HexHeader;
