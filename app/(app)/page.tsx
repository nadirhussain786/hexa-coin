"use client";

import { AnimatePresence } from "framer-motion";
import HexChaseCard from "../components/HexChaseCard";

export default function page() {
  return (
    <div className="flex-1 w-full max-w-[1800px] mx-auto relative z-10 overflow-hidden">
    <main className="flex-1 min-w-0 max-w-full">
      <AnimatePresence mode="wait">
        <HexChaseCard />
      </AnimatePresence>
    </main>
    </div>
  );
}
