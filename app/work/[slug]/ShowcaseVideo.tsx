"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProjectDetail.module.css";
import { asset } from "@/lib/asset";

interface Props {
  src: string;
  poster: string;
  label: string;
}

/**
 * Muted, looping product film. Plays only while on screen, never autoplays
 * for people who prefer reduced motion, and always offers a pause control.
 */
export default function ShowcaseVideo({ src, poster, label }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) pausedByUser.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByUser.current) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => {});
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  };

  const openFullscreen = () => {
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {});
    } else {
      video.webkitEnterFullscreen?.();
    }
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => {});
    }
  };

  return (
    <figure className={styles.film}>
      <video
        ref={videoRef}
        className={styles.filmVideo}
        src={asset(src)}
        poster={asset(poster)}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onClick={openFullscreen}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={styles.filmToggle}
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </figure>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  );
}
