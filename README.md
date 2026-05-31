# ProofChain - Whistleblower Proof-of-Existence System

## The Problem

Governments and institutions can use surveillance to identify and silence whistleblowers. Uploading evidence to prove it exists creates a digital trail that can expose the source before the evidence can protect them.

## The Solution

ProofChain creates a proof without receiving the evidence. The browser computes a SHA-256 fingerprint of the file on the user's device, then sends only that 64-character hash to the backend. The server stores the hash, timestamp, and certificate ID. The file itself is never uploaded.

## How It Works (3 steps)

1. Select file -> hash computed in browser
2. Hash + timestamp stored on server
3. Certificate generated with QR verify link

## Tech Stack

- React + Vite: fast frontend development and production builds
- Web Crypto API: browser-native SHA-256 hashing with no hashing dependency
- Node.js + Express: REST API for registration and verification
- SQLite + better-sqlite3: inspectable file-based registry
- jsPDF: client-side PDF certificate generation
- qrcode: QR links for public verification

## Security Properties

- File never leaves device
- SHA-256 is collision-resistant
- Timestamps are server-side and cannot be backdated by clients
- Public verification requires no account
- Duplicate registrations are idempotent and return the original timestamp
- IPs are hashed before abuse tracking

## Live Demo

[deployment URL]

## Hackathon Context

Built for [hackathon name]. Theme: Surveillance vs Public Safety.
This project uses surveillance-resistance technology to protect those who expose surveillance abuse - an ironic and intentional design choice.

## Local Development

Install dependencies in both apps:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:3001`.

## Deployment

This repo is configured for a split deployment:

- Backend: Render Web Service from `backend/`
- Frontend: Vercel Vite app from `frontend/`
- API routing: Vercel rewrites `/api/*` to the Render service

### Frontend on Vercel

1. Deploy the backend on Render first and copy its public URL.
2. In `frontend/vercel.json`, confirm the `/api/:path*` destination matches your Render backend URL.
   - The included default is `https://proofchain-api.onrender.com/api/:path*`.
   - If Render gives you a different URL, replace only the hostname.
3. Import the GitHub repo in Vercel.
4. Set the Vercel project root directory to `frontend`.
5. Use the Vite framework preset.
6. Use these build settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`

### Backend on Render

Recommended: use the included `render.yaml` Blueprint.

1. In Render, create a new Blueprint from this repo.
2. Render will create the `proofchain-api` web service from `backend/`.
3. Set `FRONTEND_URL` to your final Vercel production URL, for example:
   - `https://your-project.vercel.app`
4. Keep the generated `HMAC_SECRET`.
5. Keep `DB_PATH=/var/data/proofchain.sqlite`.
6. Keep the persistent disk mounted at `/var/data` so SQLite data survives deploys.

Manual Render settings, if you do not use the Blueprint:

- Root directory: `backend`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Environment variables:
  - `NODE_VERSION=20`
  - `NODE_ENV=production`
  - `FRONTEND_URL=https://<your-vercel-domain>`
  - `HMAC_SECRET=<long-random-secret>`
  - `DB_PATH=/var/data/proofchain.sqlite`
- Disk:
  - Mount path: `/var/data`
  - Size: `1 GB`

### Notes
- The frontend uses same-origin `/api` calls. In production, Vercel rewrites those requests to Render.
- The backend uses SQLite and should run on Render with a persistent disk. Without a disk, proof records can be lost between deploys.
- After Vercel is live, update `FRONTEND_URL` in Render to the Vercel production URL and redeploy the backend.
