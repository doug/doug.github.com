# Personal Site Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace legacy static site with a clean Astro-based personal page featuring a subtle boids particle background.

**Architecture:** Single-page Astro site with TypeScript. Main page shows name, tagline, social links, email reveal, and publications. Canvas-based particle system runs in background. /notes route built but hidden until content exists.

**Tech Stack:** Astro 4.x, TypeScript, vanilla CSS, GitHub Actions, GitHub Pages

---

## Task 1: Delete Legacy Content

**Files:**
- Delete: `_layouts/`, `explorations/`, `projects/`, `css/`, `js/`, `images/`, `thoughts/`, `writing/`, `t/`
- Delete: `*.html` (except keep nothing), `*.old.html`, `*.markdown`, `atom.xml`, `old_config.yml`, `style.css`
- Keep: `CNAME`, `favicon.ico`, `favicon.png`, `.gitignore`, `.nojekyll`, `docs/`

**Step 1: Delete legacy directories**

```bash
cd /Users/dougfritz/src/doug.github.com/.worktrees/personal-site-redesign
rm -rf _layouts explorations projects css js images thoughts writing t
```

**Step 2: Delete legacy files**

```bash
rm -f *.html *.markdown atom.xml old_config.yml style.css readme.html
```

**Step 3: Verify only essential files remain**

```bash
ls -la
```

Expected: Only `CNAME`, `favicon.ico`, `favicon.png`, `.gitignore`, `.nojekyll`, `docs/`, `.git`

**Step 4: Commit**

```bash
git add -A
git commit -m "Delete all legacy content

Fresh start for site redesign. Keeping only:
- CNAME (domain config)
- favicons
- .gitignore, .nojekyll
- docs/plans (design documentation)"
```

---

## Task 2: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/pages/index.astro` (placeholder)
- Modify: `.gitignore`

**Step 1: Initialize Astro**

```bash
cd /Users/dougfritz/src/doug.github.com/.worktrees/personal-site-redesign
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

When prompted, accept defaults. This creates the base Astro structure.

**Step 2: Move favicons to public/**

```bash
mkdir -p public
mv favicon.ico favicon.png CNAME .nojekyll public/
```

**Step 3: Update .gitignore for Astro**

Replace `.gitignore` contents with:

```
# Astro
dist/
.astro/

# Dependencies
node_modules/

# Environment
.env
.env.*

# OS
.DS_Store

# Worktrees
.worktrees
```

**Step 4: Verify Astro runs**

```bash
npm run dev
```

Expected: Dev server starts at localhost:4321

**Step 5: Stop dev server and commit**

```bash
git add -A
git commit -m "Initialize Astro project with TypeScript

- Astro 4.x with strict TypeScript
- Moved favicons and CNAME to public/
- Updated .gitignore for Astro build artifacts"
```

---

## Task 3: Set Up GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create workflows directory**

```bash
mkdir -p .github/workflows
```

**Step 2: Create deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Astro
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Update astro.config.mjs for GitHub Pages**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.dougfritz.com',
  output: 'static',
});
```

**Step 4: Verify build works**

```bash
npm run build
ls dist/
```

Expected: `dist/` contains `index.html`, `favicon.ico`, etc.

**Step 5: Commit**

```bash
git add -A
git commit -m "Add GitHub Actions workflow for deployment

- Builds on push to master
- Deploys to GitHub Pages
- Configured site URL in astro.config.mjs"
```

---

## Task 4: Create Global Styles

**Files:**
- Create: `src/styles/global.css`

**Step 1: Create styles directory**

```bash
mkdir -p src/styles
```

**Step 2: Create global.css**

```css
/* Import Space Grotesk from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  /* Colors */
  --color-bg: #F9F7F4;
  --color-text: #2D2D2D;
  --color-text-secondary: #6B6B6B;
  --color-accent: #E91E8C;

  /* Particle colors */
  --color-particle-grey: #9CA3AF;
  --color-particle-green: #A7C4A0;
  --color-particle-blue: #A5C4D4;

  /* Typography */
  --font-family: 'Space Grotesk', system-ui, sans-serif;
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 3rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-accent);
}

button {
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  border: none;
  background: none;
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add global styles with color palette and typography

- Space Grotesk font
- Warm off-white background
- CSS custom properties for colors and spacing"
```

---

## Task 5: Create Main Page Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create layouts directory**

```bash
mkdir -p src/layouts
```

**Step 2: Create BaseLayout.astro**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
}

const { title = 'Doug Fritz' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Doug Fritz - Principal Engineer at Google DeepMind, focused on AI for Science" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Step 3: Create index.astro with main content**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <main class="container">
    <div class="content">
      <h1 class="name">Doug Fritz</h1>
      <p class="tagline">Principal Engineer at Google DeepMind, focused on AI for Science</p>
      <p class="education">CMU · MIT</p>

      <nav class="social">
        <a href="https://github.com/doug" target="_blank" rel="noopener">GitHub</a>
        <span class="separator">·</span>
        <a href="https://www.linkedin.com/in/doug-fritz-aaa26b4/" target="_blank" rel="noopener">LinkedIn</a>
        <span class="separator">·</span>
        <a href="https://twitter.com/dohug" target="_blank" rel="noopener">X</a>
      </nav>

      <div class="email">
        <button class="email-reveal" id="email-reveal">Contact</button>
      </div>

      <section class="publications">
        <h2 class="section-title">Selected Work</h2>
        <ul class="publication-list">
          <li>
            <a href="https://idl.cs.washington.edu/files/2018-TensorFlowGraph-VAST.pdf" target="_blank" rel="noopener">
              Visualizing Dataflow Graphs in TensorFlow
            </a>
            <span class="pub-meta">· IEEE VAST 2018 · Best Paper</span>
          </li>
          <li>
            <a href="https://arxiv.org/abs/2112.11446" target="_blank" rel="noopener">
              Scaling Language Models (Gopher)
            </a>
            <span class="pub-meta">· DeepMind 2021</span>
          </li>
        </ul>
      </section>
    </div>
  </main>
</BaseLayout>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
    position: relative;
  }

  .content {
    text-align: center;
    max-width: 600px;
    z-index: 1;
  }

  .name {
    font-size: var(--font-size-3xl);
    font-weight: 600;
    margin-bottom: var(--space-sm);
    letter-spacing: -0.02em;
  }

  .tagline {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xs);
  }

  .education {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xl);
  }

  .social {
    margin-bottom: var(--space-lg);
  }

  .social a {
    font-size: var(--font-size-base);
  }

  .separator {
    margin: 0 var(--space-sm);
    color: var(--color-text-secondary);
  }

  .email {
    margin-bottom: var(--space-2xl);
  }

  .email-reveal {
    padding: var(--space-sm) var(--space-lg);
    border: 1px solid var(--color-text);
    border-radius: 4px;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
  }

  .email-reveal:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .email-reveal.revealed {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .section-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-md);
  }

  .publication-list {
    list-style: none;
    text-align: left;
  }

  .publication-list li {
    margin-bottom: var(--space-sm);
    font-size: var(--font-size-sm);
  }

  .pub-meta {
    color: var(--color-text-secondary);
  }

  @media (max-width: 480px) {
    .name {
      font-size: var(--font-size-2xl);
    }

    .tagline {
      font-size: var(--font-size-base);
    }

    .publication-list {
      text-align: center;
    }

    .pub-meta {
      display: block;
    }
  }
</style>

<script>
  const button = document.getElementById('email-reveal');
  if (button) {
    button.addEventListener('click', () => {
      const email = ['doug', 'dougfritz.com'].join('@');
      button.textContent = email;
      button.classList.add('revealed');

      // Make it a clickable mailto link on second click
      if (button.classList.contains('revealed')) {
        button.onclick = () => {
          window.location.href = `mailto:${email}`;
        };
      }
    });
  }
</script>
```

**Step 4: Verify page renders**

```bash
npm run dev
```

Open http://localhost:4321 - should see centered content with name, tagline, links, and publications.

**Step 5: Commit**

```bash
git add -A
git commit -m "Create main page layout with content

- BaseLayout with meta tags
- Centered layout with name, tagline, education
- Social links, email reveal button
- Publications section with links"
```

---

## Task 6: Create Boids Particle System (TypeScript)

**Files:**
- Create: `src/scripts/particles.ts`

**Step 1: Create scripts directory**

```bash
mkdir -p src/scripts
```

**Step 2: Create particles.ts**

```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  radius: number;
  isFuschia: boolean;
  fuschiaLife?: number;
}

interface BoidsConfig {
  particleCount: number;
  maxSpeed: number;
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  mouseRadius: number;
  mouseForce: number;
}

const COLORS = {
  grey: '#9CA3AF',
  green: '#A7C4A0',
  blue: '#A5C4D4',
  fuschia: '#E91E8C',
};

const CONFIG: BoidsConfig = {
  particleCount: 50,
  maxSpeed: 0.5,
  separationDistance: 30,
  alignmentDistance: 60,
  cohesionDistance: 80,
  separationWeight: 0.02,
  alignmentWeight: 0.01,
  cohesionWeight: 0.005,
  mouseRadius: 100,
  mouseForce: 0.3,
};

export function initParticles(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = -1000;
  let mouseY = -1000;
  let animationId: number;

  const particles: Particle[] = [];
  const normalColors = [COLORS.grey, COLORS.green, COLORS.blue];

  // Adjust particle count for mobile
  const isMobile = width < 768;
  const particleCount = isMobile ? Math.floor(CONFIG.particleCount * 0.6) : CONFIG.particleCount;

  function resize(): void {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticle(isFuschia = false): Particle {
    const color = isFuschia
      ? COLORS.fuschia
      : normalColors[Math.floor(Math.random() * normalColors.length)];

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed,
      color,
      opacity: isFuschia ? 0.8 : 0.3 + Math.random() * 0.4,
      radius: isFuschia ? 3 : 2 + Math.random() * 2,
      isFuschia,
      fuschiaLife: isFuschia ? 300 + Math.random() * 200 : undefined,
    };
  }

  function init(): void {
    resize();
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function separation(particle: Particle): { x: number; y: number } {
    let steerX = 0;
    let steerY = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.separationDistance && dist > 0) {
        steerX += dx / dist;
        steerY += dy / dist;
        count++;
      }
    }

    if (count > 0) {
      steerX /= count;
      steerY /= count;
    }

    return { x: steerX * CONFIG.separationWeight, y: steerY * CONFIG.separationWeight };
  }

  function alignment(particle: Particle): { x: number; y: number } {
    let avgVx = 0;
    let avgVy = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.alignmentDistance) {
        avgVx += other.vx;
        avgVy += other.vy;
        count++;
      }
    }

    if (count > 0) {
      avgVx /= count;
      avgVy /= count;
      return {
        x: (avgVx - particle.vx) * CONFIG.alignmentWeight,
        y: (avgVy - particle.vy) * CONFIG.alignmentWeight,
      };
    }

    return { x: 0, y: 0 };
  }

  function cohesion(particle: Particle): { x: number; y: number } {
    let avgX = 0;
    let avgY = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.cohesionDistance) {
        avgX += other.x;
        avgY += other.y;
        count++;
      }
    }

    if (count > 0) {
      avgX /= count;
      avgY /= count;
      return {
        x: (avgX - particle.x) * CONFIG.cohesionWeight,
        y: (avgY - particle.y) * CONFIG.cohesionWeight,
      };
    }

    return { x: 0, y: 0 };
  }

  function mouseRepulsion(particle: Particle): { x: number; y: number } {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < CONFIG.mouseRadius && dist > 0) {
      const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
      return {
        x: (dx / dist) * force * CONFIG.mouseForce,
        y: (dy / dist) * force * CONFIG.mouseForce,
      };
    }

    return { x: 0, y: 0 };
  }

  function update(): void {
    // Occasionally spawn a fuschia particle
    if (Math.random() < 0.002) {
      const fuschiaCount = particles.filter(p => p.isFuschia).length;
      if (fuschiaCount < 2) {
        particles.push(createParticle(true));
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Update fuschia lifetime
      if (p.isFuschia && p.fuschiaLife !== undefined) {
        p.fuschiaLife--;
        if (p.fuschiaLife <= 0) {
          particles.splice(i, 1);
          continue;
        }
        // Fade out near end of life
        if (p.fuschiaLife < 50) {
          p.opacity = (p.fuschiaLife / 50) * 0.8;
        }
      }

      const sep = separation(p);
      const ali = alignment(p);
      const coh = cohesion(p);
      const mouse = mouseRepulsion(p);

      p.vx += sep.x + ali.x + coh.x + mouse.x;
      p.vy += sep.y + ali.y + coh.y + mouse.y;

      // Limit speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > CONFIG.maxSpeed) {
        p.vx = (p.vx / speed) * CONFIG.maxSpeed;
        p.vy = (p.vy / speed) * CONFIG.maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  function draw(): void {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function animate(): void {
    update();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  function handleMouseMove(e: MouseEvent): void {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseLeave(): void {
    mouseX = -1000;
    mouseY = -1000;
  }

  // Initialize
  init();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  animate();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
  };
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add boids particle system in TypeScript

- Separation, alignment, cohesion behaviors
- Mouse repulsion interaction
- Occasional fuschia particle spawning with fade-out
- Responsive particle count for mobile
- Cleanup function for proper teardown"
```

---

## Task 7: Create Particles Astro Component

**Files:**
- Create: `src/components/Particles.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create components directory**

```bash
mkdir -p src/components
```

**Step 2: Create Particles.astro**

```astro
---
// Particles canvas component
---

<canvas id="particles-canvas"></canvas>

<style>
  #particles-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>

<script>
  import { initParticles } from '../scripts/particles';

  const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
  if (canvas) {
    initParticles(canvas);
  }
</script>
```

**Step 3: Update index.astro to include Particles**

Add import and component at the top of the BaseLayout slot:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Particles from '../components/Particles.astro';
---

<BaseLayout>
  <Particles />
  <main class="container">
    <!-- rest of content stays the same -->
```

**Step 4: Verify particles render**

```bash
npm run dev
```

Open http://localhost:4321 - should see subtle particles drifting in background behind content.

**Step 5: Commit**

```bash
git add -A
git commit -m "Add Particles component to main page

- Fixed position canvas behind content
- Pointer-events disabled so content is clickable
- Imports and initializes TypeScript particle system"
```

---

## Task 8: Set Up Notes Content Collection

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/notes/.gitkeep`
- Create: `src/content/notes/example-draft.md` (unpublished)
- Update: `astro.config.mjs`

**Step 1: Create content directories**

```bash
mkdir -p src/content/notes
```

**Step 2: Create content config**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    published: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

export const collections = { notes };
```

**Step 3: Create example draft note**

```markdown
---
title: "Example Draft"
date: 2026-02-10
published: false
description: "This is a draft post that won't appear on the live site."
---

This is an example draft post. It exists in the repo but won't be built into the live site because `published: false`.

When you're ready to publish, change `published: true` and the note will appear.
```

**Step 4: Create .gitkeep**

```bash
touch src/content/notes/.gitkeep
```

**Step 5: Commit**

```bash
git add -A
git commit -m "Set up notes content collection

- Astro content collection with frontmatter schema
- published: boolean controls visibility
- Example draft post (unpublished)"
```

---

## Task 9: Create Notes Pages (Hidden Until Content Exists)

**Files:**
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/notes/[slug].astro`
- Modify: `src/pages/index.astro` (conditional notes link)

**Step 1: Create notes directory in pages**

```bash
mkdir -p src/pages/notes
```

**Step 2: Create notes index page**

```astro
---
// src/pages/notes/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const publishedNotes = await getCollection('notes', ({ data }) => data.published);

// If no published notes, this page still exists but won't be linked from home
const notes = publishedNotes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<BaseLayout title="Notes - Doug Fritz">
  <main class="container">
    <div class="content">
      <a href="/" class="back">&larr; Back</a>
      <h1>Notes</h1>

      {notes.length === 0 ? (
        <p class="empty">No notes yet.</p>
      ) : (
        <ul class="notes-list">
          {notes.map((note) => (
            <li>
              <a href={`/notes/${note.slug}`}>{note.data.title}</a>
              <time>{note.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  </main>
</BaseLayout>

<style>
  .container {
    min-height: 100vh;
    padding: var(--space-2xl);
    max-width: 600px;
    margin: 0 auto;
  }

  .back {
    display: inline-block;
    margin-bottom: var(--space-xl);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  h1 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-xl);
  }

  .empty {
    color: var(--color-text-secondary);
  }

  .notes-list {
    list-style: none;
  }

  .notes-list li {
    margin-bottom: var(--space-md);
  }

  .notes-list a {
    display: block;
    font-size: var(--font-size-lg);
  }

  .notes-list time {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
</style>
```

**Step 3: Create note detail page**

```astro
---
// src/pages/notes/[slug].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const notes = await getCollection('notes', ({ data }) => data.published);
  return notes.map((note) => ({
    params: { slug: note.slug },
    props: { note },
  }));
}

const { note } = Astro.props;
const { Content } = await note.render();
---

<BaseLayout title={`${note.data.title} - Doug Fritz`}>
  <main class="container">
    <article class="content">
      <a href="/notes" class="back">&larr; Notes</a>
      <header>
        <h1>{note.data.title}</h1>
        <time>{note.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      </header>
      <div class="prose">
        <Content />
      </div>
    </article>
  </main>
</BaseLayout>

<style>
  .container {
    min-height: 100vh;
    padding: var(--space-2xl);
    max-width: 600px;
    margin: 0 auto;
  }

  .back {
    display: inline-block;
    margin-bottom: var(--space-xl);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  header {
    margin-bottom: var(--space-2xl);
  }

  h1 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-sm);
  }

  time {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .prose {
    line-height: 1.7;
  }

  .prose :global(p) {
    margin-bottom: var(--space-md);
  }

  .prose :global(a) {
    color: var(--color-accent);
  }

  .prose :global(code) {
    background: rgba(0,0,0,0.05);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.9em;
  }
</style>
```

**Step 4: Update index.astro with conditional notes link**

Add this to the imports and content section of index.astro:

After the imports:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Particles from '../components/Particles.astro';
import { getCollection } from 'astro:content';

const publishedNotes = await getCollection('notes', ({ data }) => data.published);
const hasNotes = publishedNotes.length > 0;
---
```

Add this after the publications section, before closing `</div>`:
```astro
      {hasNotes && (
        <nav class="notes-link">
          <a href="/notes">Notes &rarr;</a>
        </nav>
      )}
```

Add this to the `<style>` block:
```css
  .notes-link {
    margin-top: var(--space-2xl);
  }

  .notes-link a {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
```

**Step 5: Verify build works**

```bash
npm run build
```

Should build without errors. Notes link should NOT appear on home page (no published notes).

**Step 6: Commit**

```bash
git add -A
git commit -m "Add notes pages with conditional visibility

- Notes index and detail pages
- Only shows link on home when published notes exist
- Filters unpublished notes at build time"
```

---

## Task 10: Final Cleanup and Verification

**Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build, no errors.

**Step 2: Preview production build**

```bash
npm run preview
```

Open http://localhost:4321 and verify:
- [ ] Name and tagline render correctly
- [ ] Social links work
- [ ] Email reveal button works
- [ ] Publications link to correct papers
- [ ] Particles animate smoothly
- [ ] Mouse interaction works
- [ ] No "Notes" link appears (no published notes)
- [ ] Mobile responsive (resize browser)

**Step 3: Check for any remaining issues**

```bash
npm run build 2>&1 | grep -i error
npm run build 2>&1 | grep -i warn
```

Fix any errors or warnings.

**Step 4: Final commit**

```bash
git add -A
git commit -m "Complete personal site redesign

Clean, minimal site with:
- Astro + TypeScript
- Boids particle background
- Click-to-reveal email
- Publications section
- Hidden /notes ready for future content
- GitHub Actions deployment"
```

---

## Summary

After completing all tasks, the site will have:

1. Clean Astro project with TypeScript
2. GitHub Actions deployment to GitHub Pages
3. Warm off-white design with Space Grotesk typography
4. Subtle boids particle system with occasional fuschia particles
5. Centered layout with name, tagline, education, social links
6. Click-to-reveal email (anti-scrape)
7. Selected publications section
8. /notes infrastructure (hidden until content published)

**To merge:** When ready, merge `feature/personal-site-redesign` into `master` and push to trigger deployment.
