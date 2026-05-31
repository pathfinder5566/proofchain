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

### Frontend on Vercel
- Deploy the `frontend/` directory as a Vite project.
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Keep `frontend/vercel.json` and replace the destination with your Render backend URL.

### Backend on Render
- Deploy the `backend/` directory as a Render Web Service.
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables in Render:
  - `PORT=3001`
  - `FRONTEND_URL=https://<your-vercel-domain>`
  - `HMAC_SECRET=<your-secret>`
  - `DB_PATH=/opt/render/project/src/data/proofchain.sqlite`

### Notes
- The frontend uses rewritten API paths through Vercel to reach the backend.
- The backend uses SQLite and is better hosted on Render than on Vercel.
