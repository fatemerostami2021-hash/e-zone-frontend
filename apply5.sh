set -e
test -f src/components/Hero3D.jsx.bak1
test -f src/pages/HomePage.jsx.bak7
test -f public/image/import-export-process.webp
cp src/components/Hero3D.jsx src/components/Hero3D.jsx.bak2
cp src/pages/HomePage.jsx src/pages/HomePage.jsx.bak8
cp src/pages/HomePage.fx.css src/pages/HomePage.fx.css.bak8
# undo the mobile-hero placement (apply4) for the page and css only
cp src/pages/HomePage.jsx.bak7 src/pages/HomePage.jsx
cp src/pages/HomePage.fx.css.bak7 src/pages/HomePage.fx.css

cat > patch5.cjs <<'JS'
const fs = require('fs');
const rep = (src, from, to) => {
  if (!src.includes(from)) throw new Error('NOT FOUND: ' + from.slice(0, 70));
  return src.replace(from, to);
};

// ---- Hero3D.jsx ----
let h = fs.readFileSync('src/components/Hero3D.jsx', 'utf8');
h = rep(h, "export default function Hero3D({ className = 'ezh-hero3d' }) {",
  "export default function Hero3D({ className = 'ezh-hero3d', when = 'desktop' }) {");
h = rep(h, "if (slow || reduce) return undefined;",
  "const isSmall = window.matchMedia('(max-width: 900px)').matches;\n    if (slow || reduce) return undefined;\n    if (when === 'desktop' && isSmall) return undefined;\n    if (when === 'mobile' && !isSmall) return undefined;");
h = rep(h, "    let idle;\n    let timer;\n", "    let idle;\n    let timer;\n    let lazyIo;\n");
h = rep(h, "    const start = () => {\n",
  "    const start = () => {\n      if (when === 'mobile') {\n        lazyIo = new IntersectionObserver(([e]) => {\n          if (!e.isIntersecting) return;\n          lazyIo.disconnect();\n          boot();\n        }, { rootMargin: '400px' });\n        lazyIo.observe(box);\n        return;\n      }\n");
h = rep(h, "      clearTimeout(timer);\n      cleanup();", "      clearTimeout(timer);\n      if (lazyIo) lazyIo.disconnect();\n      cleanup();");
h = rep(h, "  }, []);\n\n  return <div", "  }, [when]);\n\n  return <div");
h = rep(h, "const sy = window.scrollY || 0;",
  "const sy = when === 'desktop' ? window.scrollY || 0 : 0;\n        const rc = box.getBoundingClientRect();\n        const sr = when === 'desktop' ? sy * 0.0012 : (window.innerHeight / 2 - (rc.top + rc.height / 2)) * 0.003;");
h = rep(h, "mouse.x * 0.6 + sy * 0.0012;", "mouse.x * 0.6 + sr;");
fs.writeFileSync('src/components/Hero3D.jsx', h);

// ---- HomePage.jsx ----
let p = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');
p = rep(p, '<Hero3D />', '<Hero3D when="desktop" />');
const a = p.indexOf('const STEPS = [');
if (a < 0) throw new Error('STEPS not found');
const aEnd = p.indexOf('];\n\n', a) + 4;
p = p.slice(0, a) + p.slice(aEnd);
const s = p.indexOf('      {/* Steps */}');
const l = p.indexOf('      {/* Logistics */}');
if (s < 0 || l < 0 || s > l) throw new Error('Steps/Logistics markers not found');
const snippet = [
  "      {/* Process: 3D globe (mobile) + infographic slide */}",
  '      <section className="ezh-section ezh-process" data-bleed>',
  '        <div className="ezh-head" data-stagger>',
  "          <span className=\"ezh-eyebrow\">{t('homePage.steps.eyebrow')}</span>",
  "          <h2 className=\"ezh-section-title\">{t('homePage.steps.title')}</h2>",
  '        </div>',
  '        <Hero3D when="mobile" className="ezh-proc3d" />',
  '        <div className="ezh-process-slide" data-fx="scale">',
  '          <div className="ezh-process-scroll">',
  "            <img src=\"/image/import-export-process.webp\" alt={t('homePage.steps.title')} width=\"1710\" height=\"920\" loading=\"lazy\" decoding=\"async\" />",
  '          </div>',
  '        </div>',
  '      </section>',
  '',
  '',
].join('\n');
p = p.slice(0, s) + snippet + p.slice(l);
fs.writeFileSync('src/pages/HomePage.jsx', p);
console.log('patched');
JS
node patch5.cjs
rm patch5.cjs

cat >> src/pages/HomePage.fx.css <<'CSS'

/* ===== Process section: infographic slide + mobile-only 3D globe ===== */
.ez-home .ezh-process { padding-inline: 0; }
.ez-home .ezh-process .ezh-head { padding-inline: var(--page-gutter, 1.25rem); }
.ez-home .ezh-process-slide {
  width: 100%;
  background: var(--color-surface);
  border-block: 1px solid var(--color-border);
}
.ez-home .ezh-process-scroll {
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}
.ez-home .ezh-process-scroll img {
  display: block;
  width: 100%;
  height: auto;
  max-width: none;
}
.ez-home .ezh-proc3d { display: none; }
@media (max-width: 900px) {
  .ez-home .ezh-process-scroll img { width: 280vw; }
  .ez-home .ezh-proc3d {
    display: block;
    position: relative;
    width: min(88vw, 400px);
    aspect-ratio: 1;
    margin: 0.25rem auto 1rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 1.2s ease;
  }
  .ez-home .ezh-proc3d.is-ready { opacity: 1; }
  .ez-home .ezh-proc3d canvas { display: block; width: 100%; height: 100%; }
}
CSS

echo ---CHECK
grep -n "Hero3D\|ezh-process\|STEPS" src/pages/HomePage.jsx
grep -n "when" src/components/Hero3D.jsx | head -12
npx eslint src/components/Hero3D.jsx src/pages/HomePage.jsx
npm run build
