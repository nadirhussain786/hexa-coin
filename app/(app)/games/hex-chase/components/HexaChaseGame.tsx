"use client";

import { useState, useEffect, useMemo } from "react";
import { useWindowSize } from "@/hooks/use-window-size";
import { useAdSystem } from "@/hooks/use-ad-system";
import type { Hexagon, HexReward, UserBalance } from "@/types/game-types";
import { generateHexagons } from "@/utils/game-utils";
import { WalletConnect } from "./WalletConnect";
import { BalanceDisplay } from "./alanceDisplay";
import { GameInfo } from "./GameInfo";
import { HexagonGrid } from "./HexagonGrid";
import { OpenOptionsDialog } from "./OpenOptionsDialog";
import { AdDialog } from "./AdDialog";
import { AdLimitDialog } from "./AdLimitDialog";
import { RewardDialog } from "./RewardDialog";

interface HexaChaseGameProps {
  isEmbedded?: boolean;
  walletConnected?: boolean;
}

export default function HexaChaseGame({
  isEmbedded = false,
  walletConnected: externalWalletConnected = false,
}: HexaChaseGameProps) {
  const [hexagons, setHexagons] = useState<Hexagon[]>(() => generateHexagons());
  const [walletConnected, setWalletConnected] = useState<boolean>(
    externalWalletConnected
  );
  const [userBalance, setUserBalance] = useState<UserBalance>({
    ton: 0,
    hxco: 0,
  });
  const [selectedHex, setSelectedHex] = useState<Hexagon | null>(null);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [currentReward, setCurrentReward] = useState<HexReward | null>(null);
  const [hoveredHex, setHoveredHex] = useState<number | null>(null);
  const [showOpenOptions, setShowOpenOptions] = useState<boolean>(false);

  const windowSize = useWindowSize();

  const adSystem = useAdSystem(() => {
    confirmOpenHexagon();
  });

  // Effect to sync with external wallet connected state
  useEffect(() => {
    setWalletConnected(externalWalletConnected);
  }, [externalWalletConnected]);

  // Calculate container size and hexagon dimensions based on screen size
  const containerSize = useMemo((): number => {
    // Responsive sizing based on screen width
    if (isEmbedded) {
      return Math.min(windowSize.width * 0.8, 500);
    }
    if (windowSize.width < 640) return Math.min(windowSize.width - 40, 400);
    return Math.min(windowSize.width * 0.8, 600);
  }, [windowSize.width, isEmbedded]);

  // Connect wallet handler
  const connectWallet = (): void => {
    // In a real app, this would connect to TON wallet
    setWalletConnected(true);
  };

  // Update the openHexagon function to show options instead of directly opening
  const openHexagon = (id: number): void => {
    if (!walletConnected) return;

    const hex = hexagons.find((h) => h.id === id);
    if (!hex || hex.opened) return;

    setSelectedHex(hex);
    setShowOpenOptions(true);
  };

  // Add function to handle TON payment
  const payWithTON = (): void => {
    if (userBalance.ton < 0.2) {
      alert("Insufficient TON balance");
      setShowOpenOptions(false);
      setSelectedHex(null);
      return;
    }

    // Deduct TON and open hexagon
    setUserBalance({ ...userBalance, ton: userBalance.ton - 0.2 });
    confirmOpenHexagon();
  };

  // Update confirmOpenHexagon to not check TON balance
  const confirmOpenHexagon = (): void => {
    if (!selectedHex) return;

    // Update hexagons
    setHexagons(
      hexagons.map((h) =>
        h.id === selectedHex.id ? { ...h, opened: true } : h
      )
    );

    // Show reward
    setCurrentReward(selectedHex.reward);
    setShowReward(true);
    setSelectedHex(null);
    setShowOpenOptions(false);
  };

  // Close reward dialog
  const closeReward = (): void => {
    setShowReward(false);
    setCurrentReward(null);
  };

  const handleCancel = (): void => {
    setShowOpenOptions(false);
    setSelectedHex(null);
  };

  // Verify we have exactly 61 hexagons
  const hexagonCount = hexagons.length;

  return (
    <div
      className={`flex flex-col justify-center mt-4 items-center w-full ${isEmbedded ? "" : "max-w-4xl"} px-4`}
    >
      {!walletConnected ? (
        <WalletConnect onConnect={connectWallet} />
      ) : (
        <>
          <BalanceDisplay balance={userBalance} />
          <GameInfo hexagonCount={hexagonCount} />
          <HexagonGrid
            hexagons={hexagons}
            containerSize={containerSize}
            hoveredHex={hoveredHex}
            onHexClick={openHexagon}
            onHexHover={setHoveredHex}
          />
        </>
      )}

      <OpenOptionsDialog
        open={showOpenOptions}
        onOpenChange={setShowOpenOptions}
        onWatchAd={adSystem.watchAd}
        onPayWithTON={payWithTON}
        onCancel={handleCancel}
        userBalance={userBalance}
        adViewCount={adSystem.adViewCount}
        adViewsToday={adSystem.adViewsToday}
        adCooldown={adSystem.adCooldown}
      />

      <AdDialog
        open={adSystem.showAdDialog}
        onOpenChange={adSystem.setShowAdDialog}
        adLoading={adSystem.adLoading}
      />

      <AdLimitDialog
        open={adSystem.showAdLimitMessage}
        onOpenChange={adSystem.setShowAdLimitMessage}
      />

      <RewardDialog
        open={showReward}
        onClose={closeReward}
        reward={currentReward}
      />
    </div>
  );
}
