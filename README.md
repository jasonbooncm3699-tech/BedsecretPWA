# Bedsecret PWA

Responsive multilingual skincare PWA for Bedsecret, built with Next.js App Router and Supabase-ready architecture.

## Tech stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Supabase JS client
- next-themes for dark mode

## Features in this MVP skeleton

- Public pages: home, products, product details, reviews
- Member pages: login/signup, member info, rewards, claim, referral landing
- Admin page scaffold for products/reviews/referrals management
- EN / MS / TH language routing (`/en`, `/ms`, `/th`)
- WhatsApp order CTA with prefilled product message
- Footer social links (TikTok, Instagram, Facebook, WhatsApp)
- Cookie consent banner (accept/reject)
- PWA setup (manifest + service worker + install prompt support)
- SEO baseline (metadata, sitemap, robots)

## Project structure

- `src/app/[locale]/*` - localized routes
- `src/components/*` - shared UI components
- `src/lib/*` - data, i18n, config, Supabase and helpers
- `public/manifest.webmanifest` and `public/sw.js` - PWA assets

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Fill Supabase keys in `.env.local`.
4. Run development server:
   ```bash
   npm run dev
   ```

## Deployment

- Deploy on Vercel
- Connect custom domain `bedsecret.com` from GoDaddy DNS
- Ensure environment variables are configured in Vercel project settings
