set -e
test -f src/components/Hero3D.jsx
cp src/components/Hero3D.jsx src/components/Hero3D.jsx.bak4
cp src/pages/HomePage.fx.css src/pages/HomePage.fx.css.bak10

python3 - <<'PY'
p = 'src/components/Hero3D.jsx'
s = open(p, encoding='utf-8').read()

# 1) city names
s = s.replace(
"const LINKS =",
"""const ZONE_NAMES = ['Chabahar', 'Arvand', 'Anzali', 'Salafchegan'];
const HUB_NAMES = ['Dubai', 'Istanbul', 'Shanghai', 'Rotterdam', 'Mumbai', 'Moscow'];
const LINKS =""", 1)

# 2) label sprites (inserted before applyColors)
labels = """
      // English city labels (canvas sprites, hidden automatically on the far side)
      const makeLabel = (text, strong) => {
        const cv = document.createElement('canvas');
        cv.width = 256;
        cv.height = 64;
        const cx = cv.getContext('2d');
        cx.font = `${strong ? 700 : 600} ${strong ? 30 : 26}px sans-serif`;
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
        sp.scale.set(w * (isSmall ? 1.25 : 1), (w / 4) * (isSmall ? 1.25 : 1), 1);
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

      const applyColors"""
s = s.replace("\n      const applyColors", labels, 1)

# 3) dispose label textures
s = s.replace(
"if (o.material) o.material.dispose();",
"if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }", 1)

# 4) slightly closer camera = bigger globe inside its box
s = s.replace("camera.position.set(0, 0, 4.1)", "camera.position.set(0, 0, 3.6)", 1)
open(p, 'w', encoding='utf-8').write(s)
PY

cat >> src/pages/HomePage.fx.css <<'CSS'

/* ===== Hero globe v7: big, centered beside the buttons, not behind the stats card ===== */
@media (min-width: 901px) {
  .ez-home .ezh-hero3d {
    width: var(--h3d-size, min(42vw, 740px));
    height: var(--h3d-size, min(42vw, 740px));
    left: var(--h3d-left, 33%);
    right: auto;
    inset-inline-start: auto;
    top: var(--h3d-top, 2%);
    z-index: 1;
    pointer-events: none;
  }
}
CSS

echo ---CHECK
grep -n "ZONE_NAMES\|makeLabel\|camera.position" src/components/Hero3D.jsx | head
npx eslint src/components/Hero3D.jsx src/pages/HomePage.jsx
npm run build
