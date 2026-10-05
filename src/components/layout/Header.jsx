import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu, X, Sun, Moon, LogIn, Search, ChevronDown, ArrowUpRight,
  FileText, Warehouse, Factory, BarChart3, ShieldCheck, Boxes,
} from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { GB, IR } from 'country-flag-icons/react/3x2';
import './Header.css';

// ⚠️ عنوان‌ها و لینک‌ها را با ماژول‌های واقعی E-ZONE عوض کن
const MODULES = [
  { id: 'customs', icon: FileText, to: '/modules#customs',
    fa: 'مستندسازی گمرکی', en: 'Customs Documentation',
    dfa: 'ثبت، پیگیری و آرشیو اظهارنامه‌ها', den: 'File, track and archive declarations' },
  { id: 'warehouse', icon: Warehouse, to: '/modules#warehouse',
    fa: 'مدیریت انبار', en: 'Warehouse & Inventory',
    dfa: 'کنترل ورود، خروج و موجودی کالا', den: 'Control inbound, outbound and stock' },
  { id: 'production', icon: Factory, to: '/modules#production',
    fa: 'تولید و کیل مصرف', en: 'Production & BOM',
    dfa: 'ردیابی جریان تولید و مصرف مواد', den: 'Trace production flow and consumption' },
  { id: 'compliance', icon: ShieldCheck, to: '/modules#compliance',
    fa: 'ممیزی و انطباق', en: 'Audit & Compliance',
    dfa: 'انطباق با استانداردهای بین‌المللی', den: 'Stay aligned with international standards' },
  { id: 'logistics', icon: Boxes, to: '/modules#logistics',
    fa: 'لجستیک و حمل', en: 'Logistics & Shipments',
    dfa: 'پیگیری محموله‌ها و شرکت‌های فعال', den: 'Track shipments and active companies' },
  { id: 'reports', icon: BarChart3, to: '/modules#reports',
    fa: 'گزارش و تحلیل', en: 'Reports & Analytics',
    dfa: 'داشبورد و گزارش‌های مدیریتی', den: 'Dashboards and management reports' },
];

function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const megaRef = useRef(null);
  const searchInputRef = useRef(null);

  const isFa = i18n.language?.startsWith('fa');
  const L = (fa, en) => (isFa ? fa : en);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // بستن همه‌چیز هنگام تغییر مسیر (بدون setState داخل effect)
  const [prevPath, setPrevPath] = useState(location.pathname + location.hash);
  const currentPath = location.pathname + location.hash;
  if (currentPath !== prevPath) {
    setPrevPath(currentPath);
    setOpen(false);
    setMega(false);
    setSearchOpen(false);
    setQuery('');
  }

  // قفل اسکرول
  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open, searchOpen]);

  // Esc و Ctrl/⌘ + K
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setMega(false);
        setSearchOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // کلیک بیرون از مگامنو
  useEffect(() => {
    if (!mega) return;
    const onDown = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMega(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [mega]);

  // فوکوس روی input سرچ
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeAll = () => {
    setOpen(false);
    setMega(false);
    setSearchOpen(false);
    setQuery('');
  };
  const go = (to) => {
    closeAll();
    navigate(to);
  };
  const toggleLanguage = () => i18n.changeLanguage(isFa ? 'en' : 'fa');

  const tagline = t('brandTagline', {
    defaultValue: 'Smart Customs & Trade Management Platform',
  });

  const pages = [
    { to: '/', label: t('nav.home'), hint: L('صفحه', 'Page') },
    { to: '/modules', label: t('nav.modules'), hint: L('صفحه', 'Page') },
    { to: '/about', label: t('nav.about'), hint: L('صفحه', 'Page') },
    { to: '/contact', label: t('nav.contact'), hint: L('صفحه', 'Page') },
    { to: '/login', label: t('login'), hint: L('حساب کاربری', 'Account') },
  ];

  const results = useMemo(() => {
    const all = [
      ...pages,
      ...MODULES.map((m) => ({
        to: m.to,
        label: isFa ? m.fa : m.en,
        hint: isFa ? m.dfa : m.den,
      })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 7);
    return all.filter((r) => `${r.label} ${r.hint}`.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isFa, i18n.language]);

  const modulesActive = location.pathname.startsWith('/modules');

  return (
    <header className={`ez-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="ez-header-inner">
        {/* ---------- Brand ---------- */}
        <Link to="/" className="ez-header-brand" onClick={closeAll}>
          <span className="ez-header-logo-wrap">
            <img src="/logo.png" alt={t('appName')} className="ez-header-logo" />
          </span>
          <span className="ez-header-text">
            <span className="ez-header-name">{t('appName')}</span>
            <span className="ez-header-tagline">{tagline}</span>
          </span>
        </Link>

        {/* ---------- Nav ---------- */}
        <nav id="ez-primary-nav" className={`ez-header-nav${open ? ' is-open' : ''}`} aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => `ez-nav-link${isActive ? ' is-active' : ''}`} onClick={closeAll}>
            {t('nav.home')}
          </NavLink>

          {/* Mega menu */}
          <div className="ez-mega-wrap" ref={megaRef}>
            <button
              type="button"
              className={`ez-nav-link ez-mega-trigger${modulesActive ? ' is-active' : ''}${mega ? ' is-open' : ''}`}
              aria-expanded={mega}
              aria-controls="ez-mega"
              onClick={() => setMega((v) => !v)}
            >
              {t('nav.modules')}
              <ChevronDown size={15} className="ez-chevron" />
            </button>

            {mega && (
              <div id="ez-mega" className="ez-mega">
                <div className="ez-mega-inner">
                  <div className="ez-mega-grid">
                    {MODULES.map(({ id, icon: Icon, to, fa, en, dfa, den }) => (
                      <Link key={id} to={to} className="ez-mega-item" onClick={closeAll}>
                        <span className="ez-mega-icon"><Icon size={20} /></span>
                        <span className="ez-mega-copy">
                          <strong>{L(fa, en)}</strong>
                          <small>{L(dfa, den)}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/modules" className="ez-mega-all" onClick={closeAll}>
                    {L('مشاهده‌ی همه‌ی ماژول‌ها', 'View all modules')}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={({ isActive }) => `ez-nav-link${isActive ? ' is-active' : ''}`} onClick={closeAll}>
            {t('nav.about')}
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `ez-nav-link${isActive ? ' is-active' : ''}`} onClick={closeAll}>
            {t('nav.contact')}
          </NavLink>

          {/* ---------- Mobile-only actions (inside hamburger) ---------- */}
          <div className="ez-mobile-actions">
            <button
              type="button"
              className="ez-lang-switch ez-mobile-action"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <span className="ez-flag" aria-hidden="true">
                {isFa ? <GB title="English" /> : <IR title="فارسی" />}
              </span>
              <span className="ez-lang-label">{isFa ? 'English' : 'فارسی'}</span>
            </button>

            <button
              type="button"
              className="ez-theme-switch ez-mobile-action"
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle theme"
            >
              <span className="ez-theme-track">
                <span className="ez-theme-knob">
                  {theme === 'light' ? <Sun size={13} /> : <Moon size={13} />}
                </span>
              </span>
              <span className="ez-theme-label">
                {theme === 'light' ? L('روشن', 'Light') : L('تاریک', 'Dark')}
              </span>
            </button>
          </div>

          <Link to="/login" className="ez-header-cta ez-header-cta--mobile" onClick={closeAll}>
            <LogIn size={16} /> {t('login')}
          </Link>
        </nav>

        {/* ---------- Actions (desktop only on mobile) ---------- */}
        <div className="ez-header-actions">
          <button
            type="button"
            className="ez-search-btn ez-action--desktop"
            onClick={() => setSearchOpen(true)}
            aria-label={L('جستجو', 'Search')}
          >
            <Search size={17} />
            <span className="ez-search-btn-text">{L('جستجو…', 'Search…')}</span>
            <kbd>Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="ez-lang-switch ez-action--desktop"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <span className="ez-flag" aria-hidden="true">
              {isFa ? <GB title="English" /> : <IR title="فارسی" />}
            </span>
            <span className="ez-lang-label">{isFa ? 'English' : 'فارسی'}</span>
          </button>

          <button
            type="button"
            className="ez-theme-switch ez-action--desktop"
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label="Toggle theme"
          >
            <span className="ez-theme-track">
              <span className="ez-theme-knob">
                {theme === 'light' ? <Sun size={13} /> : <Moon size={13} />}
              </span>
            </span>
          </button>

          <Link to="/login" className="ez-header-cta ez-header-cta--desktop">
            <LogIn size={16} />
            {t('login')}
          </Link>

          <button
            type="button"
            className="ez-icon-btn ez-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="ez-primary-nav"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {(open || mega) && <div className="ez-header-backdrop" onClick={closeAll} aria-hidden="true" />}

      {/* ---------- Search dialog ---------- */}
      {searchOpen && (
        <div className="ez-search-overlay" onClick={closeAll}>
          <div
            className="ez-search-box"
            role="dialog"
            aria-modal="true"
            aria-label={L('جستجو', 'Search')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ez-search-field">
              <Search size={18} />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results[0]) go(results[0].to);
                }}
                placeholder={L('جستجوی صفحه‌ها و ماژول‌ها…', 'Search pages and modules…')}
              />
              <kbd>Esc</kbd>
            </div>
            <ul className="ez-search-results">
              {results.length === 0 && (
                <li className="ez-search-empty">{L('نتیجه‌ای پیدا نشد', 'No results found')}</li>
              )}
              {results.map((r) => (
                <li key={r.to + r.label}>
                  <button type="button" onClick={() => go(r.to)}>
                    <span>{r.label}</span>
                    <small>{r.hint}</small>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;