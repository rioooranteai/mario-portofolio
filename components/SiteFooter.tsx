import { profile, gmailComposeUrl } from "@/data/profile";
import styles from "./SiteFooter.module.css";

/**
 * "Let's talk." call to action and the site footer, shared across pages.
 * Pass `closing={false}` to show only the footer bar (e.g. on Contact).
 */
export default function SiteFooter({ closing = true }: { closing?: boolean }) {
  return (
    <div className={styles.root}>
      {closing && (
        <section className={styles.closing} aria-labelledby="closing-lead">
          <p id="closing-lead" className={styles.closingLead}>
            Hiring for an AI or data role, or have a dataset that needs a second look?
          </p>
          <a
            href={gmailComposeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.closingLink}
          >
            Let&apos;s talk.
          </a>
        </section>
      )}

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className={styles.footerPlace}>{profile.location}</span>
        <nav className={styles.footerLinks} aria-label="Elsewhere">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={gmailComposeUrl()} target="_blank" rel="noopener noreferrer">Email</a>
        </nav>
      </footer>
    </div>
  );
}
