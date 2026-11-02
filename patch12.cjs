const fs = require('fs');
const p = 'src/components/Process3D.jsx';
let s = fs.readFileSync(p, 'utf8');
if (s.includes('ezp-fx')) { console.log('already patched'); process.exit(0); }
const rep = (a, b) => {
  if (!s.includes(a)) { console.error('NOT FOUND: ' + a); process.exit(1); }
  s = s.replace(a, () => b);
};

// 1) wider route on desktop so it fills the full width
rep('pts: raw.map(([x, y, n]) => [x * dir, y, n]),', 'pts: raw.map(([x, y, n]) => [x * 1.5 * dir, y, n]),');
rep('hw: 6.4,', 'hw: 9.6,');

// 2) floor grid + dust particles
rep('const applyColors = () => {', `// cinematic: floor grid + floating dust
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

      const applyColors = () => {`);
rep('baseMat.color.copy(accentC);', `baseMat.color.copy(accentC);
        gridMat.color.copy(accentC);
        dustMat.color.copy(primaryC).lerp(new THREE.Color('white'), 0.5);`);

// 3) slow camera drift + dust motion
rep('root.rotation.x = -L.tilt + mouse.y * 0.1;', `camera.position.x = Math.sin(t * 0.15) * 0.5;
        camera.lookAt(0, 0, 0);
        dust.rotation.z = t * 0.02;
        dust.position.y = Math.sin(t * 0.2) * 0.15;
        root.rotation.x = -L.tilt + mouse.y * 0.1;`);

// 4) cinematic DOM layers
rep('<div className="ezp-stage" ref={stageRef} aria-hidden="true" />', `<div className="ezp-bg" aria-hidden="true" />
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
      </div>`);

fs.writeFileSync(p, s);
console.log('patched Process3D.jsx');
