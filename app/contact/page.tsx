import type { Metadata } from "next";
import styles from "./contact.module.css";
import { profile, gmailComposeUrl } from "@/data/profile";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact — riooorante",
  description: `Get in touch with ${profile.name} by email or LinkedIn.`,
};

const elsewhere = [
  { label: "LinkedIn", value: "in/mario-tadung", href: profile.linkedin },
  { label: "GitHub", value: "rioooranteai", href: profile.github },
];

export default function ContactPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Contact — Get in touch</span>
        <h1 className={styles.title}>Contact</h1>
        <div className={styles.divider} role="separator" />
      </header>

      <main className={styles.main}>
        <p className={styles.lead}>
          Open to full-time roles, internships, freelance work and research
          collaborations in AI and data. Email is the fastest way to reach me.
        </p>

        <a
          href={gmailComposeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.emailLink}
        >
          <span className={styles.emailText}>{profile.email}</span>
          <ArrowIcon className={styles.emailArrow} />
        </a>

        <section className={styles.index} aria-labelledby="elsewhere">
          <h2 id="elsewhere" className={styles.indexLabel}>Elsewhere</h2>
          <ul className={styles.rows}>
            {elsewhere.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.row}
                >
                  <span className={styles.rowLabel}>{item.label}</span>
                  <span className={styles.rowValue}>{item.value}</span>
                  <ArrowIcon className={styles.rowArrow} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <dl className={styles.meta}>
          <div>
            <dt className={styles.metaLabel}>Based in</dt>
            <dd className={styles.metaValue}>{profile.location}</dd>
          </div>
          <div>
            <dt className={styles.metaLabel}>Timezone</dt>
            <dd className={styles.metaValue}>{profile.timezone}</dd>
          </div>
        </dl>
      </main>

      <SiteFooter closing={false} />
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
