"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

const TYPED_WORDS = ["analyst.", "researcher.", "strategist.", "thinker.", "explorer."];

export default function HomePage() {
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const deletingRef  = useRef(false);

  const [typedWord, setTypedWord] = useState("");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = TYPED_WORDS[wordIndexRef.current];

      if (!deletingRef.current) {
        charIndexRef.current += 1;
        setTypedWord(word.slice(0, charIndexRef.current));

        if (charIndexRef.current === word.length) {
          deletingRef.current = true;
          timeout = setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndexRef.current -= 1;
        setTypedWord(word.slice(0, charIndexRef.current));

        if (charIndexRef.current === 0) {
          deletingRef.current = false;
          wordIndexRef.current = (wordIndexRef.current + 1) % TYPED_WORDS.length;
        }
      }

      timeout = setTimeout(tick, deletingRef.current ? 55 : 95);
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.hero}>
        <p className={styles.heroEyebrow}>Portfolio — riooorante</p>

        <div className={styles.heroHeadingBlock}>
          <h1 className={styles.heroHeading}>
            Welcome to my <span className={styles.heroWhite}>World.</span>
          </h1>
          <h2 className={styles.heroHeadingLine2} aria-live="polite">
            I am a{" "}
            <span className={styles.heroTyped}>{typedWord}</span>
            <span className={styles.heroCursor} aria-hidden="true" />
          </h2>
        </div>

        <p className={styles.heroSub}>
          Crafting digital experiences that leave a lasting impression.
          Let&apos;s build something great together.
        </p>

        <div className={styles.heroCta}>
          <Link href="/work" className={styles.btnPrimary}>View My Work</Link>
        </div>
      </main>

      <footer className={styles.bottomBar} />
    </div>
  );
}