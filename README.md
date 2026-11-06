# riooorante — Portfolio

Personal portfolio site built with Next.js (App Router), React 19, GSAP and Tailwind CSS, exported as a static site and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000/mario-portofolio (the site uses a `basePath`).

## Adding a project

All project content lives in `data/projects.json`. Add an entry with a unique `slug`, then put its images in `public/images/projects/<slug>/`. Image paths in the JSON start at `/images/...`; the base path is added automatically by `lib/asset.ts`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages.
