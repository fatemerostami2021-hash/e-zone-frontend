const fs = require('fs');
const p = 'src/components/Hero3D.jsx';
let s = fs.readFileSync(p, 'utf8');
const n = s.replace(/\r?\n\s*if \(when === 'desktop' && isSmall\) return undefined;/, '');
if (n === s) console.log('guard line already removed');
else { fs.writeFileSync(p, n); console.log('guard line removed'); }
