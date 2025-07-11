"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface HexHeaderProps {
  userName: string;
  profileUrl?: string;
  title: string;
}

const HexHeader: React.FC<HexHeaderProps> = ({
  userName,
  profileUrl,
  title,
}) => {
  const [hxcoBalance, setHxcoBalance] = useState<number | null>(null);
  const [hxcoEarnings, setHxcoEarnings] = useState(0);
  const [isEarningAnimating, setIsEarningAnimating] = useState(false);
  const initialLetter = userName?.charAt(0).toUpperCase() || "U";
  const balanceDifference = hxcoEarnings - ((hxcoBalance || 0) - hxcoEarnings);
  const [imageError, setImageError] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full px-6 py-4 border-b border-white/10 backdrop-blur-md bg-cosmic-card/30 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(123,63,228,0.4)]">
            <Sparkles className="h-5 w-5 text-cosmic-text animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-cosmic-text bg-clip-text text-transparent bg-gradient-to-r from-cosmic-text to-cosmic-highlight">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative flex items-center bg-cosmic-card/50 px-3 py-1 rounded-full border border-cosmic-accent/30 shadow-inner shadow-cosmic-accent/10 overflow-hidden">
            <span
              className={`text-cosmic-accent font-medium mr-1 ${
                isEarningAnimating ? "animate-pulse" : ""
              }`}
            >
              {hxcoBalance || 0}
            </span>
            <span className="text-xs text-cosmic-muted">HXCO</span>

            {isEarningAnimating && (
              <div className="absolute inset-0 bg-cosmic-accent/10 flex items-center justify-center pointer-events-none">
                <span className="text-cosmic-accent text-xs font-bold animate-bounce">
                  +{balanceDifference}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary flex items-center justify-center text-cosmic-text font-bold shadow-lg shadow-cosmic-accent/20 hover:shadow-cosmic-accent/40 transition-shadow overflow-hidden"
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
