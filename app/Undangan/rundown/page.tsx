"use client";

import { useEffect, useState } from "react";
import { Clock3, Loader2, AlertCircle } from "lucide-react";
import BottomNav from "@/components/BottonNav";

/* ============================================================ */
/* TYPES                                                        */
/* ============================================================ */
type RundownItem = {
  id?: string;
  title?: string;
  acara?: string;
  description?: string;
  desc?: string;
  startTime?: string;
  endTime?: string;
  waktu?: string;
  order?: number;
};

/* ============================================================ */
/* FALLBACK DATA                                                */
/* ============================================================ */
const fallbackData: RundownItem[] = [
  {
    waktu: "07.30 – 08.00",
    acara: "Registrasi Tamu",
    desc: "Tamu undangan melakukan registrasi dan memasuki venue",
  },
  {
    waktu: "08.00 – 08.15",
    acara: "Pembukaan",
    desc: "Pembukaan oleh MC dan doa bersama",
  },
  {
    waktu: "08.15 – 09.30",
    acara: "Prosesi Wisuda",
    desc: "Pemanggilan dan penyerahan penghargaan kepada wisudawan",
  },
  {
    waktu: "09.30 – 10.00",
    acara: "Sambutan",
    desc: "Sambutan dari Kepala Sekolah dan perwakilan siswa",
  },
  {
    waktu: "10.00 – 11.00",
    acara: "Penutup & Foto Bersama",
    desc: "Sesi foto bersama dan penutup acara",
  },
];

/* ============================================================ */
/* HELPERS                                                      */
/* ============================================================ */
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(new Date(iso))
      .replace(":", ".");
  } catch {
    return iso;
  }
}

function buildWaktu(item: RundownItem) {
  if (item.waktu) return item.waktu;
  if (item.startTime && item.endTime)
    return `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`;
  if (item.startTime) return formatTime(item.startTime);
  return "–";
}

function buildAcara(item: RundownItem) {
  return item.title ?? item.acara ?? "";
}

function buildDesc(item: RundownItem) {
  return item.description ?? item.desc ?? "";
}

/* ============================================================ */
/* MAIN PAGE                                                    */
/* ============================================================ */
export default function RundownPage() {
  const [rundown, setRundown] = useState<RundownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const hash =
      typeof window !== "undefined"
        ? sessionStorage.getItem("invitation-hash")
        : null;

    if (!hash) {
      setRundown(fallbackData);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    fetch(`${API}/api/invitation/${hash}`)
      .then((r) => r.json())
      .then((res) => {
        const items: RundownItem[] =
          res?.data?.event?.rundowns ?? [];
        if (items.length > 0) {
          const sorted = [...items].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          );
          setRundown(sorted);
        } else {
          setRundown(fallbackData);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setRundown(fallbackData);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#050f20] pb-36 text-white">
        {/* BACKGROUND */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #0d3470 0%, #071840 45%, #050f20 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 z-[3] h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,215,0,0.7), transparent)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,0,0.07) 0%, rgba(20,80,200,0.08) 50%, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-md px-4 pt-12">
          {/* HEADER */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 backdrop-blur-xl"
              style={{ letterSpacing: "0.32em" }}
            >
              <span className="text-yellow-400 text-[9px]">✦</span>
              <span className="text-[9px] text-yellow-300/80">
                LUMINEX · ANGKATAN 32
              </span>
              <span className="text-yellow-400 text-[9px]">✦</span>
            </div>

            <div className="relative mt-6 inline-block">
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(40px, 10vw, 72px)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "0.1em",
                  color: "transparent",
                  backgroundImage:
                    "linear-gradient(160deg, #ffffff 10%, #e8d68a 45%, #ffd700 60%, #fff8e0 90%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(255,215,0,0.2))",
                }}
              >
                Rundown
                <br />
                Acara
              </h1>
              <div
                className="absolute -bottom-1 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)",
                }}
              />
            </div>

            <p
              className="mt-5 text-sm text-white/45"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(14px,2vw,16px)",
                letterSpacing: "0.05em",
              }}
            >
              Susunan kegiatan Wisuda LUMINEX
            </p>

            <GoldDivider />
          </div>

          {/* LOADING SKELETON */}
          {loading && (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[22px] p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 flex-shrink-0 rounded-full"
                      style={{
                        background: "rgba(255,215,0,0.08)",
                        animation: "pulse 1.8s ease-in-out infinite",
                      }}
                    />
                    <div className="flex-1 space-y-2">
                      <div
                        className="h-3 w-24 rounded-full"
                        style={{
                          background: "rgba(255,215,0,0.08)",
                          animation: "pulse 1.8s ease-in-out infinite",
                        }}
                      />
                      <div
                        className="h-4 w-36 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          animation: "pulse 1.8s ease-in-out 0.2s infinite",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <Loader2 size={20} className="animate-spin text-yellow-300/40" />
              </div>
            </div>
          )}

          {/* FALLBACK NOTICE */}
          {!loading && usingFallback && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-yellow-400/15 bg-yellow-400/5 px-4 py-3">
              <AlertCircle size={15} className="text-yellow-400/60 flex-shrink-0" />
              <p className="text-[12px] text-yellow-300/50">
                Menampilkan jadwal sementara
              </p>
            </div>
          )}

          {/* TIMELINE */}
          {!loading && (
            <div className="relative mt-2">
              {/* vertical gold line */}
              <div
                className="absolute left-5 top-5 bottom-5 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0.15) 70%, transparent 100%)",
                }}
              />

              <div className="space-y-5">
                {rundown.map((item, i) => {
                  const isLast = i === rundown.length - 1;
                  return (
                    <div
                      key={i}
                      className="relative flex gap-4 animate-fadein"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      {/* NODE */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full text-sm font-black"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            background:
                              "linear-gradient(135deg, #ffd700 0%, #f0c000 100%)",
                            boxShadow:
                              "0 0 0 3px rgba(255,215,0,0.12), 0 0 20px rgba(255,215,0,0.25)",
                            color: "#050f20",
                            fontSize: 14,
                          }}
                        >
                          {i + 1}
                        </div>
                      </div>

                      {/* CARD */}
                      <div
                        className="relative flex-1 overflow-hidden rounded-[22px] p-5 transition-all"
                        style={{
                          background:
                            "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 60%, rgba(13,52,112,0.12) 100%)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.3)",
                          backdropFilter: "blur(16px)",
                        }}
                      >
                        {/* shimmer top */}
                        <div
                          className="absolute top-0 left-4 right-4 h-px"
                          style={{
                            background:
                              "linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)",
                          }}
                        />

                        {/* time row */}
                        <div className="mb-3 flex items-center gap-2">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-yellow-400/20"
                            style={{ background: "rgba(255,215,0,0.07)" }}
                          >
                            <Clock3
                              size={13}
                              className="text-yellow-300/80"
                            />
                          </div>
                          <span
                            className="text-yellow-300/75"
                            style={{
                              fontFamily: "'Cinzel', serif",
                              fontSize: 11,
                              letterSpacing: "0.22em",
                            }}
                          >
                            {buildWaktu(item)}
                          </span>
                        </div>

                        {/* acara name */}
                        <h2
                          className="text-white"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(15px, 4vw, 19px)",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            lineHeight: 1.2,
                          }}
                        >
                          {buildAcara(item)}
                        </h2>

                        {/* desc */}
                        <p
                          className="mt-3 leading-7 text-white/50"
                          style={{
                            fontFamily:
                              "'Cormorant Garamond', Georgia, serif",
                            fontSize: "clamp(13px,2.2vw,15px)",
                            fontStyle: "italic",
                          }}
                        >
                          {buildDesc(item)}
                        </p>

                        {!isLast && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-px"
                            style={{
                              background:
                                "linear-gradient(to right, transparent, rgba(255,215,0,0.08), transparent)",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* end marker */}
              <div className="relative mt-5 ml-[5px] flex items-center gap-3">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-yellow-400/40"
                  style={{ background: "rgba(255,215,0,0.1)" }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
                </div>
                <p
                  className="text-[11px] text-white/25"
                  style={{
                    letterSpacing: "0.3em",
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  SELESAI
                </p>
              </div>
            </div>
          )}

          {/* footer sparkles */}
          <div className="mt-12 flex justify-center gap-3">
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

          @keyframes fadein {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
          }

          .animate-fadein {
            animation: fadein 0.5s ease-out both;
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
      <div
        className="h-px w-20"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6))",
        }}
      />
      <span
        style={{
          color: "#ffd700",
          fontSize: 10,
          filter: "drop-shadow(0 0 4px rgba(255,215,0,0.8))",
        }}
      >
        ◆
      </span>
      <div
        className="h-px w-20"
        style={{
          background: "linear-gradient(to left, transparent, rgba(255,215,0,0.6))",
        }}
      />
    </div>
  );
}
