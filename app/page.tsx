"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./page.module.css";


const TYPED_WORDS = ["analyst.", "researcher.", "strategist.", "thinker.", "explorer."];


function smoothNoise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.008 + t * 0.3) *
    Math.cos(y * 0.008 - t * 0.2) *
    Math.sin((x + y) * 0.005 + t * 0.15)
  );
}

export default function HomePage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const animIdRef   = useRef<number>(0);
  const frameRef    = useRef(0);
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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = frameRef.current * 0.018;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, w, h);

    const blobs = [
      { x: w * 0.18 + Math.sin(t * 0.4) * 90,  y: h * 0.28 + Math.cos(t * 0.3)  * 65, r: 380, color: "rgba(60,40,100,0.22)" },
      { x: w * 0.76 + Math.cos(t * 0.35) * 110, y: h * 0.62 + Math.sin(t * 0.45) * 75, r: 420, color: "rgba(20,60,80,0.18)"  },
      { x: w * 0.5  + Math.sin(t * 0.25) * 55,  y: h * 0.12 + Math.cos(t * 0.5)  * 38, r: 290, color: "rgba(80,40,20,0.12)"  },
    ];

    blobs.forEach(({ x, y, r, color }) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    const STEP = 3;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    for (let py = 0; py < h; py += STEP) {
      for (let px = 0; px < w; px += STEP) {
        const n = smoothNoise(px, py, t);
        const grain = (Math.random() * 2 - 1) * 18;
        const brightness = n * 12 + grain;

        for (let dy = 0; dy < STEP && py + dy < h; dy++) {
          for (let dx = 0; dx < STEP && px + dx < w; dx++) {
            const i = ((py + dy) * w + (px + dx)) * 4;
            data[i]     = Math.max(0, Math.min(255, data[i]     + brightness));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness * 0.85));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness * 1.1));
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.9);
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    frameRef.current += 1;
    animIdRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    animIdRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animIdRef.current);
    };
  }, [draw]);


  return (
    <div className={styles.page}>
      {/* Background canvas */}
      <canvas ref={canvasRef} className={styles.noiseCanvas} aria-hidden="true" />

      {/* Hero — navbar sudah ada di layout.tsx, tidak perlu di sini */}
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
          <button className={styles.btnPrimary}>View My Work</button>
          <button className={styles.btnGhost}>Scroll down</button>
        </div>
      </main>

      {/* Bottom bar */}
      <footer className={styles.bottomBar}>
      </footer>
    </div>
  );
}