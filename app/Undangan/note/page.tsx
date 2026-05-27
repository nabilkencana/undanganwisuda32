"use client";

import { Ban, Users, MapPinned } from "lucide-react";
import BottomNav from "@/components/BottonNav";

/* ============================================================ */
/* DATA                                                         */
/* ============================================================ */
const mandatoryRules = [
  {
    icon: Users,
    title: "Undangan berlaku 2 orang",
    desc: "Bapak-Ibu / Saudara",
    color: "#ffd700",
    bg: "rgba(255,215,0,0.08)",
    border: "rgba(255,215,0,0.25)",
    iconBg: "rgba(255,215,0,0.12)",
  },
  {
    icon: Ban,
    title: "Dilarang membawa bouquet",
    desc: "Karangan bunga tidak diperkenankan masuk ke dalam venue",
    color: "#ff8080",
    bg: "rgba(255,80,80,0.07)",
    border: "rgba(255,80,80,0.22)",
    iconBg: "rgba(255,80,80,0.12)",
  },
];

const generalNotes = [
  "Menggunakan pakaian formal dan rapi",
  "Hadir 30 menit sebelum acara dimulai",
  "Konfirmasi kehadiran dengan scan barcode pada undangan",
  "Undangan harap dibawa saat acara",
  "Mohon menjaga ketertiban selama acara berlangsung",
  "Dilarang membawa makanan dan minuman dari luar",
  "Dilarang menggunakan flash saat dokumentasi",
  "Jaga barang bawaan pribadi",
  "Matikan atau silent mode perangkat saat acara berlangsung",
];

/* ============================================================ */
/* MAIN PAGE                                                    */
/* ============================================================ */
export default function NotePage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#050f20] pb-28 text-white">
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
          className="absolute left-1/2 top-32 z-[1] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,0,0.08) 0%, rgba(20,80,200,0.08) 50%, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 pt-12 text-center">
          {/* BADGE */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 backdrop-blur-xl"
            style={{ letterSpacing: "0.32em" }}
          >
            <span className="text-[9px] text-yellow-400">✦</span>
            <span className="text-[9px] text-yellow-300/80">
              LUMINEX · ANGKATAN 32
            </span>
            <span className="text-[9px] text-yellow-400">✦</span>
          </div>

          {/* TITLE */}
          <div className="relative mt-6 inline-block">
            <h1
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(42px, 10vw, 72px)",
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
              Note
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
            className="mt-5 max-w-[320px] text-white/45"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(14px,2vw,16px)",
            }}
          >
            Informasi penting untuk seluruh tamu undangan wisuda SMK Telkom
            Malang
          </p>

          <Divider />

          {/* ============================================================
              MANDATORY RULES — HIGH VISIBILITY
          ============================================================ */}
          <div className="w-full space-y-4">
            <p
              className="text-left text-[10px] tracking-[0.4em] text-yellow-300/60 uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Perhatian Khusus
            </p>

            {mandatoryRules.map((rule, i) => (
              <div
                key={i}
                className="animate-fadein w-full overflow-hidden rounded-[22px] p-5"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  background: rule.bg,
                  border: `2px solid ${rule.border}`,
                  boxShadow: `0 0 24px ${rule.bg}, inset 0 1px 0 ${rule.border}`,
                }}
              >
                <div className="flex items-start gap-4 text-left">
                  {/* icon */}
                  <div
                    className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-2xl flex-shrink-0"
                    style={{
                      background: rule.iconBg,
                      border: `1px solid ${rule.border}`,
                    }}
                  >
                    <rule.icon size={24} style={{ color: rule.color }} />
                  </div>

                  {/* text */}
                  <div>
                    <p
                      className="font-bold leading-snug"
                      style={{
                        color: rule.color,
                        fontSize: "clamp(16px, 4vw, 18px)",
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {rule.title}
                    </p>
                    <p
                      className="mt-1.5 leading-7"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontSize: "clamp(14px, 3.5vw, 16px)",
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontStyle: "italic",
                      }}
                    >
                      {rule.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* ============================================================
              GENERAL NOTES
          ============================================================ */}
          <div
            className="animate-fadein w-full overflow-hidden rounded-[26px] p-6"
            style={{
              animationDelay: "0.25s",
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 60%, rgba(13,52,112,0.15) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.07), 0 25px 50px rgba(0,0,0,0.35)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute left-5 right-5 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)",
              }}
            />

            <p
              className="mb-5 text-left text-[10px] tracking-[0.35em] text-yellow-300/70 uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Tata Tertib Umum
            </p>

            <ul className="space-y-4 text-left">
              {generalNotes.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 text-yellow-300"
                    style={{ fontSize: 14 }}
                  >
                    ✦
                  </span>
                  <span
                    className="leading-7 text-white/75"
                    style={{
                      fontSize: "clamp(14px, 3.5vw, 16px)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* THANK YOU */}
          <div className="mt-14 text-center">
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 5vw, 46px)",
                color: "#fff4d6",
                textShadow: "0 0 20px rgba(255,215,0,0.25)",
              }}
            >
              Thank You
            </p>
            <div
              className="mx-auto mt-3 h-px w-44"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)",
              }}
            />
            <p
              className="mt-4 leading-relaxed text-white/45"
              style={{ fontSize: "clamp(14px, 3.5vw, 16px)" }}
            >
              atas kehadiran dan kerja samanya
            </p>
          </div>

          {/* SPARKLES */}
          <div className="mt-10 flex gap-4">
            {["✦", "✧", "⋆", "✧", "✦"].map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 16,
                  textShadow: "0 0 10px rgba(255,215,0,0.8)",
                  animation: `float 2.5s ease-in-out ${i * 0.2}s infinite`,
                  color: i % 2 === 1 ? "#ffffff" : "#ffd700",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;600&family=Playfair+Display:wght@700;900&display=swap");

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes fadein {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
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

function Divider() {
  return (
    <div className="my-7 flex w-full max-w-[240px] items-center gap-3">
      <div
        className="h-px flex-1"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,215,0,0.7))",
        }}
      />
      <span className="text-xs text-yellow-400">◆</span>
      <div
        className="h-px flex-1"
        style={{
          background: "linear-gradient(to left, transparent, rgba(255,215,0,0.7))",
        }}
      />
    </div>
  );
}