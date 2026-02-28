"use client";

/**
 * Navbar — app/components/Navbar.tsx
 * ────────────────────────────────────
 * Global navbar. Dipanggil dari layout.tsx.
 * usePathname() mendeteksi halaman aktif secara otomatis.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Work",    href: "/work" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">

      {/* Logo */}
      <Link href="/" className={styles.navLogo} aria-label="Home">
        <div className={styles.logoGrid} aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        riooorante.
      </Link>

      {/* Pill links */}
      <ul className={styles.navPill} role="list">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <li key={href} role="listitem">
              <Link
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side */}
      <div className={styles.navRight}>
        <button className={styles.navIconBtn} aria-label="Contact me">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.364 5.636a9 9 0 1 1-12.728 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </div>

    </nav>
  );
}