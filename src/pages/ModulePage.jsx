import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '../components/common/DataTable';
import { listCompanies } from '../api/companiesApi';
import { SAMPLE_MODULE_KEYS, buildSampleRows } from '../data/sampleModules';
import './CompaniesPage.css'; // shared ez-page-*, ez-stat-*, ez-badge, ez-cell-* styles
import './ModulePage.css';

function ModulePage() {
  const { key } = useParams();
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let cancelled = false;
    listCompanies()
      .then((rows) => { if (!cancelled) setCompanies(rows || []); })
      .catch(() => { /* sample page: fall back to company ids */ });
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => {
    const names = new Map(companies.map((c) => [c.id, isFa ? c.name_fa : c.name_en]));
    return buildSampleRows(key).map((r) => ({
      ...r,
      company: names.get(r.companyId) || `#${r.companyId}`,
      statusText: t(`samplePage.status.${r.status}`),
    }));
  }, [key, companies, isFa, t]);

  const columns = useMemo(() => [
    {
      key: 'ref',
      label: t('samplePage.columns.ref'),
      render: (r) => <span className="ez-cell-mono">{r.ref}</span>,
    },
    {
      key: 'date',
      label: t('samplePage.columns.date'),
      render: (r) => <span className="ez-cell-mono">{r.date}</span>,
    },
    { key: 'company', label: t('samplePage.columns.company') },
    {
      key: 'quantity',
      label: t('samplePage.columns.quantity'),
      render: (r) => <span className="ez-cell-mono">{r.quantity}</span>,
    },
    {
      key: 'statusText',
      label: t('samplePage.columns.status'),
      render: (r) => (
        <span className={`ez-badge${r.status === 'approved' ? ' is-active' : ' is-inactive'}`}>
          {r.statusText}
        </span>
      ),
    },
  ], [t]);

  if (!SAMPLE_MODULE_KEYS.includes(key)) {
    return <Navigate to="/app" replace />;
  }

  const total = rows.length;
  const approved = rows.filter((r) => r.status === 'approved').length;
  const pending = rows.filter((r) => r.status === 'pending').length;

  return (
    <div className="ez-module-page">
      <div className="ez-page-header">
        <h1 className="ez-page-heading">{t(`modules.${key}`)}</h1>
      </div>

      <p className="ez-sample-notice" role="note">{t('samplePage.notice')}</p>

      <div className="ez-stats-row">
        <div className="ez-stat-card">
          <span className="ez-stat-value">{total}</span>
          <span className="ez-stat-label">{t('samplePage.total')}</span>
        </div>
        <div className="ez-stat-card">
          <span className="ez-stat-value">{approved}</span>
          <span className="ez-stat-label">{t('samplePage.status.approved')}</span>
        </div>
        <div className="ez-stat-card">
          <span className="ez-stat-value">{pending}</span>
          <span className="ez-stat-label">{t('samplePage.status.pending')}</span>
        </div>
      </div>

      <DataTable columns={columns} data={rows} pageSize={8} />
    </div>
  );
}

export default ModulePage;
