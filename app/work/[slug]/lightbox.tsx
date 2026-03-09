"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./lightbox.module.css";

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
    setZoom(z => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

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
  const onTouchMove = (e: React.TouchEvent) => {
    if (zoom <= 1) return;
    setOffset({
      x: offsetStart.current.x + (e.touches[0].clientX - touchStart.current.x),
      y: offsetStart.current.y + (e.touches[0].clientY - touchStart.current.y),
    });
  };

  // Scroll to zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

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
    >
      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <span className={styles.counter}>
            <span className={styles.counterCurrent}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(images.length).padStart(2, "0")}</span>
          </span>
          {current.caption && (
            <span className={styles.caption}>{current.caption}</span>
          )}
        </div>

        <div className={styles.topRight}>
          {/* Zoom controls */}
          <div className={styles.zoomGroup}>
            <button
              className={styles.toolBtn}
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              title="Zoom out (–)"
            >
              <ZoomOutIcon />
            </button>
            <button
              className={styles.zoomLabel}
              onClick={resetZoom}
              title="Reset zoom (0)"
            >
              {zoomPercent}%
            </button>
            <button
              className={styles.toolBtn}
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              title="Zoom in (+)"
            >
              <ZoomInIcon />
            </button>
          </div>

          <div className={styles.divider} />

          {/* Close */}
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* ── IMAGE STAGE ── */}
      <div
        className={`${styles.stage} ${zoom > 1 ? styles.stagePannable : ""} ${isDragging ? styles.stageDragging : ""}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onWheel={onWheel}
      >
        <div
          className={`${styles.imgWrap} ${isImgLoaded ? styles.imgLoaded : ""}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        >
          {/* Loading skeleton */}
          {!isImgLoaded && <div className={styles.skeleton} />}

          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className={styles.img}
            draggable={false}
            onLoad={() => setIsImgLoaded(true)}
          />
        </div>
      </div>

      {/* ── PREV / NEXT ── */}
      {images.length > 1 && (
        <>
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* ── BOTTOM DOTS ── */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── BOTTOM HINT ── */}
      <div className={styles.hint}>
        <span>← → navigate</span>
        <span className={styles.hintSep}>·</span>
        <span>scroll to zoom</span>
        <span className={styles.hintSep}>·</span>
        <span>drag to pan</span>
        <span className={styles.hintSep}>·</span>
        <span>esc to close</span>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────

function ZoomInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}