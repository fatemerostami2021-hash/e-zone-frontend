import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, Ship, ArrowRight, PlayCircle, Building2, Puzzle, Globe,
  FileDown, Warehouse, Share2, Award, ClipboardList, Truck, CheckCheck, CheckCircle2,
} from 'lucide-react';
import './HomePage.css';

const ICONS = {
  Building2, Puzzle, Globe, ShieldCheck,
  FileDown, Warehouse, Share2, Award, ClipboardList, Truck,
};

const STEPS = [
  { n: '01', title_fa: 'ثبت شرکت', title_en: 'Register Company', desc_fa: 'راه‌اندازی شرکت در یکی از مناطق ویژه اقتصادی مجاز ایران.', desc_en: "Corporate setup within one of Iran's licensed Special Economic Zones." },
  { n: '02', title_fa: 'واردات مواد اولیه', title_en: 'Import Raw Materials', desc_fa: 'ثبت اسناد واردات برای اعتبارسنجی خودکار و ورود فوری به انبار.', desc_en: 'Submit import documents for automated validation & immediate storage.' },
  { n: '03', title_fa: 'پیگیری تولید', title_en: 'Track Production', desc_fa: 'ثبت محصولات نهایی در مقابل کیل مصرف در سامانه.', desc_en: 'Submit finished goods against Bills of Materials (BOM) on-platform.' },
  { n: '04', title_fa: 'ارسال اظهارنامه', title_en: 'Submit Declaration', desc_fa: 'صدور آنی گواهی تولید برای معافیت و ترخیص گمرکی.', desc_en: 'Instantly generate production certificates for duty exemption and clearance.' },
];

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

function HomePage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const pick = (item, key) => (isFa ? item[`${key}_fa`] : item[`${key}_en`]);

  const [stats, setStats] = useState([]);
  const [features, setFeatures] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/home')
      .then((r) => {
        if (!r.ok) throw new Error('bad response');
        return r.json();
      })
      .then((data) => {
        setStats(data.stats || []);
        setFeatures(data.features || []);
        setRoadmap(data.roadmap || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ez-home"><div className="ezh-loading">Loading…</div></div>;
  if (error) return <div className="ez-home"><div className="ezh-loading">خطا در بارگذاری / Failed to load</div></div>;

  return (
    <div className="ez-home">
      {/* Hero — 3D Animated Professional Layout */}
      <section 
        className="ezh-hero-fullwidth"
        style={{ backgroundImage: 'url(/image/hero.webp)' }}
      >
        <div className="ezh-hero-overlay" />
        
        {/* Left & Right Filters with Text Badges */}
        <div className="ezh-hero-side ezh-hero-side--start">
          <div className="ezh-hero-side-content">
            <div className="ezh-hero-side-badge">
              <Globe size={20} /> 
              <span>{isFa ? 'شبکه جهانی' : 'Global Network'}</span>
            </div>
            <div className="ezh-hero-side-badge">
              <Truck size={20} /> 
              <span>{isFa ? 'لجستیک هوشمند' : 'Smart Logistics'}</span>
            </div>
          </div>
        </div>

        <div className="ezh-hero-side ezh-hero-side--end">
          <div className="ezh-hero-side-content">
            <div className="ezh-hero-side-badge">
              <ShieldCheck size={20} /> 
              <span>{isFa ? 'امنیت جامع' : 'Secure & Encrypted'}</span>
            </div>
            <div className="ezh-hero-side-badge">
              <Share2 size={20} /> 
              <span>{isFa ? 'اتصال بی‌وقفه' : 'Real-time Sync'}</span>
            </div>
          </div>
        </div>

        {/* 3D Floating Animation Layer */}
        <div className="ezh-hero-3d-layer">
          <div className="ezh-3d-shape ezh-3d-shape--1"></div>
          <div className="ezh-3d-shape ezh-3d-shape--2"></div>
          <div className="ezh-3d-shape ezh-3d-shape--3"></div>
        </div>

        {/* Main Content Grid */}
        <div className="ezh-hero-grid">
          <div className="ezh-hero-content">
            <span className="ezh-pill">{t('homePage.hero.pill')}</span>
            <h1 className="ezh-hero-title">{t('homePage.hero.title')}</h1>
            <p className="ezh-hero-sub">{t('homePage.hero.subtitle')}</p>
            <div className="ezh-hero-actions">
              <button className="ez-btn-lg ez-btn-lg--primary">
                {t('homePage.hero.cta1')} <ArrowRight size={18} className="btn-arrow" />
              </button>
              <button className="ez-btn-lg ez-btn-lg--outline">
                <PlayCircle size={18} /> {t('homePage.hero.cta2')}
              </button>
            </div>
          </div>

          <div className="ezh-hero-panel ezh-hero-panel--glass">
            <div className="ezh-hero-panel-label">{t('homePage.hero.panelLabel')}</div>
            <div className="ezh-hero-panel-title">{t('homePage.hero.panelTitle')}</div>
            <div className="ezh-hero-panel-graphic"><Ship size={48} /></div>
            <div className="ezh-hero-panel-footer">
              <span>{t('homePage.hero.sysOk')}</span>
              <span>{t('homePage.hero.gpsLocked')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="ezh-section ezh-trusted">
        <p className="ezh-trusted-label">{t('homePage.trusted.label')}</p>
        <div className="ezh-trusted-row">
          {ZONES.map((z) => (
            <span key={z.en} className="ezh-trusted-item">{isFa ? z.fa : z.en}</span>
          ))}
        </div>
      </section>

      {/* Mission / intro — full bleed image integration */}
      <section className="ezh-section ezh-split ezh-fullbleed-split">
        <div className="ezh-split-media">
          <img src="/image/digitize-your-Trade-Zone.webp" alt={t('homePage.mission.title')} loading="lazy" />
        </div>
        <div className="ezh-split-copy">
          <span className="ezh-eyebrow">{t('homePage.mission.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.mission.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.mission.desc')}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="ezh-section">
        <span className="ezh-eyebrow">{t('homePage.stats.eyebrow')}</span>
        <h2 className="ezh-section-title">{t('homePage.stats.title')}</h2>
        <div className="ezh-stats-grid">
          {stats.map((s) => {
            const Icon = ICONS[s.icon_name] || Building2;
            return (
              <div key={s.id} className="ezh-stat-card">
                <Icon size={22} className="ezh-icon-accent" />
                <div className="ezh-stat-value">{s.value}</div>
                <div className="ezh-stat-title">{pick(s, 'title')}</div>
                <div className="ezh-stat-desc">{pick(s, 'description')}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="ezh-section">
        <span className="ezh-eyebrow">{t('homePage.features.eyebrow')}</span>
        <h2 className="ezh-section-title">{t('homePage.features.title')}</h2>
        <div className="ezh-features-grid">
          {features.map((f) => {
            const Icon = ICONS[f.icon_name] || FileDown;
            return (
              <div key={f.id} className="ezh-feature-card">
                <div className="ezh-feature-icon"><Icon size={22} /></div>
                <h3>{pick(f, 'title')}</h3>
                <p>{pick(f, 'description')}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      <section className="ezh-section">
        <span className="ezh-eyebrow">{t('homePage.steps.eyebrow')}</span>
        <h2 className="ezh-section-title">{t('homePage.steps.title')}</h2>
        <div className="ezh-steps-grid">
          {STEPS.map((s) => (
            <div key={s.n} className="ezh-step-card">
              <div className="ezh-step-num">{s.n}</div>
              <h3>{pick(s, 'title')}</h3>
              <p>{pick(s, 'desc')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logistics — compact image (left, fixed) + copy (right, language-aware) */}
      <section className="ezh-section ezh-logistics-split">
        <div className="ezh-logistics-media">
          <img src="/image/Logistics.webp" alt={t('homePage.logistics.title')} loading="lazy" />
        </div>
        <div className="ezh-logistics-copy" dir={isFa ? 'rtl' : 'ltr'}>
          <span className="ezh-eyebrow">{t('homePage.logistics.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.logistics.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.logistics.desc')}</p>
        </div>
      </section>

      {/* Architecture — multi-tenant isolation */}
      <section className="ezh-section ezh-arch-grid">
        <div className="ezh-arch-media">
          <img src="/image/Strict-Multi.webp" alt={t('homePage.architecture.title')} loading="lazy" />
        </div>
        <div>
          <span className="ezh-eyebrow">{t('homePage.architecture.eyebrow')}</span>
          <h2 className="ezh-section-title">{t('homePage.architecture.title')}</h2>
          <p className="ezh-section-sub">{t('homePage.architecture.desc')}</p>
          <ul className="ezh-checklist">
            {CHECKLIST.map((c) => (
              <li key={c.en}><CheckCircle2 size={18} className="ezh-icon-accent" /> {isFa ? c.fa : c.en}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roadmap */}
      <section className="ezh-section">
        <span className="ezh-eyebrow">{t('homePage.roadmap.eyebrow')}</span>
        <h2 className="ezh-section-title">{t('homePage.roadmap.title')}</h2>
        <div className="ezh-roadmap-grid">
          {roadmap.map((r) => (
            <div key={r.id} className={`ezh-roadmap-card ezh-status--${r.status}`}>
              <div className="ezh-roadmap-top">
                <span className="ezh-roadmap-phase">
                  {r.status === 'deployed' && <CheckCheck size={14} />} {r.phase_label}
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

      {/* CTA */}
      <section className="ezh-section ezh-cta">
        <h2 className="ezh-cta-title">{t('homePage.cta.title')}</h2>
        <p className="ezh-section-sub">{t('homePage.cta.subtitle')}</p>
        <div className="ezh-hero-actions">
          <button className="ez-btn-lg ez-btn-lg--primary">{t('homePage.cta.primary')}</button>
          <button className="ez-btn-lg ez-btn-lg--outline">{t('homePage.cta.secondary')}</button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;