# Rotary Connect — Deployment Guide

This repository is a Next.js (App Router) application that uses MongoDB via Mongoose.

Quick steps to deploy to Vercel:

1. Push your repository to GitHub (or Git provider supported by Vercel).
2. Go to https://vercel.com, create an account or log in, and choose "Import Project" → select your repo.
3. In the Setup options:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run vercel-build` (or leave empty to use default)
   - Output Directory: leave empty (Next.js default)
4. Add Environment Variables in the Vercel project settings (Dashboard → Settings → Environment Variables):
   - `MONGO_URI` — your MongoDB connection string (required)
   - Optionally: `NEXT_PUBLIC_APP_URL` or any other keys used by your app
5. If using MongoDB Atlas, ensure your cluster allows connections from Vercel (either allow all IPs or configure a VPC or IP allowlist).
6. Click Deploy. Vercel will build and deploy your app.

Notes & recommendations

- The project requires Node 18+. We set `engines.node` in `package.json` to `>=18.0.0`.
- The `lib/mongodb.js` utility caches Mongoose connections for serverless environments — no extra changes needed.
- Do NOT commit `.env.local` with secrets. Use the Vercel dashboard to store env vars for Production and Preview.

Post-deploy tips

- To store the parsed `data/past-events.json` in MongoDB, you can write a small script that reads the JSON and POSTs to `/api/events` or uses Mongoose directly.
- If you need to run one-off scripts, you can use `vercel dev` locally or run them from your machine and point to your production database.
