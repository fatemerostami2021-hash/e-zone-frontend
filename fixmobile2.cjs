const fs = require('fs');
const p = 'src/components/Hero3D.jsx';
let s = fs.readFileSync(p, 'utf8');
if (s.includes('isSmall) return;')) { console.log('already patched'); process.exit(0); }
const a = `HUBS.forEach(([lat, lon], i) => {
        const sp = makeLabel(HUB_NAMES[i], false);`;
if (!s.includes(a)) { console.error('NOT FOUND: hub label block'); process.exit(1); }
s = s.replace(a, () => `HUBS.forEach(([lat, lon], i) => {
        if (isSmall) return;
        const sp = makeLabel(HUB_NAMES[i], false);`);
const b = 'const k = isSmall ? 1.25 : 1;';
if (s.includes(b)) s = s.replace(b, () => 'const k = isSmall ? 0.8 : 1;');
fs.writeFileSync(p, s);
console.log('patched Hero3D.jsx');
