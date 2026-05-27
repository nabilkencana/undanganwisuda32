"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Calendar,
  BookOpen,
  Clock,
  BookCheck,
} from "lucide-react";

const staticLinks = [
  { href: "/Undangan/opening",  label: "Home",    Icon: Home },
  { href: "/Undangan/acara",    label: "Info",    Icon: Calendar },
  { href: "/Undangan/rundown",  label: "Rundown", Icon: Clock },
  { href: "/Undangan/note",     label: "Notes",   Icon: BookCheck },
];

const NON_HASH_PATHS = [
  "/Undangan/opening",
  "/Undangan/acara",
  "/Undangan/rundown",
  "/Undangan/note",
  "/Undangan/gallery",
  "/Undangan/komentar",
  "/Undangan/rsvp",
];

export default function BottomNav() {
  const pathname = usePathname();

  // Default ke /Undangan/rsvp (sama di server & client awal)
  // Setelah mount, update ke hash page kalau ada — menghindari hydration mismatch
  const [rsvpHref, setRsvpHref] = useState("/Undangan/rsvp");

  useEffect(() => {
    const hash = sessionStorage.getItem("invitation-hash");
    if (hash) setRsvpHref(`/Undangan/${hash}`);
  }, []);

  const allLinks = [
    ...staticLinks.slice(0, 2),
    { href: rsvpHref, label: "RSVP", Icon: BookOpen },
    ...staticLinks.slice(2),
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      {/* outer glow */}
      <div
        className="absolute inset-0 rounded-t-[28px] pointer-events-none"
        style={{ boxShadow: "0 -8px 40px rgba(255,215,0,0.06), 0 -1px 0 rgba(255,215,0,0.1)" }}
      />

      <div
        className="rounded-t-[28px]"
        style={{
          background: "linear-gradient(180deg, rgba(7,24,64,0.92) 0%, rgba(5,15,32,0.97) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid rgba(255,215,0,0.12)",
        }}
      >
        <div className="flex items-center px-2 py-2">
          {allLinks.map(({ href, label, Icon }) => {
            const isActive =
              pathname === href ||
              // Aktif juga kalau ini RSVP dan pathname adalah hash page
              (label === "RSVP" &&
                /^\/Undangan\/[^/]+$/.test(pathname) &&
                !NON_HASH_PATHS.includes(pathname));

            return (
              <Link
                key={label}
                href={href}
                className="relative flex flex-1 flex-col items-center justify-center rounded-2xl transition-all duration-300 active:scale-90"
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.04) 100%)"
                    : "transparent",
                  border: isActive ? "1px solid rgba(255,215,0,0.18)" : "1px solid transparent",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: isActive ? "#ffd700" : "rgba(255,255,255,0.4)",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(255,215,0,0.5))" : "none",
                    transition: "all 0.3s",
                  }}
                />
                <span
                  className="mt-1.5 font-medium"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.04em",
                    color: isActive ? "#ffd700" : "rgba(255,255,255,0.35)",
                    fontFamily: "'Cinzel', serif",
                    transition: "color 0.3s",
                  }}
                >
                  {label.toUpperCase()}
                </span>
                {isActive && (
                  <div
                    className="absolute bottom-1.5 h-0.5 w-5 rounded-full"
                    style={{ background: "linear-gradient(to right, transparent, #ffd700, transparent)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}