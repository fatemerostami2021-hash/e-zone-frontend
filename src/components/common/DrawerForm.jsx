import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import Button from '../Button';
import './DrawerForm.css';

function DrawerForm({ open, title, onClose, onSubmit, submitting = false, children }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="ez-drawer-overlay" onClick={onClose}>
      <div
        className="ez-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ez-drawer-title"
      >
        <div className="ez-drawer-header">
          <h2 id="ez-drawer-title" className="ez-page-heading">{title}</h2>
          <button type="button" className="ez-icon-btn" onClick={onClose} aria-label={t('drawer.close')}>
            <X size={18} />
          </button>
        </div>

        <form
          className="ez-drawer-body"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        >
          <div className="ez-drawer-fields">{children}</div>

          <div className="ez-drawer-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              {t('drawer.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? t('drawer.saving') : t('drawer.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DrawerForm;
