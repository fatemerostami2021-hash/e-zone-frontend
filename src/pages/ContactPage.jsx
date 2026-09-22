import { useTranslation } from 'react-i18next';
import Seo from '../seo/Seo';

function ContactPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('nav.contact')} description={t('footer.tagline')} path="/contact" />
      <section className="ez-hero">
        <h1 className="ez-hero-title">{t('nav.contact')}</h1>
        <p className="ez-hero-subtitle">info@ezone.ir</p>
      </section>
    </>
  );
}

export default ContactPage;
