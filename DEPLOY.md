# 🔥 Silicon Nexus Portfolio — Complete Deployment Guide
### Stack: Firebase Hosting (GCS CDN) + Firestore + EmailJS

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase CLI Setup](#firebase-cli-setup)
3. [Firebase Project Setup](#firebase-project-setup)
4. [Code Configuration](#code-configuration)
5. [EmailJS Setup](#emailjs-setup)
6. [Deploy Commands](#deploy-commands)
7. [CI/CD (Auto-Deploy on Push)](#cicd-auto-deploy-on-push)
8. [Update & Redeploy](#update--redeploy)
9. [Free Tier Limits](#free-tier-limits)
10. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | Bundled with Node.js |
| Firebase CLI | 15.9+ | `npm install -g firebase-tools` |

```powershell
# Verify everything is installed
node --version     # should print v18+ or v24+
npm --version      # should print 9+
firebase --version # should print 15.9.0+
```

> **Windows only:** If npm gives a script-disabled error, run first:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
> ```

---

## 2️⃣ Firebase CLI Setup

```powershell
# Step 1 — Install Firebase CLI globally
npm install -g firebase-tools

# Step 2 — Log in (opens a browser for Google sign-in)
# Run this in a NEW PowerShell window (not VS Code terminal)
firebase login

# Step 3 — Verify login
firebase projects:list
# Should show: silicon-nexus-portfolio (current)
```

---

## 3️⃣ Firebase Project Setup

### 3a. Create Project (done automatically in this case)
```
Project ID:   silicon-nexus-portfolio
Project Name: silicon-nexus-portfolio
Region:       asia-south1 (Mumbai)
```

### 3b. Register Web App & Get Config (already done — values below)

The Firebase config is already injected into `public/index.html`:

```js
const firebaseConfig = {
  apiKey:            "AIzaSyAhg_mzKsRG5WvRbugo_K3wU2jVx75u-A0",
  authDomain:        "silicon-nexus-portfolio.firebaseapp.com",
  projectId:         "silicon-nexus-portfolio",
  storageBucket:     "silicon-nexus-portfolio.firebasestorage.app",
  messagingSenderId: "284303554633",
  appId:             "1:284303554633:web:111f6242bbab7f4e462798",
};
```

### 3c. Enable Firestore (first time only)
If Firestore is not yet created, the `firebase deploy` command auto-enables it.
Or create it manually:
```
Console → Firestore Database → Create database
→ Production mode → Region: asia-south1 → Enable
```

---

## 4️⃣ Code Configuration

All configuration files in this project:

| File | Purpose |
|---|---|
| `.firebaserc` | Links CLI to Firebase project ID |
| `firebase.json` | Hosting dir, headers, rewrites |
| `firestore.rules` | Security rules for Firestore |
| `public/index.html` | Firebase SDK + EmailJS config block |

### `.firebaserc` (already set)
```json
{
  "projects": {
    "default": "silicon-nexus-portfolio"
  }
}
```

---

## 5️⃣ EmailJS Setup

> Contact form currently uses a `mailto:` fallback. To enable real email sending:

### Step 1 — Create Account
1. Go to [emailjs.com](https://www.emailjs.com) → **Sign Up** (free)
2. Use your Gmail: `karthickeaswar43815@gmail.com`

### Step 2 — Add Gmail Service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail** → Connect account → Save
3. Note the **Service ID** (e.g. `service_abc123`)

### Step 3 — Create Email Template
1. Dashboard → **Email Templates** → **Create New Template**
2. Configure the template:
   ```
   Subject:  {{subject}}
   To:       karthickeaswar43815@gmail.com
   
   Body:
   From: {{from_name}} <{{from_email}}>
   
   {{message}}
   ```
3. Click **Save** → note the **Template ID** (e.g. `template_xyz789`)

### Step 4 — Get Public Key
1. Dashboard → **Account** → **General**
2. Copy your **Public Key** (e.g. `aBcDeFgHiJkLmNoPq`)

### Step 5 — Paste into `public/index.html`
Find this block near the bottom of `index.html` and replace:
```js
window.EMAILJS_SERVICE_ID  = 'YOUR_EMAILJS_SERVICE_ID';   // ← paste here
window.EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';  // ← paste here
emailjs.init({ publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' });    // ← paste here
```

### Step 6 — Redeploy
```powershell
firebase deploy --only hosting --project silicon-nexus-portfolio
```

---

## 6️⃣ Deploy Commands

```powershell
# ── Full deploy (hosting + Firestore rules) ─────────────────
firebase deploy --project silicon-nexus-portfolio

# ── Hosting only (HTML/CSS/JS) ───────────────────────────────
firebase deploy --only hosting --project silicon-nexus-portfolio

# ── Firestore rules only ─────────────────────────────────────
firebase deploy --only firestore:rules --project silicon-nexus-portfolio

# ── Cloud Functions only ─────────────────────────────────────
cd functions && npm install && cd ..
firebase deploy --only functions --project silicon-nexus-portfolio
```

### Live URLs
| URL | Purpose |
|---|---|
| https://silicon-nexus-portfolio.web.app | Primary hosting URL |
| https://silicon-nexus-portfolio.firebaseapp.com | Alternate hosting URL |

---

## 7️⃣ CI/CD — Auto-Deploy on Push

A GitHub Actions workflow is set up at `.github/workflows/deploy.yml`.

### Setup (one-time)
1. Push code to GitHub:
   ```powershell
   git add .
   git commit -m "Initial Firebase deployment"
   git push origin main
   ```
2. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** → Name: `FIREBASE_SERVICE_ACCOUNT`
4. Get the value:
   ```powershell
   firebase init hosting:github --project silicon-nexus-portfolio
   ```
   This auto-creates the GitHub secret for you.

After setup, **every push to `main` automatically deploys** to Firebase Hosting.

---

## 8️⃣ Update & Redeploy

Whenever you make changes to your portfolio:

```powershell
# Option A — Manual redeploy
firebase deploy --only hosting --project silicon-nexus-portfolio

# Option B — Git push (auto-deploys via GitHub Actions)
git add .
git commit -m "Update portfolio content"
git push origin main
```

---

## 9️⃣ Free Tier Limits

| Service | Free Limit | Estimated Usage |
|---|---|---|
| **Firebase Hosting** | 10 GB storage · 360 MB/day bandwidth | ✅ ~3 MB site |
| **Firestore reads** | 50,000 / day | ✅ <<100/day |
| **Firestore writes** | 20,000 / day | ✅ <<50/day |
| **EmailJS** | 200 emails / month | ✅ Contact form |
| **Cloud Functions** | 2M calls / month (Blaze) | ✅ Optional |

**Total cost: ₹0 / month** 🎉

---

## 🔧 Troubleshooting

### `firebase: not recognized`
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
npm install -g firebase-tools
```

### `Cannot run login in non-interactive mode`
Run `firebase login` in a **new PowerShell window** (Start → PowerShell), not inside VS Code terminal.

### `403 Firestore API not enabled`
```powershell
# The CLI auto-enables it — just retry:
firebase deploy --only firestore:rules --project silicon-nexus-portfolio
```

### `Error: Invalid project id`
Make sure `.firebaserc` contains the correct project ID:
```json
{ "projects": { "default": "silicon-nexus-portfolio" } }
```

### Contact form doesn't send email
- Check that EmailJS credentials are filled in `public/index.html`
- Verify the Gmail service is connected in EmailJS dashboard
- Without EmailJS config, it automatically falls back to opening your email client

### Analytics not writing to Firestore
- Ensure Firestore is created in the console (asia-south1 region)
- Check browser console for any Firestore permission errors
- Verify the `firestore.rules` have been deployed

---

## 📁 Project Structure

```
e:\Portfolio\
├── public/                  ← Static site (deployed to Firebase Hosting)
│   ├── index.html           ← Main page + Firebase SDK config
│   ├── styles.css           ← All styles
│   ├── script.js            ← JS: animations, EmailJS, Firestore analytics
│   └── assets/              ← Images
├── functions/               ← Firebase Cloud Functions (optional)
│   ├── index.js             ← trackVisit function
│   └── package.json
├── .github/workflows/
│   └── deploy.yml           ← GitHub Actions CI/CD
├── firebase.json            ← Firebase hosting + function config
├── .firebaserc              ← Firebase project binding
├── firestore.rules          ← Firestore security rules
├── firestore.indexes.json   ← Firestore indexes
├── server.js                ← Local dev server (node server.js)
└── DEPLOY.md                ← This file
```
