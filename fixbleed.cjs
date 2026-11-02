const fs = require('fs');
const p = 'src/pages/HomePage.fx.css';
let s = fs.readFileSync(p, 'utf8');
const n = s.replace(/\.ez-home \{ overflow-x: clip; \}\r?\n?/, '');
if (n === s) console.log('overflow rule not found (already removed?)');
else console.log('overflow rule removed');
fs.writeFileSync(p, n);
