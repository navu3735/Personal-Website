# Navtesh Nijhawan — Personal Website

A small Flask site that acts as my personal landing page, with a dedicated projects showcase.

## Structure

```
Personal Website/
├── app.py                  # Flask routes: /, /projects, /resume
├── requirements.txt
├── static/
│   ├── profile.jpg         # Profile picture (home page)
│   ├── resume.pdf          # Resume PDF served at /resume
│   └── css/
│       └── style.css       # Shared site styles
└── templates/
    ├── base.html           # Shared layout (nav, background, fonts)
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

| Route       | Description                            |
| ----------- | -------------------------------------- |
| `/`         | Landing page with GitHub / LinkedIn / Projects links |
| `/projects` | Projects gallery (Pulseify, SmartFlow, VantaManji)    |
| `/resume`   | Serves `static/resume.pdf`             |
