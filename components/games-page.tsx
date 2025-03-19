"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, Users, Star, Clock, ChevronRight, Flame, Sparkles } from "lucide-react"
import Image from "next/image"

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Featured", "New", "Popular", "Tournaments"]

  const games = [
    {
      id: 1,
      title: "Cosmic Conquest",
      category: "Strategy",
      players: "2-4",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=400",
      featured: true,
      new: false,
      hot: true,
    },
    {
      id: 2,
      title: "Stellar Hunters",
      category: "Adventure",
      players: "1-2",
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
      new: true,
      hot: false,
    },
    {
      id: 3,
      title: "Nebula Racers",
      category: "Racing",
      players: "1-8",
      rating: 4.2,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
      new: false,
      hot: false,
    },
    {
      id: 4,
      title: "Galactic Puzzles",
      category: "Puzzle",
      players: "1",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
      new: true,
      hot: true,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <header className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-highlight bg-clip-text text-transparent">
          Cosmic Games
        </h1>
        <p className="text-cosmic-muted">Discover premium gaming experiences</p>
      </header>

      {/* Categories */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 md:-mx-0 md:px-0">
        <div className="flex space-x-2 w-max md:w-auto">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-1 h-auto text-sm whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-cosmic-accent to-cosmic-secondary hover:opacity-90 text-white shadow-[0_0_10px_rgba(123,63,228,0.3)]"
                  : "bg-cosmic-bg/40 text-cosmic-muted hover:text-white border border-white/10"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Tournament */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Card className="bg-cosmic-card border-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <CardContent className="p-0">
            <div className="relative h-40 md:h-48">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Featured Game"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-card to-transparent"></div>
              <div className="absolute top-4 left-4 flex space-x-2">
                <Badge className="bg-cosmic-accent text-white border-none">
                  <Sparkles className="h-3 w-3 mr-1" /> Premium
                </Badge>
                <Badge className="bg-cosmic-highlight border-none">
                  <Trophy className="h-3 w-3 mr-1" /> Tournament
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg md:text-xl font-bold text-white">Grand Tournament: Cosmic Conquest</h3>
                <p className="text-sm text-cosmic-muted">Join the weekly tournament and win exclusive rewards</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <Trophy className="h-3 w-3 text-cosmic-highlight" />
                    <span>10,000 prize pool</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3 text-cosmic-highlight" />
                    <span>Starts in 2h 15m</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-highlight border border-cosmic-bg"
                ></div>
              ))}
              <div className="w-6 h-6 rounded-full bg-cosmic-bg/60 text-white flex items-center justify-center text-xs">
                +8
              </div>
            </div>
            <Button className="bg-cosmic-accent hover:bg-cosmic-highlight text-white rounded-full px-6">
              Join Now
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Games Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Popular Games</h2>
          <Button variant="link" className="text-cosmic-highlight p-0 h-auto text-sm flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={item}>
              <Card className="bg-cosmic-card border-white/5 backdrop-blur-sm overflow-hidden h-full group">
                <div className="relative h-36">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-card via-transparent to-transparent"></div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {game.new && <Badge className="bg-green-500 text-white border-none text-xs">New</Badge>}
                    {game.hot && (
                      <Badge className="bg-red-500 text-white border-none text-xs">
                        <Flame className="h-3 w-3 mr-1" /> Hot
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-base">{game.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <div className="flex items-center justify-between text-sm text-cosmic-muted">
                    <div className="flex items-center gap-1">
                      <Gamepad2 className="h-3 w-3" />
                      <span>{game.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-cosmic-highlight" />
                      <span className="text-cosmic-highlight">{game.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-cosmic-bg border border-cosmic-accent/30 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent/50 rounded-full">
                    Play Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

