"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GachaBall from "@/components/GachaBall";
import ResultModal from "@/components/ResultModal";
import PityBar from "@/components/PityBar";
import { getState, saveState, getCItems, getRItems, getSRItems, getSSRItems } from "@/lib/storage";
import { pullGacha, canPullToday, getTodayString, PITY_THRESHOLD } from "@/lib/gacha";
import type { GachaItem, GachaState } from "@/lib/gacha";

export default function Home() {
  const [state, setState] = useState<GachaState | null>(null);
  const [result, setResult] = useState<GachaItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setState(getState());
  }, []);

  const handlePull = useCallback(() => {
    if (!state || isAnimating) return;
    if (!canPullToday(state.lastPullDate)) return;
    setIsAnimating(true);
    setTimeout(() => {
      const item = pullGacha(getCItems(), getRItems(), getSRItems(), getSSRItems(), state.pityCount);
      const newIsNew = !state.collectedIds.includes(item.id);
      const newPity = item.rarity === "SSR" ? 0 : Math.min(state.pityCount + 1, PITY_THRESHOLD);
      const newState: GachaState = {
        lastPullDate: getTodayString(),
        pityCount: newPity,
        collectedIds: newIsNew ? [...state.collectedIds, item.id] : state.collectedIds,
        totalPulls: state.totalPulls + 1,
      };
      saveState(newState);
      setState(newState);
      setIsNew(newIsNew);
      setResult(item);
      setIsAnimating(false);
    }, 900);
  }, [state, isAnimating]);

  if (!mounted || !state) return null;

  const canPull = canPullToday(state.lastPullDate);
  const ssrCount = state.collectedIds.filter((id) => getSSRItems().some((i) => i.id === id)).length;
  const totalItems = getCItems().length + getRItems().length + getSRItems().length + getSSRItems().length;

  return (
    <>
      <ResultModal item={result} onClose={() => setResult(null)} isNew={isNew} />

      <div className="h-[100dvh] flex flex-col items-center px-4">

        {/* ── Title + Pity ── */}
        <motion.div
          className="text-center w-full max-w-[300px] mt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1
            className="font-bold mb-2"
            style={{ fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif", lineHeight: 1.05, fontSize: "clamp(1.7rem, 8.5vw, 2.8rem)" }}
          >
            <span className="title-love">Love Gacha For</span>
            <br />
            <span className="title-name">คูมมอมอ</span>
          </h1>
          <PityBar pityCount={state.pityCount} />
        </motion.div>

        {/* ── Gacha machine — flex-1 ── */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 16 }}
        >
          <GachaBall onOpen={handlePull} canPull={canPull} isAnimating={isAnimating} />
        </motion.div>

        {/* ── Stats + Nav ── */}
        <motion.div
          className="flex flex-col items-center gap-2.5 mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-2">
            {[
              { label: "หมุน", value: state.totalPulls,                             color: "#2D1B5E" },
              { label: "สะสม", value: `${state.collectedIds.length}/${totalItems}`, color: "#2D1B5E" },
              { label: "SSR",  value: ssrCount,                                      color: "#B8860B" },
            ].map((s) => (
              <div key={s.label} className="card-glass px-4 py-1.5 rounded-2xl text-center min-w-[64px]">
                <p className="text-base font-bold leading-tight" style={{ color: s.color, fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif" }}>
                  {s.value}
                </p>
                <p className="text-[11px]" style={{ color: "#7B6A9E" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/collection"
            className="flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif",
              background: "rgba(255,255,255,0.6)",
              border: "1.5px solid rgba(255,255,255,0.9)",
              color: "#2D1B5E",
              boxShadow: "0 2px 10px rgba(100,120,200,0.12)",
            }}
          >
            📚 สมุดสะสม
          </Link>
        </motion.div>

      </div>
    </>
  );
}
