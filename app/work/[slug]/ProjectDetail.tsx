"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./project.module.css";

// Types
export interface ProjectData {
  slug: string;
  title: string;
  secondaryTitle: string;
  category: string;
  year: string;
  thumbnail: string;
  overview: string;
  problem: string;
  solution: string;
  techStack: string[];
  challenges: string;
  results: string;
  gallery: {
    id: string;
    src: string;
    alt: string;
    caption?: string;
  }[];
}

// Component
export default function ProjectDetail({ project }: { project: ProjectData }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  // Scroll spy for gallery dots
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / project.gallery.length;
      setActiveIdx(Math.round(el.scrollLeft / cardWidth));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [project.gallery.length]);

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = e.pageX;
    scrollStart.current = galleryRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !galleryRef.current) return;
    galleryRef.current.scrollLeft = scrollStart.current - (e.pageX - dragStart.current);
  };
  const onMouseUp = () => setIsDragging(false);

  const scrollTo = (idx: number) => {
    const el = galleryRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / project.gallery.length;
    el.scrollTo({ left: cardWidth * idx, behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>

      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.categoryLabel}>{project.category}</span>
          <h1 className={styles.heroTitle}>{project.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroDivider} />
            <span className={styles.heroYear}>{project.year}</span>
          </div>
        </div>
        <div className={styles.heroBorderBottom} />
      </header>

      {/* ARTICLE  */}
      <main className={styles.article}>

        {/* 01 Overview */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelIndex}>01</span>
            <span className={styles.labelText}>Overview</span>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.leadText}>{project.overview}</p>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* 02 Problem & Solution */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelIndex}>02</span>
            <span className={styles.labelText}>Problem &amp; Solution</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.twoCol}>
              <div className={styles.twoColItem}>
                <h3 className={styles.colHeading}>The Problem</h3>
                <p className={styles.bodyText}>{project.problem}</p>
              </div>
              <div className={styles.twoColItem}>
                <h3 className={styles.colHeading}>The Solution</h3>
                <p className={styles.bodyText}>{project.solution}</p>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* 03 Tech Stack */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelIndex}>03</span>
            <span className={styles.labelText}>Tech Stack</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.techGrid}>
              {project.techStack.map((tech) => (
                <span key={tech} className={styles.techPill}>{tech}</span>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* 04 Challenges & Results */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelIndex}>04</span>
            <span className={styles.labelText}>Challenges &amp; Results</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.twoCol}>
              <div className={styles.twoColItem}>
                <h3 className={styles.colHeading}>Challenges</h3>
                <p className={styles.bodyText}>{project.challenges}</p>
              </div>
              <div className={styles.twoColItem}>
                <h3 className={styles.colHeading}>Results</h3>
                <p className={styles.bodyText}>{project.results}</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/*  GALLERY  */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <h2 className={styles.galleryTitle}>Showcase</h2>
          <div className={styles.galleryNav}>
            <button
              className={styles.navBtn}
              onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
              aria-label="Previous"
            >
              <ArrowLeft />
            </button>
            <button
              className={styles.navBtn}
              onClick={() => scrollTo(Math.min(project.gallery.length - 1, activeIdx + 1))}
              aria-label="Next"
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        <div
          ref={galleryRef}
          className={`${styles.galleryTrack} ${isDragging ? styles.grabbing : ""}`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {project.gallery.map((item, idx) => (
            <div key={item.id} className={styles.galleryCard}>
              <div className={styles.galleryImgWrap}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className={styles.galleryImg}
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className={styles.galleryPlaceholder}>
                  <span className={styles.placeholderIdx}>{String(idx + 1).padStart(2, "0")}</span>
                </div>
              </div>
              {item.caption && (
                <p className={styles.galleryCaption}>{item.caption}</p>
              )}
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {project.gallery.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ""}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

// Icons 
function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}