# Navtesh Nijhawan — Personal Website

A small Flask site that acts as my personal landing page, with a dedicated projects showcase.

## Structure

```
Personal Website/
├── app.py                  # Flask routes: /, /projects, /resume, /favicon.ico
├── requirements.txt
├── vercel.json             # Vercel rewrite config (all routes -> api/index)
├── api/
│   └── index.py            # Vercel serverless entry that re-exports `app`
├── static/
│   ├── profile.jpg         # Profile picture (home page)
│   ├── resume.pdf          # Resume PDF served at /resume
│   ├── favicon.svg         # NN logo used as browser tab icon
│   └── css/
│       └── style.css       # Shared site styles
└── templates/
    ├── base.html           # Shared layout (background, fonts, favicon)
    ├── index.html          # Landing page
    └── projects.html       # Projects gallery
```

## Run locally

```powershell
# (optional) create a virtualenv
python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Routes

| Route          | Description                            |
| -------------- | -------------------------------------- |
| `/`            | Landing page with GitHub / LinkedIn / Projects links |
| `/projects`    | Projects gallery (Pulseify, SmartFlow, VantaManji)    |
| `/resume`      | Serves `static/resume.pdf`             |
| `/favicon.ico` | Serves the NN SVG favicon              |

## Deploy to Vercel

The repo is pre-wired for Vercel's Python serverless runtime:

- `vercel.json` rewrites every incoming URL to `/api/index`.
- `api/index.py` imports the Flask `app` from `app.py` at the repo root.
- Vercel reads `requirements.txt` automatically and installs Flask.

To deploy: connect the GitHub repo on vercel.com (Framework Preset: *Other*).
Every push to `main` triggers a redeploy automatically.
