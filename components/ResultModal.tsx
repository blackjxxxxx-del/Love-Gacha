"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import type { GachaItem, Rarity } from "@/lib/gacha";

interface ResultModalProps {
  item: GachaItem | null;
  onClose: () => void;
  isNew: boolean;
}

const STYLES: Record<Rarity, {
  cardBg: string; border: string; glow: string;
  badge: string; badgeText: string; textColor: string; subColor: string;
}> = {
  C: {
    cardBg:   "rgba(240,246,255,0.95)",
    border:   "rgba(200,220,250,0.9)",
    glow:     "0 8px 32px rgba(150,180,230,0.25)",
    badge:    "bg-slate-400/80 text-white",
    badgeText:"✦ Common",
    textColor:"#2D1B5E",
    subColor: "#7B6A9E",
  },
  R: {
    cardBg:   "rgba(230,244,255,0.95)",
    border:   "rgba(140,190,255,0.8)",
    glow:     "0 8px 40px rgba(100,160,255,0.3)",
    badge:    "bg-sky-500 text-white",
    badgeText:"★ Rare",
    textColor:"#1A3A7E",
    subColor: "#4A70AE",
  },
  SR: {
    cardBg:   "rgba(245,235,255,0.95)",
    border:   "rgba(190,140,255,0.75)",
    glow:     "0 8px 48px rgba(160,100,255,0.35)",
    badge:    "bg-purple-500 text-white",
    badgeText:"★★ Super Rare",
    textColor:"#3A0A6E",
    subColor: "#7A4AAE",
  },
  SSR: {
    cardBg:   "rgba(255,252,230,0.97)",
    border:   "rgba(255,215,0,0.7)",
    glow:     "0 8px 60px rgba(255,185,0,0.4)",
    badge:    "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
    badgeText:"★★★ LEGENDARY ★★★",
    textColor:"#5A3000",
    subColor: "#8B6000",
  },
};

export default function ResultModal({ item, onClose, isNew }: ResultModalProps) {
  useEffect(() => {
    if (!item || item.rarity !== "SSR") return;
    let active = true;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (!active) return;
      const burst = () => {
        confetti({ particleCount: 90, spread: 110, origin: { y: 0.5, x: 0.25 }, colors: ["#FFD700","#FFA500","#FF69B4","#A0C4FF","#fff"] });
        confetti({ particleCount: 90, spread: 110, origin: { y: 0.5, x: 0.75 }, colors: ["#FFD700","#C84BFF","#60B4FF","#FF8FAB","#fff"] });
      };
      burst(); setTimeout(burst, 450); setTimeout(burst, 900);
    });
    return () => { active = false; };
  }, [item]);

  const s = item ? STYLES[item.rarity] : STYLES.C;
  const isSSR = item?.rarity === "SSR";
  const isSR  = item?.rarity === "SR";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(100,130,200,0.35)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          {/* SSR golden burst */}
          {isSSR && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0, 0.5, 0, 0.2, 0] }}
              transition={{ duration: 0.9 }}
              style={{ background: "radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, transparent 65%)" }}
            />
          )}

          <motion.div
            key="card"
            initial={{ scale: 0.2, opacity: 0, y: 80 }}
            animate={
              isSSR ? { scale: [0.2, 1.18, 0.92, 1.05, 1], opacity: 1, y: 0 } :
              isSR  ? { scale: [0.2, 1.08, 0.97, 1], opacity: 1, y: 0 } :
                      { scale: [0.2, 1.04, 1], opacity: 1, y: 0 }
            }
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: isSSR ? 0.75 : 0.45, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-xs rounded-3xl overflow-hidden"
            style={{
              background: s.cardBg,
              border: `2px solid ${s.border}`,
              boxShadow: s.glow,
            }}
          >
            {/* SSR shimmer rays */}
            {isSSR && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i}
                    className="absolute w-0.5 h-full"
                    style={{ left: `${18 + i * 16}%`, background: "linear-gradient(to bottom, transparent, rgba(255,200,0,0.4), transparent)" }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.28 }}
                  />
                ))}
              </div>
            )}

            {/* Image */}
            {item.image && (
              <div className="w-full flex items-center justify-center pt-6 pb-2"
                style={{ background: isSSR ? "linear-gradient(180deg, rgba(255,240,150,0.3) 0%, transparent 100%)" : "transparent" }}>
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 18 }}
                >
                  <Image
                    src={item.image} alt="" width={150} height={150}
                    className="object-contain"
                    style={{ filter: isSSR ? "drop-shadow(0 4px 16px rgba(255,180,0,0.5))" : isSR ? "drop-shadow(0 4px 12px rgba(160,100,255,0.4))" : "drop-shadow(0 4px 10px rgba(100,130,200,0.25))" }}
                  />
                </motion.div>
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-5 flex flex-col items-center gap-3">
              {/* Badge */}
              <motion.span
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${s.badge}`}
                animate={isSSR ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {s.badgeText}
              </motion.span>

              {/* Text */}
              <motion.p
                className="text-center text-base font-semibold leading-relaxed whitespace-pre-line"
                style={{ color: s.textColor, fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {item.text}
              </motion.p>

              {/* NEW badge */}
              {isNew && (
                <motion.span
                  className="px-3 py-0.5 rounded-full text-white text-xs font-bold"
                  style={{ background: "#FF3D82" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.5 }}
                >
                  NEW! ✨
                </motion.span>
              )}

              {/* Close */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="mt-1 w-full py-3 rounded-2xl font-bold text-sm transition-all"
                style={{
                  fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif",
                  background: isSSR ? "linear-gradient(135deg, #FFD700, #FFA500)" : "rgba(180,200,240,0.5)",
                  color: isSSR ? "#5A3000" : s.textColor,
                  border: `1.5px solid ${isSSR ? "rgba(255,200,0,0.6)" : "rgba(255,255,255,0.8)"}`,
                }}
              >
                รับแล้ว! 💕
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
