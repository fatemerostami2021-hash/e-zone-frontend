import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Languages,
  History,
  Layers,
  Sparkles,
  Cpu,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import './AboutPage.css';

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    t_fa: 'پلتفرم هوشمند و یکپارچه',
    t_en: 'One intelligent platform',
    d_fa: 'مدیریت گمرک، تجارت خارجی و عملیات مناطق آزاد و ویژه در یک اکوسیستم متصل',
    d_en: 'Customs, foreign trade and free/special zone operations in one connected ecosystem',
  },
  {
    icon: Layers,
    t_fa: 'زنجیرهٔ کامل عملیات',
    t_en: 'Full operational chain',
    d_fa: 'واردات، صادرات، انبارداری، موجودی، تولید، BOM، ثبت سفارش و اظهارنامه در یک بستر',
    d_en: 'Imports, exports, warehousing, inventory, production, BOM, orders and declarations in one place',
  },
  {
    icon: ShieldCheck,
    t_fa: 'ثبت یک‌بار، استفادهٔ همیشگی',
    t_en: 'Enter once, reuse always',
    d_fa: 'حذف ورود تکراری داده، کاهش خطاهای عملیاتی و پایان پراکندگی اطلاعات',
    d_en: 'No duplicate entry, fewer operational errors, no scattered data',
  },
  {
    icon: History,
    t_fa: 'رهگیری کامل و کنترل دقیق',
    t_en: 'Full traceability, precise control',
    d_fa: 'معماری یکپارچه و گردش‌کار هوشمند، دسترسی سریع به اطلاعات در همهٔ مراحل',
    d_en: 'Unified architecture and smart workflows put every step within reach',
  },
  {
    icon: Cpu,
    t_fa: 'مبتنی بر AI-Assisted',
    t_en: 'AI-Assisted by design',
    d_fa: 'اتوماسیون و تحلیل داده، مسیر مدیریت تجاری و گمرکی را شفاف‌تر و کارآمدتر می‌کند',
    d_en: 'Automation and analytics make trade and customs management clearer and faster',
  },
  {
    icon: Globe2,
    t_fa: 'زیرساخت آینده‌نگر',
    t_en: 'A future-ready infrastructure',
    d_fa: 'امن، مقیاس‌پذیر و متصل‌کنندهٔ تجارت، گمرک، زنجیرهٔ تأمین و تولید',
    d_en: 'Secure, scalable and built to connect trade, customs, supply chain and production',
  },
];

const PRINCIPLES = [
  {
    icon: Layers,
    t_fa: 'یک‌بار ثبت، همه‌جا استفاده',
    t_en: 'Enter once, reuse everywhere',
    d_fa: 'داده‌ای که در ابتدا ثبت می‌شود در همهٔ مراحل بعدی همراه کالا می‌ماند',
    d_en: 'Data entered at the start follows the goods through every later step',
  },
  {
    icon: ShieldCheck,
    t_fa: 'جداسازی کامل شرکت‌ها',
    t_en: 'Strict company isolation',
    d_fa: 'هر شرکت فقط داده و فایل خودش را می‌بیند؛ دسترسی کاربران به شرکت‌ها جدا کنترل می‌شود',
    d_en: 'Each company sees only its own data and files; user access is controlled per company',
  },
  {
    icon: History,
    t_fa: 'ردپای کامل تغییرات',
    t_en: 'A full audit trail',
    d_fa: 'رکوردهای مهم حذف نمی‌شوند و هر تغییر با کاربر و زمانش ثبت می‌شود',
    d_en: 'Important records are never hard-deleted; every change is logged with user and time',
  },
  {
    icon: Languages,
    t_fa: 'دوزبانه، روشن و تیره',
    t_en: 'Bilingual, light and dark',
    d_fa: 'رابط فارسی و انگلیسی با تم روشن و تیره برای تیم‌هایی که با هر دو زبان کار می‌کنند',
    d_en: 'Persian and English interface with light and dark themes for teams that use both',
  },
];

/**
 * Spotlight reveal: writes the pointer position into --mx / --my on the
 * element and toggles `is-active`. The CSS mask does the rest.
 *
 * - Desktop (fine pointer): follows the mouse with smooth lerp.
 * - Touch devices: a soft static light that moves with touch.
 * - prefers-reduced-motion: a static light, no tracking.
 */
function useSpotlight(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const setPos = (x, y) => {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };

    const localPoint = (e) => {
      const r = el.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    // ---- Static / touch mode ----
    if (reduce || !finePointer) {
      const r = el.getBoundingClientRect();
      setPos(r.width * 0.72, r.height * 0.3);
      el.classList.add('is-active');
      if (reduce) return undefined;

      const onTouch = (e) => setPos(...localPoint(e));
      el.addEventListener('pointermove', onTouch);
      el.addEventListener('pointerdown', onTouch);
      return () => {
        el.removeEventListener('pointermove', onTouch);
        el.removeEventListener('pointerdown', onTouch);
      };
    }

    // ---- Desktop mode: smooth follow ----
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let running = false;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      setPos(x, y);
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      [tx, ty] = localPoint(e);
      if (!el.classList.contains('is-active')) {
        x = tx; // first entry: no jump
        y = ty;
        el.classList.add('is-active');
      }
      start();
    };

    const onLeave = () => el.classList.remove('is-active');

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
}

function AboutPage() {
  const { i18n } = useTranslation();
  const isFa = i18n.language?.startsWith('fa');
  const L = (fa, en) => (isFa ? fa : en);

  const heroRef = useRef(null);
  useSpotlight(heroRef);

  return (
    <div className="eza">
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="eza-hero"
        aria-labelledby="eza-hero-title"
      >
        <div className="eza-hero-media" aria-hidden="true">
          <div className="eza-layer eza-layer--base">
            <img
              src="/image/about/about-hero.webp"
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="eza-layer eza-layer--reveal">
            <img
              src="/image/about/about-hero.webp"
              alt=""
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="eza-hero-inner">
          <span className="eza-eyebrow">
            <span className="eza-dot" aria-hidden="true" />
            {L('دربارهٔ ایزون', 'About E-ZONE')}
          </span>

          <h1 id="eza-hero-title" className="eza-hero-title">
            {L(
              'یک پلتفرم، تمام عملیات تجارت و گمرک',
              'One platform for all trade and customs operations'
            )}
          </h1>

          <p className="eza-hero-sub">
            {L(
              'E-ZONE یک پلتفرم هوشمند و یکپارچه برای مدیریت گمرک، تجارت خارجی و عملیات مناطق آزاد و ویژهٔ اقتصادی است؛ از واردات و صادرات تا انبار، تولید، BOM، ثبت سفارش و اظهارنامه — همه در یک اکوسیستم متصل',
              'E-ZONE is one intelligent platform for customs, foreign trade and free/special zone operations — from imports and exports to warehouse, production, BOM, orders and declarations, all in one connected ecosystem'
            )}
          </p>

          <div className="eza-hero-actions">
            <Link to="/contact" className="ez-btn-lg ez-btn-lg--primary">
              {L('درخواست مشاوره', 'Request a consultation')}
              <ArrowRight size={18} className="eza-arrow" aria-hidden="true" />
            </Link>
            <Link to="/modules" className="ez-btn-lg ez-btn-lg--ghost">
              {L('مشاهدهٔ ماژول‌ها', 'Explore modules')}
              <ChevronRight size={18} className="eza-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ HIGHLIGHTS ============ */}
      <section className="eza-section" aria-labelledby="eza-highlights-title">
        <header className="eza-section-head">
          <span className="eza-eyebrow eza-eyebrow--muted">
            {L('چه چیزی ایزون را متفاوت می‌کند', 'What makes E-ZONE different')}
          </span>
          <h2 id="eza-highlights-title" className="eza-h2">
            {L(
              'معماری یکپارچه، گردش‌کار هوشمند',
              'Unified architecture, intelligent workflows'
            )}
          </h2>
          <p className="eza-section-lead">
            {L(
              'با ثبت اطلاعات یک‌باره و استفادهٔ مجدد از آن در مراحل مختلف، E-ZONE ورود داده‌های تکراری، خطاهای عملیاتی و پراکندگی اطلاعات را کاهش می‌دهد',
              'By entering data once and reusing it across every step, E-ZONE cuts duplicate entry, operational errors and scattered information'
            )}
          </p>
        </header>

        <div className="eza-grid eza-grid--3">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <article key={h.t_en} className="eza-card">
                <span className="eza-card-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="eza-card-title">{L(h.t_fa, h.t_en)}</h3>
                <p className="eza-card-desc">{L(h.d_fa, h.d_en)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section className="eza-section" aria-labelledby="eza-principles-title">
        <header className="eza-section-head">
          <span className="eza-eyebrow eza-eyebrow--muted">
            {L('اصول طراحی', 'Design principles')}
          </span>
          <h2 id="eza-principles-title" className="eza-h2">
            {L('سامانه بر چه اصولی ساخته شده', 'What the platform is built on')}
          </h2>
        </header>

        <div className="eza-grid eza-grid--4">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.t_en} className="eza-card eza-card--soft">
                <span className="eza-card-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="eza-card-title">{L(p.t_fa, p.t_en)}</h3>
                <p className="eza-card-desc">{L(p.d_fa, p.d_en)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="eza-cta" aria-labelledby="eza-cta-title">
        <div className="eza-cta-glow" aria-hidden="true" />
        <h2 id="eza-cta-title" className="eza-cta-title">
          {L(
            'زیرساخت دیجیتال امن، مقیاس‌پذیر و آینده‌نگر',
            'A secure, scalable, future-ready digital infrastructure'
          )}
        </h2>
        <p className="eza-cta-sub">
          {L(
            'تجارت، گمرک، زنجیرهٔ تأمین و تولید را روی یک پلتفرم واحد به هم وصل کنید',
            'Connect trade, customs, supply chain and production on one platform'
          )}
        </p>
        <Link to="/contact" className="ez-btn-lg ez-btn-lg--primary">
          {L('شروع گفتگو', 'Start a conversation')}
          <ArrowRight size={18} className="eza-arrow" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;