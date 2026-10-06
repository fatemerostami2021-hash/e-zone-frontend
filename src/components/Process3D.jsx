import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const STEPS = [
  { fa: 'ثبت سفارش', en: 'Submit Your Order', sfa: 'از طریق پلتفرم ای‌زون', sen: 'Using E-ZONE Platform' },
  { fa: 'آماده‌سازی کالا', en: 'Cargo Preparation', sfa: 'در انبار و بسته‌بندی', sen: 'In Warehouse & Packaging' },
  { fa: 'ترخیص کالا', en: 'Customs Clearance', sfa: 'از طریق سامانه‌های گمرکی', sen: 'Using Customs Systems' },
  { fa: 'حمل و نقل بین‌المللی', en: 'International Transport', sfa: 'دریایی، هوایی و زمینی', sen: 'By Sea, Air and Land' },
  { fa: 'پیگیری و اطلاع‌رسانی', en: 'Tracking & Updates', sfa: 'در تمام مراحل، لحظه‌ای', sen: 'Real-time Tracking' },
  { fa: 'تحویل به مقصد', en: 'Delivery to Destination', sfa: 'به دست مشتری نهایی', sen: 'To Final Customer' },
];

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// [x, y, isNode] control points of the path
function layoutOf(small, dir) {
  if (small) {
    const pts = [];
    [5, 3, 1, -1, -3, -5].forEach((y, i) => {
      pts.push([-1.2 * dir, y, 1]);
      if (i < 5) pts.push([(i % 2 ? -1.9 : -0.5) * dir, y - 1, 0]);
    });
    return { pts, sides: Array(6).fill(dir > 0 ? 'r' : 'l'), hw: 2.0, hh: 6.2, tilt: 0.3 };
  }
  const raw = [
    [-4.4, 1.7, 1], [-2.2, 2.2, 0], [0, 1.7, 1], [2.2, 1.2, 0], [4.4, 1.7, 1], [5.9, 0, 0],
    [4.4, -1.7, 1], [2.2, -2.2, 0], [0, -1.7, 1], [-2.2, -1.2, 0], [-4.4, -1.7, 1],
  ];
  return {
    pts: raw.map(([x, y, n]) => [x * 1.5 * dir, y, n]),
    sides: ['t', 't', 't', 'b', 'b', 'b'],
    hw: 9.6,
    hh: 2.8,
    tilt: 0.75,
  };
}

/**
 * 3D process route. The static infographic stays as placeholder / fallback
 * (Save-Data, 2G, reduced-motion, no WebGL).
 */
export default function Process3D() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const dir = isFa ? -1 : 1;
  const boxRef = useRef(null);
  const stageRef = useRef(null);
  const labelRefs = useRef([]);
  const [small, setSmall] = useState(() => window.matchMedia('(max-width: 900px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => setSmall(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const sides = layoutOf(small, dir).sides;

  useEffect(() => {
    const box = boxRef.current;
    const stage = stageRef.current;
    if (!box || !stage) return undefined;
    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slow || reduce) return undefined;

    let disposed = false;
    let cleanup = () => {};
    let lazyIo;

    const boot = async () => {
      let THREE;
      try { THREE = await import('three'); } catch { return; }
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'low-power' });
      } catch { return; }
      renderer.setClearColor(0x000000, 0);
      stage.appendChild(renderer.domElement);

      const L = layoutOf(small, dir);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      const root = new THREE.Group();
      scene.add(root);

      // path
      const curve = new THREE.CatmullRomCurve3(L.pts.map(([x, y]) => new THREE.Vector3(x, y, 0)));
      const TUBE = 240;
      const RAD = 6;
      const baseMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.28, depthWrite: false });
      const litMat = new THREE.MeshBasicMaterial({ depthWrite: false });
      root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, TUBE, 0.05, RAD, false), baseMat));
      const litGeo = new THREE.TubeGeometry(curve, TUBE, 0.08, RAD, false);
      litGeo.setDrawRange(0, 0);
      root.add(new THREE.Mesh(litGeo, litMat));

      // node positions (+ arc-length position of each node along the curve)
      const nodePts = L.pts.filter((q) => q[2]).map(([x, y]) => new THREE.Vector3(x, y, 0));
      const samples = curve.getSpacedPoints(400);
      const nodeU = nodePts.map((np) => {
        let best = 0;
        let bd = Infinity;
        samples.forEach((sp, k) => {
          const dd = sp.distanceToSquared(np);
          if (dd < bd) { bd = dd; best = k; }
        });
        return best / 400;
      });

      // shared materials
      const fillMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: false });
      const edgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.95 });
      const part = (geo, x, y, z, rx = 0) => {
        const g = new THREE.Group();
        g.add(new THREE.Mesh(geo, fillMat));
        g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
        g.position.set(x, y, z);
        g.rotation.x = rx;
        return g;
      };
      const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
      const roof = new THREE.ConeGeometry(0.78, 0.4, 4);
      roof.rotateY(Math.PI / 4);
      const icons = [
        () => [part(B(0.9, 0.6, 0.06), 0, 0, 0.03), part(B(0.9, 0.05, 0.55), 0, 0.3, 0.33)],
        () => [part(B(1, 0.7, 0.5), 0, 0, 0.25), part(roof, 0, 0, 0.7, Math.PI / 2)],
        () => [part(new THREE.CylinderGeometry(0.4, 0.4, 0.12, 6), 0, 0, 0.5)],
        () => [part(B(0.5, 0.25, 0.25), -0.3, 0, 0.125), part(B(0.5, 0.25, 0.25), 0.3, 0, 0.125), part(B(0.5, 0.25, 0.25), 0, 0, 0.375)],
        () => [part(new THREE.SphereGeometry(0.42, 16, 12), 0, 0, 0.5)],
        () => [
          part(B(0.7, 0.7, 0.5), 0, 0, 0.25),
          part(new THREE.ConeGeometry(0.14, 0.35, 12), 0, 0, 0.75, -Math.PI / 2),
          part(new THREE.SphereGeometry(0.12, 12, 10), 0, 0, 0.95),
        ],
      ];

      const accentC = new THREE.Color('white');
      const primaryC = new THREE.Color('white');
      const nodes = nodePts.map((np, i) => {
        const g = new THREE.Group();
        g.position.copy(np);
        const iconG = new THREE.Group();
        icons[i]().forEach((m) => iconG.add(m));
        g.add(iconG);
        const ringMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.8, depthWrite: false });
        const discMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.12, depthWrite: false });
        const pulseMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false });
        g.add(new THREE.Mesh(new THREE.RingGeometry(0.62, 0.7, 48), ringMat));
        g.add(new THREE.Mesh(new THREE.CircleGeometry(0.62, 40), discMat));
        const pulse = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.68, 48), pulseMat);
        g.add(pulse);
        root.add(g);
        return { g, iconG, ringMat, discMat, pulse, pulseMat, act: 0, on: false };
      });

      // travelling pulses on the lit part of the path
      const pMat = new THREE.MeshBasicMaterial();
      const pGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const pulses = [0, 1, 2].map((k) => {
        const m = new THREE.Mesh(pGeo, pMat);
        root.add(m);
        return { m, k };
      });

      // cinematic: floor grid + floating dust
      const gridMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.16, depthWrite: false });
      const GX = L.hw * 1.3;
      const GY = L.hh * 1.5;
      const gp = [];
      for (let gx = -GX; gx <= GX; gx += 0.8) gp.push(gx, -GY, -0.35, gx, GY, -0.35);
      for (let gy = -GY; gy <= GY; gy += 0.8) gp.push(-GX, gy, -0.35, GX, gy, -0.35);
      const gridGeo = new THREE.BufferGeometry();
      gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gp, 3));
      root.add(new THREE.LineSegments(gridGeo, gridMat));
      const DN = small ? 120 : 260;
      const dp = new Float32Array(DN * 3);
      for (let i = 0; i < DN; i += 1) {
        dp[i * 3] = (Math.random() - 0.5) * L.hw * 2.4;
        dp[i * 3 + 1] = (Math.random() - 0.5) * L.hh * 3;
        dp[i * 3 + 2] = Math.random() * 3.2 - 0.3;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
      const dustMat = new THREE.PointsMaterial({ size: small ? 0.05 : 0.045, transparent: true, opacity: 0.7, depthWrite: false });
      const dust = new THREE.Points(dustGeo, dustMat);
      root.add(dust);

      const applyColors = () => {
        accentC.set(css('--color-accent') || 'white');
        primaryC.set(css('--color-primary') || 'white');
        baseMat.color.copy(accentC);
        gridMat.color.copy(accentC);
        dustMat.color.copy(primaryC).lerp(new THREE.Color('white'), 0.5);
        litMat.color.copy(primaryC);
        fillMat.color.copy(accentC).multiplyScalar(0.25);
        edgeMat.color.copy(accentC).lerp(new THREE.Color('white'), 0.3);
        pMat.color.copy(primaryC).lerp(new THREE.Color('white'), 0.4);
      };
      applyColors();
      const themeObs = new MutationObserver(applyColors);
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      let W = 1;
      let H = 1;
      const resize = () => {
        W = box.clientWidth;
        H = box.clientHeight;
        if (!W || !H) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        const tanH = Math.tan((17.5 * Math.PI) / 180);
        const d = Math.max(L.hw / (tanH * camera.aspect), L.hh / tanH) * 1.15;
        camera.position.set(0, 0, d);
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(box);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e) => {
        mouse.tx = e.clientX / window.innerWidth - 0.5;
        mouse.ty = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const clock = new THREE.Clock();
      const tmp = new THREE.Vector3();
      let prog = 0;
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const t = clock.getElapsedTime();
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        const rc = box.getBoundingClientRect();
        const target = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - rc.top) / (rc.height * 0.9)));
        prog += (target - prog) * 0.08;
        litGeo.setDrawRange(0, Math.floor(prog * TUBE) * RAD * 6);

        camera.position.x = Math.sin(t * 0.15) * 0.5;
        camera.lookAt(0, 0, 0);
        dust.rotation.z = t * 0.02;
        dust.position.y = Math.sin(t * 0.2) * 0.15;
        root.rotation.x = -L.tilt + mouse.y * 0.1;
        root.rotation.y = (small ? 0.1 : 0.25) * mouse.x + Math.sin(t * 0.3) * 0.04;

        nodes.forEach((n, i) => {
          const on = prog >= nodeU[i] - 0.02;
          n.act += ((on ? 1 : 0) - n.act) * 0.1;
          n.ringMat.color.copy(accentC).lerp(primaryC, n.act);
          n.discMat.color.copy(n.ringMat.color);
          n.pulseMat.color.copy(primaryC);
          n.ringMat.opacity = 0.45 + n.act * 0.5;
          n.discMat.opacity = 0.1 + n.act * 0.18;
          const ph = (t * 0.7 + i * 0.2) % 1;
          n.pulse.scale.setScalar(1 + ph * 0.7);
          n.pulseMat.opacity = n.act * 0.7 * (1 - ph);
          n.iconG.scale.setScalar(1 + n.act * 0.15);
          n.iconG.position.z = Math.sin(t * 1.6 + i) * 0.04 * n.act;
          if (n.on !== on) {
            n.on = on;
            const el = labelRefs.current[i];
            if (el) el.classList.toggle('is-active', on);
          }
        });

        pulses.forEach((p) => {
          const u = ((t * 0.12 + p.k / 3) % 1) * Math.max(prog, 0.04);
          p.m.position.copy(curve.getPointAt(Math.min(u, 0.999)));
        });

        root.updateMatrixWorld();
        renderer.render(scene, camera);

        nodes.forEach((n, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          n.g.getWorldPosition(tmp);
          tmp.project(camera);
          el.style.transform = `translate3d(${((tmp.x * 0.5 + 0.5) * W).toFixed(1)}px, ${((-tmp.y * 0.5 + 0.5) * H).toFixed(1)}px, 0)`;
        });
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
        labelRefs.current.forEach((el) => { if (el) el.classList.remove('is-active'); });
      };
    };

    // load three.js only when the section is near the viewport
    lazyIo = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      lazyIo.disconnect();
      boot();
    }, { rootMargin: '400px' });
    lazyIo.observe(box);

    return () => {
      disposed = true;
      if (lazyIo) lazyIo.disconnect();
      cleanup();
    };
  }, [small, dir]);

  return (
    <div className="ezp" ref={boxRef} dir={isFa ? 'rtl' : 'ltr'}>
      <img className="ezp-img" src="/image/import-export-process.webp" alt={isFa ? 'فرایند صادرات و واردات' : 'Import & export process'} loading="lazy" />
      <div className="ezp-bg" aria-hidden="true" />
      <div className="ezp-stage" ref={stageRef} aria-hidden="true" />
      <div className="ezp-fx" aria-hidden="true">
        <i className="ezp-sweep" />
        <i className="ezp-vig" />
        <i className="ezp-grain" />
        <i className="ezp-c ezp-c1" />
        <i className="ezp-c ezp-c2" />
        <i className="ezp-c ezp-c3" />
        <i className="ezp-c ezp-c4" />
        <b className="ezp-tag"><u />{isFa ? 'مسیر زنده' : 'LIVE ROUTE'}</b>
      </div>
      <div className="ezp-labels">
        {STEPS.map((s, i) => (
          <div key={s.en} className={`ezp-label ezp-side-${sides[i]}`} ref={(el) => { labelRefs.current[i] = el; }}>
            <div className="ezp-label-in">
              <span className="ezp-num">{`0${i + 1}`}</span>
              <span className="ezp-txt">
                <strong>{isFa ? s.fa : s.en}</strong>
                <small>{isFa ? s.sfa : s.sen}</small>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
