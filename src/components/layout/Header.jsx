import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Moon, Sun, LogIn } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import './Header.css';

function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fa' ? 'en' : 'fa');
  };

  const close = () => setOpen(false);

  return (
    <header className="ez-header">
      <div className="ez-header-inner">
        <Link to="/" className="ez-header-brand" onClick={close}>
          <span className="ez-header-logo">E</span>
          <span className="ez-header-name">{t('appName')}</span>
        </Link>

        <nav className={`ez-header-nav${open ? ' is-open' : ''}`}>
          <NavLink to="/" end className="ez-nav-link" onClick={close}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/modules" className="ez-nav-link" onClick={close}>
            {t('nav.modules')}
          </NavLink>
          <NavLink to="/about" className="ez-nav-link" onClick={close}>
            {t('nav.about')}
          </NavLink>
          <NavLink to="/contact" className="ez-nav-link" onClick={close}>
            {t('nav.contact')}
          </NavLink>
        </nav>

        <div className="ez-header-actions">
          <button
            type="button"
            className="ez-icon-btn"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <Globe size={18} />
            <span className="ez-icon-btn-label">{i18n.language === 'fa' ? 'EN' : 'FA'}</span>
          </button>

          <button
            type="button"
            className="ez-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link to="/login" className="ez-header-cta">
            <LogIn size={16} />
            {t('login')}
          </Link>

          <button
            type="button"
            className="ez-icon-btn ez-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
