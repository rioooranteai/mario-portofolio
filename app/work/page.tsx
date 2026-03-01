"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./work.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  tags: string[];
  bg: string;
  accent: string;
  layout: "grid" | "single";
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Building a seamless e-commerce checkout flow.",
    tags: ["UX Design", "Prototyping", "User Testing"],
    bg: "bgPurple",
    accent: "#7c5cbf",
    layout: "grid",
  },
  {
    id: 2,
    title: "Data dashboard for real-time analytics.",
    tags: ["Product Design", "Design System", "Concepting"],
    bg: "bgSlate",
    accent: "#4a90d9",
    layout: "grid",
  },
  {
    id: 3,
    title: "Brand identity & design system for a fintech.",
    tags: ["Branding", "Design System", "UI Design"],
    bg: "bgEarth",
    accent: "#d4a843",
    layout: "single",
  },
  {
    id: 4,
    title: "Mobile app for sustainable daily habits.",
    tags: ["App Design", "User Research", "Motion"],
    bg: "bgForest",
    accent: "#4ade80",
    layout: "grid",
  },
  {
    id: 5,
    title: "Interactive onboarding for a SaaS platform.",
    tags: ["UX Design", "Interaction Design", "Copywriting"],
    bg: "bgNavy",
    accent: "#60a5fa",
    layout: "single",
  },
  {
    id: 6,
    title: "Accessibility-first redesign for a health app.",
    tags: ["Product Design", "A11Y", "User Research"],
    bg: "bgRose",
    accent: "#f87171",
    layout: "grid",
  },
];

function MockupGrid({ accent }: { accent: string }) {
  return (
    <div className={styles.mockupGrid}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={styles.mockBlock}>
          <div className={styles.mockAccent} style={{ background: accent }} />
        </div>
      ))}
    </div>
  );
}

function MockupSingle({ accent }: { accent: string }) {
  return (
    <div className={styles.mockupSingle}>
      <div className={styles.mockBlock} style={{ width: "70%", height: "80%" }}>
        <div className={styles.mockAccent} style={{ background: accent, height: 40 }} />
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <div className={styles.arrowTag} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const delay = index % 2 === 1 ? 0.12 : 0;

    const ctx = gsap.context(() => {
      // Set state awal
      gsap.set(el, { opacity: 0, y: 60, scale: 0.96 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",

        // Scroll ke bawah → card masuk viewport → MUNCUL
        onEnter: () => {
          gsap.to(el, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75, delay,
            ease: "power3.out",
          });
        },

        // Scroll ke atas → card keluar viewport ke bawah → HILANG
        onLeaveBack: () => {
          gsap.to(el, {
            opacity: 0, y: 60, scale: 0.96,
            duration: 0.45,
            ease: "power3.in",
          });
        },

        // Scroll ke atas → card masuk viewport lagi dari atas → MUNCUL
        onEnterBack: () => {
          gsap.to(el, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75,
            ease: "power3.out",
          });
        },

        // Scroll ke bawah → card keluar viewport ke atas → HILANG
        onLeave: () => {
          gsap.to(el, {
            opacity: 0, y: -40, scale: 0.96,
            duration: 0.45,
            ease: "power3.in",
          });
        },
      });
    });

    return () => ctx.revert();
  }, [index]);

  const bgClass = styles[project.bg as keyof typeof styles];

  return (
    <article ref={cardRef} className={styles.card} aria-label={project.title}>
      <div className={`${styles.preview} ${bgClass}`}>
        <div className={styles.previewInner}>
          {project.layout === "grid" ? (
            <MockupGrid accent={project.accent} />
          ) : (
            <MockupSingle accent={project.accent} />
          )}
        </div>
        <ArrowIcon />
      </div>

      <div className={styles.meta}>
        <h2 className={styles.projectTitle}>{project.title}</h2>
        <div className={styles.tags} role="list" aria-label="Project tags">
          {project.tags.map((tag, i) => (
            <span key={tag} role="listitem">
              <span className={styles.tag}>{tag}</span>
              {i < project.tags.length - 1 && (
                <span className={styles.tagSep} aria-hidden="true"> /</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function WorkPage() {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.headerEyebrow}>Portfolio — Selected works</span>
          <div className={styles.headerTitleRow}>
            <h1 className={styles.headerTitle}>Work</h1>
          </div>
        </div>
        <div className={styles.headerDivider} role="separator" />
      </header>

      <section className={styles.grid} aria-label="Portfolio projects">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </section>
    </div>
  );
}