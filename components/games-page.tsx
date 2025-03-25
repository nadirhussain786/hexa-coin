"use client"

import EntryLuxuryHexCard from "./EntryHexCard"

export default function GamesPage() {

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <header className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-highlight bg-clip-text text-transparent">
          Hex Games
        </h1>
        <p className="text-cosmic-muted">Discover premium gaming experiences</p>
      </header>

      <EntryLuxuryHexCard />

    </div>
  )
}

