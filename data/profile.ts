export const profile = {
  name: "Mario Valerian Rante Ta'dung",
  shortName: "Mario",
  handle: "riooorante",
  role: "AI Engineer & Data Analyst",
  email: "rantetadung.labs@gmail.com",
  location: "Makassar, Indonesia",
  timezone: "WITA (UTC+8)",
  status: "Open to AI/ML and data roles",
  linkedin: "https://www.linkedin.com/in/mario-tadung",
  github: "https://github.com/rioooranteai",
};

/** Opens a new message to the profile email directly in Gmail. */
export const gmailComposeUrl = (subject = "Inquiry from your portfolio") =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email,
  )}&su=${encodeURIComponent(subject)}`;

export const bio = [
  "I'm an AI engineer and data analyst from Makassar, Indonesia, finishing a Bachelor of Information Systems at Universitas Hasanuddin. I'm drawn to problems where the data is messy and the stakes are real: scanned documents that need validating, wildlife photos that need identifying, competitor reports nobody has time to read.",
  "My work sits between research and production. I train computer vision and language models, then ship them behind APIs and interfaces people actually use. At Telkom Indonesia, that meant an LLM-powered document validation platform that cut review time by roughly 85%.",
];

export const facts = [
  { label: "Based in", value: `${profile.location} · ${profile.timezone}` },
  { label: "Focus", value: "Computer vision, LLM & retrieval systems, data analytics" },
  { label: "Status", value: profile.status },
];

export interface Experience {
  role: string;
  org: string;
  place: string;
  period: string;
  points: string[];
}

export const experiences: Experience[] = [
  {
    role: "Software Engineer Intern",
    org: "OPPO Indonesia Manufacturing",
    place: "Tangerang, Indonesia",
    period: "May 2026 — Aug 2026",
    points: [
      "Built PEmini, an AI assistant the Product Engineering department still uses. I cleaned 200+ problem reports from a shared Excel template into PostgreSQL and ChromaDB, then a Qwen3.5 router sends each question to NL2SQL (Qwen2.5-Coder-14B, SELECT only, with up to three retries for blocked or failing queries), to semantic search (BGE-M3 and a reranker), or to both, with every model running locally on Ollama.",
      "Built Material Tracker, an internal app now used on almost every production line through to the warehouse. Every NG incoming material gets a QR code when it is found, each of four departments re-judges it with one scan and a few taps, the next department is alerted automatically through the company's chat app, and a mobile version captures photos for the cases that need one (Next.js, TypeScript, FastAPI, PostgreSQL).",
    ],
  },
  {
    role: "AI Engineer Intern",
    org: "Telkom Indonesia",
    place: "Balikpapan, Indonesia",
    period: "Aug 2025 — Jan 2026",
    points: [
      "Built and deployed komo.ai, a Laravel platform where users confirm AI-extracted fields before automated cross-document checks highlight discrepancies on the source files. Review time per ticket dropped by ~85%, from 3–4 hours to ~30 minutes.",
      "Designed a two-stage LLM validation pipeline (LangChain, OpenAI, chain-of-thought and few-shot prompting) covering 20+ document types, plus the labeling protocols behind it.",
      "Benchmarked PaddleOCR and EasyOCR against Azure Document Intelligence under CPU-only constraints and chose Azure DI for 10–20× faster processing and better accuracy on degraded scans.",
    ],
  },
  {
    role: "Machine Learning Cohort",
    org: "Coding Camp powered by DBS Foundation",
    place: "Remote",
    period: "Feb 2025 — Jul 2025",
    points: [
      "Led a team of six building Safana, an AI system for detecting endangered Indonesian wildlife, coordinating ML, frontend and backend work.",
      "Trained a RetinaNet (ResNet-50) detector for 11 species on a custom 8,000+ image dataset, reaching 89% AP@50.",
      "Deployed it on Azure with a FastAPI backend and tested it in the field with 20 elementary school students during community service (KKN).",
    ],
  },
];

export const education = {
  school: "Universitas Hasanuddin",
  degree: "Bachelor of Information Systems",
  period: "2022 — 2026",
  gpa: "3.96 / 4.00",
  courses: [
    "Machine Learning",
    "Deep Learning",
    "Data Mining",
    "Business Intelligence",
    "Data Visualization",
    "Big Data",
    "Statistics & Probability",
  ],
};

export const achievements: { year?: string; title: string; detail: string }[] = [
  { year: "2024", title: "Finalist — Gemastik 17", detail: "National ICT competition by the Ministry of Education; top 10 of 600+ university teams." },
  { year: "2024", title: "Finalist — Compfest 2024", detail: "AI Innovation Challenge division." },
  { year: "2023", title: "Finalist — Gemastik 16", detail: "National ICT competition by the Ministry of Education." },
];

export const skills = [
  { group: "Programming & Development", items: ["Python", "SQL", "Git", "FastAPI", "REST APIs"] },
  { group: "Machine & Deep Learning", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-Learn"] },
  { group: "NLP & LLM", items: ["Transformers", "LangChain", "LangGraph", "Unsloth", "Prompt Engineering"] },
  { group: "Computer Vision", items: ["Ultralytics YOLO", "OpenCV", "Roboflow", "PaddleOCR"] },
  { group: "Data & BI", items: ["Power BI", "DAX", "Power Query"] },
  { group: "Cloud & MLOps", items: ["Microsoft Azure", "GCP", "Docker", "GitHub Actions CI/CD"] },
];
