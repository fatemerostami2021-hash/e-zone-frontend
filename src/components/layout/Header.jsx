import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, LogIn } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { GB, IR } from 'country-flag-icons/react/3x2';
import './Header.css';

function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isFa = i18n.language === 'fa';
  const toggleLanguage = () => i18n.changeLanguage(isFa ? 'en' : 'fa');
  const langLabel = isFa ? 'English' : 'فارسی';
  const close = () => setOpen(false);

  const navItems = [
    { to: '/', end: true, label: t('nav.home') },
    { to: '/modules', end: false, label: t('nav.modules') },
    { to: '/about', end: false, label: t('nav.about') },
    { to: '/contact', end: false, label: t('nav.contact') },
  ];

  return (
    <header className={`ez-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="ez-header-inner">
        <Link to="/" className="ez-header-brand" onClick={close}>
          <img src="/logo.png" alt={t('appName')} className="ez-header-logo" />
          <span className="ez-header-name">{t('appName')}</span>
        </Link>

        <nav
          ref={navRef}
          id="ez-primary-nav"
          className={`ez-header-nav${open ? ' is-open' : ''}`}
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `ez-nav-link${isActive ? ' is-active' : ''}`
              }
              onClick={close}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/login" className="ez-header-cta ez-header-cta--mobile" onClick={close}>
            <LogIn size={16} /> {t('login')}
          </Link>
        </nav>

        <div className="ez-header-actions">
          <button
            type="button"
            className="ez-lang-switch"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <span className="ez-flag" aria-hidden="true">
              {isFa ? <GB title="English" /> : <IR title="فارسی" />}
            </span>
            <span className="ez-lang-label">{langLabel}</span>
          </button>

          <button
            type="button"
            className="ez-theme-switch"
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

      {open && <div className="ez-header-backdrop" onClick={close} aria-hidden="true" />}
    </header>
  );
}

export default Header;
