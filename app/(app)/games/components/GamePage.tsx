"use client";

import { Gamepad2, Sparkles } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Game } from "@/types";
import HexChaseGameImage from "@/app/components/HexChaseGameImage";

export default function GamesPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  // Check authentication status on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(!!storedUser);

      // Check if wallet is connected
      const walletConnected = localStorage.getItem("walletConnected");
      setIsWalletConnected(!!walletConnected);
    }
  }, []);

  // Only show Hex Chase game
  const games: Game[] = [
    {
      id: 1,
      title: "Hex Chase",
      description: "Open hexagons and win crypto rewards in this exciting game",
      image: "/placeholder.svg?height=200&width=300",
      status: "Live",
    },
  ];

  const handlePlayHexGame = (): void => {
    // Navigate to hex-chase game
    router.push("/hex-chase");
  };

  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
          Games
        </h1>
        <div className="flex items-center gap-2 text-cosmic-muted text-sm">
          <Gamepad2 className="h-4 w-4" />
          <span>
            {games.filter((game) => game.status === "Live").length} Game
            Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="overflow-hidden border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm"
          >
            <div className="aspect-video w-full overflow-hidden">
              <HexChaseGameImage />
            </div>
            <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-cosmic-text text-lg">
                  {game.title}
                </CardTitle>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${game.status === "Live" ? "bg-cosmic-tertiary/20 text-cosmic-tertiary" : "bg-cosmic-secondary/20 text-cosmic-secondary"}`}
                >
                  {game.status}
                </div>
              </div>
              <CardDescription className="text-cosmic-muted text-sm">
                {game.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
              <Button
                className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text w-full"
                onClick={handlePlayHexGame}
              >
                Play Now
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Coming Soon Game Card */}
        <Card className="overflow-hidden border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm opacity-70">
          <div className="aspect-video w-full overflow-hidden bg-cosmic-bg/50 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-10 w-10 text-cosmic-accent/40 mx-auto mb-2" />
              <p className="text-cosmic-muted font-medium">Coming Soon</p>
            </div>
          </div>
          <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-cosmic-text text-lg">
                Mystery Game
              </CardTitle>
              <div className="px-2 py-1 rounded-full text-xs bg-cosmic-secondary/20 text-cosmic-secondary">
                Coming Soon
              </div>
            </div>
            <CardDescription className="text-cosmic-muted text-sm">
              A new exciting game is coming soon
            </CardDescription>
          </CardHeader>
          <CardFooter className="px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
            <Button
              className="bg-cosmic-card border-cosmic-accent/20 text-cosmic-muted w-full cursor-not-allowed"
              disabled
            >
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
