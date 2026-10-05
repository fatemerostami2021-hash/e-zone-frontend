import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send as TelegramIcon } from 'lucide-react';
import { openCookieSettings } from '../cookieUtils';
import { Instagram, Linkedin, Facebook } from './BrandIcons';
import './Footer.css';

function PlaneIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="currentColor"
        d="M60 32 44 27 30 8h-8l10 20H14l-6-8H3l5 12-5 12h5l6-8h18L22 56h8l14-19z"
      />
    </svg>
  );
}

const SOCIALS = [
  {
    id: 'telegram',
    icon: TelegramIcon,
    label: 'Telegram',
    url: 'https://t.me/fitness_mindset',
  },
  {
    id: 'instagram',
    icon: Instagram,
    label: 'Instagram',
    url: 'https://www.instagram.com/f.rostamii_web',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fatemeh-rostami963/',
  },
  {
    id: 'facebook',
    icon: Facebook,
    label: 'Facebook',
    url: '', // خالی → نمایش داده نمی‌شود
  },
].filter((s) => s.url);

function Footer() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language?.startsWith('fa');
  const L = (fa, en) => (isFa ? fa : en);
  const year = new Date().getFullYear();

  const tagline = t('brandTagline', {
    defaultValue: 'Smart Customs & Trade Management Platform',
  });

  return (
    <footer className="ez-footer">
      {/* هواپیمای در حال حرکت */}
      <div className="ez-sky" aria-hidden="true">
        <span className="ez-sky-route" />
        <span className="ez-plane">
          <span className="ez-plane-trail" />
          <PlaneIcon />
        </span>
      </div>

      <div className="ez-footer-inner">
        {/* برند */}
        <div className="ez-footer-brand">
          <div className="ez-footer-logo-row">
            <span className="ez-footer-logo-wrap">
              <img src="/logo.png" alt={t('appName')} />
            </span>
            <div>
              <strong>{t('appName')}</strong>
              <small>{tagline}</small>
            </div>
          </div>
          <p>
            {L(
              'یکپارچه‌سازی مستندسازی گمرکی، انبار و تولید در مناطق ویژه و آزاد تجاری.',
              'Unifying customs documentation, warehousing and production across special and free economic zones.'
            )}
          </p>
        </div>

        {/* دسترسی سریع */}
        <nav className="ez-footer-col" aria-label={L('دسترسی سریع', 'Quick links')}>
          <h4>{L('دسترسی سریع', 'Quick links')}</h4>
          <ul className="ez-footer-links">
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/modules">{t('nav.modules')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
          </ul>
        </nav>

        {/* حریم خصوصی و دسترسی */}
        <div className="ez-footer-col ez-footer-col--actions">
          <h4>{L('حریم خصوصی و دسترسی', 'Privacy & access')}</h4>
          <ul className="ez-footer-links">
            <li>
              <button type="button" onClick={openCookieSettings}>
                {L('تنظیمات حریم خصوصی', 'Privacy settings')}
              </button>
            </li>
            <li>
              <Link to="/login">{t('login')}</Link>
            </li>
          </ul>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div className="ez-footer-col ez-footer-col--social">
          <h4>{L('ما را دنبال کنید', 'Follow us')}</h4>
          <ul className="ez-footer-social">
            {SOCIALS.map(({ id, icon: Icon, label, url }) => (
              <li key={id}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`ez-footer-social-link ez-footer-social-link--${id}`}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ez-footer-bottom">
        <span>
          © {year} {t('appName')} — {L('تمامی حقوق محفوظ است', 'All rights reserved')}
        </span>
      </div>
    </footer>
  );
}


export default Footer;