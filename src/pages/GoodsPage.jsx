import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import DataTable from '../components/common/DataTable';
import DrawerForm from '../components/common/DrawerForm';
import FormField from '../components/common/FormField';
import { listGoods, createGoods, updateGoods, deleteGoods } from '../api/goodsApi';
import { listUnits } from '../api/unitsApi';
import { listCompanies } from '../api/companiesApi';
import './CompaniesPage.css';

const ITEM_TYPES = ['raw_material', 'part', 'finished_product', 'machinery', 'waste'];

const EMPTY_FORM = {
  companyId: '', itemCode: '', nameFa: '', nameEn: '', hsCode: '', unitId: '', itemType: 'raw_material',
};

function GoodsPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === 'fa';

  const [goods, setGoods] = useState([]);
  const [units, setUnits] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [g, u, c] = await Promise.all([listGoods(), listUnits(), listCompanies()]);
      setGoods(g);
      setUnits(u);
      setCompanies(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filteredGoods = useMemo(() => {
    return goods.filter((g) => {
      if (companyFilter && String(g.company_id) !== String(companyFilter)) return false;
      if (typeFilter && g.item_type !== typeFilter) return false;
      return true;
    });
  }, [goods, companyFilter, typeFilter]);

  const columns = [
    { key: 'item_code', label: t('goodsPage.itemCode') },
    { key: 'name', label: t('name'), render: (row) => (isFa ? row.name_fa : row.name_en) },
    { key: 'company', label: t('goodsPage.company'), render: (row) => (isFa ? row.company_name_fa : row.company_name_en) },
    { key: 'unit', label: t('goodsPage.unit'), render: (row) => (isFa ? row.unit_name_fa : row.unit_name_en) },
    { key: 'item_type', label: t('goodsPage.itemType'), render: (row) => t(`goodsPage.types.${row.item_type}`) },
    { key: 'hs_code', label: t('goodsPage.hsCode') },
  ];

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setDrawerOpen(true);
  }

  function openEdit(row) {
    setEditingId(row.id);
    setForm({
      companyId: row.company_id, itemCode: row.item_code, nameFa: row.name_fa,
      nameEn: row.name_en, hsCode: row.hs_code || '', unitId: row.unit_id, itemType: row.item_type,
    });
    setError('');
    setDrawerOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await updateGoods(editingId, form);
      } else {
        await createGoods(form);
      }
      setDrawerOpen(false);
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(t('goodsPage.confirmDelete'))) return;
    try {
      await deleteGoods(row.id);
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="ez-companies-page">
      <div className="ez-page-header">
        <h1 className="ez-page-heading">{t('modules.baseInfo')}</h1>
        <Button variant="primary" onClick={openAdd}>{t('goodsPage.addNew')}</Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredGoods}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        pageSize={10}
        toolbarExtra={
          <>
            <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="">{t('goodsPage.allCompanies')}</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{isFa ? c.name_fa : c.name_en}</option>
              ))}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">{t('goodsPage.allTypes')}</option>
              {ITEM_TYPES.map((type) => (
                <option key={type} value={type}>{t(`goodsPage.types.${type}`)}</option>
              ))}
            </select>
          </>
        }
      />

      <DrawerForm
        open={drawerOpen}
        title={editingId ? t('goodsPage.editTitle') : t('goodsPage.addTitle')}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        {error && <p className="ez-form-field-error">{error}</p>}

        <FormField label={t('goodsPage.company')}>
          <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">—</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{isFa ? c.name_fa : c.name_en}</option>
            ))}
          </select>
        </FormField>

        <FormField label={t('goodsPage.itemCode')}>
          <input value={form.itemCode} onChange={(e) => setForm({ ...form, itemCode: e.target.value })} />
        </FormField>

        <FormField label={`${t('name')} (فارسی)`}>
          <input value={form.nameFa} onChange={(e) => setForm({ ...form, nameFa: e.target.value })} />
        </FormField>

        <FormField label={`${t('name')} (English)`}>
          <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        </FormField>

        <FormField label={t('goodsPage.hsCode')}>
          <input value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} />
        </FormField>

        <FormField label={t('goodsPage.unit')}>
          <select value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })}>
            <option value="">—</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{isFa ? u.name_fa : u.name_en}</option>
            ))}
          </select>
        </FormField>

        <FormField label={t('goodsPage.itemType')}>
          <select value={form.itemType} onChange={(e) => setForm({ ...form, itemType: e.target.value })}>
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>{t(`goodsPage.types.${type}`)}</option>
            ))}
          </select>
        </FormField>
      </DrawerForm>
    </div>
  );
}

export default GoodsPage;
