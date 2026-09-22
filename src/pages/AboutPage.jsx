import { useTranslation } from 'react-i18next';
import Seo from '../seo/Seo';

function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('nav.about')} description={t('footer.tagline')} path="/about" />
      <section className="ez-hero">
        <h1 className="ez-hero-title">{t('nav.about')}</h1>
        <p className="ez-hero-subtitle">{t('footer.tagline')}</p>
      </section>
    </>
  );
}

export default AboutPage;
