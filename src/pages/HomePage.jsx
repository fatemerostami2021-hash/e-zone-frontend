import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useHomeFx from '../hooks/useHomeFx';
import HeroVideo from '../components/HeroVideo';
import Hero3D from '../components/Hero3D';
import Process3D from '../components/Process3D';
import CtaLink from '../components/home/CtaLink';
import { mergeHomeLinks, linkLabel } from '../config/homeLinks';
import './HomePage.css';
import './HomePage.fx.css';

const ZONES = [
  { fa: 'منطقه آزاد چابهار', en: 'Chabahar FTZ' },
  { fa: 'منطقه ویژه اروند', en: 'Arvand SEZ' },
  { fa: 'منطقه آزاد انزلی', en: 'Anzali Free Zone' },
  { fa: 'منطقه ویژه سلفچگان', en: 'Salafchegan SEZ' },
];

const CHECKLIST = [
  { fa: 'جداسازی کامل داده در سطح Schema', en: 'Isolated Schema Database Layers' },
  { fa: 'مخازن فایل رمزنگاری‌شده به‌ازای هر شرکت', en: 'Encrypted File Repositories per Company' },
  { fa: 'محدودیت نرخ API اختصاصی', en: 'Dedicated API Rate Limits' },
];

const BIGTEXT = {
  fa: ['گمرک', 'انبار', 'تولید', 'اظهارنامه'],
  en: ['Customs', 'Warehouse', 'Production', 'Declaration'],
};

const heroMove = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--mx', (x * 100) + '%');
  el.style.setProperty('--my', (y * 100) + '%');
  el.style.setProperty('--rx', ((0.5 - y) * 4) + 'deg');
  el.style.setProperty('--ry', ((x - 0.5) * 5) + 'deg');
};

const heroLeave = (e) => {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
};

/* Placeholder instead of an icon: swap for real artwork later */
function Ph({ size = '' }) {
  return <span className={`ezh-ph ${size}`} aria-hidden="true" />;
}

/* Minimal train on a rail: each word is a wagon */
function Train({ words }) {
  const row = [...words, ...words, ...words];
  return (
    <div className="ezh-rail-train" data-marquee="1">
      {row.map((w, i) => (
        <span key={`${w}-${i}`} className="ezh-wagon">{w}</span>
      ))}
    </div>
  );
}

const CACHE_KEY = 'ezone:home:v1';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Skeletons({ n }) {
  return Array.from({ length: n }, (_, i) => <div key={i} className="ezh-skel" aria-hidden="true" />);
}

function HomePage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const pick = (item, key) => (isFa ? item[`${key}_fa`] : item[`${key}_en`]);

  const [cached] = useState(readCache);
  const [stats, setStats] = useState(cached?.stats || []);
  const [features, setFeatures] = useState(cached?.features || []);
  const [roadmap, setRoadmap] = useState(cached?.roadmap || []);
  const [loading, setLoading] = useState(!cached);
  const [links, setLinks] = useState(() => mergeHomeLinks(cached?.links));
  const homeRef = useRef(null);

  // The page renders immediately; CMS data fills in when it arrives (cached copy first)
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/home`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error('bad response');
        return r.json();
      })
      .then((data) => {
        const next = {
          stats: data.stats || [],
          features: data.features || [],
          roadmap: data.roadmap || [],
          links: data.links || null,
        };
        setStats(next.stats);
        setFeatures(next.features);
        setRoadmap(next.roadmap);
        setLinks(mergeHomeLinks(next.links));
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch { /* storage full or blocked */ }
      })
      .catch(() => { /* keep cached data; empty sections stay hidden */ })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  useHomeFx(homeRef, true, [
    i18n.language, stats.length, features.length, roadmap.length,
  ]);

  const bigWords = isFa ? BIGTEXT.fa : BIGTEXT.en;

  return (
    <div className="ez-home" ref={homeRef}>
      <div className="ezh-progress" aria-hidden="true" />

      {/* Hero — video banner + text */}
      <section className="ezh-vhero" data-bleed onMouseMove={heroMove} onMouseLeave={heroLeave}>
        <div className="ezh-vhero-banner">
          <HeroVideo className="ezh-vhero-video" />
          <div className="ezh-vhero-shade" aria-hidden="true" />
          <Hero3D />
        </div>

        <div className="ezh-vhero-body">
          <div className="ezh-hero-content">
            <span className="ezh-pill">{t('homePage.hero.pill')}</span>
            <h1 className="ezh-hero-title">{t('homePage.hero.title')}</h1>
            <p className="ezh-hero-sub">{t('homePage.hero.subtitle')}</p>
            <div className="ezh-hero-actions">
              <CtaLink to={links.heroPrimary.to} className="ez-btn-lg ez-btn-lg--primary ez-btn-lg--arrow">
                {linkLabel(links.heroPrimary, isFa, t('homePage.hero.cta1'))}
              </CtaLink>
              <CtaLink to={links.heroSecondary.to} className="ez-btn-lg ez-btn-lg--outline">
                {linkLabel(links.heroSecondary, isFa, t('homePage.hero.cta2'))}
              </CtaLink>
            </div>
          </div>

          <div className="ezh-mockup">
            <div className="ezh-mockup-bar">
              <div className="ezh-mockup-dots"><span></span><span></span><span></span></div>
              <span className="ezh-mockup-label">{t('homePage.hero.panelTitle')}</span>
            </div>
            <div className="ezh-mockup-stats">
              <div><strong className="ezh-count">4</strong><span>{isFa ? 'شرکت فعال' : 'Active companies'}</span></div>
              <div><strong className="ezh-count">12</strong><span>{isFa ? 'اظهارنامه امروز' : "Today's declarations"}</span></div>
              <div><strong className="ezh-count">99.9%</strong><span>{t('homePage.hero.sysOk')}</span></div>
            </div>
            <ul className="ezh-mockup-rows">
              <li>
                <span>{isFa ? 'صنایع فولاد پارس' : 'Persian Steel Industries'}</span>
                <span className="ezh-badge ezh-badge--ok">{isFa ? 'تایید شده' : 'Approved'}</span>
              </li>
              <li>
                <span>{isFa ? 'نساجی البرز' : 'Alborz Textile'}</span>
                <span className="ezh-badge ezh-badge--pending">{isFa ? 'در حال بررسی' : 'Reviewing'}</span>
              </li>
              <li>
                <span>{isFa ? 'پتروشیمی خزر' : 'Caspian Petrochemical'}</span>
                <span className="ezh-badge ezh-badge--wait">{isFa ? 'در انتظار مدارک' : 'Awaiting docs'}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="ezh-section ezh-trusted" data-fx="up">
        <p className="ezh-trusted-label">{t('homePage.trusted.label')}</p>
        <div className="ezh-trusted-marquee" aria-hidden="true">
          <div className="ezh-trusted-track">
            {[...ZONES, ...ZONES].map((z, i) => (
              <span key={`${z.en}-${i}`} className="ezh-trusted-item">{isFa ? z.fa : z.en}</span>
            ))}
          </div>
        </div>
        <div className="ezh-trusted-row">
          {ZONES.map((z) => (
            <span key={z.en} className="ezh-trusted-item">{isFa ? z.fa : z.en}</span>
          ))}
        </div>
      </section>

      {/* Rail: small train moves along the track while scrolling */}
      <section className="ezh-rail" data-bleed aria-hidden="true">
        <Train words={bigWords} />
        <div className="ezh-rail-bed" />
      </section>

      {/* Mission */}
      <section className="ezh-section ezh-split ezh-fullbleed-split" data-bleed>
        <div className="ezh-split-media" data-fx="left">
          <img src="/image/digitize-your-Trade-Zone.webp" alt={t('homePage.mission.title')} loading="lazy" />
        </div>
        <div className="ezh-split-copy" data-stagger>
          <span className="ezh-eyebrow">{t('homePage.mission.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.mission.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.mission.desc')}</p>
        </div>
      </section>

      {/* Stats */}
      {(loading || stats.length > 0) && (
      <section className="ezh-section">
        <div className="ezh-head" data-stagger>
          <span className="ezh-eyebrow">{t('homePage.stats.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.stats.title')}</h2>
        </div>
        <div className="ezh-stats-grid" data-bleed data-stagger>
          {stats.length === 0 && <Skeletons n={4} />}
          {stats.map((s) => (
            <div key={s.id} className="ezh-stat-card">
              <Ph size="ezh-ph--xs" />
              <div className="ezh-stat-value ezh-count">{s.value}</div>
              <div className="ezh-stat-title">{pick(s, 'title')}</div>
              <div className="ezh-stat-desc">{pick(s, 'description')}</div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Process: 3D route (replaces Features + Steps) */}
      <section className="ezh-section ezh-process-section" data-bleed>
        <div className="ezh-head" data-stagger>
          <span className="ezh-eyebrow">{t('homePage.steps.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.steps.title')}</h2>
        </div>
        <div className="ezh-process" data-fx="scale">
          <Process3D />
        </div>
      </section>

      {/* Logistics */}
      <section className="ezh-section ezh-logistics-split" data-bleed>
        <div className="ezh-logistics-media" data-fx="scale">
          <img src="/image/Logistics.webp" alt={t('homePage.logistics.title')} loading="lazy" />
        </div>
        <div className="ezh-logistics-copy" dir={isFa ? 'rtl' : 'ltr'} data-stagger>
          <span className="ezh-eyebrow">{t('homePage.logistics.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.logistics.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.logistics.desc')}</p>
        </div>
      </section>

      {/* Architecture */}
      <section className="ezh-section ezh-arch-grid" data-bleed>
        <div className="ezh-arch-media" data-fx="left">
          <img src="/image/Strict-Multi.webp" alt={t('homePage.architecture.title')} loading="lazy" />
        </div>
        <div className="ezh-arch-copy" data-stagger>
          <span className="ezh-eyebrow">{t('homePage.architecture.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.architecture.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.architecture.desc')}</p>
          <ul className="ezh-checklist">
            {CHECKLIST.map((c) => (
              <li key={c.en}><Ph size="ezh-ph--xs" /> {isFa ? c.fa : c.en}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roadmap */}
      {(loading || roadmap.length > 0) && (
      <section className="ezh-section">
        <div className="ezh-head" data-stagger>
          <span className="ezh-eyebrow">{t('homePage.roadmap.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.roadmap.title')}</h2>
        </div>
        <div className="ezh-roadmap-grid" data-bleed data-stagger>
          {roadmap.length === 0 && <Skeletons n={5} />}
          {roadmap.map((r) => (
            <div key={r.id} className={`ezh-roadmap-card ezh-status--${r.status}`}>
              <div className="ezh-roadmap-top">
                <span className="ezh-roadmap-phase">
                  {r.status === 'deployed' && <Ph size="ezh-ph--xs" />} {r.phase_label}
                </span>
                <span className="ezh-roadmap-badge">
                  {r.status === 'deployed' && t('homePage.roadmap.statusDeployed')}
                  {r.status === 'activeDev' && t('homePage.roadmap.statusActiveDev')}
                  {r.status === 'upcoming' && t('homePage.roadmap.statusUpcoming')}
                </span>
              </div>
              <h3>{pick(r, 'title')}</h3>
              <p>{pick(r, 'description')}</p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="ezh-section ezh-cta" data-bleed>
        <div className="ezh-cta-inner" data-fx="scale">
          <h2 className="ezh-cta-title">{t('homePage.cta.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.cta.subtitle')}</p>
          <div className="ezh-hero-actions">
            <CtaLink to={links.ctaPrimary.to} className="ez-btn-lg ez-btn-lg--primary ez-btn-lg--arrow">
              {linkLabel(links.ctaPrimary, isFa, t('homePage.cta.primary'))}
            </CtaLink>
            <CtaLink to={links.ctaSecondary.to} className="ez-btn-lg ez-btn-lg--outline">
              {linkLabel(links.ctaSecondary, isFa, t('homePage.cta.secondary'))}
            </CtaLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
