"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Lock, AlertCircle, Check } from "lucide-react";
import BottomNav from "@/components/BottonNav";

/* ============================================================ */
/* CONFIG                                                       */
/* ============================================================ */
const GALLERY_CODE =
  process.env.NEXT_PUBLIC_GALLERY_CODE ?? "wisuda32";

/* ============================================================ */
/* DATA AWAL                                                    */
/* ============================================================ */
const initialPhotos = [
  "/undangan-wisuda-32/rpl3-kelas.png",
  "/undangan-wisuda-32/rpl6-kelas.png",
  "/undangan-wisuda-32/kel1.JPG",
  "/undangan-wisuda-32/kel2.JPG",
];

/* ============================================================ */
/* MAIN PAGE                                                    */
/* ============================================================ */
export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* passcode modal state */
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ── VERIFY PASSCODE ── */
  const handleVerifyPasscode = () => {
    if (passcode === GALLERY_CODE) {
      setPasscodeSuccess(true);
      setPasscodeError(false);
      setTimeout(() => {
        setShowPasscodeModal(false);
        setPasscode("");
        setPasscodeSuccess(false);
        fileInputRef.current?.click();
      }, 700);
    } else {
      setPasscodeError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  /* ── ADD PHOTO ── */
  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  /* ── OPEN PASSCODE MODAL ── */
  const openPasscodeModal = () => {
    const sessionHash = typeof window !== "undefined" ? sessionStorage.getItem("invitation-hash") : null;
    const queryHash = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("kode") || new URLSearchParams(window.location.search).get("hash") : null;
    const hasCode = !!(queryHash || sessionHash);

    if (hasCode) {
      fileInputRef.current?.click();
    } else {
      setPasscode("");
      setPasscodeError(false);
      setPasscodeSuccess(false);
      setShowPasscodeModal(true);
    }
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#050f20] px-4 pb-32 text-white">
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
          className="absolute left-1/2 top-0 z-[1] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,0,0.07) 0%, rgba(20,80,200,0.08) 50%, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl pt-12">
          {/* HEADER */}
          <div className="mx-auto mb-12 flex max-w-[720px] flex-col items-center text-center">
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

            <div className="relative mt-6 inline-block">
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(34px,7vw,68px)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "0.06em",
                  color: "transparent",
                  backgroundImage:
                    "linear-gradient(160deg, #ffffff 10%, #e8d68a 45%, #ffd700 60%, #fff8e0 90%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 35px rgba(255,215,0,0.18))",
                }}
              >
                Our Memories
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
              className="mt-4 max-w-[420px] text-white/50"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(13px,2vw,15px)",
              }}
            >
              Kenangan terbaik bersama LUMINEX
            </p>

            <Divider />
          </div>

          {/* BUTTONS */}
          <div className="mx-auto mb-14 mt-2 flex w-full max-w-sm flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              id="btn-tambah-foto"
              onClick={openPasscodeModal}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold text-[#050f20] transition-all active:scale-95 sm:w-auto"
              style={{
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #ffd700 0%, #f0c000 100%)",
                boxShadow:
                  "0 0 0 1px rgba(255,215,0,0.3), 0 8px 20px rgba(255,215,0,0.2)",
                minHeight: 52,
                fontSize: 15,
              }}
            >
              <ImagePlus size={18} />
              Tambah Foto
            </button>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAddPhoto}
            className="hidden"
          />

          {/* GALLERY GRID */}
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(img)}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] p-[1px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.20), rgba(255,255,255,0.08), rgba(255,215,0,0.10))",
                }}
              >
                <div
                  className="relative overflow-hidden rounded-[24px]"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 60%, rgba(13,52,112,0.12) 100%)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    loading={i < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/25" />
                  <div
                    className="absolute left-4 right-4 top-0 h-px"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="mt-20 text-center text-white/45">
              Belum ada foto
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-14 flex justify-center gap-5">
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

        {/* ============================================================
            PASSCODE MODAL
        ============================================================ */}
        {showPasscodeModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowPasscodeModal(false)}
          >
            <div
              className="relative w-full max-w-sm rounded-t-[32px] p-7 sm:rounded-[32px]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(13,40,96,0.98) 0%, rgba(5,15,32,0.99) 100%)",
                border: "1px solid rgba(255,215,0,0.12)",
                boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* top handle */}
              <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/15 sm:hidden" />

              {/* close */}
              <button
                className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white/50"
                onClick={() => setShowPasscodeModal(false)}
              >
                <X size={18} />
              </button>

              {/* lock icon */}
              <div className="mb-5 flex justify-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: passcodeSuccess
                      ? "rgba(255,215,0,0.12)"
                      : "rgba(255,215,0,0.08)",
                    border: `1px solid rgba(255,215,0,${passcodeSuccess ? 0.4 : 0.2})`,
                  }}
                >
                  {passcodeSuccess ? (
                    <Check size={28} className="text-yellow-300" />
                  ) : (
                    <Lock size={26} className="text-yellow-300/70" />
                  )}
                </div>
              </div>

              <h2
                className="text-center text-white"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {passcodeSuccess ? "Kode Benar!" : "Masukkan Kode"}
              </h2>

              <p
                className="mt-2 text-center text-white/45"
                style={{ fontSize: 14, lineHeight: 1.7 }}
              >
                {passcodeSuccess
                  ? "Membuka galeri unggahan..."
                  : "Masukkan kode akses untuk menambah foto"}
              </p>

              {!passcodeSuccess && (
                <>
                  {/* input */}
                  <div
                    className={`mt-6 overflow-hidden rounded-2xl transition-all ${shake ? "shake" : ""}`}
                    style={{
                      border: passcodeError
                        ? "1px solid rgba(255,100,100,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <input
                      id="gallery-passcode-input"
                      type="text"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setPasscodeError(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerifyPasscode();
                      }}
                      placeholder="Masukkan kode akses..."
                      autoComplete="off"
                      autoFocus
                      className="w-full bg-transparent px-5 py-4 text-center text-white outline-none placeholder:text-white/30"
                      style={{ fontSize: 18, letterSpacing: "0.2em" }}
                    />
                  </div>

                  {/* error */}
                  {passcodeError && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <AlertCircle size={14} className="text-red-400" />
                      <p className="text-sm text-red-400" style={{ fontSize: 14 }}>
                        Kode salah. Coba lagi.
                      </p>
                    </div>
                  )}

                  {/* submit */}
                  <button
                    id="btn-submit-passcode"
                    onClick={handleVerifyPasscode}
                    className="mt-5 w-full rounded-2xl py-4 font-bold text-[#050f20] transition-all active:scale-95"
                    style={{
                      background: "linear-gradient(135deg,#ffd700,#f0c000)",
                      fontSize: 16,
                      minHeight: 54,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Verifikasi
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* IMAGE LIGHTBOX */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 p-2 text-white backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            >
              <X size={22} />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] max-w-full rounded-[28px] border border-white/10 shadow-2xl"
            />
          </div>
        )}

        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;600&display=swap");

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }

          .shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </main>

      <BottomNav />
    </>
  );
}

function Divider() {
  return (
    <div className="my-7 flex w-full items-center justify-center gap-3">
      <div
        className="h-px w-20"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,215,0,0.7))",
        }}
      />
      <span className="text-xs text-yellow-400">◆</span>
      <div
        className="h-px w-20"
        style={{
          background: "linear-gradient(to left, transparent, rgba(255,215,0,0.7))",
        }}
      />
    </div>
  );
}