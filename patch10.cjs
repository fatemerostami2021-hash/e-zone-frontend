const fs = require('fs');
const p = 'src/pages/HomePage.jsx';
if (!fs.existsSync('src/components/Process3D.jsx')) {
  console.error('STOP: src/components/Process3D.jsx does not exist. Create it first (previous message, step 1).');
  process.exit(1);
}
let s = fs.readFileSync(p, 'utf8');

const a = s.indexOf('{/* Features */}');
const b = s.indexOf('{/* Logistics */}');
if (a < 0 || b < 0 || b < a) {
  console.error('STOP: section markers not found in HomePage.jsx');
  process.exit(1);
}

const section = `{/* Process: 3D route (replaces Features + Steps) */}
      <section className="ezh-section ezh-process-section" data-bleed>
        <div className="ezh-head" data-stagger>
          <span className="ezh-eyebrow">{t('homePage.steps.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.steps.title')}</h2>
        </div>
        <div className="ezh-process" data-fx="scale">
          <Process3D />
        </div>
      </section>

      `;
s = s.slice(0, a) + section + s.slice(b);

// imports: drop ModuleVisual (no longer used), add Process3D
s = s.replace(/import ModuleVisual from '..\/components\/ModuleVisual';\r?\n/, '');
if (!s.includes("import Process3D")) {
  s = s.replace("import Hero3D from '../components/Hero3D';", "import Hero3D from '../components/Hero3D';\nimport Process3D from '../components/Process3D';");
}

// drop the old STEPS constant
s = s.replace(/const STEPS = \[[\s\S]*?\r?\n\];\r?\n\r?\n/, '');

if (!s.includes('<Process3D />') || s.includes('const STEPS') || s.includes('ModuleVisual')) {
  console.error('PATCH FAILED: nothing was written');
  process.exit(1);
}
fs.writeFileSync(p, s);
console.log('patched HomePage.jsx');
