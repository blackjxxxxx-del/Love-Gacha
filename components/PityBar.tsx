"use client";

import { motion } from "framer-motion";
import { PITY_THRESHOLD } from "@/lib/gacha";

interface PityBarProps { pityCount: number; }

export default function PityBar({ pityCount }: PityBarProps) {
  const pct  = Math.min((pityCount / PITY_THRESHOLD) * 100, 100);
  const full = pityCount >= PITY_THRESHOLD;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium" style={{ color: "#7B6A9E", fontFamily: "'Sarabun', sans-serif" }}>
          Pity
        </span>
        {full && (
          <span className="text-xs font-bold animate-pulse" style={{ color: "#B8860B" }}>
            ✨ วันนี้พิเศษมากๆ!
          </span>
        )}
      </div>

      <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(170,200,240,0.4)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: full ? "linear-gradient(90deg,#FFD700,#FFA500)" : "linear-gradient(90deg,#FF6B9D,#C84BFF)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        {[...Array(PITY_THRESHOLD)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ background: i < pityCount ? "#FF6B9D" : "rgba(150,180,220,0.4)" }} />
        ))}
      </div>
    </div>
  );
}
