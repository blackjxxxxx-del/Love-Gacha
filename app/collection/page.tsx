"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CollectionBook from "@/components/CollectionBook";
import { getState, getAllItems } from "@/lib/storage";
import type { GachaItem, GachaState } from "@/lib/gacha";

export default function CollectionPage() {
  const [state, setState] = useState<GachaState | null>(null);
  const [allItems, setAllItems] = useState<GachaItem[]>([]);

  useEffect(() => {
    setState(getState());
    setAllItems(getAllItems());
  }, []);

  if (!state) return null;

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.9)", color: "#2D1B5E" }}>
            ← กลับ
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#2D1B5E", fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif" }}>
              สมุดสะสม 📚
            </h1>
            <p className="text-sm" style={{ color: "#9B8ABE" }}>รวบรวมความรักทั้งหมดที่ได้รับ</p>
          </div>
        </div>
        <CollectionBook allItems={allItems} collectedIds={state.collectedIds} />
      </motion.div>
    </div>
  );
}
