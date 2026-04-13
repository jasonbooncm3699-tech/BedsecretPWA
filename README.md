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

## Supabase Phase 2 setup (Auth + Referral + Rewards)

### 1) Run SQL migration in Supabase

In Supabase Dashboard -> SQL Editor, run:

`supabase/migrations/2026041301_phase2_member_rewards.sql`

This creates:
- `member_profiles`
- `referrals`
- `reward_settings`
- `reward_vouchers`
- RLS policies and helper function `get_referrer_by_code`

### 2) Configure Supabase Auth providers

In Supabase -> Authentication -> Providers:
- Enable Google
- Enable Facebook
- (Optional) Email is already used for magic link flow

Set callback / redirect URLs:
- `https://www.bedsecret.com/en/member`
- `https://www.bedsecret.com/ms/member`
- `https://www.bedsecret.com/th/member`
- `http://localhost:3000/en/member` (local testing)
- `http://localhost:3000/ms/member`
- `http://localhost:3000/th/member`

### 3) Add environment variables (Vercel + local)

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional for middleware/server expansions later:
- `SUPABASE_SERVICE_ROLE_KEY`

### 4) Phase 2 behavior now implemented

- Social/email login via Supabase
- Auto-create member profile on first login with unique referral code
- Supports referral capture from `?ref=CODE` links
- Member profile save form persists to Supabase
- Rewards page now reads live counts + claimable value from Supabase tables
- Claim page issues or reuses active voucher codes from Supabase
