"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useWindowSize } from "@/hooks/use-window-size";
import { useAdSystem } from "@/hooks/use-ad-system";
import { useGameSession } from "@/hooks/use-game-session";
import { useUser } from "@/contexts/user-context";
import type { Hexagon, HexReward } from "@/types";
import { generateHexagons } from "@/utils/game-utils";
import { HexagonGrid } from "./HexagonGrid";
import { OpenOptionsDialog } from "./OpenOptionsDialog";
import { AdDialog } from "./AdDialog";
import { AdLimitDialog } from "./AdLimitDialog";
import { RewardDialog } from "./RewardDialog";
import { Button } from "@/components/ui/button";
import { Diamond, Wallet, Zap, AlertCircle, Hexagon as HexIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function HexaChaseGame() {
  const { user, balance, permission, refreshBalance, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const windowSize = useWindowSize();

  const dailyLimit = permission?.daily_limit ?? 2;
  const tonCost = Number(permission?.ton_cost ?? 0.2);

  const { opensToday, openedHexIndices, isLoading: sessionLoading, openHex, loadTodaySession } =
    useGameSession(dailyLimit);

  const [hexagons, setHexagons] = useState<Hexagon[]>(() => generateHexagons());
  const [selectedHex, setSelectedHex] = useState<Hexagon | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState<HexReward | null>(null);
  const [hoveredHex, setHoveredHex] = useState<number | null>(null);
  const [showOpenOptions, setShowOpenOptions] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const adSystem = useAdSystem(() => confirmOpenHexagon("ad"));

  useEffect(() => {
    if (user?.id) loadTodaySession(user.id);
  }, [user?.id, loadTodaySession]);

  // Mark already-opened hexes from today's DB session
  useEffect(() => {
    if (openedHexIndices.length === 0) return;
    setHexagons((prev) =>
      prev.map((h) =>
        openedHexIndices.includes(h.id) ? { ...h, opened: true } : h
      )
    );
  }, [openedHexIndices]);

  const containerSize = useMemo(() => {
    if (windowSize.width < 640) return Math.min(windowSize.width - 40, 400);
    return Math.min(windowSize.width * 0.8, 560);
  }, [windowSize.width]);

  const limitReached = opensToday >= dailyLimit;
  const tonBalance = Number(balance?.balance_ton ?? 0);
  const hxcoBalance = Number(balance?.balance_hxco ?? 0);
  const isLoading = userLoading || sessionLoading;

  const handleHexClick = (id: number) => {
    if (limitReached || isOpening || isLoading) return;
    const hex = hexagons.find((h) => h.id === id);
    if (!hex || hex.opened) return;
    setSelectedHex(hex);
    setShowOpenOptions(true);
  };

  const confirmOpenHexagon = async (method: "ad" | "ton") => {
    if (!selectedHex || !user?.id) return;
    setShowOpenOptions(false);
    setIsOpening(true);

    if (method === "ton") {
      if (tonBalance < tonCost) {
        toast({ title: "Insufficient TON", description: `Need at least ${tonCost} TON`, variant: "destructive" });
        setIsOpening(false);
        setSelectedHex(null);
        return;
      }
    }

    const result = await openHex(user.id, selectedHex.id, selectedHex.reward);

    if (result.success) {
      setHexagons((prev) =>
        prev.map((h) => (h.id === selectedHex.id ? { ...h, opened: true } : h))
      );
      setCurrentReward(selectedHex.reward);
      setShowReward(true);
      await refreshBalance();
    } else if (result.error === "daily_limit_reached") {
      toast({
        title: "Daily limit reached",
        description: `You can open ${dailyLimit} hex tiles per day`,
        variant: "destructive",
      });
    } else if (result.error === "user_banned") {
      toast({ title: "Account suspended", description: "Contact support for help", variant: "destructive" });
    } else {
      toast({ title: "Error", description: result.error ?? "Try again", variant: "destructive" });
    }

    setSelectedHex(null);
    setIsOpening(false);
  };

  const handlePayWithTON = () => {
    if (!wallet) {
      tonConnectUI.openModal();
      setShowOpenOptions(false);
      setSelectedHex(null);
      return;
    }
    confirmOpenHexagon("ton");
  };

  const handleCancel = () => { setShowOpenOptions(false); setSelectedHex(null); };
  const closeReward = () => { setShowReward(false); setCurrentReward(null); };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center w-full px-4 py-4 max-w-4xl mx-auto"
    >
      {/* Top bar: balance + wallet */}
      <motion.div variants={fadeUp} className="w-full mb-4">
        <Card className="border border-cosmic-border/60 bg-gradient-to-br from-cosmic-surface to-cosmic-bg backdrop-blur-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-[10px] text-cosmic-muted uppercase tracking-wider">HXCO</p>
                  <motion.p
                    key={hxcoBalance}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold text-gradient-gold text-base leading-tight"
                  >
                    {isLoading ? "—" : hxcoBalance.toLocaleString()}
                  </motion.p>
                </div>
                <div>
                  <p className="text-[10px] text-cosmic-muted uppercase tracking-wider">TON</p>
                  <motion.p
                    key={tonBalance}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold text-cosmic-tertiary text-base leading-tight"
                  >
                    {isLoading ? "—" : tonBalance.toFixed(4)}
                  </motion.p>
                </div>
              </div>

              {wallet ? (
                <button
                  onClick={() => tonConnectUI.openModal()}
                  className="flex items-center gap-1.5 bg-cosmic-accent/10 hover:bg-cosmic-accent/20 border border-cosmic-accent/30 rounded-lg px-2.5 py-1.5 transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-cosmic-accent font-mono">
                    {wallet.account?.address?.slice(0, 4)}…{wallet.account?.address?.slice(-4)}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => tonConnectUI.openModal()}
                  className="flex items-center gap-1.5 bg-cosmic-accent/10 hover:bg-cosmic-accent/20 border border-cosmic-accent/30 rounded-lg px-2.5 py-1.5 transition-all"
                >
                  <Wallet className="h-3.5 w-3.5 text-cosmic-accent" />
                  <span className="text-xs text-cosmic-accent">Connect</span>
                </button>
              )}
            </div>

            {/* Daily opens progress */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1 text-cosmic-muted">
                  <Zap className="h-3 w-3" /> Daily Opens
                </span>
                <span className={`font-semibold ${limitReached ? "text-cosmic-secondary" : "text-cosmic-accent"}`}>
                  {isLoading ? "—" : `${opensToday} / ${dailyLimit}`}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${limitReached ? "bg-cosmic-secondary" : "bg-gradient-to-r from-cosmic-accent to-cosmic-highlight"}`}
                  initial={{ width: 0 }}
                  animate={{ width: isLoading ? "0%" : `${Math.min((opensToday / dailyLimit) * 100, 100)}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
              {limitReached && (
                <p className="text-[11px] text-cosmic-secondary mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Daily limit reached — come back tomorrow
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ad progress bar */}
      {adSystem.adViewCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-3"
        >
          <div className="bg-cosmic-card/60 border border-cosmic-accent/10 rounded-xl px-4 py-2">
            <div className="flex justify-between text-xs text-cosmic-muted mb-1">
              <span>Ad progress to free hex</span>
              <span className="text-cosmic-accent font-semibold">{adSystem.adViewCount}/{adSystem.adsNeeded}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${(adSystem.adViewCount / adSystem.adsNeeded) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Game instruction */}
      <motion.div variants={fadeUp} className="text-center mb-4">
        <p className="text-xs text-cosmic-muted">
          {limitReached
            ? "Daily limit reached"
            : `Tap a hex to open • Pay ${tonCost} TON or watch ${adSystem.adsNeeded} ads`}
        </p>
      </motion.div>

      {/* Hex grid */}
      <motion.div variants={fadeUp} className="flex justify-center">
        {isLoading ? (
          <div className="w-80 h-64 rounded-2xl bg-cosmic-card/30 animate-pulse flex items-center justify-center">
            <HexIcon className="h-8 w-8 text-cosmic-accent/20" />
          </div>
        ) : (
          <HexagonGrid
            hexagons={hexagons}
            containerSize={containerSize}
            hoveredHex={hoveredHex}
            onHexClick={handleHexClick}
            onHexHover={setHoveredHex}
          />
        )}
      </motion.div>

      <OpenOptionsDialog
        open={showOpenOptions}
        onOpenChange={setShowOpenOptions}
        onWatchAd={adSystem.watchAd}
        onPayWithTON={handlePayWithTON}
        onCancel={handleCancel}
        userBalance={{ balance_ton: tonBalance, balance_hxco: hxcoBalance, ton: tonBalance, hxco: hxcoBalance }}
        adViewCount={adSystem.adViewCount}
        adViewsToday={0}
        adCooldown={adSystem.adCooldown}
        tonCost={tonCost}
        adsNeeded={adSystem.adsNeeded}
        walletConnected={!!wallet}
      />

      <AdDialog open={adSystem.showAdDialog} onOpenChange={adSystem.setShowAdDialog} adLoading={adSystem.adLoading} />
      <AdLimitDialog open={adSystem.showAdLimitMessage} onOpenChange={adSystem.setShowAdLimitMessage} />
      <RewardDialog open={showReward} onClose={closeReward} reward={currentReward} />
    </motion.div>
  );
}
