"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./project.module.css";

// ─── Types
export interface ProjectData {
  id: string;
  title: string;
  category: string;
  year: string;
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

// ─── Dummy data (ganti dengan data JSON kamu nanti) 
const PROJECT: ProjectData = {
  id: "comprende",
  title: "Comprendé",
  category: "Property Management Website",
  year: "2024",
  overview:
    "Comprendé is a full-featured property management platform built for a New Zealand-based real estate agency. The goal was to create a digital experience that felt as refined and trustworthy as the brand itself — balancing rich visual storytelling with practical listing and inquiry workflows.",
  problem:
    "The client was operating with an outdated website that failed to reflect the premium positioning of their brand. Listings were buried under poor navigation, the mobile experience was broken, and the inquiry flow had a significant drop-off rate. Prospective clients couldn't find what they needed, and the team couldn't manage content without a developer.",
  solution:
    "We redesigned the platform from the ground up with a content-first architecture. A custom CMS allowed the team to manage listings, agents, and editorial content independently. The new design language leaned into warm typography and generous white space to communicate reliability without coldness.",
  techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "Vercel"],
  challenges:
    "The biggest engineering challenge was building a real-time listing sync with a third-party property data provider that had an inconsistent API. We implemented a resilient background job system with automatic retries and a local cache layer to ensure the UI never showed stale or broken data — even during sync failures.",
  results:
    "Within 60 days of launch, the client reported a 3× increase in online inquiries and a measurable reduction in time-to-contact for new leads. The internal team now manages all content without developer intervention, cutting operational overhead significantly.",
  gallery: [
    { id: "g1", src: "/images/comprende-1.jpg", alt: "Homepage hero", caption: "Homepage redesign" },
    { id: "g2", src: "/images/comprende-2.jpg", alt: "Listing page", caption: "Property listing view" },
    { id: "g3", src: "/images/comprende-3.jpg", alt: "About page", caption: "About the team" },
    { id: "g4", src: "/images/comprende-4.jpg", alt: "Property detail", caption: "Property detail page" },
    { id: "g5", src: "/images/comprende-5.jpg", alt: "Why sell section", caption: "Why sell with us" },
  ],
};

// ─── Component 
export default function ProjectDetail({ project = PROJECT }: { project?: ProjectData }) {
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

      {/* ── HERO  */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.categoryLabel}>{project.category}</span>

          <h1 className={styles.heroTitle}>{project.title}</h1>

          <div className={styles.heroMeta}>
            <span className={styles.heroDivider} />
            <span className={styles.heroYear}>{project.year}</span>
          </div>
        </div>

        {/* decorative line */}
        <div className={styles.heroBorderBottom} />
      </header>

      {/* ── ARTICLE */}
      <main className={styles.article}>

        {/* Overview */}
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

        {/* Problem & Solution */}
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

        {/* Tech Stack */}
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

        {/* Challenges & Results */}
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

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
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

        {/* Track */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className={styles.galleryImgWrap}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className={styles.galleryImg}
                  draggable={false}
                  onError={(e) => {
                    // fallback placeholder
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* placeholder shown when image missing */}
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

        {/* Dots */}
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