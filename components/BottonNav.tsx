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
  Image,
  MessageSquare,
} from "lucide-react";

const staticLinks = [
  { href: "/Undangan/opening",  label: "Home",    Icon: Home },
  { href: "/Undangan/acara",    label: "Info",    Icon: Calendar },
  { href: "/Undangan/rundown",  label: "Rundown", Icon: Clock },
  { href: "/Undangan/note",     label: "Notes",   Icon: BookCheck },
];

export default function BottomNav() {
  const pathname = usePathname();

  const [hasCode, setHasCode] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const [rsvpHref, setRsvpHref] = useState("/Undangan/opening#rsvp");
  const [hashActive, setHashActive] = useState(false);

  useEffect(() => {
    const sessionHash = typeof window !== "undefined" ? sessionStorage.getItem("invitation-hash") : null;
    const queryHash = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("kode") || new URLSearchParams(window.location.search).get("hash") : null;
    const hashVal = queryHash || sessionHash;
    if (hashVal) {
      setHasCode(true);
      setActiveHash(hashVal);
      setRsvpHref(`/Undangan/opening?kode=${hashVal}#rsvp`);
    } else {
      setHasCode(false);
      setActiveHash(null);
      setRsvpHref("/Undangan/opening#rsvp");
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleHashChange = () => {
        setHashActive(window.location.hash === "#rsvp");
      };
      window.addEventListener("hashchange", handleHashChange);
      // Run once at start
      handleHashChange();
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [pathname]);

  const getHref = (basePath: string) => {
    return activeHash ? `${basePath}?kode=${activeHash}` : basePath;
  };

  const allLinks = hasCode
    ? [
        { href: getHref("/Undangan/opening"), label: "Home", Icon: Home },
        { href: getHref("/Undangan/acara"), label: "Info", Icon: Calendar },
        { href: getHref("/Undangan/rundown"), label: "Rundown", Icon: Clock },
        { href: rsvpHref, label: "RSVP", Icon: BookOpen },
        { href: getHref("/Undangan/note"), label: "Notes", Icon: BookCheck },
        { href: getHref("/Undangan/gallery"), label: "Gallery", Icon: Image },
        { href: getHref("/Undangan/komentar"), label: "Comments", Icon: MessageSquare },
      ]
    : staticLinks.map(link => ({ ...link, href: getHref(link.href) }));

  const isSeven = allLinks.length > 5;

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
        <div className="flex items-center px-1.5 py-2">
          {allLinks.map(({ href, label, Icon }) => {
            const baseHref = href.split('?')[0].split('#')[0];
            const isActive =
              (label === "RSVP" && hashActive) ||
              (label === "Home" && pathname === "/Undangan/opening" && !hashActive) ||
              (label !== "RSVP" && label !== "Home" && pathname === baseHref);

            return (
              <Link
                key={label}
                href={href}
                className="relative flex flex-1 flex-col items-center justify-center rounded-2xl transition-all duration-300 active:scale-90"
                style={{
                  paddingTop: isSeven ? 8 : 10,
                  paddingBottom: isSeven ? 8 : 10,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.04) 100%)"
                    : "transparent",
                  border: isActive ? "1px solid rgba(255,215,0,0.18)" : "1px solid transparent",
                }}
              >
                <Icon
                  size={isSeven ? 17 : 20}
                  style={{
                    color: isActive ? "#ffd700" : "rgba(255,255,255,0.4)",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(255,215,0,0.5))" : "none",
                    transition: "all 0.3s",
                  }}
                />
                <span
                  className="mt-1 font-medium text-center"
                  style={{
                    fontSize: isSeven ? 8 : 9,
                    letterSpacing: isSeven ? "0.01em" : "0.04em",
                    color: isActive ? "#ffd700" : "rgba(255,255,255,0.35)",
                    fontFamily: "'Cinzel', serif",
                    transition: "color 0.3s",
                  }}
                >
                  {label.toUpperCase()}
                </span>
                {isActive && (
                  <div
                    className="absolute bottom-1 h-0.5 w-4 rounded-full"
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