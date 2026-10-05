# E-ZONE frontend - luxury / cinematic design rules

Skills live in `.claude/skills/`. For ANY UI work (new page, hero, section, component restyle) read the relevant skills FIRST:
- Look and typography: `mega-frontend-design`, `frontend-design-anthropic`
- Motion and cinematic feel: `premium-website-builder`, `modern-site-engineering`
- 3D / WebGL: `threejs-*` (use `threejs-r3f`, `threejs-product-viewer`, `threejs-performance` first)
- Scroll video hero: `video-to-website`
- Reverse-engineer a reference site: `website-analyzer`

## Project constraints (override skill defaults)
- Stack: React + Vite, PLAIN CSS design system (`src/styles/tokens.css`, `ez-*` class prefix). Do NOT introduce Tailwind. Translate skill examples into tokens + `ez-*` classes.
- Bilingual fa/en with automatic RTL/LTR (react-i18next). Every layout, animation direction, marquee and slide must work in RTL. Persian text: pick a proper Persian display + body font, never Latin-only fonts; no letter-spacing on Persian.
- Cinematic effects (GSAP, Lenis, Three.js, video scroll) are for PUBLIC pages (home, about, modules, contact, login). Inside the protected `/app` (tables, forms, drawers) keep it refined and fast: subtle micro-interactions only, no heavy WebGL.
- Always honor `prefers-reduced-motion`; lazy-load Three.js / heavy libs; keep Lighthouse performance in mind; mobile first.
- Anti-generic: no purple gradients, no default Inter-only look, no card-grid-everything.
- Before adding a dependency (gsap, lenis, three, @react-three/fiber, framer-motion) say so and ask approval.
- Working protocol: cat the real file first, small reversible changes, back up before edits, lint + build after (`npm run lint && npm run build`). Persian text files edited in VS Code only.
