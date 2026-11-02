const fs = require('fs');
const path = require('path');
const changed = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(json|js|jsx)$/.test(f.name)) {
      const s = fs.readFileSync(p, 'utf8');
      const n = s.replace(/(["'`])خانه\1/g, '$1صفحه اصلی$1');
      if (n !== s) { fs.writeFileSync(p, n); changed.push(p); }
    }
  }
})('src');
console.log(changed.length ? changed.join('\n') : 'nothing found');
