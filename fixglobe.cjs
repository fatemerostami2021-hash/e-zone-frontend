const fs = require('fs');
const p = 'src/pages/HomePage.fx.css';
let s = fs.readFileSync(p, 'utf8');
const marker = '/* ===== Hero globe v9: always centered (fa + en), behind the text ===== */';
const i = s.indexOf(marker);
if (i < 0) { console.error('v9 block not found'); process.exit(1); }
s = s.slice(0, i).trimEnd() + '\n';
s += `
/* ===== Hero globe v10: centered with margin:auto (no transform) ===== */
@media (min-width: 901px) {
  .ez-home .ezh-vhero-banner .ezh-hero3d {
    position: absolute;
    inset: 0;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    inset-inline-end: 0;
    transform: none;
    width: min(44vw, 720px);
    height: min(44vw, 720px);
    max-height: 92%;
    z-index: 1;
    pointer-events: none;
  }
}
`;
fs.writeFileSync(p, s);
console.log('fixed');
