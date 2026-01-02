# Teja Portfolio Website (GitHub Pages)

This is a single-page Bootstrap portfolio site designed to be recruiter-friendly and auto-load your latest public GitHub repositories.

## Run locally
Just open `index.html` in your browser.

> Note: Some browsers block fetch() from `file://` URLs. If the GitHub section doesn't load locally, run a tiny server:
- Python: `python -m http.server 8000`
- Then open: `http://localhost:8000`

## Deploy to GitHub Pages
1. Create a repo named: `YOUR_USERNAME.github.io`
2. Upload these files to the repo root
3. GitHub → Settings → Pages → Deploy from branch → `main` → `/ (root)`
4. Your site goes live at: `https://YOUR_USERNAME.github.io`

## Customize
Edit:
- `index.html` for content
- `assets/css/styles.css` for styles
- `assets/js/main.js` to change GitHub username or repo sorting
