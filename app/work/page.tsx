"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./work.module.css";
import projects from "@/data/projects.json";

gsap.registerPlugin(ScrollTrigger);

// Shape yang diambil dari projects.json — hanya yang dibutuhkan card
interface ProjectCard {
  slug: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  techStack: string[];
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

function ProjectCard({ project, index }: { project: ProjectCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const delay = index % 2 === 1 ? 0.12 : 0;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 60, scale: 0.96 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.75, delay, ease: "power3.out" });
        },
        onLeaveBack: () => {
          gsap.to(el, { opacity: 0, y: 60, scale: 0.96, duration: 0.45, ease: "power3.in" });
        },
        onEnterBack: () => {
          gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" });
        },
        onLeave: () => {
          gsap.to(el, { opacity: 0, y: -40, scale: 0.96, duration: 0.45, ease: "power3.in" });
        },
      });
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <Link href={`/work/${project.slug}`} className={styles.cardLink}>
      <article ref={cardRef} className={styles.card} aria-label={project.title}>

        {/* Thumbnail */}
        <div className={styles.preview}>
          <div className={styles.previewInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.thumbnail}
              alt={project.title}
              className={styles.thumbnailImg}
              draggable={false}
            />
          </div>
          <ArrowIcon />
          <span className={styles.yearBadge}>{project.year}</span>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
          <p className={styles.projectDesc}>{project.category}</p>
          <div className={styles.tags} role="list" aria-label="Tech stack">
            {project.techStack.map((tech, i) => (
              <span key={tech} role="listitem">
                <span className={styles.tag}>{tech}</span>
                {i < project.techStack.length - 1 && (
                  <span className={styles.tagSep} aria-hidden="true"> /</span>
                )}
              </span>
            ))}
          </div>
        </div>

      </article>
    </Link>
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
        {(projects as ProjectCard[]).map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </section>
    </div>
  );
}