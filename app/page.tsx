"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#071f3d] text-white">

      {/* ===== BACKGROUND ===== */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, #1450a8 0%, #0c3c78 45%, #071f3d 100%)",
        }}
      />

      {/* ===== GLOW ===== */}
      <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-60 w-60 rounded-full bg-yellow-300/10 blur-3xl" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-5 py-10 sm:px-6 md:px-8 lg:px-10">

        {/* ===== TOP LOGO ===== */}
        <div className="mb-8 flex flex-col items-center">

{/* FRAME LOGO */}
<div className="absolute left-1/2 top-0 z-30 -translate-x-1/2">

  <div
    className="rounded-[14px] px-2 py-1.5"
    style={{
      background: "#ffffff",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)",
    }}
  >
    <Image
      src="/logo1.png"
      alt="Logo"
      width={380}
      height={80}
      priority
      className="
        h-auto
        w-[120px]
        object-contain
        sm:w-[150px]
        md:w-[190px]
      "
    />
  </div>

</div>

          {/* LABEL */}
          <div className="mt-3 rounded-[14px] border border-yellow-300/20 bg-yellow-300/10 px-4 py-[7px] backdrop-blur-md">

            <p className="text-center text-[8px] tracking-[0.25em] text-yellow-300/80 sm:text-[9px] md:text-[10px] md:tracking-[0.4em]">
              ✦ CELEBRATION OF MEMORIES ✦
            </p>

          </div>

        </div>

        {/* ===== HERO ===== */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ===== FOTO ===== */}
          <div className="flex justify-center">

            <div className="relative w-full max-w-[430px] overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-2 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl">

              <div className="relative overflow-hidden rounded-[20px]">

                <Image
                  src="/angkatan.png"
                  alt="Angkatan"
                  width={900}
                  height={1200}
                  priority
                  className="
                    h-[300px]
                    w-full
                    object-cover
                    sm:h-[380px]
                    md:h-[500px]
                  "
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071f3d]/85 via-transparent to-transparent" />

              </div>

            </div>

          </div>

          {/* ===== RIGHT SIDE ===== */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* TITLE */}
            <h1
              className="text-white"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(52px, 12vw, 92px)",
                fontWeight: 900,
                lineHeight: 1,
                textShadow: "0 0 20px rgba(255,255,255,0.08)",
              }}
            >
              Wisuda
            </h1>

            {/* SUBTITLE */}
            <h2 className="mt-3 text-[16px] font-semibold tracking-[0.08em] text-white sm:text-[20px] md:text-[30px]">
              SMK TELKOM MALANG
            </h2>

            {/* ANGKATAN */}
            <div className="mt-5 rounded-[16px] border border-yellow-300/20 bg-yellow-300/10 px-5 py-2 backdrop-blur-md">

              <p className="text-[10px] tracking-[0.24em] text-yellow-300/90 sm:text-[11px] md:text-sm">
                ANGKATAN XXXII
              </p>

            </div>

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-3">

              <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-300/70" />

              <span className="text-sm text-yellow-300">
                ◆
              </span>

              <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-300/70" />

            </div>

            {/* TEXT */}
            <p className="max-w-[520px] text-sm leading-8 text-white/75 sm:text-[15px] md:text-[17px] md:leading-9">
              Dengan hormat, kami mengundang
              Bapak dan Ibu sekalian untuk menghadiri
              acara wisuda sebagai bentuk perayaan
              atas pencapaian generasi terbaik
              kami.
            </p>

            {/* BUTTON */}
            <Link
              href="/Undangan/opening"
              className="
                mt-8
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-[18px]
                bg-yellow-300
                px-7
                py-4
                text-sm
                font-bold
                text-[#071f3d]
                shadow-[0_0_30px_rgba(255,215,0,0.2)]
                transition-all
                duration-300
                hover:scale-[1.03]
                active:scale-95
                sm:text-[15px]
              "
            >

              <Sparkles size={18} />

              Buka Undangan

            </Link>

            {/* ORNAMENT */}
            <div className="mt-8 flex gap-4">

              {["✦", "✧", "⋆", "✧", "✦"].map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 16,
                    textShadow:
                      "0 0 12px rgba(255,215,0,0.8)",
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
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* ===== STYLE ===== */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap");

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

    </main>
  );
}