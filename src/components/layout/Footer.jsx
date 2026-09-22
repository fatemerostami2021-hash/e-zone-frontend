import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="ez-footer">
      <div className="ez-footer-inner">
        <div className="ez-footer-col ez-footer-brand">
          <div className="ez-footer-logo">E-ZONE</div>
          <p className="ez-footer-desc">{t('footer.tagline')}</p>
        </div>

        <div className="ez-footer-col">
          <h4 className="ez-footer-title">{t('footer.product')}</h4>
          <ul className="ez-footer-list">
            <li><Link to="/modules">{t('nav.modules')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/login">{t('login')}</Link></li>
          </ul>
        </div>

        <div className="ez-footer-col">
          <h4 className="ez-footer-title">{t('footer.legal')}</h4>
          <ul className="ez-footer-list">
            <li><Link to="/terms">{t('footer.terms')}</Link></li>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div className="ez-footer-col">
          <h4 className="ez-footer-title">{t('footer.contact')}</h4>
          <ul className="ez-footer-list ez-footer-contact">
            <li><Mail size={14} /> info@ezone.ir</li>
            <li><Phone size={14} /> +98 21 0000 0000</li>
            <li><MapPin size={14} /> {t('footer.address')}</li>
          </ul>
        </div>
      </div>

      <div className="ez-footer-bottom">
        <span>© {year} E-ZONE. {t('footer.rights')}</span>
      </div>
    </footer>
  );
}

export default Footer;
