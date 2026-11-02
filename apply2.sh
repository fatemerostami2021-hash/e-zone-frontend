set -e
cp src/pages/HomePage.fx.css src/pages/HomePage.fx.css.bak5
cat >> src/pages/HomePage.fx.css <<'CSS'

/* ===== Hero mobile: compact text + buttons so the first screen needs no scroll ===== */
@media (max-width: 900px) {
  .ez-home .ezh-vhero .ezh-vhero-body {
    padding: 0.75rem 1.1rem 1.75rem;
    gap: 1.25rem;
  }
  .ez-home .ezh-vhero .ezh-hero-content { gap: 0; }
  .ez-home .ezh-vhero .ezh-pill {
    font-size: 0.72rem;
    padding: 0.28rem 0.75rem;
    margin: 0 0 0.55rem;
  }
  .ez-home .ezh-vhero .ezh-hero-title {
    font-size: 1.4rem;
    line-height: 1.35;
    margin: 0 0 0.4rem;
  }
  .ez-home .ezh-vhero .ezh-hero-sub {
    font-size: 0.82rem;
    line-height: 1.7;
    margin: 0 0 0.8rem;
  }
  .ez-home .ezh-vhero .ezh-hero-actions {
    flex-direction: row;
    align-items: stretch;
    gap: 0.5rem;
    margin: 0;
  }
  .ez-home .ezh-vhero .ezh-hero-actions .ez-btn-lg {
    flex: 1 1 0;
    width: auto;
    min-height: 0;
    height: 44px;
    padding: 0 0.6rem;
    font-size: 0.82rem;
    justify-content: center;
    white-space: nowrap;
  }
}
CSS
tail -8 src/pages/HomePage.fx.css
npm run build
