# Fragments

A little archive room for stray lore, filed characters, alternate universes, and the occasional sticky-note of a world that refuses to stay tidy.

Built with React, Vite, and Supabase, this project turns a pile of fandom fragments into something browsable, searchable, and just a bit dramatic. (˶˃𐃷˂˶)

## Structure ✦｡°✩

```text
fragments/
├── src/
│   ├── components/            ← cards, layouts, admin UI, visual flourishes
│   ├── data/                  ← local JSON seed data
│   ├── lib/                   ← Supabase client + auth context
│   ├── pages/                 ← landing, archive, character pages, admin routes
│   ├── utils/                 ← tiny helpers and odd little fixes
│   ├── App.jsx                ← route wiring and app shell
│   ├── main.jsx               ← app bootstrap
│   └── index.css              ← base styles and theme tokens
├── public/
│   └── images/                ← static imagery and media assets
├── exports/                   ← exported JSON snapshots from Supabase
├── .env.example               ← copy to .env.local and fill in your keys
├── export-supabase.mjs        ← export data from Supabase to local JSON
├── import-to-pocketbase.mjs   ← migration helper from Supabase data into PocketBase
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── README.md
└── public/
```

The app is intentionally split into a few clean layers: the archive pages read from Supabase, the admin area edits the same data behind a restricted route, and the export scripts help move records around without treating data like a haunted attic.

## Usage (๑ > ᴗ < ๑)

```bash
npm install
cp .env.example .env.local
# fill in your Supabase settings
npm run dev
```

Open the app in the browser and wander in:

```bash
npm run dev
```

The expected local app URL is usually:

```text
http://localhost:5173
```

### Required environment values

Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

If you're using the export script, the same keys are read from `.env.local`.

## What this project does (˶°ㅁ°) !!

- Shows a landing page and an archive room for browsing entries
- Lets readers explore characters and their related alternate universes
- Displays pinned posts and archived fragments in a searchable interface
- Gives admins a private dashboard for managing characters, AUs, and posts
- Keeps the data layer centralized through Supabase instead of scattering it across random components

## Routes ✧ <(•_•<)

- `/` — landing entrance
- `/archive` — searchable archive of characters
- `/character/:slug` — detailed character page
- `/au/:slug` — alternate universe detail page
- `/admin` — admin login
- `/admin/dashboard` — protected cataloging dashboard

## How it works ( ᵕᴗᵕ )

- `src/lib/supabaseClient.js` creates the shared Supabase client
- `src/pages/home.jsx` fetches character and archive stats from the database
- `src/pages/AdminDashboard.jsx` uses the same backend data for a private editing interface
- `export-supabase.mjs` exports one JSON file per table into the `exports/` folder
- `import-to-pocketbase.mjs` is a migration helper for moving those records into PocketBase collections

This means the project is easy to extend: if a field or table changes, you update the source of truth and the app follows along like it always expected to.

## Scripts & data tools

```bash
npm run dev      # run the local Vite dev server
npm run build    # production build
npm run preview  # preview the production build locally
node export-supabase.mjs   # export Supabase tables to ./exports
```

The `exports/` folder is useful for snapshots, migration work, or backup-style check-ins before changing the data structure.

## Stack 三三ᕕ( ᐛ )ᕗ

- React 19
- Vite
- Supabase
- React Router
- JavaScript / JSX
- ESLint for code hygiene

## Roadmap ⋆.˚ (ᵕ—ᴗ—)

Right now the archive is already doing the heavy lifting: browsing, searching, and admin management. The next best upgrades would be:

- richer filtering and sorting for archive entries
- better validation and admin form UX
- a cleaner backup / restore flow for exported data
- optional content moderation or publishing states for drafts

## Notes for the curious 𐔌՞ ܸ.ˬ.ܸ՞𐦯

This project has a very specific mood: a cataloged universe where every fragment feels gently preserved, like a library of half-remembered worlds. If you're here to build on it, the main things to watch are:

- the Supabase table structure
- the shared client in `src/lib/supabaseClient.js`
- the admin dashboard workflow in `src/pages/AdminDashboard.jsx`

Everything else is mostly atmosphere, paper labels, and a few well-placed dust motes.

---

If you want, this repo can also be expanded with a more formal project-specific guide for data schema, admin usage, and contributor setup. Have fun looking around ♡ ̆̈

