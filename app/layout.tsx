import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Love Gacha For คูมมอมอ 💕",
  description: "กาชาความรักพิเศษ เฉพาะคูมมอมอ",
};

// [left%, size(px), duration(s), delay(s), type]  type: 0=star 1=dot 2=sparkle
const PARTICLES: [number, number, number, number, number][] = [
  [4,  14, 9,  0.0, 0], [10,  8, 11, 1.5, 1], [17, 12, 8,  0.8, 2],
  [24, 10, 12, 2.2, 0], [31,  8, 10, 0.3, 1], [38, 16, 9,  3.0, 2],
  [45, 10, 11, 1.0, 0], [52,  8,  8, 2.8, 1], [60, 12, 10, 0.5, 2],
  [67, 10,  9, 1.8, 0], [74, 14, 12, 3.5, 1], [81,  8, 10, 0.2, 2],
  [88, 12,  8, 2.0, 0], [14, 10, 11, 4.0, 1], [57,  8,  9, 3.8, 2],
  [70, 16, 12, 1.2, 0], [36, 10,  8, 2.5, 1], [83, 12, 10, 4.5, 2],
  [50,  8, 11, 0.6, 0], [21, 14,  9, 3.2, 1],
];

const EMOJIS = ["✦", "·", "✿"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{ fontFamily: "'Sarabun', sans-serif" }} className="antialiased">
        <div className="heartfield" aria-hidden="true">
          {PARTICLES.map(([left, sz, dur, delay, type], i) => (
            <div
              key={i}
              className="heart-particle"
              style={{
                left:   `${left}%`,
                bottom: "-4%",
                fontSize: `${sz}px`,
                color: type === 0 ? "#FFD700" : type === 1 ? "#FF8FAB" : "#A0C4FF",
                ["--dur"   as string]: `${dur}s`,
                ["--delay" as string]: `${delay}s`,
              }}
            >
              {EMOJIS[type]}
            </div>
          ))}
        </div>
        <main className="relative z-10 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
