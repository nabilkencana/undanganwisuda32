"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Download,
  Pencil,
  Sparkles,
  Send,
  ChevronDown,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import BottomNav from "@/components/BottonNav";

/* ============================================================ */
/* TYPES                                                        */
/* ============================================================ */
type GuestData = {
  name: string;
  status: string;
  openedAt: string | null;
};

type EventData = {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
};

type RsvpState = {
  attendance: boolean;
  pax: number;
  message: string;
};

type Step = "loading" | "error" | "intro" | "form" | "done";

/* ============================================================ */
/* HELPERS                                                      */
/* ============================================================ */
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchInvitation(hash: string) {
  const res = await fetch(`${API}/api/invitation/${hash}`);
  if (!res.ok) throw new Error("Undangan tidak ditemukan");
  return res.json();
}

async function submitRsvp(
  hash: string,
  attendance: boolean,
  pax: number,
  message: string
) {
  const res = await fetch(`${API}/api/invitation/${hash}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attendance, pax, message }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message ?? "Terjadi kesalahan. Silakan coba lagi."
    );
  }
  return data;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/* ============================================================ */
/* MAIN PAGE                                                    */
/* ============================================================ */
export default function HashRsvpPage() {
  const params = useParams();
  const hash = Array.isArray(params.hash) ? params.hash[0] : (params.hash ?? "");

  const [step, setStep] = useState<Step>("loading");
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  /* form state */
  const [hadir, setHadir] = useState<"" | "Hadir" | "Tidak Hadir">("");
  const [pax, setPax] = useState<1 | 2>(1);
  const [pesan, setPesan] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");
  const [focused, setFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [toast, setToast] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editCount, setEditCount] = useState(0); // max 3x update
  const MAX_EDIT = 2;

  /* ── LOAD ── */
  useEffect(() => {
    if (!hash) {
      setErrorMsg("Kode undangan tidak valid.");
      setStep("error");
      return;
    }

    // Store hash for other pages (rundown, etc.)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("invitation-hash", hash);
      // Load edit count for this hash
      const key = `rsvp-edit-count-${hash}`;
      const saved = parseInt(localStorage.getItem(key) || "0", 10);
      setEditCount(saved);
    }

    fetchInvitation(hash)
      .then((res) => {
        const d = res.data;
        setGuest(d.guest);
        setEvent(d.event);

        // If already submitted RSVP → go to done
        const alreadyRsvp =
          d.guest.status === "GOING" || d.guest.status === "NOT_GOING";
        if (alreadyRsvp) {
          setHadir(d.guest.status === "GOING" ? "Hadir" : "Tidak Hadir");
          setStep("done");
        } else {
          setStep("intro");
        }
      })
      .catch((e) => {
        setErrorMsg(e.message ?? "Undangan tidak ditemukan.");
        setStep("error");
      });
  }, [hash]);

  /* ── TOAST ── */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  /* ── SUBMIT ── */
  const handleSubmit = async () => {
    if (!hadir) {
      setSubmitError("Silakan pilih kehadiran Anda.");
      return;
    }
    // Cek limit edit
    if (isEditing && editCount >= MAX_EDIT) {
      setSubmitError("Batas maksimal perubahan (2x) telah tercapai.");
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const attendance = hadir === "Hadir";
      // API requires pax >= 1; send 1 when not attending as a placeholder
      await submitRsvp(hash, attendance, attendance ? pax : 1, pesan);

      // Refresh guest data
      const res = await fetchInvitation(hash);
      setGuest(res.data.guest);

      // Increment edit count jika ini update (bukan first submit)
      if (isEditing) {
        const newCount = editCount + 1;
        setEditCount(newCount);
        localStorage.setItem(`rsvp-edit-count-${hash}`, String(newCount));
      }

      // ── Save to localStorage so Komentar page can display it ──
      try {
        const commentEntry = {
          id: Date.now(),
          nama: guest?.name ?? "Tamu",
          pesan: pesan.trim() || (attendance ? "Turut hadir bersama" : "Tidak dapat hadir"),
          hadir,
          pax: attendance ? pax : 0,
          waktu: new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        };
        const existing: any[] = JSON.parse(localStorage.getItem("rsvp-data") || "[]");
        // Replace existing entry for same guest (re-submission case)
        const filtered = existing.filter((c: any) => c.nama !== commentEntry.nama);
        filtered.push(commentEntry);
        localStorage.setItem("rsvp-data", JSON.stringify(filtered));
      } catch {
        // localStorage might be unavailable (private mode), silently ignore
      }

      setIsEditing(false);
      setStep("done");
      showToast("Kehadiran berhasil disimpan!");
    } catch (e: any) {
      setSubmitError(e.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };



  /* ── DOWNLOAD QR ── */
  const downloadQR = async () => {
    const qrCanvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (!qrCanvas) return;

    const W = 750;
    const H = 1050;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = W;
    canvas.height = H;

    // ── Helper: rounded rect path ──
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // ── OUTER PAGE background: pure black ──
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, W, H);

    // ── CARD (dark charcoal rounded) ──
    const cX = 40, cY = 40, cW = W - 80, cH = H - 80, cR = 32;
    rr(cX, cY, cW, cH, cR);
    ctx.fillStyle = "#1e1e24";
    ctx.fill();

    // Card border: thin gold
    rr(cX, cY, cW, cH, cR);
    ctx.strokeStyle = "rgba(200,160,40,0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ── EVENT TITLE ──
    ctx.fillStyle = "#f5e9c0";
    ctx.textAlign = "center";
    ctx.font = "bold 52px serif";
    ctx.fillText("LUMINEX 2026", W / 2, cY + 110);

    // ── SCHOOL NAME ──
    ctx.fillStyle = "rgba(245,233,192,0.55)";
    ctx.font = "18px sans-serif";
    ctx.fillText("SMK TELKOM MALANG · ANGKATAN 32", W / 2, cY + 178);

    // ── DASHED DIVIDER (ticket perforation style) with notches ──
    const divY = cY + 220;
    // left notch
    ctx.beginPath();
    ctx.arc(cX, divY, 20, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = "#111111";
    ctx.fill();
    // right notch
    ctx.beginPath();
    ctx.arc(cX + cW, divY, 20, Math.PI / 2, -Math.PI / 2);
    ctx.fillStyle = "#111111";
    ctx.fill();
    // dashed line
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = "rgba(200,160,40,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cX + 24, divY);
    ctx.lineTo(cX + cW - 24, divY);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── TAMU KEHORMATAN label ──
    ctx.fillStyle = "rgba(200,160,40,0.65)";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("TAMU KEHORMATAN", W / 2, divY + 44);

    // ── GUEST NAME ──
    ctx.fillStyle = "#f5e9c0";
    ctx.font = "bold 36px serif";
    ctx.fillText(guest?.name ?? "Tamu", W / 2, divY + 90);

    // ── PAX ──
    ctx.fillStyle = "rgba(245,233,192,0.45)";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Maksimal ${pax} wali · Wisuda 11 Juni 2026`, W / 2, divY + 122);

    // ── QR FRAME: gold rounded rect ──
    const qrSize = 320;
    const qrX = (W - qrSize) / 2;
    const qrY = divY + 155;
    // gold glow
    ctx.shadowColor = "rgba(200,160,40,0.6)";
    ctx.shadowBlur = 24;
    rr(qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 22);
    ctx.fillStyle = "#c8a028";
    ctx.fill();
    ctx.shadowBlur = 0;
    // white inner
    rr(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    // QR code
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // ── BOTTOM INSTRUCTION ──
    const instrY = qrY + qrSize + 60;
    ctx.fillStyle = "rgba(245,233,192,0.5)";
    ctx.font = "17px sans-serif";
    ctx.fillText("Silakan tunjukkan QR Code ini kepada resepsionis", W / 2, instrY);
    ctx.fillText("saat memasuki area acara.", W / 2, instrY + 28);

    // ── BOTTOM GOLD LINE ──
    const grad = ctx.createLinearGradient(cX, 0, cX + cW, 0);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, "rgba(200,160,40,0.7)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(cX + 40, cY + cH - 2, cW - 80, 1.5);

    const dataUrl = canvas.toDataURL("image/png");

    // Unified download: convert dataUrl → Blob → object URL → click
    // Works on mobile (Chrome/Safari) without opening a new tab
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mimeString });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `eticket-${guest?.name ?? "tamu"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Cleanup blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  };

  /* ============================================================ */
  /* RENDER                                                       */
  /* ============================================================ */
  return (
    <>
      {/* TOAST */}
      {toast && (
        <div
          className="fixed top-6 left-1/2 z-[100] -translate-x-1/2"
          style={{
            animation: "toastSlide 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
            maxWidth: "calc(100vw - 40px)",
            width: 340,
          }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
            style={{
              background: "linear-gradient(135deg, rgba(20,40,90,0.97) 0%, rgba(10,25,60,0.98) 100%)",
              border: "1px solid rgba(255,215,0,0.25)",
              boxShadow: "0 0 0 1px rgba(255,215,0,0.08), 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(255,215,0,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Icon circle */}
            <div
              className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.08))",
                border: "1px solid rgba(34,197,94,0.35)",
                boxShadow: "0 0 12px rgba(34,197,94,0.2)",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-white/95"
                style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: "0.04em" }}
              >
                Berhasil Disimpan
              </p>
              <p
                className="mt-0.5 text-white/50"
                style={{ fontSize: 11, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}
              >
                Kehadiran Anda telah dikonfirmasi
              </p>
            </div>

            {/* Right glow dot */}
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }}
            />
          </div>

          {/* Progress bar */}
          <div
            className="mx-4 h-0.5 rounded-full"
            style={{
              background: "linear-gradient(to right, rgba(34,197,94,0.6), rgba(34,197,94,0.1))",
              animation: "toastProgress 3.5s linear forwards",
            }}
          />
        </div>
      )}

      <main
        className="relative min-h-screen overflow-hidden bg-[#050f20] pb-36 text-white"
        onClick={() => setOpenDropdown("")}
      >
        {/* background */}
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
          {/* ── HEADER ── */}
          <div className="text-center">
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

            {/* title */}
            <div className="relative mt-5 inline-block">
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(46px, 12vw, 80px)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "0.14em",
                  color: "transparent",
                  backgroundImage:
                    "linear-gradient(160deg, #ffffff 10%, #e8d68a 45%, #ffd700 60%, #fff8e0 90%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 32px rgba(255,215,0,0.2))",
                }}
              >
                RSVP
              </h1>
              <div
                className="absolute -bottom-1 left-0 right-0 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)" }}
              />
            </div>

            {/* personalised guest envelope */}
            {guest && (
              <div
                className="relative mt-5 overflow-hidden rounded-[22px] px-6 py-5"
                style={{
                  background: "linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(20,80,160,0.12) 100%)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  boxShadow: "inset 0 1px 0 rgba(255,215,0,0.12), 0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)" }} />

                {/* monogram */}
                <div className="mb-4 flex justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-black"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.08))",
                      border: "1px solid rgba(255,215,0,0.35)",
                      fontFamily: "'Cinzel', serif",
                      color: "#ffd700",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {guest.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                  </div>
                </div>

                <p className="text-[10px] tracking-[0.4em] text-yellow-300/55 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                  Kepada
                </p>
                <p
                  className="mt-1 text-white"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(13px,3.5vw,16px)",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    opacity: 0.7,
                  }}
                >
                  Orang Tua / Wali
                </p>
                <p
                  className="mt-0.5 text-yellow-300"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(18px, 5vw, 24px)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textShadow: "0 0 20px rgba(255,215,0,0.3)",
                  }}
                >
                  {guest.name}
                </p>
              </div>
            )}

            <p
              className="mt-4 leading-8 text-white/45"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(15px, 3.5vw, 17px)",
                fontStyle: "italic",
              }}
            >
              Mohon konfirmasi kehadiran Anda untuk acara wisuda LUMINEX Angkatan 32.<br />
              <span className="text-yellow-300/60">Maks. 2 wali per undangan.</span>
            </p>
          </div>

          <GoldDivider />

          {/* ── LOADING ── */}
          {step === "loading" && (
            <div className="mt-8 flex flex-col items-center gap-4 text-white/50">
              <Loader2 size={36} className="animate-spin text-yellow-300" />
              <p className="text-sm">Memuat undangan...</p>
            </div>
          )}

          {/* ── ERROR ── */}
          {step === "error" && (
            <div className="animate-fadein mt-8">
              <LuxCard>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <h2
                    className="text-white"
                    style={{ fontFamily: "'Cinzel', serif", fontSize: 18 }}
                  >
                    Undangan Tidak Ditemukan
                  </h2>
                  <p
                    className="leading-7 text-white/50"
                    style={{ fontSize: 15 }}
                  >
                    {errorMsg}
                  </p>
                  <p className="mt-2 text-xs text-white/30">
                    Pastikan Anda membuka link yang dikirimkan melalui WhatsApp.
                  </p>
                </div>
              </LuxCard>
            </div>
          )}

          {/* ── INTRO ── */}
          {step === "intro" && (
            <div className="animate-fadein mt-8">
              <LuxCard>
                <div className="mb-6 flex justify-center">
                  <Sparkles size={32} className="text-yellow-300" />
                </div>
                <h2
                  className="text-center text-white"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(18px, 5vw, 22px)",
                    fontWeight: 700,
                  }}
                >
                  Konfirmasi Kehadiran
                </h2>
                <p
                  className="mt-4 text-center leading-8 text-white/55"
                  style={{ fontSize: "clamp(14px, 3.5vw, 16px)" }}
                >
                  Silakan konfirmasi kehadiran Anda di acara wisuda LUMINEX
                  Angkatan 32.
                </p>
                <GoldDivider compact />
                <button
                  id="btn-konfirmasi"
                  onClick={() => setStep("form")}
                  className="w-full rounded-2xl py-4 text-base font-bold text-[#050f20] transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg,#ffd700,#f0c000)",
                    fontSize: 17,
                    letterSpacing: "0.04em",
                    minHeight: 56,
                  }}
                >
                  Konfirmasi Sekarang
                </button>
              </LuxCard>
            </div>
          )}

          {/* ── FORM ── */}
          {step === "form" && (
            <div className="animate-fadein mt-8">
              <LuxCard>
                <button
                  onClick={() =>
                    isEditing ? setStep("done") : setStep("intro")
                  }
                  className="mb-6 inline-flex items-center gap-2 text-sm text-white/40"
                  style={{ minHeight: 44, fontSize: 14 }}
                >
                  <ArrowLeft size={16} />
                  Kembali
                </button>

                <h2
                  className="mb-6 text-white"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(16px,4.5vw,20px)",
                    fontWeight: 700,
                  }}
                >
                  {isEditing ? "Ubah Konfirmasi" : "Isi Formulir"}
                </h2>

                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  {/* KEHADIRAN */}
                  <Dropdown
                    title="Pilih Kehadiran"
                    value={hadir}
                    open={openDropdown === "hadir"}
                    onOpen={() =>
                      setOpenDropdown(
                        openDropdown === "hadir" ? "" : "hadir"
                      )
                    }
                  >
                    {(["Hadir", "Tidak Hadir"] as const).map((item) => (
                      <DropdownItem
                        key={item}
                        onClick={() => {
                          setHadir(item);
                          setOpenDropdown("");
                        }}
                        active={hadir === item}
                      >
                        {item}
                      </DropdownItem>
                    ))}
                  </Dropdown>

                  {/* PAX — only if hadir */}
                  {hadir === "Hadir" && (
                    <Dropdown
                      title="Jumlah Wali yang Hadir"
                      value={pax ? `${pax} Wali` : ""}
                      open={openDropdown === "pax"}
                      onOpen={() =>
                        setOpenDropdown(
                          openDropdown === "pax" ? "" : "pax"
                        )
                      }
                    >
                      {([1, 2] as const).map((n) => (
                        <DropdownItem
                          key={n}
                          onClick={() => {
                            setPax(n);
                            setOpenDropdown("");
                          }}
                          active={pax === n}
                        >
                          <div className="flex items-center gap-3">
                            <Users size={15} className="text-yellow-300/60" />
                            {n} Wali
                            {n === 2 && (
                              <span className="ml-auto text-[11px] text-white/30">
                                (Bapak &amp; Ibu)
                              </span>
                            )}
                          </div>
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  )}

                  {/* PESAN */}
                  <div className="relative">
                    <textarea
                      placeholder=" "
                      value={pesan}
                      onChange={(e) => setPesan(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      rows={4}
                      className="w-full resize-none px-5 pt-7 pb-3 text-white outline-none"
                      style={{
                        borderRadius: 16,
                        border: focused
                          ? "1px solid rgba(255,215,0,0.45)"
                          : "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)",
                        fontSize: 15,
                        lineHeight: 1.7,
                      }}
                    />
                    <label
                      className="pointer-events-none absolute left-5 text-white/40 transition-all"
                      style={{
                        top: pesan || focused ? 8 : "50%",
                        transform:
                          pesan || focused
                            ? "translateY(0) scale(0.8)"
                            : "translateY(-50%) scale(1)",
                        transformOrigin: "left",
                        fontSize: 14,
                      }}
                    >
                      Pesan &amp; Doa (opsional)
                    </label>
                  </div>

                  {/* ERROR */}
                  {submitError && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3">
                      <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-300" style={{ fontSize: 14 }}>
                        {submitError}
                      </p>
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button
                    id="btn-kirim-kehadiran"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold transition-all active:scale-95 disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #f0c000 50%, #ffd700 100%)",
                      color: "#050f20",
                      fontSize: 17,
                      minHeight: 56,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {isSubmitting
                      ? "Menyimpan..."
                      : isEditing
                      ? "Simpan Perubahan"
                      : "Kirim Kehadiran"}
                  </button>
                </div>
              </LuxCard>
            </div>
          )}

          {/* ── DONE ── */}
          {step === "done" && (
            <div className="animate-fadein mt-8">
              <LuxCard>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10">
                    <Check size={34} className="text-yellow-300" />
                  </div>

                  <h2
                    className="text-white"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(18px,5vw,22px)",
                      fontWeight: 700,
                    }}
                  >
                    Terima Kasih
                  </h2>

                  <p
                    className="mt-3 leading-8 text-white/55"
                    style={{ fontSize: "clamp(14px,3.5vw,16px)" }}
                  >
                    {hadir === "Hadir"
                      ? "Konfirmasi kehadiran Anda telah kami terima. Sampai jumpa di acara wisuda!"
                      : "Kami menerima konfirmasi Anda. Terima kasih atas responnya."}
                  </p>

                  {/* STATUS BADGE */}
                  <div
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                    style={{
                      background:
                        hadir === "Hadir"
                          ? "rgba(255,215,0,0.12)"
                          : "rgba(255,100,100,0.1)",
                      border:
                        hadir === "Hadir"
                          ? "1px solid rgba(255,215,0,0.25)"
                          : "1px solid rgba(255,100,100,0.2)",
                      color: hadir === "Hadir" ? "#ffd700" : "#ff9090",
                      fontSize: 14,
                    }}
                  >
                    <Check size={14} />
                    {hadir === "Hadir" ? "Hadir" : "Tidak Hadir"}
                    {hadir === "Hadir" && ` · ${pax} Wali`}
                  </div>

                  {/* QR CARD */}
                  {hadir === "Hadir" && (
                    <div className="mt-8 w-full">
                      <p
                        className="mb-4 text-center text-[10px] tracking-[0.35em] text-yellow-300/60 uppercase"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        E-Ticket Anda
                      </p>

                      {/* Dark ticket card — preview */}
                      <div
                        className="overflow-hidden rounded-[24px] px-6 py-7"
                        style={{
                          background: "linear-gradient(160deg, #1e1e28 0%, #16161e 100%)",
                          border: "1px solid rgba(200,160,40,0.35)",
                          boxShadow: "0 0 0 1px rgba(200,160,40,0.1), 0 24px 48px rgba(0,0,0,0.6)",
                        }}
                      >
                        {/* Event title */}
                        <p
                          className="mt-2 text-center"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(22px,5vw,28px)",
                            fontWeight: 900,
                            color: "#f5e9c0",
                            letterSpacing: "0.06em",
                          }}
                        >
                          LUMINEX 2026
                        </p>
                        <p className="mt-0.5 text-center text-[11px] text-yellow-100/35" style={{ letterSpacing: "0.18em" }}>
                          SMK TELKOM MALANG · ANGKATAN 32
                        </p>

                        {/* Perforation divider */}
                        <div className="relative my-5 flex items-center">
                          <div className="absolute -left-6 h-8 w-8 rounded-full" style={{ background: "#050f20" }} />
                          <div className="absolute -right-6 h-8 w-8 rounded-full" style={{ background: "#050f20" }} />
                          <div className="h-px w-full" style={{
                            background: "repeating-linear-gradient(to right, rgba(200,160,40,0.4) 0px, rgba(200,160,40,0.4) 8px, transparent 8px, transparent 16px)"
                          }} />
                        </div>

                        {/* Guest info */}
                        <p className="text-center text-[10px] tracking-[0.3em]" style={{ color: "rgba(200,160,40,0.65)" }}>
                          TAMU KEHORMATAN
                        </p>
                        <p
                          className="mt-1.5 text-center font-bold"
                          style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(16px,4vw,20px)", color: "#f5e9c0" }}
                        >
                          {guest?.name ?? "Tamu"}
                        </p>
                        <p className="mt-1 text-center text-[11px]" style={{ color: "rgba(245,233,192,0.4)" }}>
                          Maksimal {pax} wali · 11 Juni 2026
                        </p>

                        {/* QR with gold frame */}
                        <div className="mt-5 flex justify-center">
                          <div
                            className="rounded-[18px] p-[6px]"
                            style={{
                              background: "linear-gradient(135deg, #c8a028, #f5e9c0, #c8a028)",
                              boxShadow: "0 0 24px rgba(200,160,40,0.45)",
                            }}
                          >
                            <div className="rounded-[13px] bg-white p-2">
                              <QRCodeCanvas
                                id="qr-canvas"
                                value={hash}
                                size={180}
                                fgColor="#111111"
                                bgColor="#ffffff"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bottom note */}
                        <p
                          className="mt-5 text-center leading-6"
                          style={{ fontSize: 12, color: "rgba(245,233,192,0.45)", fontStyle: "italic" }}
                        >
                          Silakan tunjukkan QR Code ini kepada resepsionis<br />
                          saat memasuki area acara.
                        </p>
                      </div>

                      <button
                        id="btn-download-qr"
                        onClick={downloadQR}
                        className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold text-[#111] transition-all active:scale-95"
                        style={{
                          fontSize: 15,
                          minHeight: 52,
                          background: "linear-gradient(135deg, #c8a028 0%, #f5e9c0 50%, #c8a028 100%)",
                          boxShadow: "0 0 0 1px rgba(200,160,40,0.3), 0 8px 20px rgba(200,160,40,0.2)",
                        }}
                      >
                        <Download size={18} />
                        Unduh E-Ticket
                      </button>
                    </div>
                  )}

                  <GoldDivider compact />

                  {/* UPDATE BUTTON */}
                  {editCount < MAX_EDIT ? (
                    <button
                      id="btn-update-rsvp"
                      onClick={() => {
                        setIsEditing(true);
                        setStep("form");
                      }}
                      className="inline-flex items-center gap-2 text-sm text-white/40 transition-all hover:text-white/60"
                      style={{ fontSize: 14, minHeight: 44 }}
                    >
                      <Pencil size={14} />
                      Ubah Konfirmasi
                      <span
                        className="ml-1 rounded-full px-2 py-0.5 text-[10px]"
                        style={{
                          background: "rgba(255,215,0,0.1)",
                          border: "1px solid rgba(255,215,0,0.2)",
                          color: "rgba(255,215,0,0.6)",
                        }}
                      >
                        {MAX_EDIT - editCount}x lagi
                      </span>
                    </button>
                  ) : (
                    <p
                      className="text-center text-[12px]"
                      style={{ color: "rgba(255,100,100,0.6)", fontStyle: "italic" }}
                    >
                      Batas perubahan (2x) telah tercapai
                    </p>
                  )}
                </div>
              </LuxCard>
            </div>
          )}
        </div>

        {/* STYLES */}
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap");

          @keyframes fadein {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .animate-fadein {
            animation: fadein 0.45s ease-out both;
          }

          @keyframes toastSlide {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.92); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1); }
          }

          @keyframes toastProgress {
            from { width: 100%; opacity: 1; }
            to   { width: 0%;   opacity: 0.4; }
          }
        `}</style>
      </main>

      <BottomNav />
    </>
  );
}

/* ============================================================ */
/* SUB-COMPONENTS                                               */
/* ============================================================ */
function LuxCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-[28px] p-6"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 60%, rgba(13,52,112,0.15) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(20px)",
      }}
    >
      {children}
    </div>
  );
}

function GoldDivider({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${compact ? "my-5" : "my-7"}`}
    >
      <div
        className={`h-px ${compact ? "w-12" : "w-20"}`}
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,215,0,0.6))",
        }}
      />
      <span style={{ color: "#ffd700" }}>◆</span>
      <div
        className={`h-px ${compact ? "w-12" : "w-20"}`}
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(255,215,0,0.6))",
        }}
      />
    </div>
  );
}

function Dropdown({
  title,
  value,
  open,
  onOpen,
  children,
}: {
  title: string;
  value: string;
  open: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        id={`dropdown-${title.replace(/\s/g, "-").toLowerCase()}`}
        onClick={onOpen}
        className="flex w-full items-center justify-between px-5 transition-all"
        style={{
          borderRadius: 16,
          border:
            open || value
              ? "1px solid rgba(255,215,0,0.4)"
              : "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: value ? "#fff" : "rgba(255,255,255,0.4)",
          fontSize: 15,
          minHeight: 56,
          padding: "0 20px",
        }}
      >
        <span className="truncate">{value || title}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden backdrop-blur-xl"
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,215,0,0.2)",
            background: "rgba(7,24,64,0.97)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-white/5"
      style={{
        fontSize: 15,
        color: active ? "#ffd700" : "#fff",
        background: active ? "rgba(255,215,0,0.05)" : undefined,
      }}
    >
      {children}
      {active && <Check size={15} className="text-yellow-400" />}
    </div>
  );
}
