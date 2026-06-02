"use client";

import Image from "next/image";
import { Check, Sparkles } from "lucide-react";

export default function ThanksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050f20] text-white">

      {/* ===== BACKGROUND ===== */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #0d3470 0%, #071840 45%, #050f20 100%)",
        }}
      />
      

      {/* ===== TOP GOLD LINE ===== */}
      <div
        className="absolute left-0 right-0 top-0 z-[3] h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,215,0,0.7), transparent)",
        }}
      />

      {/* ===== AMBIENT GLOW ===== */}
      <div
        className="absolute left-1/2 top-0 z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,0,0.07) 0%, rgba(20,80,200,0.08) 50%, transparent 75%)",
        }}
      />

      {/* ===== FLOATING LIGHTS ===== */}
      <div className="absolute left-8 top-24 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_20px_gold]" />

      <div className="absolute right-10 top-40 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_20px_gold]" />

      <div className="absolute bottom-32 left-10 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_20px_gold]" />


      {/* ===== CONTENT ===== */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 py-12 text-center">

        {/* ===== TOP LABEL ===== */}
        <div
          className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 backdrop-blur-xl"
          style={{
            letterSpacing: "0.32em",
          }}
        >

          <span className="text-[9px] text-yellow-400">
            ✦
          </span>

          <span className="text-[9px] text-yellow-300/80">
            LUMINEX · ANGKATAN 32
          </span>

          <span className="text-[9px] text-yellow-400">
            ✦
          </span>

        </div>

        {/* ===== TITLE ===== */}
        <div className="relative mt-6 inline-block">

          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize:
                "clamp(56px, 11vw, 100px)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "0.08em",
              color: "transparent",
              backgroundImage:
                "linear-gradient(160deg, #ffffff 10%, #e8d68a 45%, #ffd700 60%, #fff8e0 90%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter:
                "drop-shadow(0 0 40px rgba(255,215,0,0.2))",
            }}
          >
            Thank
            <br />
            You
          </h1>

          <div
            className="absolute -bottom-1 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)",
            }}
          />

        </div>

        {/* ===== SUBTITLE ===== */}
        <p
          className="mt-5 max-w-md text-sm leading-7 text-white/45 md:text-base"
          style={{
            fontFamily:
              "'Cormorant Garamond', Georgia, serif",
            fontSize:
              "clamp(13px,2vw,15px)",
          }}
        >
          Terima kasih atas kehadiran,
          doa, dan dukungannya dalam
          perjalanan kami.
        </p>

        <Divider />

        {/* ===== MAIN CARD ===== */}
        <div
          className="relative w-full max-w-5xl overflow-hidden rounded-[32px] p-[1px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,255,255,0.08), rgba(255,215,0,0.12))",
          }}
        >

          <div
            className="relative overflow-hidden rounded-[32px]"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 60%, rgba(13,52,112,0.15) 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.07), 0 25px 50px rgba(0,0,0,0.35)",
              backdropFilter: "blur(20px)",
            }}
          >

            {/* SHIMMER */}
            <div
              className="absolute left-5 right-5 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)",
              }}
            />

            {/* CARD GLOW */}
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />

            <div className="grid lg:grid-cols-2">

              {/* ===== FOTO ===== */}
              <div className="relative min-h-[420px] overflow-hidden">

                <img
                  src="/undangan-wisuda-32/angkatan.png"
                  alt="Foto Angkatan"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050f20]/95 via-[#050f20]/25 to-transparent" />



                {/* BOTTOM TAG */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white/10 px-5 py-2 backdrop-blur-md">

                  <p className="text-sm text-white/90">
                    LUMINEX 2026
                  </p>

                </div>

              </div>

              {/* ===== RIGHT SIDE ===== */}
              <div className="flex flex-col justify-center px-6 py-10 text-center lg:px-10 lg:text-left">

                {/* ICON */}
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full lg:mx-0"
                  style={{
                    background:
                      "rgba(255,215,0,0.08)",
                    border:
                      "1px solid rgba(255,215,0,0.2)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,215,0,0.1)",
                  }}
                >

                  <Check
                    size={30}
                    className="text-yellow-300"
                  />

                </div>

                {/* TITLE */}
                <h2
                  className="mt-8 text-white"
                  style={{
                    fontFamily:
                      "'Cinzel', serif",
                    fontSize:
                      "clamp(38px, 8vw, 64px)",
                    lineHeight: 1,
                    letterSpacing: "0.06em",
                  }}
                >
                  Graduation
                  <br />
                  Ceremony
                </h2>

                {/* TEXT */}
                <p
                  className="mt-6 text-sm leading-8 text-white/45 md:text-base"
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  Wisuda Angkatan XXXII
                  <br />
                  LUMINEX 2026
                  <br />
                  SMK Telkom Malang
                </p>

                {/* QUOTE */}
                <div
                  className="mt-8 rounded-[24px] p-5"
                  style={{
                    background:
                      "rgba(255,255,255,0.05)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >

                  <p className="text-sm italic leading-7 text-white/60">
                    “Every ending is the beginning
                    of a new journey.”
                  </p>

                </div>

                {/* TEXT */}
                <div className="mt-10 text-center">

                  <p
                    className="text-yellow-300"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(18px,4vw,24px)",
                      letterSpacing: "0.15em",
                      textShadow:
                        "0 0 18px rgba(255,215,0,0.25)",
                    }}
                  >
                    Sampai Jumpa
                  </p>

                  <p
                    className="mt-3 text-sm text-white/45"
                    style={{
                      letterSpacing: "0.3em",
                      fontFamily: "'Cinzel', serif",
                    }}
                  >
                    ANGKATAN 32
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===== ORNAMENT ===== */}
        <div className="mt-12 flex flex-wrap justify-center gap-5">

          {["✦", "✧", "⋆", "✧", "✦"].map(
            (s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 16,
                  textShadow:
                    "0 0 10px rgba(255,215,0,0.8)",
                  animation: `float 2.5s ease-in-out ${i * 0.2
                    }s infinite`,
                  color:
                    i % 2 === 1
                      ? "#ffffff"
                      : "#ffd700",
                }}
              >
                {s}
              </span>
            )
          )}

        </div>

        {/* ===== FOOTER ===== */}
        <p className="mt-10 text-xs tracking-[0.35em] text-yellow-300/60">
          LUMINEX · SEE YOU SOON
        </p>

      </div>

      {/* ===== STYLE ===== */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;600&display=swap");

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

    </main>
  );

  function Divider() {
    return (
      <div className="my-8 flex items-center gap-3">

        <div
          className="h-px w-16"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,215,0,0.7))",
          }}
        />

        <span className="text-yellow-300">
          ◆
        </span>

        <div
          className="h-px w-16"
          style={{
            background:
              "linear-gradient(to left, transparent, rgba(255,215,0,0.7))",
          }}
        />

      </div>
    );
  }
}