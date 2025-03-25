"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import SmallEntryHexCard from "./SmallHexaCard"

export default function HexPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 h-full max-w-full overflow-x-hidden">
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp} className="relative">
        <Card className="bg-cosmic-card border-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cosmic-secondary/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Welcome back,</h2>
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-secondary bg-clip-text text-transparent">
                  Hex Explorer
                </p>
                <p className="text-cosmic-muted text-sm">Your journey continues...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <SmallEntryHexCard />
    </div>
  )
}

