const fs = require('fs');
const p = 'src/components/Hero3D.jsx';
let s = fs.readFileSync(p, 'utf8');

// 1) city names
s = s.replace(
  'const LINKS =',
  "const ZONE_NAMES = ['Chabahar', 'Arvand', 'Anzali', 'Salafchegan'];\nconst HUB_NAMES = ['Dubai', 'Istanbul', 'Shanghai', 'Rotterdam', 'Mumbai', 'Moscow'];\nconst LINKS ="
);

// 2) label sprites
const labels = `
      // English city labels (canvas sprites)
      const makeLabel = (text, strong) => {
        const cv = document.createElement('canvas');
        cv.width = 256;
        cv.height = 64;
        const cx = cv.getContext('2d');
        cx.font = (strong ? 700 : 600) + ' ' + (strong ? 30 : 26) + 'px sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.lineWidth = 6;
        cx.strokeStyle = 'rgba(2,10,24,0.85)';
        cx.strokeText(text, 128, 32);
        cx.fillStyle = strong ? '#ffc247' : '#ffffff';
        cx.fillText(text, 128, 32);
        const tex = new THREE.CanvasTexture(cv);
        tex.anisotropy = 4;
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
        const w = strong ? 0.5 : 0.42;
        const k = isSmall ? 1.25 : 1;
        sp.scale.set(w * k, (w / 4) * k, 1);
        sp.renderOrder = 5;
        return sp;
      };
      ZONES.forEach(([lat, lon], i) => {
        const sp = makeLabel(ZONE_NAMES[i], true);
        sp.position.copy(ll(lat, lon, R * 1.13));
        globe.add(sp);
      });
      HUBS.forEach(([lat, lon], i) => {
        const sp = makeLabel(HUB_NAMES[i], false);
        sp.position.copy(ll(lat, lon, R * 1.1));
        globe.add(sp);
      });

      const applyColors`;
s = s.replace('\n      const applyColors', labels);

// 3) dispose label textures
s = s.replace(
  'if (o.material) o.material.dispose();',
  'if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }'
);

// 4) closer camera = bigger globe
s = s.replace('camera.position.set(0, 0, 4.1)', 'camera.position.set(0, 0, 3.6)');

fs.writeFileSync(p, s);
console.log('patched Hero3D.jsx');
