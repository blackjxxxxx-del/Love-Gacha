"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getAdminPassword, setAdminPassword,
  getCItems, getRItems, getSRItems, getSSRItems,
  addCustomCItem, addCustomRItem, addCustomSRItem, addCustomSSRItem,
  deleteCustomItem, isDefaultItem, resetAllData, resetPullDate,
} from "@/lib/storage";
import type { GachaItem, Rarity } from "@/lib/gacha";

const TABS: { key: Rarity; label: string; add: (t: string) => void }[] = [
  { key: "C",   label: "Common",     add: addCustomCItem   },
  { key: "R",   label: "Rare",       add: addCustomRItem   },
  { key: "SR",  label: "Super Rare", add: addCustomSRItem  },
  { key: "SSR", label: "Legendary",  add: addCustomSSRItem },
];

function getItems(r: Rarity): GachaItem[] {
  return r === "C" ? getCItems() : r === "R" ? getRItems() : r === "SR" ? getSRItems() : getSSRItems();
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<Rarity | "settings">("C");
  const [items, setItems] = useState<GachaItem[]>([]);
  const [newText, setNewText] = useState("");
  const [newPw, setNewPw] = useState("");
  const [toast, setToast] = useState("");

  const refresh = () => { if (tab !== "settings") setItems(getItems(tab as Rarity)); };
  useEffect(() => { if (authed) refresh(); }, [authed, tab]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleLogin = () => {
    if (pwInput === getAdminPassword()) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  const handleAdd = () => {
    if (!newText.trim() || tab === "settings") return;
    TABS.find((t) => t.key === tab)!.add(newText.trim());
    setNewText(""); refresh();
    showToast(`เพิ่มแล้ว! ✓`);
  };

  const CARD  = { background: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.9)" };
  const BTN   = { background: "rgba(180,200,240,0.5)",  border: "1.5px solid rgba(255,255,255,0.85)", color: "#2D1B5E" };
  const BTNACC= { background: "linear-gradient(135deg,#FF6B9D,#C84BFF)", border: "none", color: "white" };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          className="w-full max-w-sm p-8 rounded-3xl flex flex-col gap-4" style={CARD}>
          <h1 className="text-2xl font-bold text-center" style={{ color:"#2D1B5E", fontFamily:"'IMTYC Birthday','Sarabun',sans-serif" }}>
            🔐 Admin
          </h1>
          <p className="text-sm text-center" style={{ color:"#9B8ABE" }}>ใส่รหัสผ่านเพื่อเข้าจัดการ</p>
          <input type="password" value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="รหัสผ่าน..."
            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
            style={{ background:"rgba(200,220,255,0.3)", border:`1.5px solid ${pwError?"#FF4444":"rgba(180,200,240,0.6)"}`, color:"#2D1B5E" }}
          />
          {pwError && <p className="text-xs text-center text-red-500 -mt-2">รหัสผ่านไม่ถูกต้อง</p>}
          <button onClick={handleLogin} className="w-full py-3 rounded-2xl font-bold text-white transition-opacity hover:opacity-90"
            style={{ background:"linear-gradient(135deg,#FF6B9D,#C84BFF)" }}>
            เข้าสู่ระบบ
          </button>
          <Link href="/" className="text-center text-sm transition-colors" style={{ color:"#9B8ABE" }}>← กลับหน้าหลัก</Link>
          <p className="text-xs text-center" style={{ color:"#B8B0CC" }}>รหัสเริ่มต้น: iloveyou</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg text-white"
            style={{ background:"linear-gradient(135deg,#4CAF50,#2E7D32)" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ ...BTN, border: "1.5px solid rgba(255,255,255,0.9)" }}>← กลับ</Link>
          <h1 className="text-2xl font-bold" style={{ color:"#2D1B5E", fontFamily:"'IMTYC Birthday','Sarabun',sans-serif" }}>
            Admin Panel 🛠️
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={tab === t.key ? BTNACC : { ...BTN, fontSize:"0.75rem" }}>
              {t.label} ({getItems(t.key).length})
            </button>
          ))}
          <button onClick={() => setTab("settings")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={tab === "settings" ? BTNACC : { ...BTN, fontSize:"0.75rem" }}>
            ⚙️ ตั้งค่า
          </button>
        </div>

        {/* Item tab */}
        {tab !== "settings" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
            <div className="p-4 rounded-2xl space-y-3" style={CARD}>
              <h3 className="text-sm font-bold" style={{ color:"#2D1B5E" }}>
                + เพิ่ม {TABS.find((t) => t.key === tab)?.label}
              </h3>
              <textarea value={newText} onChange={(e) => setNewText(e.target.value)}
                placeholder="พิมพ์ข้อความที่อยากเพิ่ม..." rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ background:"rgba(200,220,255,0.25)", border:"1.5px solid rgba(180,200,240,0.5)", color:"#2D1B5E" }}
              />
              <button onClick={handleAdd} disabled={!newText.trim()}
                className="float-right px-5 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
                style={BTNACC}>
                เพิ่ม
              </button>
              <div className="clear-both" />
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background:"rgba(240,246,255,0.7)", border:"1px solid rgba(200,220,250,0.6)" }}>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color:"#2D1B5E" }}>{item.text}</p>
                    <span className="text-xs mt-0.5 block" style={{ color: isDefaultItem(item.id) ? "#B8B0CC" : "#FF6B9D" }}>
                      {isDefaultItem(item.id) ? "default" : "custom"}
                    </span>
                  </div>
                  {!isDefaultItem(item.id) && (
                    <button onClick={() => { deleteCustomItem(item.id, item.rarity); refresh(); showToast("ลบแล้ว"); }}
                      className="text-xs px-2 py-1 rounded-lg transition-all flex-shrink-0"
                      style={{ color:"#EF5350", background:"rgba(255,100,100,0.08)" }}>
                      ลบ
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings tab */}
        {tab === "settings" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
            <div className="p-5 rounded-2xl space-y-3" style={CARD}>
              <h3 className="font-bold" style={{ color:"#2D1B5E" }}>เปลี่ยนรหัสผ่าน Admin</h3>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                placeholder="รหัสผ่านใหม่..." className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{ background:"rgba(200,220,255,0.25)", border:"1.5px solid rgba(180,200,240,0.5)", color:"#2D1B5E" }}
              />
              <button onClick={() => { if (newPw.trim()) { setAdminPassword(newPw.trim()); setNewPw(""); showToast("เปลี่ยนแล้ว ✓"); } }}
                disabled={!newPw.trim()} className="px-5 py-2.5 rounded-2xl font-bold disabled:opacity-40 transition-all"
                style={BTNACC}>
                บันทึก
              </button>
            </div>

            <div className="p-5 rounded-2xl space-y-3" style={CARD}>
              <h3 className="font-bold" style={{ color:"#2D1B5E" }}>ปลดล็อคการสุ่ม</h3>
              <p className="text-sm" style={{ color:"#7B6A9E" }}>ให้สุ่มได้วันนี้อีกครั้ง (ไม่ล้าง collection หรือ pity)</p>
              <button onClick={() => { resetPullDate(); showToast("ปลดล็อคแล้ว! 🎉"); }}
                className="px-5 py-2.5 rounded-2xl font-bold transition-all hover:opacity-90"
                style={BTNACC}>
                🎰 ปลดล็อคสุ่มวันนี้
              </button>
            </div>

            <div className="p-5 rounded-2xl space-y-3"
              style={{ background:"rgba(255,230,230,0.7)", border:"1.5px solid rgba(255,150,150,0.4)" }}>
              <h3 className="font-bold" style={{ color:"#8B0000" }}>Danger Zone</h3>
              <p className="text-sm" style={{ color:"#C62828" }}>รีเซ็ตข้อมูลทั้งหมด (collection, pity, pull history)</p>
              <button onClick={() => { if (confirm("รีเซ็ตทุกอย่างจริงๆ เหรอ?")) { resetAllData(); showToast("รีเซ็ตแล้ว"); } }}
                className="px-5 py-2.5 rounded-2xl font-bold transition-all"
                style={{ background:"rgba(255,100,100,0.2)", border:"1.5px solid rgba(255,100,100,0.5)", color:"#C62828" }}>
                🗑️ รีเซ็ตทุกอย่าง
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
