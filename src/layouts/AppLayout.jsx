import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/useTheme';
import Button from '../components/Button';
import Sidebar, { MODULE_KEYS } from '../components/Sidebar';
import './AppLayout.css';

function AppLayout() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fa' ? 'en' : 'fa');
  };

  const handleSelect = (index) => {
    setActiveIndex(index);
    if (index === -1) {
      navigate('/app');
    } else {
      const key = MODULE_KEYS[index];
      navigate(`/app/modules/${key}`);
    }
  };

  const activeModule = activeIndex >= 0 ? MODULE_KEYS[activeIndex] : null;
  const pageTitle = activeIndex === -1 ? t('home') : t(`modules.${activeModule}`);

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
