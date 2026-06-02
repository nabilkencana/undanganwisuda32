"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  MessageCircleHeart,
  CalendarCheck,
  Heart,
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

type Comment = {
  id: number;
  nama: string;
  pesan: string;
  hadir: string;
  pax?: number;
  waktu: string;
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
/* MAIN EXPORT WRAPPER                                          */
/* ============================================================ */
export default function OpeningPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050f20]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-yellow-400" />
      </div>
    }>
      <OpeningPageContent />
    </Suspense>
  );
}

/* ============================================================ */
/* CONTENT COMPONENT                                            */
/* ============================================================ */
function OpeningPageContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();

  /* code state */
  const [hash, setHash] = useState<string>("");
  const [hasCode, setHasCode] = useState<boolean>(false);
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
  const [editCount, setEditCount] = useState(0);
  const MAX_EDIT = 2;

  /* comments state */
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [attending, setAttending] = useState(0);
  const [notAttending, setNotAttending] = useState(0);

  /* ===== CANVAS EFFECT ===== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ===== STARS =====
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.002,
    }));

    // ===== CONFETTI =====
    const confettiColors = ["#ffd700", "#ffffff", "#87ceeb", "#fffacd", "#c8a8ff"];
    const confetti = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      w: Math.random() * 5 + 2,
      h: Math.random() * 9 + 3,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      speed: Math.random() * 0.2 + 0.06,
      rotSpeed: (Math.random() - 0.5) * 3.5,
    }));

    // ===== SHOOTING STARS =====
    const shootingStars: {
      x: number; y: number; len: number; speed: number; progress: number;
    }[] = [];

    const spawnShooting = () => {
      if (Math.random() < 0.007 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * 0.6,
          y: Math.random() * 0.35,
          len: Math.random() * 100 + 40,
          speed: Math.random() * 0.003 + 0.004,
          progress: 0,
        });
      }
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      stars.forEach((s) => {
        s.phase += s.speed;
        const alpha = 0.2 + 0.8 * Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      confetti.forEach((c) => {
        c.y += c.speed / 100;
        if (c.y > 1) c.y = -0.02;
        c.rotation += c.rotSpeed;
        ctx.save();
        ctx.translate(c.x * W, c.y * H);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = `${c.color}88`;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      });

      spawnShooting();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.progress += ss.speed;
        if (ss.progress >= 1) { shootingStars.splice(i, 1); continue; }
        const sx = (ss.x + ss.progress * 0.45) * W;
        const sy = (ss.y + ss.progress * 0.18) * H;
        const gradient = ctx.createLinearGradient(sx - ss.len, sy - ss.len * 0.4, sx, sy);
        gradient.addColorStop(0, "rgba(255,215,0,0)");
        gradient.addColorStop(1, `rgba(255,215,0,${1 - ss.progress})`);
        ctx.beginPath();
        ctx.moveTo(sx - ss.len, sy - ss.len * 0.4);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ===== CODE & INVITATION LOADER ===== */
  useEffect(() => {
    const queryHash = searchParams.get("kode") || searchParams.get("hash");
    const sessionHash = sessionStorage.getItem("invitation-hash");
    const activeHash = queryHash || sessionHash || "";

    if (activeHash) {
      setHash(activeHash);
      setHasCode(true);
      sessionStorage.setItem("invitation-hash", activeHash);

      fetchInvitation(activeHash)
        .then((res) => {
          const d = res.data;
          setGuest(d.guest);
          setEvent(d.event);

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

      // Load edit count
      const savedCount = parseInt(localStorage.getItem(`rsvp-edit-count-${activeHash}`) || "0", 10);
      setEditCount(savedCount);
    } else {
      setHasCode(false);
      setStep("done"); // general info is viewable directly
    }
  }, [searchParams]);

  /* ===== COMMENTS LOADER ===== */
  const loadComments = () => {
    try {
      const raw = localStorage.getItem("rsvp-data");
      if (raw) {
        const data = JSON.parse(raw) as Comment[];
        const sorted = [...data].reverse();
        setComments(sorted);
        setAttending(data.filter((c) => c.hadir === "Hadir").length);
        setNotAttending(data.filter((c) => c.hadir === "Tidak Hadir").length);
      }
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  /* ===== SCROLL TO RSVP ANCHOR ===== */
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#rsvp" && (step === "intro" || step === "form" || step === "done")) {
      setTimeout(() => {
        const el = document.getElementById("rsvp");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [step, searchParams]);

  /* ===== RSVP SUBMIT ===== */
  const handleSubmit = async () => {
    if (!hadir) {
      setSubmitError("Silakan pilih kehadiran Anda.");
      return;
    }
    if (isEditing && editCount >= MAX_EDIT) {
      setSubmitError("Batas maksimal perubahan (2x) telah tercapai.");
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const attendance = hadir === "Hadir";
      await submitRsvp(hash, attendance, attendance ? pax : 1, pesan);

      const res = await fetchInvitation(hash);
      setGuest(res.data.guest);

      if (isEditing) {
        const newCount = editCount + 1;
        setEditCount(newCount);
        localStorage.setItem(`rsvp-edit-count-${hash}`, String(newCount));
      }

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
        const filtered = existing.filter((c: any) => c.nama !== commentEntry.nama);
        filtered.push(commentEntry);
        localStorage.setItem("rsvp-data", JSON.stringify(filtered));
        loadComments();
      } catch (e) {
        // ignore
      }

      setIsEditing(false);
      setStep("done");
      setToast("Kehadiran berhasil disimpan!");
      setTimeout(() => setToast(""), 3500);
    } catch (e: any) {
      setSubmitError(e.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== DOWNLOAD QR CODE ===== */
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

    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, W, H);

    const cX = 40, cY = 40, cW = W - 80, cH = H - 80, cR = 32;
    rr(cX, cY, cW, cH, cR);
    ctx.fillStyle = "#1e1e24";
    ctx.fill();

    rr(cX, cY, cW, cH, cR);
    ctx.strokeStyle = "rgba(200,160,40,0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#f5e9c0";
    ctx.textAlign = "center";
    ctx.font = "bold 52px serif";
    ctx.fillText("LUMINEX 2026", W / 2, cY + 110);

    ctx.fillStyle = "rgba(245,233,192,0.55)";
    ctx.font = "18px sans-serif";
    ctx.fillText("SMK TELKOM MALANG · ANGKATAN 32", W / 2, cY + 178);

    const divY = cY + 220;
    ctx.beginPath();
    ctx.arc(cX, divY, 20, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = "#111111";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cX + cW, divY, 20, Math.PI / 2, -Math.PI / 2);
    ctx.fillStyle = "#111111";
    ctx.fill();

    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = "rgba(200,160,40,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cX + 24, divY);
    ctx.lineTo(cX + cW - 24, divY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(200,160,40,0.65)";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("TAMU KEHORMATAN", W / 2, divY + 44);

    ctx.fillStyle = "#f5e9c0";
    ctx.font = "bold 36px serif";
    ctx.fillText(guest?.name ?? "Tamu", W / 2, divY + 90);

    ctx.fillStyle = "rgba(245,233,192,0.45)";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Maksimal ${pax} wali · Wisuda 11 Juni 2026`, W / 2, divY + 122);

    const qrSize = 320;
    const qrX = (W - qrSize) / 2;
    const qrY = divY + 155;

    ctx.shadowColor = "rgba(200,160,40,0.6)";
    ctx.shadowBlur = 24;
    rr(qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 22);
    ctx.fillStyle = "#c8a028";
    ctx.fill();
    ctx.shadowBlur = 0;

    rr(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    const instrY = qrY + qrSize + 60;
    ctx.fillStyle = "rgba(245,233,192,0.5)";
    ctx.font = "17px sans-serif";
    ctx.fillText("Silakan tunjukkan QR Code ini kepada resepsionis", W / 2, instrY);
    ctx.fillText("saat memasuki area acara.", W / 2, instrY + 28);

    const grad = ctx.createLinearGradient(cX, 0, cX + cW, 0);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, "rgba(200,160,40,0.7)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(cX + 40, cY + cH - 2, cW - 80, 1.5);

    const dataUrl = canvas.toDataURL("image/png");

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

    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  };

  return (
    <>
      {/* TOAST NOTIFICATION */}
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
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }}
            />
          </div>
          <div
            className="mx-4 h-0.5 rounded-full"
            style={{
              background: "linear-gradient(to right, rgba(34,197,94,0.6), rgba(34,197,94,0.1))",
              animation: "toastProgress 3.5s linear forwards",
            }}
          />
        </div>
      )}

      <main className="relative min-h-screen overflow-hidden bg-[#050f20]" onClick={() => setOpenDropdown("")}>

        {/* ===== CANVAS ===== */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        {/* ===== BACKGROUND GRADIENT ===== */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #0f3a7a 0%, #0a2655 35%, #050f20 80%)",
          }}
        />

        {/* ===== HORIZONTAL GOLD LINE ===== */}
        <div
          className="absolute top-0 left-0 right-0 z-[3] h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)",
          }}
        />

        {/* ===== CONTENT ===== */}
        <div className="relative z-10 flex min-h-screen flex-col items-center pb-36 pt-14 text-center">

          {/* ===== MINI BADGE ===== */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/5 px-5 py-2 backdrop-blur-xl"
            style={{ letterSpacing: "0.3em" }}
          >
            <span className="text-yellow-400 text-[9px]">✦</span>
            <span className="text-[10px] text-yellow-300/90 font-light tracking-widest">WISUDA 2026</span>
            <span className="text-yellow-400 text-[9px]">✦</span>
          </div>

          {/* ===== WELCOME ===== */}
          <p className="mt-10 text-[10px] tracking-[0.35em] text-blue-200/60 uppercase">
            Selamat Datang di
          </p>

          <h2
            className="mt-2 text-white/90"
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 400,
              letterSpacing: "0.12em",
            }}
          >
            Graduation Celebration
          </h2>

          {/* ===== SALAM DAN SAPAAN ===== */}
          <p
            className="mt-5 text-xs text-yellow-100/60 font-light max-w-[340px]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 15,
              fontStyle: "italic",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            }}
          >
            Assalamu’alaikum Wr. Wb. &amp; Salam Sejahtera bagi Kita Semua
          </p>

          {/* ===== MAIN TITLE BLOCK ===== */}
          <div className="relative mt-8 flex flex-col items-center">

            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 280,
                height: 280,
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(100,160,255,0.06) 50%, transparent 75%)",
                animation: "lumipulse 4.5s ease-in-out infinite",
              }}
            />

            {[220, 310, 400].map((size, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  border: `1px solid rgba(255,215,0,${0.09 - i * 0.02})`,
                  animation: `spin ${50 + i * 25}s linear infinite`,
                }}
              />
            ))}

            <h1
              className="relative px-4"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(52px, 11vw, 112px)",
                fontWeight: 900,
                letterSpacing: "0.14em",
                lineHeight: 1,
                color: "transparent",
                backgroundImage:
                  "linear-gradient(160deg, #ffffff 20%, #e8d68a 50%, #ffd700 65%, #ffffff 90%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 0 30px rgba(255,215,0,0.25))",
              }}
            >
              LUMINEX
            </h1>

            <div
              className="mt-3 h-px w-48"
              style={{
                background: "linear-gradient(to right, transparent, rgba(255,215,0,0.8), transparent)",
              }}
            />

          </div>

          <p
            className="mt-4 text-[11px] text-yellow-300/70"
            style={{ letterSpacing: "0.3em" }}
          >
            SMK TELKOM MALANG · ANGKATAN 32
          </p>

          {/* ===== PERSONALIZED ENVELOPE (COVER) ===== */}
          {hasCode && guest && (
            <div
              className="relative mt-8 overflow-hidden rounded-[22px] px-6 py-5 mx-4 w-full max-w-[400px] text-center"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(20,80,160,0.12) 100%)",
                border: "1px solid rgba(255,215,0,0.2)",
                boxShadow: "inset 0 1px 0 rgba(255,215,0,0.12), 0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.4), transparent)" }} />

              <div className="mb-3 flex justify-center">
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
                  {guest.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </div>
              </div>

              <p className="text-[9px] tracking-[0.4em] text-yellow-300/55 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                Kepada Yth.
              </p>
              <p
                className="mt-1 text-white"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  opacity: 0.7,
                }}
              >
                Orang Tua / Wali Dari
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

          <Divider />

          {/* ===== HERO CARD ===== */}
          <div
            className="relative mx-4 mt-2 w-full max-w-[400px] overflow-hidden rounded-[32px] border border-white/10 px-6 pt-8 pb-8"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(20,80,160,0.12) 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,215,0,0.08), 0 30px 60px rgba(0,0,0,0.45)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.5), transparent)" }}
            />

            <p
              className="text-center leading-9 text-white/70 px-2"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(15px, 2.4vw, 18px)",
                fontStyle: "italic",
              }}
            >
              Di bawah hangat cahaya pagi, terukir kisah tentang perjuangan, persahabatan, dan mimpi-mimpi yang perlahan menemukan jalannya. Hari ini menjadi awal dari langkah baru menuju masa depan yang penuh harapan dan gemilang.
            </p>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/30" />
              <span style={{ color: "#ffd700", fontSize: 10, opacity: 0.7 }}>◆</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/30" />
            </div>

            <div className="relative flex flex-col items-center">
              <div
                className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,215,0,0.28) 0%, transparent 70%)" }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/20"
                style={{ width: 130, height: 130, animation: "lumipulse 3s ease-in-out infinite" }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/10"
                style={{ width: 160, height: 160, animation: "lumipulse 4s ease-in-out 0.6s infinite" }}
              />

              <img
                src="/undangan-wisuda-32/lumi1.png"
                alt="Lumi Mascot"
                className="relative animate-float object-contain"
                style={{
                  width: "clamp(100px, 22vw, 128px)",
                  filter:
                    "drop-shadow(0 0 28px rgba(255,215,0,0.55)) drop-shadow(0 0 8px rgba(255,255,255,0.1))",
                }}
              />
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/30" />
              <span style={{ color: "#ffd700", fontSize: 10, opacity: 0.7 }}>◆</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/30" />
            </div>

            <div className="text-center">
              <p className="text-[9px] tracking-[0.45em] text-white/35 uppercase">
                Celebration of Memories
              </p>
              <p
                className="mt-2 text-lg font-semibold text-yellow-300"
                style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
              >
                Graduation Ceremony
              </p>
              <div className="mt-3 flex justify-center gap-2">
                {["✦", "✧", "⋆", "✧", "✦"].map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 13,
                      color: i % 2 === 0 ? "#ffd700" : "#ffffff",
                      animation: `float 2.5s ease-in-out ${i * 0.18}s infinite`,
                      display: "inline-block",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2/3"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)" }}
            />
          </div>

          {/* ===== FOTO ANGKATAN ===== */}
          <div className="mt-14 w-full max-w-[600px] px-4">
            <div className="mb-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/40" />
              <p className="text-[10px] tracking-[0.4em] text-yellow-300/70 uppercase">Foto Angkatan</p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/40" />
            </div>

            <div
              className="relative overflow-hidden rounded-3xl border border-yellow-400/20"
              style={{
                background: "rgba(255,255,255,0.03)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
              }}
            >
              {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-5 h-5`}
                  style={{
                    borderTop: i < 2 ? "1.5px solid rgba(255,215,0,0.5)" : "none",
                    borderBottom: i >= 2 ? "1.5px solid rgba(255,215,0,0.5)" : "none",
                    borderLeft: i % 2 === 0 ? "1.5px solid rgba(255,215,0,0.5)" : "none",
                    borderRight: i % 2 === 1 ? "1.5px solid rgba(255,215,0,0.5)" : "none",
                  }}
                />
              ))}

              <img
                src="/undangan-wisuda-32/angkatan.png"
                alt="Foto Angkatan 32"
                className="w-full object-cover"
                style={{ display: "block", borderRadius: "inherit" }}
              />

              <div
                className="absolute bottom-0 left-0 right-0 px-5 py-4"
                style={{
                  background: "linear-gradient(to top, rgba(5,15,32,0.92) 0%, transparent 100%)",
                }}
              >
                <p
                  className="text-center text-xs text-yellow-300/90"
                  style={{ letterSpacing: "0.25em", fontFamily: "'Cinzel', serif" }}
                >
                  ANGKATAN 32 · SMK TELKOM MALANG
                </p>
              </div>
            </div>
          </div>

          {/* ===== PARENTS MESSAGE ===== */}
          <div
            className="mt-10 w-full max-w-[520px] px-4 rounded-[28px] border border-white/8 bg-white/[0.03] px-7 py-8 backdrop-blur-xl mx-4"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 25px 50px rgba(0,0,0,0.35)",
            }}
          >
            <p className="text-[9px] tracking-[0.45em] text-yellow-400/70 uppercase">
              Untuk Orang Tua
            </p>

            <div className="my-4 flex justify-center">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
            </div>

            <p
              className="text-sm leading-9 text-white/65"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(14px,2.2vw,16px)" }}
            >
              Terima kasih atas setiap doa yang tak pernah terucap lelah, atas dukungan yang tetap hadir bahkan di saat langkah kami terasa rapuh, dan atas setiap perjuangan yang diam-diam dikorbankan demi mengantarkan kami sampai di titik ini.
            </p>
            <p
              className="mt-5 text-sm leading-9 text-white/65"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(14px,2.2vw,16px)" }}
            >
              Hari ini bukan hanya tentang kelulusan, tetapi tentang cinta, kesabaran, air mata, dan harapan yang tumbuh bersama dalam setiap perjalanan yang telah kita lewati.
            </p>
          </div>

          {/* ===== INTEGRATED RSVP & QR CODE SECTION ===== */}
          {hasCode && (
            <div id="rsvp" className="mt-14 w-full max-w-[520px] px-4 text-left">
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/40" />
                <p className="text-[10px] tracking-[0.4em] text-yellow-300/70 uppercase">Konfirmasi &amp; E-Ticket</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/40" />
              </div>

              {step === "loading" && (
                <div className="flex flex-col items-center gap-4 text-white/50 py-10">
                  <Loader2 size={36} className="animate-spin text-yellow-300" />
                  <p className="text-sm">Memuat data undangan...</p>
                </div>
              )}

              {step === "error" && (
                <LuxCard>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
                      <AlertCircle size={28} className="text-red-400" />
                    </div>
                    <h2 className="text-white" style={{ fontFamily: "'Cinzel', serif", fontSize: 18 }}>
                      Undangan Tidak Ditemukan
                    </h2>
                    <p className="leading-7 text-white/50" style={{ fontSize: 15 }}>
                      {errorMsg}
                    </p>
                  </div>
                </LuxCard>
              )}

              {step === "intro" && (
                <div className="animate-fadein">
                  <LuxCard>
                    <div className="mb-6 flex justify-center">
                      <Sparkles size={32} className="text-yellow-300 animate-pulse" />
                    </div>
                    <h2 className="text-center text-white text-lg font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                      Konfirmasi Kehadiran
                    </h2>
                    <p className="mt-4 text-center leading-8 text-white/55 text-sm">
                      Silakan konfirmasi kehadiran Anda di acara wisuda LUMINEX Angkatan 32.
                    </p>
                    <GoldDivider compact />
                    <button
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

              {step === "form" && (
                <div className="animate-fadein">
                  <LuxCard>
                    <button
                      onClick={() => isEditing ? setStep("done") : setStep("intro")}
                      className="mb-6 inline-flex items-center gap-2 text-sm text-white/40"
                      style={{ minHeight: 44, fontSize: 14 }}
                    >
                      <ArrowLeft size={16} />
                      Kembali
                    </button>

                    <h2 className="mb-6 text-white text-lg font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                      {isEditing ? "Ubah Konfirmasi" : "Isi Formulir"}
                    </h2>

                    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        title="Pilih Kehadiran"
                        value={hadir}
                        open={openDropdown === "hadir"}
                        onOpen={() => setOpenDropdown(openDropdown === "hadir" ? "" : "hadir")}
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

                      {hadir === "Hadir" && (
                        <Dropdown
                          title="Jumlah Wali yang Hadir"
                          value={pax ? `${pax} Wali` : ""}
                          open={openDropdown === "pax"}
                          onOpen={() => setOpenDropdown(openDropdown === "pax" ? "" : "pax")}
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
                            transform: pesan || focused ? "translateY(0) scale(0.8)" : "translateY(-50%) scale(1)",
                            transformOrigin: "left",
                            fontSize: 14,
                          }}
                        >
                          Pesan &amp; Doa (opsional)
                        </label>
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3">
                          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                          <p className="text-sm text-red-300" style={{ fontSize: 14 }}>
                            {submitError}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold transition-all active:scale-95 disabled:opacity-60"
                        style={{
                          background: "linear-gradient(135deg, #ffd700 0%, #f0c000 50%, #ffd700 100%)",
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
                        {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Kirim Kehadiran"}
                      </button>
                    </div>
                  </LuxCard>
                </div>
              )}

              {step === "done" && (
                <div className="animate-fadein">
                  <LuxCard>
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10">
                        <Check size={34} className="text-yellow-300" />
                      </div>

                      <h2 className="text-white text-lg font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                        Terima Kasih
                      </h2>

                      <p className="mt-3 leading-8 text-white/55 text-sm">
                        {hadir === "Hadir"
                          ? "Konfirmasi kehadiran Anda telah kami terima. Sampai jumpa di acara wisuda!"
                          : "Kami menerima konfirmasi Anda. Terima kasih atas responnya."}
                      </p>

                      <div
                        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                        style={{
                          background: hadir === "Hadir" ? "rgba(255,215,0,0.12)" : "rgba(255,100,100,0.1)",
                          border: hadir === "Hadir" ? "1px solid rgba(255,215,0,0.25)" : "1px solid rgba(255,100,100,0.2)",
                          color: hadir === "Hadir" ? "#ffd700" : "#ff9090",
                          fontSize: 14,
                        }}
                      >
                        <Check size={14} />
                        {hadir === "Hadir" ? "Hadir" : "Tidak Hadir"}
                        {hadir === "Hadir" && ` · ${pax} Wali`}
                      </div>

                      {hadir === "Hadir" && (
                        <div className="mt-8 w-full">
                          <p
                            className="mb-4 text-center text-[10px] tracking-[0.35em] text-yellow-300/60 uppercase"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            E-Ticket Anda
                          </p>

                          <div
                            className="overflow-hidden rounded-[24px] px-6 py-7 text-left"
                            style={{
                              background: "linear-gradient(160deg, #1e1e28 0%, #16161e 100%)",
                              border: "1px solid rgba(200,160,40,0.35)",
                              boxShadow: "0 0 0 1px rgba(200,160,40,0.1), 0 24px 48px rgba(0,0,0,0.6)",
                            }}
                          >
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

                            <div className="relative my-5 flex items-center">
                              <div className="absolute -left-12 h-8 w-8 rounded-full" style={{ background: "#050f20" }} />
                              <div className="absolute -right-12 h-8 w-8 rounded-full" style={{ background: "#050f20" }} />
                              <div className="h-px w-full" style={{
                                background: "repeating-linear-gradient(to right, rgba(200,160,40,0.4) 0px, rgba(200,160,40,0.4) 8px, transparent 8px, transparent 16px)"
                              }} />
                            </div>

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

                            <p
                              className="mt-5 text-center leading-6"
                              style={{ fontSize: 12, color: "rgba(245,233,192,0.45)", fontStyle: "italic" }}
                            >
                              Silakan tunjukkan QR Code ini kepada resepsionis<br />
                              saat memasuki area acara.
                            </p>
                          </div>

                          <button
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

                      {editCount < MAX_EDIT ? (
                        <button
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
                        <p className="text-center text-[12px]" style={{ color: "rgba(255,100,100,0.6)", fontStyle: "italic" }}>
                          Batas perubahan (2x) telah tercapai
                        </p>
                      )}
                    </div>
                  </LuxCard>
                </div>
              )}
            </div>
          )}

          {/* ===== INTEGRATED COMMENTS / WISHES BOARD ===== */}
          {hasCode && (
            <div className="mt-14 w-full max-w-[520px] px-4 text-left">
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/40" />
                <p className="text-[10px] tracking-[0.4em] text-yellow-300/70 uppercase">Ucapan &amp; Doa</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/40" />
              </div>

              {commentsLoading && (
                <div className="space-y-4">
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

              {!commentsLoading && comments.length > 0 && (
                <>
                  {/* Ucapan Stats Row */}
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
                        <span className="mt-2 font-black text-2xl" style={{ fontFamily: "'Cinzel', serif", color: stat.color }}>
                          {stat.value}
                        </span>
                        <span className="mt-0.5 text-white/35 text-[10px]" style={{ letterSpacing: "0.1em" }}>
                          {stat.label.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Comment List */}
                  <div className="space-y-4">
                    {comments.map((comment, idx) => {
                      const [dark, light] = getAvatarPalette(comment.nama);
                      const isHadirStatus = comment.hadir === "Hadir";

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
                          <div
                            className="h-px w-full"
                            style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.2), transparent)" }}
                          />

                          <div className="p-5">
                            <div className="flex items-center gap-3">
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
                                  Wali <span className="text-yellow-300">{comment.nama}</span>
                                </p>
                                <p className="mt-0.5 text-white/35 text-[11px]" style={{ letterSpacing: "0.05em" }}>
                                  {comment.waktu}
                                </p>
                              </div>

                              <span
                                className="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                                style={{
                                  background: isHadirStatus ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.1)",
                                  color: isHadirStatus ? "#4ade80" : "#f87171",
                                  border: `1px solid ${isHadirStatus ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.2)"}`,
                                  fontSize: 11,
                                }}
                              >
                                {isHadirStatus ? `✓ Hadir${comment.pax ? ` · ${comment.pax}` : ""}` : "✗ Tdk Hadir"}
                              </span>
                            </div>

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
                </>
              )}

              {!commentsLoading && comments.length === 0 && (
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
                </div>
              )}
            </div>
          )}

          {/* ===== CLOSING SECTION ===== */}
          <div className="mt-16 text-center max-w-[400px] px-4">
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(26px, 5vw, 36px)",
                color: "#fff4d6",
                textShadow: "0 0 20px rgba(255,215,0,0.25)",
              }}
            >
              Thank You
            </p>
            <div
              className="mx-auto mt-2 h-px w-32"
              style={{
                background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6), transparent)",
              }}
            />
            <p
              className="mt-4 leading-relaxed text-white/50 text-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 15 }}
            >
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada wisudawan. Terima kasih atas perhatian dan kehadiran Anda.
            </p>
          </div>

          {/* ===== BOTTOM SPARKLES ===== */}
          <div className="mt-14 flex gap-4">
            {["✦", "✧", "⋆", "✧", "✦"].map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 16,
                  color: i % 2 === 0 ? "#ffd700" : "#ffffff",
                  textShadow: "0 0 12px rgba(255,215,0,0.9)",
                  animation: `float 2.5s ease-in-out ${i * 0.2}s infinite`,
                  display: "inline-block",
                }}
              >
                {s}
              </span>
            ))}
          </div>

        </div>

        {/* ===== BOTTOM GOLD LINE ===== */}
        <div
          className="absolute bottom-[110px] left-0 right-0 z-[3] h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)",
          }}
        />

        {/* ===== STYLES ===== */}
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap");

          @keyframes lumipulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
            50%       { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%      { transform: translateY(-9px); }
          }

          .animate-float {
            animation: float 3.2s ease-in-out infinite;
          }

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

/* ============================================================ */
/* SUB-COMPONENTS                                               */
/* ============================================================ */
function Divider() {
  return (
    <div className="my-7 flex w-full max-w-[260px] items-center gap-3">
      <div
        className="h-px flex-1"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.65))" }}
      />
      <span style={{ color: "#ffd700", fontSize: 12, filter: "drop-shadow(0 0 6px rgba(255,215,0,0.8))" }}>◆</span>
      <div
        className="h-px flex-1"
        style={{ background: "linear-gradient(to left, transparent, rgba(255,215,0,0.65))" }}
      />
    </div>
  );
}

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
    <div className={`flex items-center justify-center gap-3 ${compact ? "my-5" : "my-7"}`}>
      <div
        className={`h-px ${compact ? "w-12" : "w-20"}`}
        style={{ background: "linear-gradient(to right, transparent, rgba(255,215,0,0.6))" }}
      />
      <span style={{ color: "#ffd700" }}>◆</span>
      <div
        className={`h-px ${compact ? "w-12" : "w-20"}`}
        style={{ background: "linear-gradient(to left, transparent, rgba(255,215,0,0.6))" }}
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
    <div className="relative animate-fadein" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        id={`dropdown-${title.replace(/\s/g, "-").toLowerCase()}`}
        onClick={onOpen}
        className="flex w-full items-center justify-between px-5 transition-all"
        style={{
          borderRadius: 16,
          border: open || value ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
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
