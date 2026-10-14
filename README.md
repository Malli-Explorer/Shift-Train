# ShiftTrain AI

> **Next-Generation Commuter Intelligence & Station Awareness (Demo Prototype)**

ShiftTrain AI is a full-stack demo application providing train search, in-memory crowd reports, and a deterministic ticket evaluation engine with multilingual support across 5 languages.

---

## ⚠️ Important Limitations (To Tell Judges)

1. **Simulated Data**: Train data is demo only, with no live railway / IRCTC API integration.
2. **Unverified Ticket Rules**: No official ticket rule is legally verified; the ticket check rule engine always concludes with mandatory advice to **"ask railway staff"** or the TTE before boarding.
3. **Gemini / GenAI**: Gemini AI is not built into live railway operations in this build.
4. **Volatile In-Memory Reports**: Crowd reports live in server memory and reset whenever Render restarts.
5. **Multilingual Coverage**: Hindi and English are complete. Tamil, Telugu, and Bengali cover only main screen keys and display a partial translation disclaimer; none of the translations has been reviewed by a native speaker.

---

## System Architecture

### Backend (Express + TypeScript)
- **Train Search (`GET /api/trains/search`)**: Returns 3 invented demo trains clearly tagged with `"DEMO DATA"`.
- **Crowd Reports (`POST /api/crowd/report`, `GET /api/crowd/reports`)**:
  - In-memory store (up to 500 records).
  - Rate limiting (max 5 submissions per minute per IP).
  - Duplicate detection (blocks identical train/coach submissions within a 3-minute window).
  - Size limit validation (comments capped at 500 characters, body payload capped at 50kb).
- **Ticket Check (`POST /api/ticket/check`)**:
  - Deterministic rule engine for CNF, RAC, WL/GNWL, Tatkal, General, and Cancelled statuses.
  - Mandatory advice tag advising users to confirm with railway staff.
- **Security & Localization**:
  - Zero secrets exposed in payloads or error traces.
  - Localized error messages in English and Hindi.
  - Safe CORS origins via `CORS_ORIGINS` environment variable.

### Frontend (React + Vite + TypeScript)
- **Interactive Forms**:
  - Train Search (Source, Destination, Date).
  - Crowdsourced Carriage Reports (Train, Coach, Crowd level, Cleanliness, Note).
  - Ticket Check (PNR, Ticket Status, Coach).
- **Languages**: Instant switching between English (`en`), Hindi (`hi`), Tamil (`ta`), Telugu (`te`), and Bengali (`bn`).
- **Global Demo Banner**: Prominent yellow "DEMO DATA" banner persistent across every screen.

---

## Local Development & Testing

### 1. Backend

```bash
cd backend
npm install
npm test
npm run dev
```

Runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

Runs on `http://localhost:3000` (proxies `/api` requests to backend at `localhost:5000`).

---

## Deployment Guide

### Step 1: Push Repository to GitHub

```bash
git init
git add .
git commit -m "Initial commit of ShiftTrain AI full deployable app"
git branch -M main
git remote add origin https://github.com/<your-username>/shifttrain-ai.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service** and connect your `shifttrain-ai` repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CORS_ORIGINS`: `*` (or your Vercel URL once generated in Step 3)
5. Click **Create Web Service**. Note your Render URL (e.g. `https://shifttrain-backend.onrender.com`).

### Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project** and import the `shifttrain-ai` repository.
3. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g. `https://shifttrain-backend.onrender.com`).
5. Click **Deploy**.

### Step 4: Finalize CORS on Render

1. Go back to Render > **Environment**.
2. Update `CORS_ORIGINS` with your actual Vercel domain (e.g. `https://shifttrain-ai.vercel.app`).
3. Save changes.

---

## Post-Deploy Smoke-Test Checklist

- [ ] **Health Check**: Visit `https://<render-url>/api/health` -> should return `{"status":"ok","mode":"demo"}`.
- [ ] **Demo Train Search**: Search from New Delhi to Mumbai Central -> verify 3 demo trains appear with `DEMO DATA` tags.
- [ ] **Submit Crowd Report**: Post a report for Coach B1 -> verify report displays in list.
- [ ] **Duplicate Guard Check**: Submit the exact same report again immediately -> should return a duplicate warning error.
- [ ] **Ticket Rule Check**: Test `RAC` and `WL` status -> verify advice explicitly instructs to "Always ask railway staff".
- [ ] **Language Switching**: Switch to Hindi, Tamil, Telugu, and Bengali -> verify banner, buttons, and notices update accordingly.
