# GtaMods

Redesigned presentation layer — dark cyberpunk/gamer marketplace UI. Phase 1: Landing page + shared design system.

## Setup

1. Unzip this into a new folder.
2. Push it to a new GitHub repo:
   - Create a repo on GitHub named `gtamods` (don't initialize with a README).
   - On your machine (or via GitHub Desktop), add this folder as the repo and push to `main`.
   - If you don't want to use git commands: on the empty repo page, use **Add file → Upload files**, then drag the entire unzipped folder contents in and commit.
3. Add a placeholder image: drop any 16:9 image into `public/placeholder-mod.jpg` (used by the mod cards until real R2 thumbnails are wired in).
4. Deploy on Vercel:
   - vercel.com → **Add New → Project** → Import this repo.
   - Framework preset auto-detects **Next.js**. Deploy.

## What's included

- Design system: Tailwind config (colors, glow shadows, animations), Space Grotesk / Inter / JetBrains Mono fonts, glass + reticle-lock hover utilities in `app/globals.css`.
- Shared layout: `Navbar`, `BottomNav` (mobile), `Footer`.
- Shared UI: `GlassCard`, `NeonButton`.
- Landing page (`/`): `Hero` (animated mesh gradient), `PurchaseTicker` (mock data — swap for a real Supabase query later), `FeaturedCarousel` (3D tilt cards), `CategoryGrid`.
- `ModCard` component used across landing/browse/category pages.

## Next phases (ask Claude to continue)

- `/browse` — full catalog, search, filter, sort
- `/category/:slug`
- `/mod/:slug` — split-screen detail + sticky purchase panel
- `/auth`
- `/library`
- `/dashboard` (Employee)
- `/admin` (Owner)

Backend logic (Supabase RLS, `private.has_role()`, Razorpay webhook, R2 presigned URLs) is untouched — this is UI only.
