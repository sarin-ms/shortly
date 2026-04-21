# Shortly

A clean, minimal URL shortener built with React and Supabase.

Paste a long URL, get a short one. Track clicks. Add custom aliases.

![Shortly](https://img.shields.io/badge/built%20with-React%20%2B%20Supabase-lime?style=flat-square)

---

## Features

- **Shorten any URL** in one click
- **Custom aliases** — choose your own slug (e.g. `shortly.app/github`)
- **Click tracking** — see how many times each link was visited
- **Dashboard** — manage and delete all your links
- **Instant redirect** — sub-100ms lookup via Supabase

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React (Vite) |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Short ID | nanoid |
| Deploy | Vercel |

---

## Project Structure

```
src/
├── lib/
│   └── supabase.js        # Supabase client
├── pages/
│   ├── Home.jsx           # Shorten form + result
│   ├── Dashboard.jsx      # All links, click counts, delete
│   ├── Redirect.jsx       # /:code → fetches URL → redirects
│   └── NotFound.jsx       # 404 fallback
└── App.jsx                # Route definitions
```

---
Live demo: [shortly.app](https://shortlyyy.vercel.app)

---
