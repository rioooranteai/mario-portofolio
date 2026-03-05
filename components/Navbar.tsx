"use client";

import { useState, useEffect } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup menu saat navigasi
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={styles.navbar} role="navigation" aria-label="Main navigation">

        {/* Logo */}
        <Link href="/" className={styles.navLogo} aria-label="Home">
          <div className={styles.logoGrid} aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          riooorante.
        </Link>

        {/* Pill links — Desktop only */}
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

          {/* Hamburger — Mobile only */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}

        {/* Footer info di dalam mobile menu */}
        <div className={styles.mobileMenuFooter}>
          <span className={styles.mobileAvail}>
            <span className={styles.navDot} aria-hidden="true" />
            Available for work
          </span>
        </div>
      </div>
    </>
  );
}
