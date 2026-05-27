"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Lock, MessageCircle, RefreshCw } from "lucide-react";

// Nomor WA admin — ganti sesuai kebutuhan
const ADMIN_WA = "6281234567890"; // ← GANTI dengan nomor admin
const ADMIN_WA_MESSAGE = encodeURIComponent(
  "Halo Admin, saya ingin mendapatkan link undangan wisuda Angkatan 32 SMK Telkom Malang. Mohon bantuannya 🙏"
);

// Path yang boleh diakses tanpa hash
const EXEMPT_PATHS = ["/", "/Undangan"];

// Apakah path ini adalah hash page (e.g. /Undangan/abc123)
function isHashPage(pathname: string) {
  return /^\/Undangan\/[^/]+$/.test(pathname) &&
    ![
      "/Undangan/opening",
      "/Undangan/acara",
      "/Undangan/rundown",
      "/Undangan/note",
      "/Undangan/rsvp",
      "/Undangan/gallery",
      "/Undangan/komentar",
      "/Undangan/thanks",
      "/Undangan/maps",
    ].includes(pathname);
}

function AccessDeniedPage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-white"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0d2a60 0%, #071840 40%, #050f20 100%)" }}
    >
      {/* Background glows */}
      <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ffd700, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #4080ff, transparent 70%)" }} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[32px] p-8 text-center"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,215,0,0.15)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.5), transparent)" }} />

        {/* Lock icon */}
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))",
            border: "1px solid rgba(255,215,0,0.25)",
            boxShadow: "0 0 40px rgba(255,215,0,0.1)",
          }}
        >
          <Lock size={32} style={{ color: "#ffd700" }} />
        </div>

        {/* Badge */}
        <div
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          <span style={{ fontSize: 9, color: "#ffd700" }}>✦</span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 9,
              letterSpacing: "0.35em",
              color: "rgba(255,215,0,0.8)",
            }}
          >
            AKSES TERBATAS
          </span>
          <span style={{ fontSize: 9, color: "#ffd700" }}>✦</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(22px, 5vw, 28px)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            color: "#f5e9c0",
            lineHeight: 1.2,
          }}
        >
          Undangan
          <br />
          <span style={{ color: "#ffd700" }}>Wisuda 2026</span>
        </h1>

        {/* Divider */}
        <div className="mx-auto my-5 h-px w-32"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)" }} />

        {/* Description */}
        <p
          className="leading-7 text-white/50"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            fontStyle: "italic",
          }}
        >
          Halaman ini hanya dapat diakses melalui{" "}
          <span style={{ color: "rgba(255,215,0,0.7)" }}>link undangan pribadi</span>{" "}
          yang dikirimkan kepada Anda.
        </p>

        {/* WA Button */}
        <a
          href={`https://wa.me/${ADMIN_WA}?text=${ADMIN_WA_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold transition-all active:scale-[0.97]"
          style={{
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.1em",
            fontSize: 13,
            minHeight: 52,
            background: "linear-gradient(135deg, #25d366 0%, #128c4e 100%)",
            boxShadow: "0 0 0 1px rgba(37,211,102,0.3), 0 8px 24px rgba(37,211,102,0.2)",
            color: "#fff",
          }}
        >
          <MessageCircle size={18} />
          HUBUNGI ADMIN
        </a>

        {/* Reload hint */}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 flex w-full items-center justify-center gap-2 text-white/25 transition-all hover:text-white/40"
          style={{ fontSize: 12, minHeight: 36 }}
        >
          <RefreshCw size={12} />
          Sudah punya link? Buka link undangan Anda
        </button>
      </div>

      {/* Footer sparkles */}
      <div className="mt-10 flex gap-3">
        {["✦", "✧", "⋆", "✧", "✦"].map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 14,
              color: i % 2 === 0 ? "#ffd700" : "#ffffff",
              textShadow: "0 0 10px rgba(255,215,0,0.7)",
              opacity: 0.4,
              animation: `float 2.5s ease-in-out ${i * 0.2}s infinite`,
              display: "inline-block",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap");
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </main>
  );
}

export default function UndanganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    // Hash page sendiri selalu boleh diakses (dia yang menyimpan hash)
    if (isHashPage(pathname)) {
      setHasAccess(true);
      return;
    }

    // Exempt paths
    if (EXEMPT_PATHS.includes(pathname)) {
      setHasAccess(true);
      return;
    }

    // Cek sessionStorage
    const hash = sessionStorage.getItem("invitation-hash");
    setHasAccess(!!hash);
  }, [pathname]);

  // Loading state — hindari flash
  if (hasAccess === null) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#050f20" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#ffd700" }}
        />
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessDeniedPage />;
  }

  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
}