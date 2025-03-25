"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Hexagon, Play, ChevronRight} from "lucide-react"

export default function EntryLuxuryHexCard() {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const controls = useAnimation()

  // Mouse parallax effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])

  // Particle animation
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number }[]>([])

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / 10)
    y.set((e.clientY - centerY) / 10)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    controls.start({ scale: 1, transition: { duration: 0.5 } })
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    controls.start({ scale: 1.02, transition: { duration: 0.5 } })
  }

  const handlePlay = () => {
    router.push("/hexa-chase")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Background luxury elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated luxury particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-gold-300 opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 10,
              delay: particle.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full" />
      </div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-2xl perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-white/5"
          animate={controls}
        >
          <div
            className="absolute inset-0 rounded-2xl p-[1px] opacity-0 transition-opacity duration-500"
            style={{ opacity: isHovering ? 1 : 0 }}
          />
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-0"
            animate={{ opacity: isHovering ? 0.8 : 0 }}
            transition={{ duration: 0.6 }}
          />

          <div className="relative p-8 md:p-10" style={{ transform: "translateZ(40px)" }}>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: 360,
                    background: [
                      "linear-gradient(to right, #9333ea, #3b82f6)",
                      "linear-gradient(to right, #3b82f6, #9333ea)",
                    ],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    background: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                  }}
                  className="absolute -inset-1 rounded-full"
                />
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <Hexagon className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-gray-400">
                  Hex Chase
                </h2>
              </div>
            </div>

            {/* Game preview */}
            <div className="relative mb-8 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />

              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 aspect-video rounded-xl flex items-center justify-center overflow-hidden">
                {/* Hexagon grid background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1 transform rotate-45 scale-125">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-md"
                        initial={{ opacity: 0.2 }}
                        animate={{
                          opacity: [0.2, 0.5, 0.2],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating hexagons */}
                <div className="relative z-10">
                  {[1, 2, 3].map((hex) => (
                    <motion.div
                      key={hex}
                      className="absolute"
                      style={{
                        left: `${30 + hex * 15}%`,
                        top: `${20 + hex * 15}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        y: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: hex * 0.5 },
                        rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: hex * 0.3 },
                      }}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${
                          hex === 1
                            ? "from-purple-500 to-blue-500"
                            : hex === 2
                              ? "from-amber-500 to-red-500"
                              : "from-emerald-500 to-cyan-500"
                        } opacity-80 rounded-lg shadow-lg`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Fixed position play button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                  whileHover={{
                    boxShadow: "0 0 30px rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.2 }}
                />

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div
                    onClick={handlePlay}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
                  >
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Description with luxury styling */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-amber-300 mb-3 uppercase tracking-wider">
                The Ultimate Experience
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Immerse yourself in the most exclusive hexagonal treasure hunt ever created. Discover rare rewards and
                build your collection in this premium gaming experience.
              </p>
            </div>

            {/* Features with luxury styling */}
            <div className="mb-8 space-y-3">
              {[
                { text: "61 Unique Hexagons with Premium Rewards" },
                { text: "Exclusive Gameplay Experience" },
                { text: "Limited Edition Digital Collectibles" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
                  <span className="text-sm text-gray-200">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative">
              {/* Button glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-xl opacity-70" />

              <Button
                onClick={handlePlay}
                className="relative w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-7 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border-0 h-auto shadow-[0_10px_25px_rgba(91,33,182,0.4)]"
              >
                <span className="text-lg font-semibold">Play Now</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

