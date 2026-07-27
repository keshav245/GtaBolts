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

## Phase 2 additions

- `lib/mods-data.ts` — shared mock catalog (6 mods). Replace `getAllMods`, `getModBySlug`, `getModsByCategory` with real Supabase queries later; every page below keeps working as long as the function signatures stay the same.
- `/browse` — client-side search, category filter, price slider, sort (popular/newest/price). Empty state with reset CTA.
- `/category/:slug` — static per-category page (`generateStaticParams` pre-renders all 4 categories).
- `/mod/:slug` — split-screen: `MediaGallery` (thumbnail selector) on the left, sticky `PurchasePanel` (price, Buy Now, view/download/rating stats) on the right, description + `Changelog` below.
- `EmptyState` — reusable illustrated empty state with optional CTA.

The `PurchasePanel`'s `handleBuyNow` is a stub (`setTimeout`) — wire it to your Razorpay order-creation server action next.

## Phase 3 additions

- `/auth` — sign in / sign up tab toggle, Google OAuth button, email/password form, forgot-password link. `AuthForm.tsx` has `TODO` comments marking exactly where `supabase.auth.signInWithOAuth` / `signInWithPassword` / `signUp` calls go.
- `/library` — owned mods grid (`OwnedModCard` with a Download button) + download history table. Currently reads from `lib/library-data.ts` mock data; the page has a `TODO` comment for adding the auth guard (middleware or `supabase.auth.getUser()` redirect) and swapping in a real Supabase query scoped to the signed-in user.
- Both pages are pure UI — no session state is created yet, so `/library` is not actually protected until you wire the auth check back in.

## Phase 4 additions

- `/dashboard` (Employee console) — sidebar layout (`components/dashboard/Sidebar.tsx`), stat cards with inline SVG sparklines (no chart library dependency), and a mods data table with inline publish/unpublish and delete-draft actions.
- `/dashboard/upload` — mod upload form: title (auto-slugifies), slug (editable), description, price, category, a screenshot multi-upload grid with previews, and a drag-and-drop mod-file dropzone with an animated circular progress ring.
- `lib/dashboard-data.ts` — mock employee mods + sparkline series. Swap `EMPLOYEE_MODS` for a real query scoped to `auth.uid()`, and wire the `TODO` comments in `ModsTable.tsx` (publish/unpublish/delete) and `upload/page.tsx` (R2 upload + insert mod row) to real server actions.
- `UploadDropzone`'s progress is simulated with `setInterval` — swap for real upload progress via `XMLHttpRequest.upload.onprogress` when you wire it to R2 (plain `fetch` doesn't expose upload progress).

## Phase 5 additions — `/admin` (Owner console), final phase

- `components/ui/ToastProvider.tsx` — toast context + `useToast()` hook, now wrapping the whole app in `app/layout.tsx`. Each toast carries a severity (`success`/`error`/`warning`/`info`) with its own icon and color, auto-dismisses after 4s, animates in/out with Framer Motion.
- `/admin` — revenue overview: stat cards + top-mods and top-employees leaderboards.
- `/admin/roles` — command-palette-style role grant (email + role select), and a chip list of current role holders with a revoke-on-click `X`. `RoleCommandPalette.tsx` returns a structured `{ ok, code, message }` result from its stub functions and maps each `code` to the right toast severity — including `user_not_found`, handled gracefully as "role will apply once they sign up" rather than an error.
- `/admin/moderation` — platform-wide mods table (not just one employee's), with status filter tabs and approve/unpublish/delete actions.
- `/admin/employees` — per-employee audit: upload count, sales, revenue, expandable activity log.
- `/admin/users` — searchable user directory with expandable purchase history per user.
- All mock data lives in `lib/admin-data.ts` — swap `PLATFORM_USERS`, `PLATFORM_MODS`, `EMPLOYEE_AUDITS` for real Supabase queries (all should go through `private.has_role(auth.uid(), 'owner')`-gated RLS).

## Phase 6 — Supabase backend + real auth wiring

- `supabase/migrations/0001_init.sql` — run this in the Supabase SQL Editor. Creates `user_roles` (+ `app_role` enum), the `private.has_role()` security-definer function, `profiles`, `mods`, `purchases`, all RLS policies, and a trigger that auto-creates a profile + default `user` role on signup. Includes a commented-out final step to make yourself the first `owner` — uncomment and run it after you've signed up once.
- `lib/supabase/client.ts` — browser client, for Client Components.
- `lib/supabase/server.ts` — server client (reads/writes the auth cookie), for Server Components/Route Handlers/Server Actions. Also exports `getUser()`.
- `lib/supabase/admin.ts` — service-role client. Only ever `await import('@/lib/supabase/admin')` inside a server action/route handler, never at module top-level, per the spec's security model.
- `middleware.ts` — refreshes the auth session on every request so Server Components always see a valid user.
- `app/auth/callback/route.ts` — exchanges the OAuth/email-confirmation code for a session, then redirects.
- `components/auth/AuthForm.tsx` — now calls real `supabase.auth.signInWithOAuth` (Google), `signInWithPassword`, and `signUp` instead of stubs.
- `lib/auth-guards.ts` — `requireUser()` and `requireRole('employee' | 'owner')`, now actually applied in `app/library/page.tsx`, `app/dashboard/layout.tsx`, and `app/admin/layout.tsx`. `/dashboard` requires employee-or-owner, `/admin` requires owner-only, `/library` requires any signed-in user — no more `TODO` comments on these three.
- `.env.example` — copy to `.env.local`, fill in your real Supabase URL/keys (get these from Project Settings → API after creating your project).

### To finish this phase yourself
1. Create the Supabase project, run the migration SQL.
2. Add the three `NEXT_PUBLIC_SUPABASE_*`/`SUPABASE_SERVICE_ROLE_KEY` env vars locally (`.env.local`) and in Vercel.
3. (Optional) enable Google as an auth provider in Supabase, with a Google Cloud OAuth client.
4. Deploy, sign up once through `/auth` on your live site, then run the commented `insert` at the bottom of the migration file (with your email) to make yourself `owner`.
5. `/dashboard`, `/admin`, and `/library` will now actually redirect unauthorized visitors instead of just rendering.

Still mock/stubbed: the actual mod data shown on these pages (still from `lib/mods-data.ts`, `lib/dashboard-data.ts`, `lib/admin-data.ts`), the Buy Now button, the download-link fetch, and the mod-upload submission. Those get wired in the R2 and Razorpay/Cashfree phases next.

## Phase 7 — R2 storage + Razorpay payments

### R2 (mod file + screenshot storage)
- `lib/r2.ts` — S3-compatible client configured against your Cloudflare R2 endpoint.
- `app/api/uploads/presign/route.ts` — employee/owner-only endpoint that mints a short-lived presigned `PUT` URL for a mod file or screenshot.
- `app/api/library/download/route.ts` — checks for a **completed** purchase row before minting a 5-minute presigned `GET` URL. This is the actual access gate — no purchase, no link, regardless of what the UI shows.
- `lib/upload-client.ts` — `uploadToR2()`, used by both the dropzone and the screenshot grid; uses `XMLHttpRequest` (not `fetch`) specifically so real upload progress is available.
- `UploadDropzone.tsx` and `app/dashboard/upload/page.tsx` now upload for real and show true progress on the ring — no more simulated `setInterval`.
- `app/dashboard/upload/actions.ts` — server action that inserts the `mods` row once files are uploaded and keys are known.
- `OwnedModCard.tsx`'s Download button now calls the real presigned-download endpoint.

### Razorpay (checkout + webhook)
- `app/api/checkout/create-order/route.ts` — creates a Razorpay order for a published mod and upserts a `pending` purchase row tied to it. Blocks re-purchase if you already own the mod.
- `app/api/webhooks/razorpay/route.ts` — verifies the webhook signature with `crypto.timingSafeEqual` (never a plain `===` on a signature), then on `payment.captured` flips the purchase to `completed` using `supabaseAdmin` (dynamic-imported, since a webhook has no user session to run under normal RLS).
- `components/mod/PurchasePanel.tsx` — loads Razorpay's checkout script, creates the order, opens the payment modal, and redirects to `/library` on success (the webhook is still the actual source of truth for access).
- `supabase/migrations/0002_purchases_update_policy.sql` — **run this too**. Adds the one RLS policy needed so a user can attach their own order ID to their own still-pending purchase row (completion itself only ever happens via the webhook's service-role client, so this can't be abused to self-grant access).

### To finish this phase yourself
1. Create the R2 bucket + API token, add the four `R2_*` env vars.
2. Get Razorpay test API keys, add `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
3. Once deployed, add the webhook URL in Razorpay's dashboard pointing at `/api/webhooks/razorpay`, copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`.
4. Run `0002_purchases_update_policy.sql` in the Supabase SQL Editor.
5. Test end-to-end with a Razorpay **test card** (available in their docs) before going live — switch to live keys only once that works.

### What's still mock
`/`, `/browse`, `/category/:slug` still read from `lib/mods-data.ts` rather than the real `mods` table, and view counters aren't incremented yet. Swapping those three list/detail queries for real Supabase reads is the last remaining piece — everything else (auth, uploads, downloads, payments, moderation, roles) is now real.

Backend logic (Supabase RLS, `private.has_role()`, Razorpay webhook, R2 presigned URLs) is untouched — this is UI only.
