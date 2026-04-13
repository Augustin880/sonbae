# Sonbae Teachers Intranet

Static GitHub Pages demo built with Vite, React, TypeScript, TailwindCSS, React Router, ESLint, Prettier, and Vitest.

The current app reads local JSON through a repository interface. The same dependency injection boundary can later switch to API-backed repositories, auth providers, analytics, database-backed services, and cloud hosting.

## Setup

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

## GitHub Pages Deployment

This project supports GitHub Pages with Vite's `base` configured for the `sonbae` repository during GitHub Actions builds.

Option 1, GitHub Actions:

1. Push the repository to GitHub.
2. In GitHub, open Settings > Pages.
3. Set Source to GitHub Actions.
4. Push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist`.

Option 2, `gh-pages` package:

```bash
npm run deploy
```

If the repository name changes, update `repositoryName` in `vite.config.ts` or set `VITE_BASE_PATH=/your-repo-name/`.
