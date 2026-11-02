set -e
cp src/pages/HomePage.fx.css src/pages/HomePage.fx.css.bak4
cp src/components/HeroVideo.jsx src/components/HeroVideo.jsx.bak1
sed -i "s|hero-home-banner.mp4|hero-home.mp4|" src/components/HeroVideo.jsx
sed -i "s|(max-width: 768px)|(max-width: 900px)|" src/components/HeroVideo.jsx
cat >> src/pages/HomePage.fx.css <<'CSS'

/* ===== Hero on mobile/tablet: video is a full 16:9 block on top, no crop ===== */
@media (max-width: 900px) {
  .ez-home .ezh-vhero {
    display: flex;
    flex-direction: column;
    background: #06101c;
  }
  .ez-home .ezh-vhero-banner {
    position: relative;
    inset: auto;
    width: 100%;
    height: auto;
    min-height: 0;
    aspect-ratio: 16 / 9;
    flex: none;
  }
  .ez-home .ezh-vhero-video { object-position: center center; }
  .ez-home .ezh-vhero-shade,
  [data-theme='light'] .ez-home .ezh-vhero-shade,
  [dir='rtl'] .ez-home .ezh-vhero-shade,
  [data-theme='light'][dir='rtl'] .ez-home .ezh-vhero-shade {
    background: linear-gradient(180deg, transparent 0%, transparent 62%, #06101c 100%);
  }
  .ez-home .ezh-vhero-body {
    min-height: 0;
    padding: 1.25rem 1.25rem 2.5rem;
    align-content: start;
  }
}
CSS
echo ---CHECK
grep -n "hero-home\|900px" src/components/HeroVideo.jsx
tail -5 src/pages/HomePage.fx.css
npx eslint src/components/HeroVideo.jsx
npm run build
