import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "riooorante — Portfolio",
  description: "Personal portfolio. Designer & Developer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: "#080808" }}>

        {/* ✅ Navbar global — muncul di semua halaman */}
        <Navbar />

        {/* Konten tiap halaman dirender di sini */}
        {children}

      </body>
    </html>
  );
}