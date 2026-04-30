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

      <div className="h-screen flex flex-col items-center justify-between px-4 py-4">

        {/* ── Title ── */}
        <motion.div
          className="text-center pt-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1
            className="font-bold"
            style={{ fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif", lineHeight: 1, fontSize: "clamp(1.8rem, 9vw, 3rem)" }}
          >
            <span className="title-love">Love Gacha For </span>
            <br />
            <span className="title-name">คูมมอมอ</span>
          </h1>
        </motion.div>

        {/* ── Pity bar ── */}
        <motion.div className="w-full max-w-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <PityBar pityCount={state.pityCount} />
        </motion.div>

        {/* ── Gacha machine ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 16 }}
        >
          <GachaBall onOpen={handlePull} canPull={canPull} isAnimating={isAnimating} />
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          className="flex gap-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: "หมุน", value: state.totalPulls,                                color: "#2D1B5E" },
            { label: "สะสม", value: `${state.collectedIds.length}/${totalItems}`,    color: "#2D1B5E" },
            { label: "SSR",  value: ssrCount,                                         color: "#B8860B" },
          ].map((s) => (
            <div key={s.label} className="card-glass px-3 py-1 rounded-xl w-[68px] text-center">
              <p className="text-base font-bold leading-tight" style={{ color: s.color, fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif" }}>
                {s.value}
              </p>
              <p className="text-xs" style={{ color: "#7B6A9E" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Nav ── */}
        <motion.nav
          className="flex gap-3 pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/collection"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105"
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
        </motion.nav>

      </div>
    </>
  );
}
