import type { Metadata } from "next";
import styles from "./about.module.css";
import AboutMotion from "./AboutMotion";
import SiteFooter from "@/components/SiteFooter";
import {
  profile,
  bio,
  facts,
  experiences,
  education,
  achievements,
  skills,
} from "@/data/profile";

export const metadata: Metadata = {
  title: "About — riooorante",
  description: `${profile.name}, ${profile.role} based in ${profile.location}.`,
};

function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span className={styles.labelIndex}>{index}</span>
      <span className={styles.labelText}>{text}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <AboutMotion>
      <div className={styles.wrap}>
        <noscript>
          <style>{"[data-about-hero]{visibility:visible!important}"}</style>
        </noscript>
        <header className={styles.header}>
          <span className={styles.eyebrow} data-about-hero="eyebrow">About — {profile.name}</span>
          <h1 className={styles.title}>
            <span className={styles.titleLine} data-about-hero="title">About</span>
          </h1>
          <div className={styles.divider} role="separator" data-about-hero="divider" />
        </header>

        <main className={styles.article}>
          {/* 01 Profile */}
          <section className={styles.section}>
            <SectionLabel index="01" text="Profile" />
            <div className={styles.sectionBody}>
              {bio.map((p, i) => (
                <p key={i} className={i === 0 ? styles.leadText : styles.bodyText}>
                  {p}
                </p>
              ))}
              <dl className={styles.facts}>
                {facts.map((f) => (
                  <div key={f.label} className={styles.fact}>
                    <dt className={styles.factLabel}>{f.label}</dt>
                    <dd className={styles.factValue}>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <div className={styles.sectionDivider} />

          {/* 02 Experience */}
          <section className={styles.section}>
            <SectionLabel index="02" text="Experience" />
            <div className={styles.timelineWrap} data-about="timeline">
              <span className={styles.track} aria-hidden="true">
                <span className={styles.trackProgress} data-about="progress" />
              </span>
              <ol className={styles.timeline}>
                {experiences.map((exp) => (
                  <li key={`${exp.org}-${exp.period}`} className={styles.timelineItem}>
                    <span className={styles.dot} data-about="dot" aria-hidden="true" />
                    <div className={styles.timelineHead}>
                      <h2 className={styles.itemTitle}>{exp.role}</h2>
                      <span className={styles.itemPeriod}>{exp.period}</span>
                    </div>
                    <p className={styles.itemOrg}>
                      {exp.org} <span className={styles.itemSep}>·</span> {exp.place}
                    </p>
                    {exp.points.length > 0 && (
                      <ul className={styles.points}>
                        {exp.points.map((pt, i) => (
                          <li key={i} className={styles.point}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <div className={styles.sectionDivider} />

          {/* 03 Education */}
          <section className={styles.section}>
            <SectionLabel index="03" text="Education" />
            <div className={styles.sectionBody}>
              <div className={styles.timelineHead}>
                <h2 className={styles.itemTitle}>{education.school}</h2>
                <span className={styles.itemPeriod}>{education.period}</span>
              </div>
              <p className={styles.itemOrg}>
                {education.degree} <span className={styles.itemSep}>·</span> GPA {education.gpa}
              </p>
              <p className={styles.subHeading}>Relevant coursework</p>
              <div className={styles.pills}>
                {education.courses.map((c) => (
                  <span key={c} className={styles.pill}>{c}</span>
                ))}
              </div>
            </div>
          </section>

          <div className={styles.sectionDivider} />

          {/* 04 Achievements */}
          <section className={styles.section}>
            <SectionLabel index="04" text="Achievements" />
            <ul className={styles.achievements}>
              {achievements.map((a) => (
                <li key={a.title} className={styles.achievement}>
                  <span className={styles.achYear}>{a.year ?? ""}</span>
                  <div>
                    <h2 className={styles.achTitle}>{a.title}</h2>
                    <p className={styles.bodyText}>{a.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className={styles.sectionDivider} />

          {/* 05 Skills */}
          <section className={styles.section}>
            <SectionLabel index="05" text="Skills" />
            <div className={styles.skillGrid}>
              {skills.map((s) => (
                <div key={s.group} className={styles.skillGroup}>
                  <h2 className={styles.colHeading}>{s.group}</h2>
                  <div className={styles.pills}>
                    {s.items.map((item) => (
                      <span key={item} className={styles.pill}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </AboutMotion>
  );
}
