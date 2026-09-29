import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Languages, History, Layers } from 'lucide-react';
import './AboutPage.css';

const FLOW = [
  { t_fa: 'رسید انبار', t_en: 'Warehouse receipt', d_fa: 'ثبت ورود کالای داخلی و خارجی به انبار، یک‌بار و با همهٔ مشخصات.', d_en: 'Domestic and foreign goods are recorded on arrival, once, with all their details.' },
  { t_fa: 'اسناد واردات', t_en: 'Import documents', d_fa: 'اسناد واردات بر پایهٔ رسید ثبت و اعتبارسنجی می‌شوند.', d_en: 'Import documents are built from the receipt and validated.' },
  { t_fa: 'موجودی انبار', t_en: 'Inventory', d_fa: 'موجودی هر کالا با هر ورود و مصرف به‌روز می‌ماند.', d_en: 'Stock per item stays current with every receipt and consumption.' },
  { t_fa: 'طرح مصرف (BOM)', t_en: 'Consumption plan (BOM)', d_fa: 'مواد مصرفی هر محصول نهایی از پیش تعریف می‌شود.', d_en: 'The materials each finished product consumes are defined up front.' },
  { t_fa: 'ثبت تولید', t_en: 'Production entry', d_fa: 'تولید در برابر طرح مصرف ثبت می‌شود.', d_en: 'Production is recorded against the consumption plan.' },
  { t_fa: 'گواهی تولید', t_en: 'Production certificate', d_fa: 'گواهی تولید از روی داده‌های ثبت‌شده صادر می‌شود.', d_en: 'The production certificate is generated from the recorded data.' },
  { t_fa: 'ثبت سفارش', t_en: 'Order registration', d_fa: 'سفارش بر پایهٔ محصولات تولیدشده ثبت می‌شود.', d_en: 'Orders are registered from the goods produced.' },
  { t_fa: 'اظهارنامه و گزارش', t_en: 'Declaration and reports', d_fa: 'اظهارنامهٔ گمرکی و گزارش‌های نهایی بدون ورود دوبارهٔ اطلاعات آماده می‌شوند.', d_en: 'The customs declaration and final reports are prepared without re-entering data.' },
];

const PRINCIPLES = [
  { icon: Layers, t_fa: 'یک‌بار ثبت، همه‌جا استفاده', t_en: 'Enter once, reuse everywhere', d_fa: 'داده‌ای که در ابتدا ثبت می‌شود در همهٔ مراحل بعدی همراه کالا می‌ماند.', d_en: 'Data entered at the start follows the goods through every later step.' },
  { icon: ShieldCheck, t_fa: 'جداسازی کامل شرکت‌ها', t_en: 'Strict company isolation', d_fa: 'هر شرکت فقط داده و فایل خودش را می‌بیند؛ دسترسی کاربران به شرکت‌ها جدا کنترل می‌شود.', d_en: 'Each company sees only its own data and files; user access is controlled per company.' },
  { icon: History, t_fa: 'ردپای کامل تغییرات', t_en: 'A full audit trail', d_fa: 'رکوردهای مهم حذف نمی‌شوند و هر تغییر با کاربر و زمانش ثبت می‌شود.', d_en: 'Important records are never hard-deleted; every change is logged with user and time.' },
  { icon: Languages, t_fa: 'دوزبانه، روشن و تیره', t_en: 'Bilingual, light and dark', d_fa: 'رابط فارسی و انگلیسی با تم روشن و تیره برای تیم‌هایی که با هر دو زبان کار می‌کنند.', d_en: 'Persian and English interface with light and dark themes for teams that use both.' },
];

const ZONES = [
  { fa: 'منطقه آزاد چابهار', en: 'Chabahar FTZ' },
  { fa: 'منطقه ویژه اروند', en: 'Arvand SEZ' },
  { fa: 'منطقه آزاد انزلی', en: 'Anzali Free Zone' },
  { fa: 'منطقه ویژه سلفچگان', en: 'Salafchegan SEZ' },
];

function AboutPage() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const L = (fa, en) => (isFa ? fa : en);
  const num = (i) =>
    isFa ? i.toLocaleString('fa-IR', { minimumIntegerDigits: 2 }) : String(i).padStart(2, '0');

  const trackRef = useRef(null);
  // "next" moves in the reading direction: left in RTL, right in LTR
  const slide = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (isFa ? -1 : 1) * 320, behavior: 'smooth' });
  };

  return (
    <div className="eza">
      {/* Hero */}
      <section className="eza-band eza-hero">
        <h1 className="eza-hero-title">{L('درباره ایزون', 'About E-ZONE')}</h1>
        <p className="eza-hero-sub">
          {L(
            'پنجرهٔ واحد نسل جدید مناطق ویژه و آزاد: مسیر کالا از انبار تا اظهارنامه، روی یک بستر چندشرکتی.',
            'The next-generation single window for free and special economic zones: goods from warehouse to declaration on one multi-company platform.',
          )}
        </p>
        <div className="eza-actions">
          <Link to="/contact" className="ez-btn-lg ez-btn-lg--primary">
            {L('درخواست مشاوره', 'Request a consultation')}
            <ArrowRight size={18} className="eza-arrow" aria-hidden="true" />
          </Link>
          <Link to="/modules" className="ez-btn-lg ez-btn-lg--outline">
            {L('مشاهدهٔ ماژول‌ها', 'Explore modules')}
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className="eza-intro">
        <div className="eza-intro-copy">
          <h2 className="eza-h2">
            {L('برای گمرک و تولید، یک بستر یکپارچه ساخته‌ایم', 'We built one platform for customs and production')}
          </h2>
          <p>
            {L(
              'شرکت‌های مستقر در مناطق آزاد و ویژه معمولاً یک اطلاعات را بارها در انبار، اسناد واردات، تولید و اظهارنامه وارد می‌کنند. ایزون این زنجیره را به هم وصل می‌کند.',
              'Companies in free and special zones usually enter the same information again and again across warehouse, import documents, production and declarations. E-ZONE connects that chain.',
            )}
          </p>
          <p>
            {L(
              'هر مرحله از خروجی مرحلهٔ قبل استفاده می‌کند؛ پس خطای ورود دستی کمتر می‌شود و همهٔ تیم‌ها روی یک منبع داده کار می‌کنند.',
              'Each step builds on the output of the one before it, so manual entry errors drop and every team works from a single source of data.',
            )}
          </p>
        </div>
        <div className="eza-intro-media">
          <img src="/image/digitize-your-Trade-Zone.webp" alt={L('دیجیتال‌سازی منطقهٔ تجاری', 'Digitizing the trade zone')} loading="lazy" />
        </div>
      </section>

      {/* Showcase */}
      <section className="eza-showcase" aria-label={L('نگاهی به سامانه', 'Platform overview')}>
        <figure className="eza-shot eza-shot--wide">
          <img src="/image/Logistics.webp" alt="" loading="lazy" />
          <figcaption>
            <span className="eza-shot-num">{isFa ? (15).toLocaleString('fa-IR') : 15}</span>
            <span>{L('ماژول از انبار تا گزارش', 'modules, from warehouse to reports')}</span>
          </figcaption>
        </figure>
        <figure className="eza-shot">
          <img src="/image/Strict-Multi.webp" alt="" loading="lazy" />
          <figcaption>
            <span>{L('جداسازی شرکت‌ها', 'Company isolation')}</span>
          </figcaption>
        </figure>
        <figure className="eza-shot">
          <img src="/image/digitize-your-Trade-Zone.webp" alt="" loading="lazy" />
          <figcaption>
            <span>{L('اظهارنامهٔ گمرکی', 'Customs declaration')}</span>
          </figcaption>
        </figure>
      </section>

      {/* Flow */}
      <section className="eza-band eza-flow">
        <div className="eza-flow-head">
          <div>
            <h2 className="eza-h2 eza-h2--light">{L('مسیر یک کالا در ایزون', 'How goods move through E-ZONE')}</h2>
            <p className="eza-flow-sub">{L('هشت مرحله، یک بار ورود اطلاعات.', 'Eight steps, one data entry.')}</p>
          </div>
          <div className="eza-nav">
            <button type="button" onClick={() => slide(-1)} aria-label={L('قبلی', 'Previous')}>
              <ArrowRight size={18} className="eza-nav-prev" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => slide(1)} aria-label={L('بعدی', 'Next')}>
              <ArrowRight size={18} className="eza-nav-next" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ol className="eza-track" ref={trackRef}>
          {FLOW.map((s, i) => (
            <li key={s.t_en} className="eza-step">
              <span className="eza-step-n">{num(i + 1)}</span>
              <h3>{L(s.t_fa, s.t_en)}</h3>
              <p>{L(s.d_fa, s.d_en)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Principles */}
      <section className="eza-principles-wrap">
        <h2 className="eza-h2">{L('اصولی که سامانه بر آن ساخته شده', 'What the platform is built on')}</h2>
        <div className="eza-principles">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.t_en} className="eza-principle">
                <span className="eza-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{L(p.t_fa, p.t_en)}</h3>
                <p>{L(p.d_fa, p.d_en)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="eza-band eza-cta">
        <h2 className="eza-h2 eza-h2--light">{L('مسیر کالای شرکت شما را با هم ساده کنیم', 'Let’s simplify how your goods move')}</h2>
        <ul className="eza-zones" aria-label={L('مناطق پشتیبانی‌شده', 'Supported zones')}>
          {ZONES.map((z) => (
            <li key={z.en}>{L(z.fa, z.en)}</li>
          ))}
        </ul>
        <Link to="/contact" className="ez-btn-lg ez-btn-lg--primary">
          {L('تماس با ما', 'Contact us')}
          <ArrowRight size={18} className="eza-arrow" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;