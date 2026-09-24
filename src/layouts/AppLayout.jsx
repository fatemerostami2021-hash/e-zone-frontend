import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/useTheme';
import Button from '../components/Button';
import Sidebar, { MODULE_KEYS } from '../components/Sidebar';
import './AppLayout.css';

// Module keys that have a dedicated page (others use the generic placeholder)
const MODULE_ROUTES = {
  companies: '/app/companies',
  baseInfo: '/app/goods',
};

function findActiveKey(pathname) {
  // Reverse lookup: match real page paths to their module key
  for (const [key, path] of Object.entries(MODULE_ROUTES)) {
    if (pathname === path) return key;
  }
  const m = pathname.match(/^\/app\/modules\/([a-z0-9-]+)$/i);
  return m && MODULE_KEYS.includes(m[1]) ? m[1] : null;
}

function AppLayout() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Active sidebar item is derived from the URL, not local state
  const activeKey = findActiveKey(location.pathname);
  const activeIndex = activeKey ? MODULE_KEYS.indexOf(activeKey) : -1;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fa' ? 'en' : 'fa');
  };

  const handleSelect = (index) => {
    if (index === -1) {
      navigate('/app');
    } else {
      const key = MODULE_KEYS[index];
      navigate(MODULE_ROUTES[key] || `/app/modules/${key}`);
    }
  };

  const pageTitle = activeIndex === -1 ? t('home') : t(`modules.${activeKey}`);

  return (
    <div className="ez-app">
      <Sidebar activeIndex={activeIndex} onSelect={handleSelect} />

      <div className="ez-shell">
        <header className="ez-topbar">
          <span className="ez-page-title">{pageTitle}</span>
          <div className="ez-topbar-actions">
            <Button variant="ghost" onClick={toggleLanguage}>
              {i18n.language === 'fa' ? 'English' : 'فارسی'}
            </Button>
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === 'light' ? t('darkMode') : t('lightMode')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              {t('nav.home')}
            </Button>
          </div>
        </header>

        <main className="ez-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
