# VHUWON MATHERS — Digital Infrastructure Portfolio
**Domain:** [https://gautambhuwan.com.np](https://gautambhuwan.com.np)  
**Brand Identity:** Vhuwon Mathers  
**Platform:** GitHub Pages + ClouDNS Anycast Routing  
**Architecture:** Pure Semantic HTML5, CSS3, & Vanilla JavaScript  

---

## 🚀 Overview

This repository powers the official multi-page digital identity and technical engineering portfolio of **Vhuwon Mathers**. Designed with a dark-first, precision-engineered technical aesthetic, the site emphasizes computer networking, systems administration, Linux server hardening, Docker containerization, and distributed DNS infrastructure.

### Key Highlights
- **100% Static & Blazing Fast:** Zero framework bloat, zero runtime dependencies, instant first paint.
- **Multi-Page Architecture:** 12 dedicated pages (`index`, `about`, `skills`, `services`, `projects`, `labs`, `experience`, `resume`, `blog`, `contact`, `privacy`, `404`).
- **Dark & Light Mode:** Accessible theme switcher with automatic `prefers-color-scheme` detection and `localStorage` persistence.
- **Interactive Laboratory Notebook (`labs.html`):** Detailed technical writeups (LAB // 001 to LAB // 003) featuring OSPF multi-area configurations, Nginx reverse proxy blocks, and Docker bridge setups.
- **Dynamic Category Filtering (`projects.html`):** Client-side project filter supporting Networking, Systems, Cloud, Automation, and Web.
- **Accessible & Responsive:** Semantic HTML, ARIA attributes, keyboard-accessible navigation drawer, and print-ready CSS for `resume.html`.

---

## 📁 Repository Structure

```text
/
├── index.html            # Gateway / Hero, Tech Strip, Featured Work, Pillars, CTA
├── about.html            # Personal narrative, engineering philosophy, milestones
├── skills.html           # In-depth technical skills matrix & protocol proficiency
├── services.html         # Domains of technical practice & consultation scope
├── projects.html         # Interactive filtered engineering portfolio
├── labs.html             # Technical engineering notebook with code & topologies
├── experience.html       # Verified career milestones, training & operations
├── resume.html           # Print-friendly web-based Curriculum Vitae
├── blog.html             # System insights & architectural technical notes
├── contact.html          # Validated contact form, direct email, & copy button
├── privacy.html          # Transparent privacy disclosure for static site
├── 404.html              # Futuristic "Signal Not Found" error page
│
├── assets/
│   ├── images/
│   │   ├── profile/      # Profile photos & avatar fallbacks (vhuwon-mathers.svg)
│   │   ├── projects/     # Project screenshots and diagrams
│   │   └── labs/         # Network topology blueprints
│   └── icons/            # SVG vector assets
│
├── css/
│   ├── style.css         # Master stylesheet & centralized custom CSS variables
│   ├── responsive.css    # Responsive breakpoints (320px to 1920px) & print styles
│   └── animations.css    # IntersectionObserver reveal keyframes & reduced-motion
│
├── js/
│   ├── main.js           # Application entrypoint & state initialization
│   ├── navigation.js     # Accessible mobile drawer & active route highlighting
│   ├── animations.js     # Scroll reveal engine with prefers-reduced-motion check
│   ├── projects.js       # Client-side category filtering engine
│   ├── contact.js        # Form validation, feedback states, & clipboard utility
│   └── data.js           # Theme state manager (Dark/Light) & local persistence
│
├── data/
│   ├── skills.json       # Structured skills dataset
│   ├── projects.json     # Structured project portfolio dataset
│   └── blog.json         # Structured blog article metadata
│
├── CNAME                 # Custom domain configuration (gautambhuwan.com.np)
├── favicon.svg           # Geometric circuit monogram favicon (VM)
├── robots.txt            # Search engine crawler instructions
├── sitemap.xml           # XML sitemap indexing all 11 production routes
└── README.md             # Complete engineering documentation
```

---

## 🛠️ Local Development & Testing

You can preview and test the website locally without any build tools or package managers:

### Option 1: Python Built-in Server
Open terminal in the project root:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### Option 2: VS Code Live Server
1. Open the folder in Visual Studio Code.
2. Click **Go Live** on the bottom status bar.

---

## 📸 Personal Photograph Integration

When ready to add your personal photo:
1. Save your photograph as `vhuwon-mathers.webp` (or `profile.webp`).
2. Place the file inside `assets/images/profile/`.
3. In `index.html` and `about.html`, update the `src` attribute from `assets/images/profile/vhuwon-mathers.svg` to your new photo file.

---

## 🌐 Custom Domain & GitHub Pages Deployment

- **Branch:** `main` (root directory `/`)
- **Custom Domain:** `gautambhuwan.com.np`
- **DNS Records in ClouDNS:**
  - `A` record (`@`) &rarr; `185.199.108.153`
  - `A` record (`@`) &rarr; `185.199.109.153`
  - `A` record (`@`) &rarr; `185.199.110.153`
  - `A` record (`@`) &rarr; `185.199.111.153`
  - `CNAME` record (`www`) &rarr; `sudovu.github.io.`
  - **Enforce HTTPS:** Checked in GitHub Pages Settings.

---

## ☁️ Future Google Cloud Migration Path

If you decide to migrate beyond static hosting to Google Cloud:
1. **Firebase Hosting:** Run `firebase init hosting` and deploy directly with `firebase deploy`.
2. **Cloud Run:** Add a simple lightweight Nginx `Dockerfile` and deploy as a scalable container.
3. **Google Compute Engine (GCE):** Spin up an `e2-micro` Ubuntu VM and copy files to `/var/www/html/`.
