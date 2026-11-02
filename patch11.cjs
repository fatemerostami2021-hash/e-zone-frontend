const fs = require('fs');
const p = 'src/components/Process3D.jsx';
let s = fs.readFileSync(p, 'utf8');
if (s.includes('hh: 2.8')) { console.log('already patched'); process.exit(0); }
const n = s.replace('hh: 3.4,', 'hh: 2.8,');
if (n === s) { console.error('hh not found'); process.exit(1); }
fs.writeFileSync(p, n);
console.log('patched Process3D.jsx');
