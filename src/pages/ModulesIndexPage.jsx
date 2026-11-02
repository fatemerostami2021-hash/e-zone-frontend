import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import Seo from '../seo/Seo';
import ModuleVisual from '../components/ModuleVisual';
import { MODULE_KEYS } from '../components/Sidebar';
import { MODULE_META } from '../data/moduleMeta';
import './HomePage.css';
import './HomePage.fx.css';
import './ModulesIndexPage.css';

function ModulesIndexPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language?.startsWith('fa');

  return (
    <>
      <Seo title={t('nav.modules')} description={t('footer.tagline')} path="/modules" />
      <section className="ezh-section ezm-page">
        <header className="ezm-head">
          <span className="ezh-eyebrow">{isFa ? 'ساختار یکپارچه' : 'One connected system'}</span>
          <h1 className="ezh-section-title">{t('nav.modules')}</h1>
          <p className="ezh-section-sub">
            {isFa
              ? 'پانزده ماژول که یک زنجیره را می‌سازند: داده یک‌بار ثبت می‌شود و در همه‌ی مراحل، از اسناد واردات تا اظهارنامه، دوباره استفاده می‌شود.'
              : 'Fifteen modules forming one chain: data is captured once and reused at every step, from import documents to the final declaration.'}
          </p>
        </header>

        <div className="ezh-features-grid ezm-grid">
          {MODULE_KEYS.map((key, i) => {
            const meta = MODULE_META[key] || {};
            return (
              <Link
                key={key}
                to={`/app/modules/${key}`}
                className="ezh-feature-card ezh-feature-card--art ezm-card"
              >
                <ModuleVisual name={meta.icon} index={i} />
                <span className="ezm-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="ezh-feature-body">
                  <h3>{t(`modules.${key}`)}</h3>
                  <p>{isFa ? meta.fa : meta.en}</p>
                  <span className="ezm-open">
                    {isFa ? 'مشاهده ماژول' : 'Open module'}
                    <ArrowUpRight size={16} className="ezm-open-ico" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default ModulesIndexPage;
