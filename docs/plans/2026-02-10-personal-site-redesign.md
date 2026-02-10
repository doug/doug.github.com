# Personal Site Redesign

## Overview

Complete redesign of dougfritz.com - delete all legacy content and create a clean, minimal personal site with a subtle generative background element.

## Goals

1. **Professional presence** - A clear landing page for people who want to know about Doug professionally
2. **Contact hub** - Easy way for people to reach out
3. **Personal expression** - Subtle creative element that hints at art + engineering intersection

## Content

### Main Page (top to bottom)

1. **Name:** Doug Fritz (large, clean typography)
2. **Tagline:** Principal Engineer at Google DeepMind, focused on AI for Science
3. **Education:** CMU · MIT
4. **Social links:** GitHub · LinkedIn · X (horizontal row)
5. **Email:** Click-to-reveal button (anti-scrape) → reveals doug@dougfritz.com
6. **Publications:** 2-3 curated highlights:
   - Visualizing Dataflow Graphs in TensorFlow · IEEE VAST 2018 · Best Paper
   - Scaling Language Models (Gopher) · DeepMind 2021

### Future Content (/notes)

- Route exists but hidden until content is published
- Markdown files with frontmatter
- `published: false` keeps posts in repo but not on live site
- When content exists with `published: true`, a "Notes →" link appears on main page

## Visual Design

### Color Palette

- **Background:** Warm off-white (#F9F7F4 or similar)
- **Primary text:** Warm dark grey (#2D2D2D)
- **Secondary text:** Muted grey (#6B6B6B)
- **Particles:** Pale sage green, soft sky blue, warm greys
- **Accent:** Fuschia (#E91E8C) - rare particles, hover states, email reveal button

### Typography

- Clean sans-serif (Inter, Space Grotesk, or similar)
- Generous whitespace
- Comfortable reading size

### Generative Element

A subtle particle/boids system in the background:

- 40-60 particles, very slow movement
- Boids-like flocking behavior (loose grouping, flowing motion)
- Small circles/dots, varying opacity (0.3-0.7)
- Colors: muted greys, pale greens, soft blues
- 1-2 fuschia particles appear occasionally, drift through, fade out
- Mouse proximity causes gentle repulsion or attraction (subtle)
- Particle count reduces on mobile for performance

### Responsive

- Content stacks cleanly on mobile
- Centered layout works at all sizes
- Particle system adapts to viewport

## Technical Approach

### Stack

- **Framework:** Astro (not Starlight - too heavy for this use case)
- **Language:** TypeScript for particles and interactivity
- **Content:** Markdown + frontmatter for /notes
- **Styling:** Plain CSS (or CSS modules)
- **Hosting:** GitHub Pages
- **Build:** GitHub Actions

### File Structure

```
/src
  /pages
    index.astro
    notes/
      index.astro (list page, hidden if no published posts)
      [slug].astro
  /components
    Particles.astro (canvas wrapper)
    EmailReveal.astro
    SocialLinks.astro
  /scripts
    particles.ts (boids simulation)
  /content
    /notes
      example-post.md (published: false)
  /styles
    global.css
/public
  favicon.ico
  CNAME
/.github
  /workflows
    deploy.yml
astro.config.mjs
tsconfig.json
package.json
```

### GitHub Actions

Workflow triggers on push to master:
1. Install dependencies
2. Build Astro site
3. Deploy to GitHub Pages

### What Gets Deleted

- All legacy content:
  - `_layouts/`
  - `explorations/`
  - `projects/`
  - `css/` (old styles)
  - `js/` (old scripts)
  - `images/` (old images)
  - `*.old.html` files
  - `old_config.yml`
  - `atom.xml`
  - Old HTML files (about, explorations, now, etc.)

- **Keep:**
  - `CNAME` (www.dougfritz.com)
  - `favicon.ico` / `favicon.png` (unless replacing)
  - `.gitignore` (will update for Astro)
  - `.nojekyll`

## Social Links

- GitHub: https://github.com/doug
- LinkedIn: https://www.linkedin.com/in/doug-fritz-aaa26b4/
- X/Twitter: https://twitter.com/dohug

## Implementation Notes

### Particles (TypeScript)

Simple boids-like simulation:
- Position, velocity for each particle
- Separation, alignment, cohesion rules (gentle weights)
- Mouse interaction force
- Rare fuschia particle spawner (random interval)
- Canvas resizes with viewport
- RequestAnimationFrame loop

### Email Reveal

- Button shows "Contact" or "Email"
- On click: button text fades/transforms to reveal email
- Email is constructed in JS (not in HTML source)
- Becomes clickable mailto link

### Notes Visibility

- Check for any published notes at build time
- If none exist, don't render "Notes" link on main page
- When at least one `published: true` post exists, link appears

## Design Decisions

- **LinkedIn:** https://www.linkedin.com/in/doug-fritz-aaa26b4/
- **Favicon:** Keep existing
- **Font:** Space Grotesk - geometric, modern, slightly warmer than Inter, good personality without being quirky
