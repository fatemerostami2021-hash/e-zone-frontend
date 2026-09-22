import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import './CompaniesPage.css';

const MOCK_COMPANIES = [
  {
    id: 1,
    name_fa: 'شرکت صنایع فولاد پارسیان',
    name_en: 'Persian Steel Industries Co.',
    registration_number: '10102030405',
    economic_code: '411111111111',
    address_fa: 'منطقه ویژه اقتصادی، شهرک صنعتی فولاد، جاده اهواز',
    address_en: 'Steel Industrial Town, Special Economic Zone, Ahvaz Road',
    is_active: true,
  },
  {
    id: 2,
    name_fa: 'شرکت تولیدی نساجی البرز',
    name_en: 'Alborz Textile Manufacturing Co.',
    registration_number: '10203040506',
    economic_code: '411111111122',
    address_fa: 'منطقه ویژه اقتصادی، شهرک نساجی، جاده کاشان',
    address_en: 'Textile Industrial Town, Special Economic Zone, Kashan Road',
    is_active: true,
  },
  {
    id: 3,
    name_fa: 'شرکت صنایع غذایی زاگرس',
    name_en: 'Zagros Food Industries Co.',
    registration_number: '10304050607',
    economic_code: '411111111133',
    address_fa: 'منطقه ویژه اقتصادی، شهرک صنایع غذایی، جاده شیراز',
    address_en: 'Food Industrial Town, Special Economic Zone, Shiraz Road',
    is_active: true,
  },
  {
    id: 4,
    name_fa: 'شرکت محصولات پتروشیمی خزر',
    name_en: 'Caspian Petrochemical Products Co.',
    registration_number: '10405060708',
    economic_code: '411111111144',
    address_fa: 'منطقه ویژه اقتصادی، شهرک پتروشیمی، جاده بندر انزلی',
    address_en: 'Petrochemical Industrial Town, Special Economic Zone, Bandar Anzali Road',
    is_active: false,
  },
];

function CompaniesPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === 'fa';

  const total = MOCK_COMPANIES.length;
  const activeCount = MOCK_COMPANIES.filter((c) => c.is_active).length;
  const inactiveCount = total - activeCount;

  return (
    <div className="ez-companies-page">
      <div className="ez-page-header">
        <h1 className="ez-page-heading">{t('modules.companies')}</h1>
        <Button variant="primary">{t('addCompany')}</Button>
      </div>

      <div className="ez-stats-row">
        <div className="ez-stat-card">
          <span className="ez-stat-value">{total}</span>
          <span className="ez-stat-label">{t('totalCompanies')}</span>
        </div>
        <div className="ez-stat-card">
          <span className="ez-stat-value">{activeCount}</span>
          <span className="ez-stat-label">{t('activeCompanies')}</span>
        </div>
        <div className="ez-stat-card">
          <span className="ez-stat-value">{inactiveCount}</span>
          <span className="ez-stat-label">{t('inactiveCompanies')}</span>
        </div>
      </div>

      <div className="ez-table-wrapper">
        <table className="ez-table">
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('registrationNumber')}</th>
              <th>{t('economicCode')}</th>
              <th>{t('address')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPANIES.map((c) => (
              <tr key={c.id}>
                <td>{isFa ? c.name_fa : c.name_en}</td>
                <td className="ez-cell-mono">{c.registration_number}</td>
                <td className="ez-cell-mono">{c.economic_code}</td>
                <td className="ez-cell-muted">{isFa ? c.address_fa : c.address_en}</td>
                <td>
                  <span className={`ez-badge${c.is_active ? ' is-active' : ' is-inactive'}`}>
                    {c.is_active ? t('active') : t('inactive')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompaniesPage;
