# IGNITE Website — Master Handover Document

> The living manual for the IGNITE React website: how it works, where everything lives,
> how to change it, and what still needs to be built. If you are inheriting this site,
> read this top to bottom once — it's written for you.
>
> **Status: proof-of-concept.** The site is fully functional as a demo, but the storage
> layer (real database + logins) is not built yet. Sections marked **⬜ TBD** are waiting
> to be filled in as those decisions get made.

| Quick facts | |
| --- | --- |
| Live demo | https://unmignite.github.io/ignite-magazine/ |
| Repository | https://github.com/unmignite/ignite-magazine |
| Stack | React 18 + Vite, React Router, TipTap editor, plain CSS |
| Hosting | GitHub Pages, auto-deployed by GitHub Actions on every push to `main` |
| Backend | None yet — content persists in each browser's localStorage (POC) |
| Maintainer (current) | Dhiren — Web Manager |
| Maintainer (next) | ⬜ TBD |

---

## 1. Accounts & ownership

### 1.1 GitHub account

The site lives on the **official IGNITE GitHub account** (`unmignite`), not a personal one,
so it survives committee handovers. Web managers are added as **collaborators** with their
own personal accounts — they can push code (which deploys the site) without ever needing
the IGNITE account password.

> | | |
> | --- | --- |
> | IGNITE GitHub handle | `unmignite` |
> | Repository | https://github.com/unmignite/ignite-magazine |
> | Live URL | https://unmignite.github.io/ignite-magazine/ |
> | Account email | ⬜ TBD — the official IGNITE address |
> | Password / 2FA recovery | ⬜ TBD — where is it stored? (committee password manager?) |

**The repo must stay public.** GitHub Pages only publishes from private repositories on
paid plans, and the published website is public either way — a private repo would hide the
source without hiding the site. See section 9 for what this means for secrets.

**Adding the next web manager:** from the IGNITE account, *Settings → Collaborators →
Add people* → their personal GitHub username. Remove departing members the same way.

**Owner-only actions.** Collaborators can push, but a few things require logging in as
`unmignite`: enabling Pages, adding/removing collaborators, changing repo settings, and
setting a custom domain.

**If the repo is ever renamed**, the live URL changes with it, and `DEPLOY_BASE` in
`.github/workflows/deploy.yml` must be updated to match the new `/repo-name/`.

### 1.2 Domain (when we go live for real)

The real site should live at **unmignite.com**, which is currently attached to the Wix
subscription. Before cancelling Wix, **transfer the domain out** to a registrar
(Namecheap / Cloudflare / etc.) — do not let the subscription lapse first, or the domain
can be lost. Renewal is roughly RM60–90/year and is the only unavoidable running cost.

> **⬜ TBD:** registrar account details, renewal date, who pays.

Custom domain setup on GitHub Pages (when ready): repo *Settings → Pages → Custom domain*,
plus a CNAME record at the registrar pointing `www` to `unmignite.github.io`.
Note: with a custom domain the site is served from the domain root, so `DEPLOY_BASE`
in the workflow must change from `/ignite-magazine/` to `/`.

### 1.3 Editor accounts (demo)

Logins are currently hard-coded demo accounts in `src/data/users.js`:

| Email | Role | Can |
| --- | --- | --- |
| `chief@unmignite.com` | Editor-in-Chief (admin) | everything: edit, delete, feature on landing page |
| `editor@unmignite.com` | Section Editor | write, edit, publish — no delete, no feature |

Password for both: `ignite2026`. These are placeholders — real authentication arrives with
the storage layer (section 7).

---

## 2. Running the site locally

You need [Node.js](https://nodejs.org) 18 or newer (LTS is fine). Then:

```bash
git clone https://github.com/unmignite/ignite-magazine.git
cd ignite-magazine
npm install        # once, ~1 minute
npm run dev        # dev server at http://localhost:5173
```

Changes to any file hot-reload instantly in the browser. Other commands:

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

You never deploy manually — see section 6.

---

## 3. Map of the repository

```
ignite-magazine/
├── index.html                  page shell: <title>, favicon, meta description
├── vite.config.js              build config (DEPLOY_BASE base-path logic lives here)
├── package.json                dependencies & the npm scripts above
├── .github/workflows/deploy.yml   auto-deploy pipeline (section 6)
├── HANDOVER.md                 this document
└── src/
    ├── main.jsx                entry point; loads fonts + global.css, mounts the app
    ├── App.jsx                 routes, page shell (nav/footer), login-protected routes
    ├── styles/
    │   └── global.css          THE DESIGN LANGUAGE — every colour, font and component
    │                           style on the site lives in this one file
    ├── data/
    │   ├── seedArticles.js     the seeded articles + the list of sections/categories
    │   └── users.js            demo accounts + role permission rules (can())
    ├── context/
    │   └── StoreContext.jsx    all state: articles + login session, saved to
    │                           localStorage — THIS is the file the future backend replaces
    ├── components/
    │   ├── Nav.jsx             top bar + mobile menu (which sections appear is set here)
    │   ├── Hero.jsx            A24-style landing carousel (timing: SLIDE_MS constant)
    │   ├── ArticleCard.jsx     the article card used in every grid/list
    │   ├── AdminBar.jsx        black bar shown across the site while logged in
    │   └── Footer.jsx          footer + giant IGNITE wordmark
    └── pages/
        ├── Home.jsx            landing page: hero, The Latest, section rows, join banner
        ├── Section.jsx         one section's article grid (/section/music etc.)
        ├── Article.jsx         a single story (/article/<slug>)
        ├── Login.jsx           editor login page
        ├── Studio.jsx          CMS dashboard: search, filter, feature, edit, delete
        ├── Editor.jsx          the article editor (TipTap) + article settings panel
        └── NotFound.jsx        404 page
```

Mental model of the data flow:

```
seedArticles.js ──▶ StoreContext (localStorage) ──▶ pages read via useStore()
                         ▲
        Studio/Editor ───┘  (saveArticle / deleteArticle / toggleFeatured)
```

---

## 4. How to change things (cookbook)

All visual identity lives in **`src/styles/global.css`**. It starts with design tokens:

```css
:root {
  --black: #0a0a0a;  --white: #ffffff;  --grey: #737373;
  --yellow: #ffed00; --red: #f73630;  --pink: #ff10a3;
  --green: #8acd01;  --orange: #fc4c00;
  --font-display: 'League Spartan', ...;   /* big loud headlines */
  --font-body: 'Montserrat', ...;          /* body text */
  --font-serif: 'Times New Roman', ...;    /* italic deks & pull quotes */
}
```

**Change a colour everywhere** → edit the token here once.
**Change fonts** → fonts are bundled npm packages (`@fontsource/...`). To swap: `npm install
@fontsource/<new-font>`, import its weights in `src/main.jsx`, update the token.

Common edits, where to make them:

| I want to… | Go to |
| --- | --- |
| Change hero auto-advance speed | `SLIDE_MS` at the top of `src/components/Hero.jsx` (milliseconds) |
| Change which articles are in the hero | Studio → ★ toggle (or `featured: true` in seed data) |
| Add / rename / recolour a section | `SECTIONS` array at the top of `src/data/seedArticles.js` — pages, nav, footer and studio all read from it |
| Choose which sections show in the top nav | `NAV_SECTIONS` list in `src/components/Nav.jsx` |
| Edit seeded articles | `src/data/seedArticles.js` (each article is one object; `body` is HTML) |
| Change the ticker/join/footer text | `Home.jsx` (join banner) / `Footer.jsx` |
| Add a wholly new page | Create `src/pages/X.jsx`, add a `<Route>` in `src/App.jsx` |
| Change roles/permissions | `can()` in `src/data/users.js` |
| Change the site title / favicon | `index.html` |

**Adding an article as an editor (no code)**: log in → Studio → *+ New article* → write in
the editor (toolbar has headings, bold/colour, pull quotes, images by URL or upload with
photo credits) → set cover, section, tags in the right panel → status *Published* → Save.
⚠️ POC caveat: this saves to **your browser only** (localStorage) — real shared publishing
arrives with the storage layer. To permanently add content today, put it in
`seedArticles.js` and push.

---

## 5. How the site works (the parts worth understanding)

- **Routing** (`App.jsx`): `/` home, `/section/:slug`, `/article/:slug`, `/login`, and the
  protected `/studio`, `/studio/new`, `/studio/edit/:id`. "Protected" = redirects to
  `/login` unless someone is logged in.
- **State** (`StoreContext.jsx`): one React context provides `articles`, `user`, and the
  mutation functions. On every change it rewrites localStorage key `ignite.articles.v1`.
  The session lives in `ignite.session.v1`. *Reset demo content* in the Studio wipes back
  to the seed articles.
- **Hero carousel** (`Hero.jsx`): plain `setInterval` advancing an index every `SLIDE_MS`;
  the progress bars are buttons (clicking jumps and resets the timer); the fill animation
  duration is passed to CSS via the `--slide-ms` variable so they stay in sync.
- **The editor** (`Editor.jsx`): TipTap (ProseMirror) with extensions for images, links,
  colours, fonts and alignment. Output is HTML stored on the article's `body` field and
  rendered on the article page. Uploaded images become base64 data URLs inside that HTML —
  fine for a demo, replaced by real image hosting later (section 7).
- **Roles** (`users.js`): every privileged UI action asks `can(user, action)`. Adding a new
  role = add the account + extend `can()`.

---

## 6. Deployment (already fully automatic)

Push to `main` → GitHub Actions builds and publishes. That's the whole workflow.

What `.github/workflows/deploy.yml` actually does:

1. `npm ci && npm run build` with `DEPLOY_BASE=/ignite-magazine/` — GitHub Pages serves
   the site under that sub-path, and Vite needs to know it at build time.
   (`vite.config.js` reads it; locally it defaults to `/` so dev is unaffected.)
2. Copies `dist/index.html` to `dist/404.html` — the trick that makes shared deep links
   like `/article/<slug>` work on Pages (unknown paths serve 404.html, which boots the
   React app, which then shows the right page).
3. Uploads `dist/` to GitHub Pages.

Checking on a deploy: repo → *Actions* tab. Green tick ≈ 1–2 minutes after push. If a run
fails, open it and read the first red step — the two historical causes are Pages not being
enabled (Settings → Pages → Source: GitHub Actions) and a build error you'd also see
locally with `npm run build`.

---

## 7. Storage layer — NOT BUILT YET ⬜

This is the main piece of engineering left. Today, articles written in the Studio persist
only in the author's own browser. Production needs a shared backend for: the article
database, real logins, and image hosting.

**The good news:** the app was shaped for this. Every read/write goes through one file —
`src/context/StoreContext.jsx` — so the swap is contained: replace its localStorage calls
with API calls and the rest of the site (Studio, editor, roles, pages) works unchanged.

Recommended path (free at our scale): **Supabase** — Postgres database + auth + file
storage in one service.

| Piece | Today (POC) | Production target |
| --- | --- | --- |
| Articles | localStorage array | `articles` table (columns ≈ the fields in `seedArticles.js`) |
| Login | hard-coded `users.js` | Supabase Auth; role stored per user |
| Role checks | `can()` client-side | keep `can()` for UI + enforce with row-level-security policies server-side |
| Cover/body images | hotlinked Wix CDN + base64 | Supabase Storage bucket, upload from the editor |

Migration checklist for whoever builds it:

- [ ] Create Supabase project **on an IGNITE-owned email**
- [ ] `articles` table + row-level security (public can read `status = 'published'`; editors write)
- [ ] Swap `StoreContext.jsx` internals to `@supabase/supabase-js` calls
- [ ] Swap `Login.jsx` to Supabase Auth; map roles
- [ ] Editor image upload → Storage bucket (replace the base64 path in `Editor.jsx`)
- [ ] **Re-host the seed article images** — they currently hotlink Wix's CDN
      (`static.wixstatic.com`) and will break when the Wix site is cancelled
- [ ] Seed the database from `seedArticles.js`, then retire the localStorage code

> **⬜ TBD once built:** Supabase project URL, dashboard login location, anon/service key
> storage, backup story.

---

## 8. Costs

| Item | Cost |
| --- | --- |
| GitHub Pages hosting | RM0 |
| Supabase free tier (future backend) | RM0 at our traffic |
| Domain renewal | ~RM60–90 / year |
| **Total** | **under RM100/year** (vs ~RM500 on Wix) |

If traffic ever outgrows free tiers, the first paid step is ~USD 25/month (Supabase Pro);
cheaper escape hatches exist (Cloudinary free tier / Cloudflare R2 for images). Not a
today-problem.

---

## 9. Known quirks & gotchas

- **Seed images hotlink Wix.** Works today; dies when Wix is cancelled. Re-host first (see checklist above).
- **Uploaded images are base64 in localStorage** — a few large uploads can hit the ~5MB
  browser quota. The app warns when saving fails. Backend fixes this properly.
- **The repo must stay public** for free GitHub Pages.
- **Renaming the repo** changes the live URL and requires updating `DEPLOY_BASE` in the workflow.
- **Custom domain** requires `DEPLOY_BASE=/` (section 1.2) — don't forget or all assets 404.
- **Supabase free tier pauses** after ~a week of zero traffic (future concern; real visitor
  traffic prevents it).
- **node_modules inside OneDrive** (current dev machine) makes syncing sluggish — pause
  OneDrive sync for the folder or clone outside OneDrive.

---

## 10. Handover checklist (do these when passing the site on)

- [ ] Transfer repo to the IGNITE GitHub account (section 1.1) and fill in the TBD table
- [ ] Confirm the new live URL works and update README + this doc
- [ ] Hand over: GitHub credentials, domain registrar login, (future) Supabase login —
      into the committee's shared credential store, never personal accounts
- [ ] Walk the new web manager through: local setup (section 2), one article publish in
      the Studio, one deploy (push something trivial and watch Actions)
- [ ] New maintainer updates the *Quick facts* table at the top of this doc

*Last updated: August 2026 · Written at POC handoff by Dhiren (with Claude).*
