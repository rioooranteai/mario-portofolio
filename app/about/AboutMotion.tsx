"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Motion for the About page, kept to two moments:
 * 1. page load: title rises, eyebrow fades in, divider draws from the left
 * 2. scroll: the experience timeline fills with gold as it is read
 */
export default function AboutMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { motion } = ctx.conditions as Record<string, boolean>;

        if (!motion) {
          gsap.set("[data-about-hero]", { autoAlpha: 1 });
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo("[data-about-hero='title']", { yPercent: 105, autoAlpha: 1 }, { yPercent: 0, duration: 1.1 })
          .fromTo("[data-about-hero='eyebrow']", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.25)
          .fromTo(
            "[data-about-hero='divider']",
            { scaleX: 0, autoAlpha: 1 },
            { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
            0.35,
          );

        gsap.fromTo(
          "[data-about='progress']",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-about='timeline']",
              start: "top 65%",
              end: "bottom 65%",
              scrub: 0.6,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-about='dot']").forEach((dot) => {
          gsap.fromTo(
            dot,
            { backgroundColor: "#0c0c0c", scale: 0.8 },
            {
              backgroundColor: "#d4a843",
              scale: 1,
              duration: 0.35,
              ease: "power2.out",
              scrollTrigger: {
                trigger: dot,
                start: "top 65%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      },
    );

    return () => mm.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
