"use client";

import { useEffect, useState } from "react";
import { MapPin, Shirt, Sparkles, Share2 } from "lucide-react";
import BottomNav from "@/components/BottonNav";

export default function AcaraPage() {
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date("2026-06-11T08:00:00").getTime();

    const tick = () => {
      const distance = targetDate - Date.now();
      if (distance < 0) {
        setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
        return;
      }
      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance / (1000 * 60 * 60)) % 24),
        menit: Math.floor((distance / (1000 * 60)) % 60),
        detik: Math.floor((distance / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownItems = [
    { label: "Hari", value: timeLeft.hari },
    { label: "Jam", value: timeLeft.jam },
    { label: "Menit", value: timeLeft.menit },
    { label: "Detik", value: timeLeft.detik },
  ];

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#050f20] pb-36 text-white">

        {/* ===== BACKGROUND ===== */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, #0d3470 0%, #071840 45%, #050f20 100%)",
          }}
        />

        {/* ===== TOP GOLD LINE ===== */}
        <div
          className="absolute top-0 left-0 right-0 z-[3] h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.7), transparent)" }}
        />

        {/* ===== AMBIENT GLOW ===== */}
        <div
          className="absolute left-1/2 top-0 z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.07) 0%, rgba(20,80,200,0.08) 50%, transparent 75%)" }}
        />

        {/* ===== CONTENT ===== */}
        <div className="relative z-10 mx-auto max-w-md px-4 pt-12">

          {/* ===== HEADER ===== */}
          <div className="text-center">

            <div
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 backdrop-blur-xl"
              style={{ letterSpacing: "0.32em" }}
            >
              <span className="text-yellow-400 text-[9px]">✦</span>
              <span className="text-[9px] text-yellow-300/80">LUMINEX · ANGKATAN 32</span>
              <span className="text-yellow-400 text-[9px]">✦</span>
            </div>

            <div className="relative mt-6 inline-block">
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(42px, 10vw, 72px)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "0.1em",
                  color: "transparent",
                  backgroundImage: "linear-gradient(160deg, #ffffff 10%, #e8d68a 45%, #ffd700 60%, #fff8e0 90%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(255,215,0,0.2))",
                }}
              >
                Info<br />Acara
              </h1>
              <div
                className="absolute -bottom-1 left-0 right-0 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)" }}
              />
            </div>



            {/* ===== DATE HIGHLIGHT CARD ===== */}
            <div
              className="animate-fadein mt-8 overflow-hidden rounded-[26px] px-6 py-5"
              style={{
                animationDelay: "0.24s",
                background: "linear-gradient(160deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.02) 100%)",
                border: "1px solid rgba(255,215,0,0.18)",
                boxShadow: "inset 0 1px 0 rgba(255,215,0,0.1)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className="text-[10px] text-yellow-400/55"
                    style={{ letterSpacing: "0.4em", fontFamily: "'Cinzel', serif" }}
                  >
                    TANGGAL
                  </p>
                  <p
                    className="mt-1 text-white"
                    style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(14px,3vw,18px)", letterSpacing: "0.06em" }}
                  >
                    Kamis, 11 Juni 2026
                  </p>
                </div>
                <div
                  className="h-10 w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(255,215,0,0.3), transparent)" }}
                />
                <div>
                  <p
                    className="text-[10px] text-yellow-400/55"
                    style={{ letterSpacing: "0.4em", fontFamily: "'Cinzel', serif" }}
                  >
                    WAKTU
                  </p>
                  <p
                    className="mt-1 text-white"
                    style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(14px,3vw,18px)", letterSpacing: "0.06em" }}
                  >
                    08.00 WIB
                  </p>
                </div>
                <div
                  className="h-10 w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(255,215,0,0.3), transparent)" }}
                />
                <div>
                  <p
                    className="text-[10px] text-yellow-400/55"
                    style={{ letterSpacing: "0.4em", fontFamily: "'Cinzel', serif" }}
                  >
                    ACARA
                  </p>
                  <p
                    className="mt-1 text-yellow-300"
                    style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(12px,2.5vw,15px)", letterSpacing: "0.04em" }}
                  >
                    Wisuda
                  </p>
                </div>
              </div>
            </div>

            <GoldDivider />
          </div>



          {/* ===== COUNTDOWN ===== */}
          <div className="animate-fadein">
            <p
              className="mb-5 text-center text-[10px] text-yellow-300/60"
              style={{ letterSpacing: "0.45em", fontFamily: "'Cinzel', serif" }}
            >
              MENUJU HARI H
            </p>

            <div
              className="overflow-hidden rounded-[26px] p-1"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.04) 50%, rgba(255,215,0,0.08) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,215,0,0.15), 0 20px 40px rgba(0,0,0,0.35)",
              }}
            >
              <div
                className="rounded-[22px] px-4 py-5"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(13,52,112,0.2) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="grid grid-cols-4 gap-2">
                  {countdownItems.map((item, i) => (
                    <div key={i} className="text-center">
                      {/* number block */}
                      <div
                        className="relative mx-auto flex items-center justify-center rounded-2xl py-4"
                        style={{
                          background: "rgba(255,215,0,0.07)",
                          border: "1px solid rgba(255,215,0,0.18)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                        }}
                      >
                        {/* top shimmer */}
                        <div
                          className="absolute top-0 left-2 right-2 h-px"
                          style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)" }}
                        />
                        <span
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(24px,6vw,32px)",
                            fontWeight: 900,
                            color: "transparent",
                            backgroundImage: "linear-gradient(160deg, #fff8e0 20%, #ffd700 60%, #f0c000 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            lineHeight: 1,
                          }}
                        >
                          {mounted ? String(item.value).padStart(2, "0") : "00"}
                        </span>
                      </div>
                      <p
                        className="mt-2.5 text-white/40"
                        style={{ fontSize: 10, letterSpacing: "0.25em", fontFamily: "'Cinzel', serif" }}
                      >
                        {item.label.toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* separator dots */}
                <div className="mt-4 flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full"
                      style={{
                        width: i === 1 ? 20 : 6,
                        background: i === 1 ? "rgba(255,215,0,0.5)" : "rgba(255,215,0,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== INFO CARDS ===== */}
          <div className="mt-8 flex flex-col gap-5">

            {/* ===== DRESSCODE ===== */}
            <div
              className="animate-fadein overflow-hidden rounded-[26px] p-6"
              style={{
                animationDelay: "0.18s",
                background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 60%, rgba(13,52,112,0.15) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 25px 50px rgba(0,0,0,0.35)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                className="absolute top-0 left-5 right-5 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)" }}
              />

              <div className="flex items-start gap-5">
                <div
                  className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(255,215,0,0.08)",
                    border: "1px solid rgba(255,215,0,0.2)",
                    boxShadow: "inset 0 1px 0 rgba(255,215,0,0.1)",
                  }}
                >
                  <Shirt size={24} className="text-yellow-300" />
                </div>

                <div className="flex-1">
                  <p
                    className="text-[10px] text-yellow-400/60"
                    style={{ letterSpacing: "0.4em", fontFamily: "'Cinzel', serif" }}
                  >
                    DRESSCODE
                  </p>

                  <h2
                    className="mt-2 text-white"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(20px,5vw,28px)",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      lineHeight: 1.2,
                    }}
                  >
                    Bebas Rapi
                  </h2>

                  <p
                    className="mt-3 leading-7 text-white/45"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(13px,2.2vw,15px)",
                      fontStyle: "italic",
                    }}
                  >
                    Harap berpakaian sopan, rapi, dan nyaman selama acara berlangsung.
                  </p>

                  {/* color swatches hint */}
                  <div className="mt-4 flex items-center gap-2">
                    {["#1a2c5e", "#2d4a8a", "#4a6fa5", "#c8a84b", "#e8d5a3"].map((color, i) => (
                      <div
                        key={i}
                        className="h-5 w-5 rounded-full border border-white/10"
                        style={{
                          background: color,
                          boxShadow: `0 0 6px ${color}40`,
                        }}
                      />
                    ))}
                    <span
                      className="ml-1 text-[11px] text-white/25"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                    >
                      inspirasi warna
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ===== MAPS SECTION ===== */}
          <div className="mt-8">

            {/* Section header */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.3))" }} />
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-yellow-400/60" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40" style={{ fontFamily: "'Cinzel', serif" }}>
                  Lokasi Venue
                </p>
              </div>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(255,215,0,0.3))" }} />
            </div>

            {/* Venue name badge */}
            <div className="mb-4 flex flex-col items-center gap-1 text-center">
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(22px,5vw,28px)",
                  fontWeight: 900,
                  color: "#f5e9c0",
                  letterSpacing: "0.06em",
                  lineHeight: 1.2,
                }}
              >
                Graha Cakrawala
              </p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#ffd700", letterSpacing: "0.25em", opacity: 0.8 }}>
                UNIVERSITAS NEGERI MALANG
              </p>
            </div>

            {/* MAP CARD */}
            <div
              className="animate-fadein overflow-hidden rounded-[26px]"
              style={{
                border: "1px solid rgba(255,215,0,0.15)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 30px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* map iframe */}
              <div className="relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Graha+Cakrawala+Universitas+Negeri+Malang&output=embed"
                  className="w-full"
                  style={{ height: 300, display: "block", border: "none" }}
                  loading="lazy"
                  title="Lokasi Graha Cakrawala UM"
                />
                {/* gradient fade bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(5,15,32,0.95), transparent)" }}
                />
                {/* gradient fade top */}
                <div
                  className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, rgba(5,15,32,0.4), transparent)" }}
                />
              </div>

              {/* address card */}
              <div
                className="px-6 pt-5 pb-6"
                style={{
                  background: "linear-gradient(180deg, rgba(7,24,64,0.95) 0%, rgba(5,15,32,0.98) 100%)",
                }}
              >
                {/* address row */}
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl"
                    style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}
                  >
                    <MapPin size={14} className="text-yellow-300/80" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }} className="text-white/90">
                      Jl. Semarang No.5
                    </p>
                    <p
                      className="mt-0.5 leading-6 text-white/40"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic" }}
                    >
                      Sumbersari, Lowokwaru, Kota Malang,<br />Jawa Timur 65145
                    </p>
                  </div>
                </div>

                {/* divider */}
                <div className="my-4 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.12), transparent)" }} />

                {/* action buttons */}
                <div className="flex gap-3">
                  <a
                    href="https://maps.app.goo.gl/rcJPhbsJDxRMGWS7A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-[#050f20] transition-all active:scale-[0.97]"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.08em",
                      fontSize: 11,
                      background: "linear-gradient(135deg, #ffd700 0%, #f0c000 100%)",
                      boxShadow: "0 0 0 1px rgba(255,215,0,0.3), 0 8px 20px rgba(255,215,0,0.2)",
                      minHeight: 48,
                    }}
                  >
                    <MapPin size={13} />
                    PETUNJUK ARAH
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent("Lokasi Wisuda Angkatan 32 SMK Telkom Malang:\nGraha Cakrawala UM\nhttps://maps.app.goo.gl/rcJPhbsJDxRMGWS7A")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.97]"
                    style={{
                      fontSize: 11,
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.06em",
                      color: "rgba(255,215,0,0.8)",
                      background: "rgba(255,215,0,0.06)",
                      border: "1px solid rgba(255,215,0,0.2)",
                      minHeight: 48,
                    }}
                  >
                    <Share2 size={14} />
                    BAGIKAN
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* ===== FOOTER SPARKLES ===== */}
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

        {/* ===== STYLES ===== */}
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

          .animate-fadein {
            animation: fadein 0.5s ease-out both;
          }
        `}</style>
      </main>

      <BottomNav />
    </>
  );
}

/* ===== GOLD DIVIDER ===== */
function GoldDivider() {
  return (
    <div className="my-7 flex items-center justify-center gap-3">
      <div
        className="h-px w-20"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6))" }}
      />
      <span style={{ color: "#ffd700", fontSize: 10, filter: "drop-shadow(0 0 4px rgba(255,215,0,0.8))" }}>
        ◆
      </span>
      <div
        className="h-px w-20"
        style={{ background: "linear-gradient(to left, transparent, rgba(255,215,0,0.6))" }}
      />
    </div>
  );
}