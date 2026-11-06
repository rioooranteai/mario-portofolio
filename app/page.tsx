"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import styles from "./page.module.css";
import projects from "@/data/projects.json";
import { asset } from "@/lib/asset";
import SiteFooter from "@/components/SiteFooter";
import { gmailComposeUrl } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Each phrase is "detected" like an object: a class label and a final confidence. */
const DETECTIONS = [
  { text: "computer vision systems", label: "vision", conf: 0.97 },
  { text: "LLM pipelines", label: "llm", conf: 0.94 },
  { text: "retrieval systems", label: "retrieval", conf: 0.91 },
  { text: "data dashboards", label: "analytics", conf: 0.96 },
];

const FEATURED = ["safana", "argos", "leafscan"];

const AREAS = [
  {
    name: "Computer vision",
    text: "Detection and OCR models trained on custom datasets, then shipped behind an API someone can actually use. Face liveness is in progress.",
    projects: ["safana", "leafscan", "veriface"],
  },
  {
    name: "Language & retrieval",
    text: "LLM pipelines, RAG and NL-to-SQL that answer questions from documents without making the numbers up.",
    projects: ["argos", "valemart", "pemini", "pocketly"],
  },
  {
    name: "Data & analytics",
    text: "Dashboards and models that explain why a number moved and who should act on it.",
    projects: ["ibm-hr-attrition-dashboard"],
  },
  {
    name: "Software & apps",
    text: "Web and mobile apps built around how people actually work, from QR-driven workflows on a factory floor to an Android app on live APIs.",
    projects: ["material-tracker", "cosmic-chronicle"],
  },
];

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const confRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: REDUCED_MOTION,
        desktop: "(min-width: 768px)",
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as Record<string, boolean>;

        if (!motion) {
          gsap.set("[data-hero]", { autoAlpha: 1 });
          return;
        }

        // One orchestrated page-load sequence
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo("[data-hero='name']", { yPercent: 105, autoAlpha: 1 }, { yPercent: 0, duration: 1.15 })
          .fromTo(
            "[data-hero='item']",
            { y: 28, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
            "-=0.6",
          );

        // One scroll moment: 3–4 hours gets struck out, 30 minutes rises in
        gsap
          .timeline({
            scrollTrigger: desktop
              ? { trigger: "[data-impact='section']", start: "top top", end: "+=120%", pin: true, scrub: 0.7 }
              : { trigger: "[data-impact='section']", start: "top 65%", end: "bottom 70%", scrub: 0.7 },
          })
          .fromTo("[data-impact='strike']", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 })
          .fromTo(
            "[data-impact='before']",
            { color: "rgba(244, 242, 238, 0.92)" },
            { color: "rgba(244, 242, 238, 0.28)", ease: "none", duration: 1 },
            0,
          )
          .fromTo("[data-impact='after']", { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.8 }, 0.75)
          .fromTo("[data-impact='caption']", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.25);

        // Detection box: acquire, type the phrase while confidence climbs, hold, release
        const box = boxRef.current;
        const tag = tagRef.current;
        const labelEl = labelRef.current;
        const confEl = confRef.current;
        const textEl = textRef.current;

        if (box && tag && labelEl && confEl && textEl) {
          const write = (n: number, phrase: string) => {
            textEl.textContent = n > 0 ? phrase.slice(0, n) : "\u00a0";
          };
          const hidden = "rgba(212, 168, 67, 0)";
          const shown = "rgba(212, 168, 67, 1)";
          const detect = gsap.timeline({ repeat: -1, delay: 1.5 });

          DETECTIONS.forEach((d) => {
            const state = { n: 0, c: 0 };
            const typeTime = d.text.length * 0.07;

            detect
              .call(() => {
                labelEl.textContent = d.label;
                confEl.textContent = "0.00";
                write(0, d.text);
              })
              .fromTo(
                box,
                { borderColor: hidden, scale: 1.06 },
                { borderColor: shown, scale: 1, duration: 0.45, ease: "power3.out" },
              )
              .fromTo(tag, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, "<0.1")
              .to(state, {
                n: d.text.length,
                duration: typeTime,
                ease: "none",
                onUpdate: () => write(Math.round(state.n), d.text),
              }, "<")
              .to(state, {
                c: d.conf,
                duration: typeTime + 0.3,
                ease: "power2.out",
                onUpdate: () => {
                  confEl.textContent = state.c.toFixed(2);
                },
              }, "<")
              .to({}, { duration: 2.2 })
              .to(state, {
                n: 0,
                c: 0,
                duration: d.text.length * 0.035,
                ease: "none",
                onUpdate: () => {
                  write(Math.round(state.n), d.text);
                  confEl.textContent = state.c.toFixed(2);
                },
              })
              .to(tag, { autoAlpha: 0, duration: 0.2 }, ">-0.15")
              .to(box, { borderColor: hidden, duration: 0.2 }, "<")
              .to({}, { duration: 0.25 });
          });
        }

        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      },
    );

    return () => mm.revert();
  }, []);

  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
  const featured = FEATURED.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is (typeof projects)[number] => Boolean(p),
  );

  return (
    <div ref={rootRef} className={styles.page}>
      <noscript>
        <style>{"[data-hero]{visibility:visible!important}"}</style>
      </noscript>
      <main>
        <section className={styles.hero}>
          <h1 className={styles.name}>
            <span className={styles.nameLine} data-hero="name">Mario Rante.</span>
          </h1>

          <p className={styles.build} data-hero="item">
            <span className={styles.srOnly}>
              I build computer vision systems, LLM pipelines, retrieval systems and data dashboards.
            </span>
            <span aria-hidden="true" className={styles.buildVisual}>
              <span className={styles.buildLead}>I build</span>{" "}
              <span ref={boxRef} className={styles.detect}>
                <span ref={tagRef} className={styles.detectTag}>
                  <span ref={labelRef}>{DETECTIONS[0].label}</span>{" "}
                  <span ref={confRef}>{DETECTIONS[0].conf.toFixed(2)}</span>
                </span>
                <span ref={textRef} className={styles.detectText}>
                  {DETECTIONS[0].text}
                </span>
                <span className={styles.cursor} />
              </span>
            </span>
          </p>

          <p className={styles.intro} data-hero="item">
            AI engineer and data analyst based in Makassar. Most recently a software
            engineer intern at OPPO, and before that an AI engineer intern at Telkom
            Indonesia.
          </p>

          <div className={styles.actions} data-hero="item">
            <Link href="/work" className={styles.btnPrimary}>
              View my work
            </Link>
            <a
              href={gmailComposeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              Email me
            </a>
          </div>
        </section>

        <section className={styles.selected} aria-labelledby="selected-work">
          <div className={styles.selectedHead}>
            <h2 id="selected-work" className={styles.sectionTitle}>Selected work</h2>
            <Link href="/work" className={styles.textLink}>
              All projects
            </Link>
          </div>

          <ul className={styles.projects}>
            {featured.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className={styles.project}>
                  <span className={styles.thumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(p.thumbnail)} alt="" loading="lazy" draggable={false} />
                  </span>
                  <span className={styles.projectName}>{p.title}</span>
                  <span className={styles.projectMeta}>
                    {p.category}, {p.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.impact} data-impact="section" aria-labelledby="impact-lead">
          <p id="impact-lead" className={styles.impactLead}>
            At Telkom Indonesia, checking a single document ticket by hand took
          </p>
          <p className={styles.impactFigures}>
            <span className={styles.before} data-impact="before">
              3–4 hours
              <span className={styles.strike} data-impact="strike" aria-hidden="true" />
            </span>
            <span className={styles.afterMask}>
              <span className={styles.after} data-impact="after">
                <span className={styles.srOnly}>now </span>about 30 minutes
              </span>
            </span>
          </p>
          <p className={styles.impactCaption} data-impact="caption">
            That changed with komo.ai, the LLM document checker I designed and shipped
            during my internship. The same team now spends minutes, not hours, on each
            ticket.
          </p>
        </section>

        <section className={styles.areas} aria-labelledby="areas-title">
          <h2 id="areas-title" className={styles.sectionTitle}>What I work on</h2>
          <ul className={styles.areaList}>
            {AREAS.map((area) => (
              <li key={area.name} className={styles.area}>
                <h3 className={styles.areaName}>{area.name}</h3>
                <p className={styles.areaText}>{area.text}</p>
                <ul className={styles.areaProjects} aria-label={`${area.name} projects`}>
                  {area.projects.map((slug) => {
                    const p = bySlug(slug);
                    if (!p) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/work/${slug}`} className={styles.areaLink}>
                          {p.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
