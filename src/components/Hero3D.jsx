import { useEffect, useRef } from 'react';

// [lat, lon] of the four zones and of the trade hubs they connect to
const ZONES = [[25.3, 60.6], [30.4, 48.2], [37.5, 49.5], [34.5, 50.5]];
const HUBS = [[25.2, 55.3], [41.0, 29.0], [31.2, 121.5], [51.9, 4.5], [19.1, 72.9], [55.7, 37.6]];
// [zone index, hub index]
const ZONE_NAMES = ['Chabahar', 'Arvand', 'Anzali', 'Salafchegan'];
const HUB_NAMES = ['Dubai', 'Istanbul', 'Shanghai', 'Rotterdam', 'Mumbai', 'Moscow'];
const LINKS = [[0, 0], [0, 4], [0, 2], [1, 0], [1, 3], [2, 5], [2, 1], [3, 1], [3, 3]];

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Real WebGL globe. when="desktop": hero globe, reacts to mouse + page scroll.
 * when="mobile": process-section globe, lazy-loaded near the viewport, rotates with its own position.
 * Does nothing on Save-Data, 2G, reduced-motion or without WebGL.
 */
export default function Hero3D({ className = 'ezh-hero3d', when = 'desktop' }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 900px)').matches;
    if (slow || reduce) return undefined;
    if (when === 'mobile' && !isSmall) return undefined;

    let disposed = false;
    let cleanup = () => {};
    let idle;
    let timer;
    let lazyIo;

    const boot = async () => {
      let THREE;
      try { THREE = await import('three'); } catch { return; }
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !isSmall, alpha: true, powerPreference: 'low-power' });
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
      camera.position.set(0, 0, 3.6);
      const tilt = new THREE.Group();
      const globe = new THREE.Group();
      tilt.add(globe);
      scene.add(tilt);

      // glass body: dark translucent sphere, also hides the back side
      const bodyMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: true });
      const body = new THREE.Mesh(new THREE.SphereGeometry(R * 0.99, 56, 56), bodyMat);
      body.renderOrder = -1;
      globe.add(body);

      // soft glow halo around the globe
      const glowMats = [];
      [[1.07, 0.2], [1.16, 0.1]].forEach(([s, o]) => {
        const gm = new THREE.MeshBasicMaterial({
          transparent: true, opacity: o, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        });
        glowMats.push(gm);
        const g = new THREE.Mesh(new THREE.SphereGeometry(R * s, 48, 48), gm);
        g.renderOrder = -2;
        globe.add(g);
      });

      // dotted sphere
      const N = isSmall ? 1000 : 1700;
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
      const dotMat = new THREE.PointsMaterial({ size: isSmall ? 0.034 : 0.026, transparent: true, opacity: 0.95, depthWrite: false });
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
      const gridMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32, depthWrite: false });
      globe.add(new THREE.LineSegments(gridGeo, gridMat));

      // markers
      const primaryMats = [];
      const accentMats = [];
      const zoneMat = new THREE.MeshBasicMaterial();
      const hubMat = new THREE.MeshBasicMaterial();
      primaryMats.push(zoneMat);
      accentMats.push(hubMat);
      const zoneGeo = new THREE.SphereGeometry(0.036, 16, 16);
      const hubGeo = new THREE.SphereGeometry(0.02, 12, 12);
      const ringGeo = new THREE.RingGeometry(0.046, 0.058, 40);
      const rings = [];
      const zz = new THREE.Vector3(0, 0, 1);
      ZONES.forEach(([lat, lon], i) => {
        const p = ll(lat, lon, R * 1.004);
        const m = new THREE.Mesh(zoneGeo, zoneMat);
        m.position.copy(p);
        globe.add(m);
        const rm = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false });
        primaryMats.push(rm);
        const ring = new THREE.Mesh(ringGeo, rm);
        ring.position.copy(p);
        ring.quaternion.setFromUnitVectors(zz, p.clone().normalize());
        globe.add(ring);
        rings.push({ ring, rm, phase: i * 0.25 });
      });
      HUBS.forEach(([lat, lon]) => {
        const m = new THREE.Mesh(hubGeo, hubMat);
        m.position.copy(ll(lat, lon, R * 1.004));
        globe.add(m);
      });

      // arcs + travelling pulses
      const arcMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9, depthWrite: false });
      accentMats.push(arcMat);
      const pulseMat = new THREE.MeshBasicMaterial();
      primaryMats.push(pulseMat);
      const pulseGeo = new THREE.SphereGeometry(0.024, 12, 12);
      const pulses = [];
      LINKS.forEach(([zi, hi], i) => {
        const a = ll(ZONES[zi][0], ZONES[zi][1], R * 1.004);
        const b = ll(HUBS[hi][0], HUBS[hi][1], R * 1.004);
        const ctrl = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1 + a.distanceTo(b) * 0.38));
        const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
        globe.add(new THREE.Line(geo, arcMat));
        const dot = new THREE.Mesh(pulseGeo, pulseMat);
        globe.add(dot);
        pulses.push({ curve, dot, offset: i * 0.137 });
      });

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
        const k = isSmall ? 0.8 : 1;
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
        if (isSmall) return;
        const sp = makeLabel(HUB_NAMES[i], false);
        sp.position.copy(ll(lat, lon, R * 1.1));
        globe.add(sp);
      });

      const applyColors = () => {
        const accent = new THREE.Color(css('--color-accent') || 'white');
        const primary = new THREE.Color(css('--color-primary') || 'white');
        const bright = accent.clone().lerp(new THREE.Color('white'), 0.35);
        dotMat.color.copy(bright);
        gridMat.color.copy(accent);
        bodyMat.color.copy(accent).multiplyScalar(0.12);
        glowMats.forEach((m) => m.color.copy(accent));
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75));
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
        const sy = when === 'desktop' ? window.scrollY || 0 : 0;
        const rc = box.getBoundingClientRect();
        const sr = when === 'desktop'
          ? sy * 0.0012
          : (window.innerHeight / 2 - (rc.top + rc.height / 2)) * 0.003;
        globe.rotation.y = base + Math.sin(t * 0.25) * 0.35 + mouse.x * 0.6 + sr;
        tilt.rotation.x = 0.42 + mouse.y * 0.25 - Math.min(sy, 800) * 0.0003;
        pulses.forEach((p) => {
          p.dot.position.copy(p.curve.getPoint((t * 0.14 + p.offset) % 1));
        });
        rings.forEach((r) => {
          const ph = (t * 0.8 + r.phase) % 1;
          r.ring.scale.setScalar(1 + ph * 2.4);
          r.rm.opacity = 0.75 * (1 - ph);
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
          if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
        });
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        box.classList.remove('is-ready');
      };
    };

    const start = () => {
      if (when === 'mobile') {
        lazyIo = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return;
          lazyIo.disconnect();
          boot();
        }, { rootMargin: '400px' });
        lazyIo.observe(box);
        return;
      }
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
      if (lazyIo) lazyIo.disconnect();
      cleanup();
    };
  }, [when]);

  return <div ref={boxRef} className={className} aria-hidden="true" />;
}
