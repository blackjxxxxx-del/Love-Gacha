"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { GachaItem, Rarity } from "@/lib/gacha";

interface CollectionBookProps {
  allItems: GachaItem[];
  collectedIds: string[];
}

const RARITY_STYLE: Record<Rarity, {
  badge: string; cardBg: string; border: string; text: string; label: string;
}> = {
  SSR: { badge: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white", cardBg: "rgba(255,248,210,0.8)", border: "rgba(255,200,50,0.6)",  text: "#5A3000", label: "★★★ Legendary"  },
  SR:  { badge: "bg-purple-500 text-white",                                  cardBg: "rgba(245,235,255,0.8)", border: "rgba(190,140,255,0.5)", text: "#3A0A6E", label: "★★ Super Rare" },
  R:   { badge: "bg-sky-500 text-white",                                     cardBg: "rgba(230,244,255,0.8)", border: "rgba(140,190,255,0.5)", text: "#1A3A7E", label: "★ Rare"         },
  C:   { badge: "bg-slate-400/80 text-white",                                cardBg: "rgba(240,246,255,0.7)", border: "rgba(200,220,250,0.5)", text: "#2D1B5E", label: "Common"         },
};

export default function CollectionBook({ allItems, collectedIds }: CollectionBookProps) {
  const collected = new Set(collectedIds);

  const groups: Record<Rarity, GachaItem[]> = { SSR: [], SR: [], R: [], C: [] };
  allItems.forEach((i) => groups[i.rarity].push(i));

  const total = allItems.length;
  const got   = collectedIds.length;

  return (
    <div className="w-full max-w-2xl mx-auto pb-4">
      {/* Progress */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: "#7B6A9E" }}>สะสมได้</span>
        <span className="text-sm font-bold" style={{ color: "#2D1B5E", fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif" }}>
          {got} / {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full mb-3 overflow-hidden" style={{ background: "rgba(180,200,240,0.35)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,#FF6B9D,#C84BFF)" }}
          initial={{ width: 0 }}
          animate={{ width: `${(got / Math.max(total, 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {(["SSR", "SR", "R", "C"] as Rarity[]).map((rarity) => {
        const items = groups[rarity];
        const s = RARITY_STYLE[rarity];
        const gotCount = items.filter((i) => collected.has(i.id)).length;
        return (
          <div key={rarity} className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.badge}`}>{s.label}</span>
              <span className="text-xs" style={{ color: "#9B8ABE" }}>{gotCount} / {items.length}</span>
            </div>

            <div className="grid gap-1.5">
              {items.map((item, idx) => {
                const done = collected.has(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex items-center gap-2 p-2 rounded-xl transition-all"
                    style={{
                      background: done ? s.cardBg : "rgba(200,220,250,0.2)",
                      border: `1.5px solid ${done ? s.border : "rgba(200,220,250,0.3)"}`,
                      opacity: done ? 1 : 0.45,
                    }}
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                      {done && item.image ? (
                        <Image src={item.image} alt="" width={40} height={40} className="object-contain" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                          style={{ background: "rgba(180,200,240,0.4)", color: "rgba(100,130,200,0.5)" }}>
                          ?
                        </div>
                      )}
                    </div>

                    <p className="flex-1 text-sm leading-snug whitespace-pre-line"
                      style={{ color: done ? s.text : "transparent", fontFamily: "'Sarabun', sans-serif",
                        textShadow: done ? "none" : "0 0 8px rgba(100,130,200,0.3)" }}>
                      {done ? item.text : "ยังไม่ได้สุ่ม..."}
                    </p>

                    {done && <span className="text-xs flex-shrink-0" style={{ color: "#66BB6A" }}>✓</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
