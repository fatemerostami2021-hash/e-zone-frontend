set -e
cp src/pages/HomePage.jsx src/pages/HomePage.jsx.bak6
cp src/pages/HomePage.fx.css src/pages/HomePage.fx.css.bak6
npm ls three >/dev/null 2>&1 || npm install three

cat > src/components/Hero3D.jsx <<'JSX'
import { useEffect, useRef } from 'react';

// [lat, lon] of the four zones and of the trade hubs they connect to
const ZONES = [[25.3, 60.6], [30.4, 48.2], [37.5, 49.5], [34.5, 50.5]];
const HUBS = [[25.2, 55.3], [41.0, 29.0], [31.2, 121.5], [51.9, 4.5], [19.1, 72.9], [55.7, 37.6]];
// [zone index, hub index]
const LINKS = [[0, 0], [0, 4], [0, 2], [1, 0], [1, 3], [2, 5], [2, 1], [3, 1], [3, 3]];

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Real WebGL globe for the hero (desktop only).
 * Lazy-loads three after page load + idle, pauses when off screen,
 * and does nothing on mobile, Save-Data, 2G, reduced-motion or without WebGL.
 */
export default function Hero3D({ className = 'ezh-hero3d' }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slow || reduce || window.matchMedia('(max-width: 900px)').matches) return undefined;

    let disposed = false;
    let cleanup = () => {};
    let idle;
    let timer;

    const boot = async () => {
      let THREE;
      try { THREE = await import('three'); } catch { return; }
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch { return; }

      const R = 1;
      const ll = (lat, lon, r) => {
        const phi = ((90 - lat) * Math.PI) / 180;
        const th = ((lon + 180) * Math.PI) / 180;
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
      };

      renderer.setClearColor(0x000000, 0);
      box.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.set(0, 0, 4.6);
      const tilt = new THREE.Group();
      const globe = new THREE.Group();
      tilt.add(globe);
      scene.add(tilt);

      // invisible occluder: hides the back side of the globe
      const occluder = new THREE.Mesh(
        new THREE.SphereGeometry(R * 0.99, 48, 48),
        new THREE.MeshBasicMaterial({ colorWrite: false }),
      );
      occluder.renderOrder = -1;
      globe.add(occluder);

      // dotted sphere
      const N = 1600;
      const pos = new Float32Array(N * 3);
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i += 1) {
        const y = 1 - (i / (N - 1)) * 2;
        const rr = Math.sqrt(1 - y * y);
        const th = ga * i;
        pos[i * 3] = Math.cos(th) * rr * R;
        pos[i * 3 + 1] = y * R;
        pos[i * 3 + 2] = Math.sin(th) * rr * R;
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const dotMat = new THREE.PointsMaterial({ size: 0.018, transparent: true, opacity: 0.55, depthWrite: false });
      globe.add(new THREE.Points(dotGeo, dotMat));

      // graticule
      const seg = [];
      const addSeg = (a1, o1, a2, o2) => {
        const a = ll(a1, o1, R);
        const b = ll(a2, o2, R);
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
      };
      for (let lat = -60; lat <= 60; lat += 30) {
        for (let lon = -180; lon < 180; lon += 6) addSeg(lat, lon, lat, lon + 6);
      }
      for (let lon = -180; lon < 180; lon += 30) {
        for (let lat = -84; lat < 84; lat += 6) addSeg(lat, lon, lat + 6, lon);
      }
      const gridGeo = new THREE.BufferGeometry();
      gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
      const gridMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.16, depthWrite: false });
      globe.add(new THREE.LineSegments(gridGeo, gridMat));

      // markers
      const primaryMats = [];
      const accentMats = [];
      const zoneMat = new THREE.MeshBasicMaterial();
      const hubMat = new THREE.MeshBasicMaterial();
      primaryMats.push(zoneMat);
      accentMats.push(hubMat);
      const zoneGeo = new THREE.SphereGeometry(0.026, 16, 16);
      const hubGeo = new THREE.SphereGeometry(0.014, 12, 12);
      const ringGeo = new THREE.RingGeometry(0.03, 0.037, 40);
      const rings = [];
      const zz = new THREE.Vector3(0, 0, 1);
      ZONES.forEach(([lat, lon], i) => {
        const p = ll(lat, lon, R * 1.003);
        const m = new THREE.Mesh(zoneGeo, zoneMat);
        m.position.copy(p);
        globe.add(m);
        const rm = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
        primaryMats.push(rm);
        const ring = new THREE.Mesh(ringGeo, rm);
        ring.position.copy(p);
        ring.quaternion.setFromUnitVectors(zz, p.clone().normalize());
        globe.add(ring);
        rings.push({ ring, rm, phase: i * 0.25 });
      });
      HUBS.forEach(([lat, lon]) => {
        const m = new THREE.Mesh(hubGeo, hubMat);
        m.position.copy(ll(lat, lon, R * 1.003));
        globe.add(m);
      });

      // arcs + travelling pulses
      const arcMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6, depthWrite: false });
      accentMats.push(arcMat);
      const pulseMat = new THREE.MeshBasicMaterial();
      primaryMats.push(pulseMat);
      const pulseGeo = new THREE.SphereGeometry(0.016, 12, 12);
      const pulses = [];
      LINKS.forEach(([zi, hi], i) => {
        const a = ll(ZONES[zi][0], ZONES[zi][1], R * 1.003);
        const b = ll(HUBS[hi][0], HUBS[hi][1], R * 1.003);
        const ctrl = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1 + a.distanceTo(b) * 0.38));
        const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
        globe.add(new THREE.Line(geo, arcMat));
        const dot = new THREE.Mesh(pulseGeo, pulseMat);
        globe.add(dot);
        pulses.push({ curve, dot, offset: i * 0.137 });
      });

      const applyColors = () => {
        const accent = new THREE.Color(css('--color-accent') || 'white');
        const primary = new THREE.Color(css('--color-primary') || 'white');
        dotMat.color.copy(accent);
        gridMat.color.copy(accent);
        accentMats.forEach((m) => m.color.copy(accent));
        primaryMats.forEach((m) => m.color.copy(primary));
      };
      applyColors();
      const themeObs = new MutationObserver(applyColors);
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      const resize = () => {
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (!w || !h) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(box);

      const focus = ll(32, 52, 1);
      const base = -Math.atan2(focus.x, focus.z);
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e) => {
        mouse.tx = e.clientX / window.innerWidth - 0.5;
        mouse.ty = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const clock = new THREE.Clock();
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const t = clock.getElapsedTime();
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        const sy = window.scrollY || 0;
        globe.rotation.y = base + Math.sin(t * 0.25) * 0.35 + mouse.x * 0.6 + sy * 0.0012;
        tilt.rotation.x = 0.42 + mouse.y * 0.25 - Math.min(sy, 800) * 0.0003;
        pulses.forEach((p) => {
          p.dot.position.copy(p.curve.getPoint((t * 0.14 + p.offset) % 1));
        });
        rings.forEach((r) => {
          const ph = (t * 0.8 + r.phase) % 1;
          r.ring.scale.setScalar(1 + ph * 2.2);
          r.rm.opacity = 0.7 * (1 - ph);
        });
        renderer.render(scene, camera);
      };
      const run = () => { if (!raf) frame(); };
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };
      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? run() : stop()));
      io.observe(box);
      requestAnimationFrame(() => box.classList.add('is-ready'));

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        themeObs.disconnect();
        window.removeEventListener('pointermove', onMove);
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) o.material.dispose();
        });
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        box.classList.remove('is-ready');
      };
    };

    const start = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(boot, { timeout: 3000 });
      else timer = setTimeout(boot, 1200);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener('load', start);
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return <div ref={boxRef} className={className} aria-hidden="true" />;
}
JSX

sed -i "/^import HeroVideo/a import Hero3D from '../components/Hero3D';" src/pages/HomePage.jsx
sed -i '/ezh-vhero-shade/a\          <Hero3D />' src/pages/HomePage.jsx

cat >> src/pages/HomePage.fx.css <<'CSS'

/* ===== Hero 3D globe (desktop only). Tune with --h3d-size / --h3d-top / --h3d-end ===== */
.ez-home .ezh-hero3d {
  position: absolute;
  z-index: 2;
  width: var(--h3d-size, min(36vw, 460px));
  aspect-ratio: 1;
  top: var(--h3d-top, 7%);
  inset-inline-end: var(--h3d-end, clamp(1rem, 5vw, 5rem));
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.4s ease;
}
.ez-home .ezh-hero3d.is-ready { opacity: 0.95; }
.ez-home .ezh-hero3d canvas { display: block; width: 100%; height: 100%; }
@media (max-width: 900px) {
  .ez-home .ezh-hero3d { display: none; }
}
CSS

echo ---CHECK
grep -n "Hero3D" src/pages/HomePage.jsx
npx eslint src/components/Hero3D.jsx src/pages/HomePage.jsx
npm run build
