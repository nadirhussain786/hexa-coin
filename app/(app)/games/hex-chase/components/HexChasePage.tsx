"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import HexaChaseGame from "@/app/hex/components/hexa-chase-game";
import { TelegramUserFull } from "@/types";

export default function HexChasePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [user, setUser] = useState<TelegramUserFull | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as TelegramUserFull;
        setUser(userData);
        setIsLoggedIn(true);

        const walletConnected = localStorage.getItem("walletConnected");
        setWalletConnected(!!walletConnected);
        setIsLoading(false);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("walletConnected");
        document.cookie =
          "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/");
      }
    } else {
      setIsLoading(false);
      router.push("/");
    }
  }, [router]);

  const connectWallet = () => {
    setWalletConnected(true);
    localStorage.setItem("walletConnected", "true");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cosmic-bg text-cosmic-text">
      {isLoggedIn && !walletConnected ? (
        <Card className="w-full max-w-sm p-8 border border-cosmic-accent/30 bg-cosmic-card/50 backdrop-blur-md text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center shadow-xl animate-pulse">
              <Wallet className="w-10 h-10 text-cosmic-text" />
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Connect Your Wallet
            </h2>
            <p className="text-cosmic-muted text-sm">
              Connect your TON wallet to start playing and winning rewards.
            </p>
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text shadow-lg"
            >
              Connect Wallet
            </Button>
          </div>
        </Card>
      ) : isLoggedIn && walletConnected ? (
        <HexaChaseGame walletConnected />
      ) : (
        <p className="text-cosmic-muted">Loading...</p>
      )}
    </div>
  );
}
