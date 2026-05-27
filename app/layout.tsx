import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import GlobalMusic from "@/components/GlobalMusic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Undangan Wisuda LUMINEX | SMK Telkom Malang Angkatan 32",
  description:
    "Undangan digital wisuda LUMINEX – SMK Telkom Malang Angkatan 32. Konfirmasi kehadiran, lihat rundown acara, dan unduh e-ticket Anda.",
  other: {
    "theme-color": "#071840",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: "yes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        {/* ===== GLOBAL MUSIC ===== */}
        <GlobalMusic />

        {/* ===== PAGE CONTENT ===== */}
        {children}

      </body>
    </html>
  );
}