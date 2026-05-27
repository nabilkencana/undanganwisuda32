"use client";

import { useEffect, useState } from "react";
import { MessageCircleHeart, Users, CalendarCheck, Sparkles, Heart } from "lucide-react";
import BottomNav from "@/components/BottonNav";

/* ============================================================ */
/* TYPES                                                        */
/* ============================================================ */
type Comment = {
  id: number;
  nama: string;
  pesan: string;
  hadir: string;
  pax?: number;
  waktu: string;
};

/* ============================================================ */
/* AVATAR COLORS                                                */
/* ============================================================ */
const PALETTES = [
  ["#1e3a8a", "#60a5fa"],
  ["#6b21a8", "#c084fc"],
  ["#065f46", "#34d399"],
  ["#92400e", "#fbbf24"],
  ["#881337", "#fb7185"],
  ["#1e3a5f", "#38bdf8"],
  ["#3b0764", "#a78bfa"],
  ["#14532d", "#86efac"],
];

function getAvatarPalette(name: string) {
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % PALETTES.length;
  return PALETTES[idx];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ============================================================ */
/* MAIN PAGE                                                    */
/* ============================================================ */
export default function KomentarPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(0);
  const [notAttending, setNotAttending] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rsvp-data");
      if (raw) {
        const data = JSON.parse(raw) as Comment[];
        const sorted = [...data].reverse(); // newest first
        setComments(sorted);
        setAttending(data.filter((c) => c.hadir === "Hadir").length);
        setNotAttending(data.filter((c) => c.hadir === "Tidak Hadir").length);
      }
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#050f20] pb-36 text-white">

        {/* ── BACKGROUND ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, #0d3470 0%, #071840 45%, #050f20 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 z-[3] h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.7), transparent)" }}
        />
        <div
          className="absolute left-1/2 top-0 z-[1] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.06) 0%, rgba(20,80,200,0.07) 50%, transparent 70%)" }}
        />

        <div className="relative z-10 mx-auto max-w-md px-4 pt-12">

          {/* ── HEADER ── */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 backdrop-blur-xl"
              style={{ letterSpacing: "0.32em" }}
            >
              <span className="text-[9px] text-yellow-400">✦</span>
              <span className="text-[9px] text-yellow-300/80">LUMINEX · ANGKATAN 32</span>
              <span className="text-[9px] text-yellow-400">✦</span>
            </div>

            <div className="relative mt-6 inline-block">
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(36px, 9vw, 64px)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                  color: "transparent",
                  backgroundImage: "linear-gradient(160deg, #ffffff 10%, #e8d68a 45%, #ffd700 60%, #fff8e0 90%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(255,215,0,0.18))",
                }}
              >
                Ucapan
              </h1>
              <div
                className="absolute -bottom-1 left-0 right-0 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)" }}
              />
            </div>

            <p
              className="mt-4 mx-auto max-w-[280px] leading-7 text-white/45"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(14px,3.5vw,16px)", fontStyle: "italic" }}
            >
              Pesan dan doa dari keluarga wisudawan Angkatan 32
            </p>
          </div>

          <GoldDivider />

          {/* ── STATS ROW ── */}
          {!loading && comments.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { icon: MessageCircleHeart, label: "Ucapan", value: comments.length, color: "#ffd700" },
                { icon: CalendarCheck, label: "Hadir", value: attending, color: "#4ade80" },
                { icon: Users, label: "Tdk Hadir", value: notAttending, color: "#f87171" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-2xl py-4"
                  style={{
                    background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <stat.icon size={20} style={{ color: stat.color, opacity: 0.8 }} />
                  <span
                    className="mt-2 font-black"
                    style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span className="mt-0.5 text-white/35" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                    {stat.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div className="mt-8 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-[24px] p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full flex-shrink-0" style={{ background: "rgba(255,215,0,0.08)", animation: "pulse 1.8s infinite" }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s infinite" }} />
                      <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s 0.2s infinite" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && comments.length === 0 && (
            <div
              className="mt-4 overflow-hidden rounded-[28px] px-6 py-10 text-center"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="mb-5 flex justify-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.15)" }}
                >
                  <Heart size={32} className="text-yellow-300/50" />
                </div>
              </div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 700, letterSpacing: "0.06em" }}>
                Belum Ada Ucapan
              </p>
              <p
                className="mt-3 leading-7 text-white/40"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: "italic" }}
              >
                Ucapan dari orang tua wisudawan akan muncul di sini setelah konfirmasi RSVP dilakukan.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/15 bg-yellow-400/5 px-4 py-2">
                <Sparkles size={13} className="text-yellow-300/60" />
                <span className="text-[12px] text-yellow-300/50">Mulai dari ucapan RSVP Anda</span>
              </div>
            </div>
          )}

          {/* ── COMMENT FEED ── */}
          {!loading && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment, idx) => {
                const [dark, light] = getAvatarPalette(comment.nama);
                const isHadir = comment.hadir === "Hadir";

                return (
                  <div
                    key={comment.id}
                    className="komcard overflow-hidden rounded-[24px]"
                    style={{
                      animationDelay: `${idx * 0.06}s`,
                      background: "linear-gradient(160deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 60%, rgba(13,52,112,0.1) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {/* top shimmer */}
                    <div
                      className="h-px w-full"
                      style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.2), transparent)" }}
                    />

                    <div className="p-5">
                      {/* ── USER ROW ── */}
                      <div className="flex items-center gap-3">
                        {/* avatar */}
                        <div
                          className="flex h-12 w-12 min-w-[48px] items-center justify-center rounded-full text-sm font-black text-white"
                          style={{
                            background: `linear-gradient(135deg, ${dark}, ${light})`,
                            fontSize: 15,
                            boxShadow: `0 0 16px ${dark}66`,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {getInitials(comment.nama)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white" style={{ fontSize: 15 }}>
                            Wali{" "}
                            <span className="text-yellow-300">{comment.nama}</span>
                          </p>
                          <p className="mt-0.5 text-white/35" style={{ fontSize: 11, letterSpacing: "0.05em" }}>
                            {comment.waktu}
                          </p>
                        </div>

                        {/* hadir badge */}
                        <span
                          className="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            background: isHadir ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.1)",
                            color: isHadir ? "#4ade80" : "#f87171",
                            border: `1px solid ${isHadir ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.2)"}`,
                            fontSize: 11,
                          }}
                        >
                          {isHadir ? `✓ Hadir${comment.pax ? ` · ${comment.pax}` : ""}` : "✗ Tdk Hadir"}
                        </span>
                      </div>

                      {/* ── MESSAGE ── */}
                      <div
                        className="mt-4 rounded-xl px-4 py-3.5"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontFamily: "Georgia, serif",
                            fontSize: 40,
                            lineHeight: 0.6,
                            color: "rgba(255,215,0,0.18)",
                          }}
                          aria-hidden
                        >
                          "
                        </span>
                        <p
                          className="mt-2 text-white/80"
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: "clamp(15px, 4vw, 17px)",
                            fontStyle: "italic",
                            lineHeight: 1.75,
                          }}
                        >
                          {comment.pesan}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FOOTER ── */}
          <div className="mt-14 flex justify-center gap-4">
            {["✦", "✧", "⋆", "✧", "✦"].map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 15,
                  color: i % 2 === 0 ? "#ffd700" : "#ffffff",
                  textShadow: "0 0 12px rgba(255,215,0,0.8)",
                  animation: `float 2.5s ease-in-out ${i * 0.2}s infinite`,
                  display: "inline-block",
                  opacity: 0.6,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap");

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
          }

          .komcard {
            animation: slideUp 0.5s ease-out both;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>

      <BottomNav />
    </>
  );
}

function GoldDivider() {
  return (
    <div className="my-7 flex items-center justify-center gap-3">
      <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6))" }} />
      <span style={{ color: "#ffd700", fontSize: 10, filter: "drop-shadow(0 0 4px rgba(255,215,0,0.8))" }}>◆</span>
      <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(255,215,0,0.6))" }} />
    </div>
  );
}
