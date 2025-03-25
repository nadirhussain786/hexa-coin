"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function ComingSoonCard() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 opacity-70" />

          <div className="relative p-8 md:p-12">
            {/* Subtle animated accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-6 right-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-purple-400 opacity-70" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-xs uppercase tracking-widest text-purple-400 font-medium">Coming Soon</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 leading-tight">
                    Our New Collection
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p className="text-gray-400 leading-relaxed max-w-md">
                    We are crafting something extraordinary. Elegant, refined, and worth the wait. Experience the
                    pinnacle of luxury, coming to you soon.
                  </p>
                </motion.div>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"
              />

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col space-y-4"
              >
                <p className="text-sm text-gray-500 italic text-center">Luxury is in each detail.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

