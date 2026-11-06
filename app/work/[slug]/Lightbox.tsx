"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Lightbox.module.css";
import { asset } from "@/lib/asset";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.01;

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mount animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Reset zoom & offset when image changes
  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setIsImgLoaded(false);
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  const goNext = useCallback(() => {
    setIndex(i => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM));
  }, []);

  // Kembalikan posisi ke tengah begitu zoom kembali ke 100%
  useEffect(() => {
    if (zoom <= MIN_ZOOM) setOffset({ x: 0, y: 0 });
  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Mouse drag (pan when zoomed)
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const onMouseUp = () => setIsDragging(false);

  // Touch drag
  const touchStart = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    offsetStart.current = { ...offset };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (zoom <= 1) return;
    setOffset({
      x: offsetStart.current.x + (e.touches[0].clientX - touchStart.current.x),
      y: offsetStart.current.y + (e.touches[0].clientY - touchStart.current.y),
    });
  };

  // Scroll to zoom — listener native non-passive agar preventDefault berfungsi
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomIn, zoomOut]);

  // Click backdrop to close
  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) handleClose();
  };

  const current = images[index];
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      ref={containerRef}
      className={`${styles.backdrop} ${isVisible ? styles.backdropVisible : ""}`}
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={current.caption || current.alt}
    >
      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <p className={styles.counter} aria-live="polite">
          <span className={styles.counterCurrent}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.counterTotal}>/{String(images.length).padStart(2, "0")}</span>
        </p>

        <div className={styles.controls}>
          <div className={styles.splitBtn} role="group" aria-label="Zoom">
            <button
              className={styles.splitCell}
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              title="Zoom out (-)"
            >
              <MinusIcon />
            </button>
            <button
              className={`${styles.splitCell} ${styles.zoomValue}`}
              onClick={resetZoom}
              aria-label={`Zoom ${zoomPercent}%, reset`}
              title="Reset zoom (0)"
            >
              {zoomPercent}%
            </button>
            <button
              className={styles.splitCell}
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              title="Zoom in (+)"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            className={styles.labelBtn}
            onClick={handleClose}
            aria-label="Close"
            title="Close (Esc)"
          >
            <span className={styles.labelBtnText}>Close</span>
            <span className={styles.labelBtnIcon}><CloseIcon /></span>
          </button>
        </div>
      </div>

      {/* ── IMAGE STAGE ── */}
      <div
        ref={stageRef}
        className={`${styles.stage} ${zoom > 1 ? styles.stagePannable : ""} ${isDragging ? styles.stageDragging : ""}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`${styles.imgWrap} ${isImgLoaded ? styles.imgLoaded : ""}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        >
          {!isImgLoaded && <div className={styles.skeleton} />}

          <img
            key={current.src}
            src={asset(current.src)}
            alt={current.alt}
            className={styles.img}
            draggable={false}
            onLoad={() => setIsImgLoaded(true)}
          />
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className={styles.bottomBar}>
        <p className={styles.caption}>{current.caption || current.alt}</p>

        {images.length > 1 && (
          <>
            <div className={styles.progress}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.segment} ${i === index ? styles.segmentActive : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Image ${i + 1}: ${img.caption || img.alt}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>

            <div className={styles.splitBtn} role="group" aria-label="Browse images">
              <button
                className={`${styles.splitCell} ${styles.navCell}`}
                onClick={goPrev}
                aria-label="Previous image"
                title="Previous (←)"
              >
                <ArrowLeft />
              </button>
              <button
                className={`${styles.splitCell} ${styles.navCell}`}
                onClick={goNext}
                aria-label="Next image"
                title="Next (→)"
              >
                <ArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
