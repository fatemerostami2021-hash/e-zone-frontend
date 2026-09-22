import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '../seo/Seo';
import { MODULE_KEYS } from '../components/Sidebar';

function ModulesIndexPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('nav.modules')} description={t('footer.tagline')} path="/modules" />
      <section className="ezh-section">
        <h1 className="ezh-section-title">{t('nav.modules')}</h1>
        <div className="ezh-features-grid">
          {MODULE_KEYS.map((key, i) => (
            <Link
              key={key}
              to={`/app/modules/${key}`}
              className="ezh-feature-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="ezh-feature-icon">{String(i + 1).padStart(2, '0')}</div>
              <h3>{t(`modules.${key}`)}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default ModulesIndexPage;
