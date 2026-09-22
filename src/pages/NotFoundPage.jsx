import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '../seo/Seo';
import Button from '../components/Button';

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title="404" description="Page not found" path="/404" noindex />
      <section className="ez-hero" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <h1 className="ez-hero-title" style={{ fontSize: '5rem', margin: 0 }}>404</h1>
        <p className="ez-hero-subtitle">{t('notFound.message')}</p>
        <Link to="/"><Button variant="primary">{t('notFound.back')}</Button></Link>
      </section>
    </>
  );
}

export default NotFoundPage;
