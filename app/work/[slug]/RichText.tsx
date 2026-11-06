import { Fragment } from "react";
import styles from "./ProjectDetail.module.css";

/**
 * Renders project copy with inline source links written as
 *   [text the reader hovers](https://source.url "Source name")
 * Hover or keyboard focus shows the source name; clicking opens it.
 */
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g;

export default function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const m of text.matchAll(LINK)) {
    const [whole, label, href, source] = m;
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cite}
        data-source={source || undefined}
        aria-label={source ? `${label} (source: ${source}, opens in a new tab)` : undefined}
      >
        {label}
      </a>,
    );
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return <Fragment>{parts}</Fragment>;
}
