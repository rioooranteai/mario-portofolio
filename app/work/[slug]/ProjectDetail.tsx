"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./project.module.css";

export interface ProjectData {
  slug: string;
  title: string;
  secondaryTitle: string;
  category: string;
  year: string;
  thumbnail: string;
  github?: string;
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

  // Drag to scroll — desktop only
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = e.pageX;
    scrollStart.current = galleryRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !galleryRef.current) return;
    galleryRef.current.scrollLeft =
      scrollStart.current - (e.pageX - dragStart.current);
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

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBtn}
            aria-label="View source on GitHub"
          >
            <span className={styles.githubBtnLabel}>Source</span>
            <span className={styles.githubBtnIconWrap}>
              <GitHubIcon />
            </span>
          </a>
        )}

        <div className={styles.heroBorderBottom} />
      </header>

      {/* ARTICLE */}
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
                <span key={tech} className={styles.techPill}>
                  {tech}
                </span>
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

      {/* GALLERY */}
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
                  <span className={styles.placeholderIdx}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
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

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15"
      fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
