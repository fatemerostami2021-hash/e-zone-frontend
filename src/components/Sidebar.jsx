import { useTranslation } from 'react-i18next';
import './Sidebar.css';

export const MODULE_KEYS = [
  'userAccess', 'companies', 'baseInfo', 'importDocs', 'domesticWarehouse',
  'foreignWarehouse', 'consumptionPlan', 'production', 'productionCertificate',
  'inventory', 'orders', 'customsDeclaration', 'reports', 'fileManagement', 'notifications',
];

function Sidebar({ activeIndex, onSelect }) {
  const { t } = useTranslation();

  return (
    <nav className="ez-sidebar" aria-label={t('modulesNav')}>
      <button type="button" className="ez-sidebar-brand" onClick={() => onSelect(-1)}>
        {t('appName')}
      </button>
      <ul className="ez-sidebar-list">
        {MODULE_KEYS.map((key, index) => (
          <li key={key}>
            <button
              type="button"
              className={`ez-sidebar-item${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => onSelect(index)}
            >
              <span className="ez-sidebar-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="ez-sidebar-label">{t(`modules.${key}`)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
