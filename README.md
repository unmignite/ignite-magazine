# IGNITE — React Redesign (Demo)

A working redesign concept for [unmignite.com](https://www.unmignite.com/), built on React so the
design language and publishing workflow are fully under your control — no Wix.

Design direction follows Fasya's creative brief: black & white editorial base, loud League
Spartan typography, Times serif accents, and the Ignite palette
(yellow `#ffed00` · red `#f73630` · pink `#ff10a3` · brat green `#8acd01` · orange `#fc4c00`).

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## What's inside

- **A24-style landing page** — scrolling steps through full-screen featured-article covers
  (click the progress bars to jump, click the title to read).
- **Section pages** for all nine sections, each with its own accent colour.
- **Article pages** — big cover, drop caps, serif pull quotes, credits block, tags, related stories.
- **Role-based Studio (the CMS)** — log in and everything is edited from inside the site:
  - Rich-text editor (TipTap): headings, bold/italic/underline, brand-colour text, font
    switching, pull quotes, lists, alignment, links, images by URL **or** upload, photo credits.
  - Article settings: cover, section, author, date, read time, tags, draft/published status.
  - Dashboard with search, status filters, feature-on-landing toggle, edit/delete.

### Demo accounts (password for both: `ignite2026`)

| Account | Role | Can do |
| --- | --- | --- |
| `chief@unmignite.com` | Editor-in-Chief | everything — edit, delete, feature on landing page |
| `editor@unmignite.com` | Section Editor | write, edit and publish (no delete, no feature) |

## How it's put together

```
src/
  data/seedArticles.js   ← the 14 seeded articles (real Ignite content) + section list
  data/users.js          ← demo accounts + role permission rules
  context/StoreContext.jsx ← articles + auth state, persisted to localStorage
  components/            ← Nav, Ticker, Hero (A24 carousel), ArticleCard, AdminBar, Footer
  pages/                 ← Home, Section, Article, Login, Studio, Editor (TipTap)
  styles/global.css      ← the whole design language: tokens, type, components
```

All content edits persist in your browser's localStorage (use **Reset demo content** in the
Studio to restore the seed articles). This keeps the demo self-contained.

## Taking it to production

The interface is already shaped like a real CMS — swapping the storage layer is the only
structural change:

1. **Backend**: replace the localStorage read/writes in `StoreContext.jsx` with API calls
   (Supabase or Firebase gets you auth + database + image storage with almost no server code).
2. **Auth**: swap the `users.js` lookup for real authentication; the role checks in
   `data/users.js` (`can()`) stay as they are.
3. **Images**: upload to object storage (Supabase Storage / Cloudinary) instead of base64.
   The seed covers currently hotlink to the existing Wix CDN — re-host them before the old
   site is shut down.
4. **Hosting**: `npm run build`, deploy `dist/` to Netlify/Vercel. Add an SPA fallback so
   deep links work (Netlify: `/* /index.html 200` in `_redirects`; Vercel handles it via
   `vercel.json` rewrites).

## Notes

- Fonts are bundled locally (@fontsource), so the site works offline and loads fast.
- `node_modules` inside OneDrive can make syncing sluggish — consider pausing OneDrive sync
  for this folder or moving the project out of OneDrive when it becomes the real codebase.
