/* Illustrated tile for a module card: generated SVG art + a hand-drawn line icon.
   Six different compositions and three tones (from design tokens), so cards never look alike.
   Replace this component's output with a real <img> later if you get photos. */

const P = (props) => <path pathLength="1" {...props} />;
const C = (props) => <circle pathLength="1" {...props} />;
const R = (props) => <rect pathLength="1" {...props} />;

const ICONS = {
  FileDown: (<><P d="M14 6h14l8 8v28H14z" /><P d="M28 6v8h8" /><P d="M24 20v12" /><P d="M18 27l6 6 6-6" /></>),
  Warehouse: (<><P d="M5 41V18L24 8l19 10v23" /><P d="M13 41V27h22v14" /><P d="M13 34h22" /></>),
  Share2: (<><C cx="36" cy="12" r="4" /><C cx="12" cy="24" r="4" /><C cx="36" cy="36" r="4" /><P d="M16 22l16-8" /><P d="M16 26l16 8" /></>),
  Award: (<><C cx="24" cy="19" r="11" /><P d="M18 29l-4 13 10-6 10 6-4-13" /></>),
  ClipboardList: (<><R x="10" y="8" width="28" height="34" rx="2" /><P d="M18 8V5h12v3" /><P d="M17 20h14" /><P d="M17 27h14" /><P d="M17 34h8" /></>),
  Truck: (<><P d="M4 33V13h27v20" /><P d="M31 21h8l6 8v4H31" /><C cx="14" cy="36" r="4" /><C cx="37" cy="36" r="4" /></>),
  ShieldCheck: (<><P d="M24 5l16 6v12c0 10-7 17-16 20C15 40 8 33 8 23V11z" /><P d="M16 24l6 6 10-12" /></>),
  Users: (<><C cx="18" cy="17" r="6" /><P d="M6 40c0-7 5-11 12-11s12 4 12 11" /><C cx="34" cy="19" r="4.5" /><P d="M34 30c5 0 8 3 8 9" /></>),
  Building: (<><R x="10" y="6" width="22" height="36" rx="1" /><P d="M32 18h6v24H32" /><P d="M16 14h4M24 14h4M16 22h4M24 22h4M16 30h4M24 30h4" /><P d="M18 42v-6h6v6" /></>),
  Database: (<><P d="M8 12c0-3 7-5 16-5s16 2 16 5-7 5-16 5-16-2-16-5z" /><P d="M8 12v12c0 3 7 5 16 5s16-2 16-5V12" /><P d="M8 24v12c0 3 7 5 16 5s16-2 16-5V24" /></>),
  Factory: (<><P d="M5 42V22l12 7v-7l12 7v-7l14 8v14z" /><P d="M33 22V8h6v18" /><P d="M13 42v-6h6v6" /></>),
  Boxes: (<><P d="M6 24l9-5 9 5v10l-9 5-9-5z" /><P d="M6 24l9 5 9-5M15 29v10" /><P d="M24 14l9-5 9 5v10l-9 5-9-5z" /><P d="M24 14l9 5 9-5M33 19v10" /></>),
  BarChart: (<><P d="M6 42h36" /><R x="9" y="26" width="6" height="16" /><R x="21" y="16" width="6" height="26" /><R x="33" y="8" width="6" height="34" /></>),
  Folder: (<><P d="M5 14c0-2 1-3 3-3h10l4 5h18c2 0 3 1 3 3v19c0 2-1 3-3 3H8c-2 0-3-1-3-3z" /><P d="M5 22h38" /></>),
  Bell: (<><P d="M12 34V22c0-7 5-12 12-12s12 5 12 12v12l3 4H9z" /><P d="M20 42h8" /><P d="M24 6v4" /></>),
  Globe: (<><C cx="24" cy="24" r="18" /><P d="M6 24h36" /><P d="M24 6c-9 9-9 27 0 36" /><P d="M24 6c9 9 9 27 0 36" /></>),
};
const KEYS = Object.keys(ICONS);

const range = (n, step, from = 0) => Array.from({ length: n }, (_, i) => from + i * step);

function Pattern({ v }) {
  switch (v) {
    case 0: // grid + rings
      return (
        <>
          {range(5, 30, 30).map((y) => <line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} strokeWidth="0.5" />)}
          {range(7, 40, 40).map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" strokeWidth="0.5" />)}
          <circle cx="160" cy="90" r="60" strokeWidth="0.7" />
          <circle cx="160" cy="90" r="95" strokeWidth="0.5" strokeDasharray="3 5" />
        </>
      );
    case 1: // diagonal stripes
      return range(22, 22, -180).map((x) => <line key={x} x1={x} y1="0" x2={x + 180} y2="180" strokeWidth="0.8" />);
    case 2: // dot matrix
      return range(12, 16, 8).flatMap((y) => range(21, 16, 4).map((x) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="currentColor" stroke="none" />
      )));
    case 3: // arcs from a corner
      return range(6, 42, 42).map((r) => <circle key={r} cx="320" cy="180" r={r} strokeWidth="0.7" />);
    case 4: // waves
      return range(6, 28, 20).map((y) => (
        <path key={y} d={`M0 ${y} Q40 ${y - 16} 80 ${y} T160 ${y} T240 ${y} T320 ${y}`} strokeWidth="0.8" />
      ));
    default: // plus signs
      return range(5, 36, 20).flatMap((y) => range(9, 36, 14).map((x) => (
        <path key={`${x}-${y}`} d={`M${x - 4} ${y}h8M${x} ${y - 4}v8`} strokeWidth="0.8" />
      )));
  }
}

export default function ModuleVisual({ name, index = 0 }) {
  const v = index % 6;
  const icon = ICONS[name] || ICONS[KEYS[index % KEYS.length]];
  return (
    <div className="ezh-art" data-v={v} aria-hidden="true">
      <svg className="ezh-art-bg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <Pattern v={v} />
      </svg>
      <svg className="ezh-art-ghost" viewBox="0 0 48 48">{icon}</svg>
      <span className="ezh-art-glow" />
      <svg className="ezh-art-icon" viewBox="0 0 48 48">{icon}</svg>
    </div>
  );
}
