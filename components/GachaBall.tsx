"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const BALL_IMGS = [
  "/Im/cewfewfew.png",
  "/Im/cscfewfewf.png",
  "/Im/dscfewfew.png",
  "/Im/frebhgrnh.png",
  "/Im/qdqfdeq.png",
  "/Im/wefewfewfw.png",
];

const DECORATIONS = [
  { src: "/Im/sacdsacfasc.png",            x: -95, y: 20,  size: 34, delay: 0,    dur: 2.8 },
  { src: "/Im/scascfsaf.png",              x: -80, y: 90,  size: 28, delay: 0.5,  dur: 3.1 },
  { src: "/Im/sacdvewvre.png",             x: -88, y: 155, size: 26, delay: 1.1,  dur: 2.6 },
  { src: "/Im/teddy-bear_4841256.png",     x: -65, y: 54,  size: 32, delay: 0.3,  dur: 3.4 },
  { src: "/Im/wefwefewf.png",              x:  82, y: 20,  size: 32, delay: 0.7,  dur: 2.9 },
  { src: "/Im/acadc7.png",                 x:  70, y: 90,  size: 26, delay: 0.2,  dur: 3.2 },
  { src: "/Im/give-love_5680123.png",      x:  84, y: 155, size: 28, delay: 0.9,  dur: 2.7 },
  { src: "/Im/love_2839131.png",           x:  62, y: 54,  size: 30, delay: 1.3,  dur: 3.0 },
  { src: "/Im/teru-teru-bozu_7096623.png", x: -42, y: -18, size: 26, delay: 0.6,  dur: 3.5 },
  { src: "/Im/pigeon_818600.png",          x:  38, y: -16, size: 26, delay: 0.4,  dur: 3.3 },
];

interface GachaBallProps {
  onOpen: () => void;
  canPull: boolean;
  isAnimating: boolean;
}

export default function GachaBall({ onOpen, canPull, isAnimating }: GachaBallProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Floating balls row — only when can pull */}
      {canPull && (
        <div className="flex gap-2 justify-center h-10">
          {BALL_IMGS.slice(0, 4).map((src, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 2 + i * 0.35, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              className="w-8 h-8"
            >
              <Image src={src} alt="" width={32} height={32} className="object-contain" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Machine + decorations — always visible */}
      <div className="relative" style={{ marginTop: canPull ? 0 : 40 }}>
        {/* Decorations */}
        {DECORATIONS.map((d, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `calc(50% + ${d.x}px)`,
              top: d.y,
              width: d.size,
              height: d.size,
              marginLeft: -d.size / 2,
            }}
            animate={{ y: [0, -6, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
          >
            <Image src={d.src} alt="" width={d.size} height={d.size} className="object-contain" />
          </motion.div>
        ))}

        <AnimatePresence mode="wait">
          {canPull ? (
            <motion.button
              key="active"
              onClick={isAnimating ? undefined : onOpen}
              disabled={isAnimating}
              className="relative focus:outline-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={!isAnimating ? { scale: 1.06 } : {}}
              whileTap={!isAnimating ? { scale: 0.94 } : {}}
            >
              <motion.div
                animate={
                  isAnimating
                    ? { rotate: [-8, 8, -6, 6, -3, 3, 0], scale: [1, 1.1, 0.95, 1.05, 1] }
                    : { y: [0, -5, 0] }
                }
                transition={
                  isAnimating
                    ? { duration: 0.7 }
                    : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <Image
                  src="/Im/299018-P85W5N-377.png"
                  alt="Gacha Machine"
                  width={220}
                  height={220}
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 8px 24px rgba(100,140,220,0.35))" }}
                  priority
                />
              </motion.div>

              {!isAnimating && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
                  style={{ color: "#7B6A9E", fontFamily: "'IMTYC Birthday', 'Sarabun', sans-serif" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  กดหมุน!
                </motion.div>
              )}
            </motion.button>
          ) : (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="opacity-35">
                <Image
                  src="/Im/299018-P85W5N-377.png"
                  alt="Locked"
                  width={220}
                  height={220}
                  className="object-contain grayscale"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
