# Qabilat Al-Naim — Ahl Al-Safra 515

Official website project for Qabilat Al-Naim, Ahl Al-Safra 515.

## Official websites

- Vercel: https://qabilat-al-naim.vercel.app
- Cloudflare Pages: https://qabilat-alnaim.pages.dev

Vercel is the primary website.
Cloudflare Pages is the backup deployment.

## Technology

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Static prerendered HTML pages for SEO
- WebP image optimization
- PWA
- Vercel Analytics
- Vercel Speed Insights

## Deployment

Source repository:

qabilatalnaim/qabilat-alnaim

Production branch:

main

Deployments:

1. Vercel
2. Cloudflare Pages

Both deployments use the main branch directly.

The project does not require GitHub Actions for deployment.

## Local development

    npm ci
    npm run dev

## Validation

    npm run tsc
    npm run lint
    npm run build

## Build

    npm run build

The build runs Vite, prerenders the required routes, and cleans optimized image output.

## Project structure

- src/ - application source code
- api/ - Vercel API handlers
- public/ - public assets
- scripts/postbuild.js - static page prerendering
- scripts/clean-dist-images.js - image cleanup
- vercel.json - Vercel configuration
- vite.config.ts - Vite configuration
- package.json - project scripts and dependencies

## SEO

The canonical website is the Vercel deployment.

Cloudflare Pages is a backup deployment and is not the canonical SEO domain.

## License

Copyright 2026 Qabilat Al-Naim. All rights reserved.