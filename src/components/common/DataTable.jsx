import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Pencil, Trash2, Inbox, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import './DataTable.css';

function DataTable({ columns, data = [], onEdit, onDelete, loading = false, searchable = true, pageSize = 10, toolbarExtra = null }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) => columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q)));
  }, [data, query, columns, searchable]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => { setPage(1); }, [query, data.length]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="ez-data-table-wrap">
      {(searchable || toolbarExtra) && (
        <div className="ez-data-table-toolbar">
          {searchable && (
            <div className="ez-data-table-search">
              <Search size={16} />
              <input type="text" placeholder={t('table.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          )}
          {toolbarExtra}
        </div>
      )}

      <div className="ez-table-wrapper">
        <table className="ez-table">
          <thead>
            <tr>
              {columns.map((col) => (<th key={col.key}>{col.label}</th>))}
              {hasActions && <th>{t('table.actionsHeader')}</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={columns.length + (hasActions ? 1 : 0)}>
                <div className="ez-data-table-state"><Loader2 size={22} className="ez-spin" /><span>{t('table.loading')}</span></div>
              </td></tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr><td colSpan={columns.length + (hasActions ? 1 : 0)}>
                <div className="ez-data-table-state"><Inbox size={22} /><span>{t('table.empty')}</span></div>
              </td></tr>
            )}

            {!loading && paged.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (<td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>))}
                {hasActions && (
                  <td className="ez-data-table-actions">
                    {onEdit && (
                      <button type="button" className="ez-icon-btn" onClick={() => onEdit(row)} aria-label={t('table.edit')}>
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button type="button" className="ez-icon-btn ez-icon-btn-danger" onClick={() => onDelete(row)} aria-label={t('table.delete')}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && totalPages > 1 && (
        <div className="ez-data-table-pagination">
          <button type="button" className="ez-icon-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label={t('table.prev')}>
            <ChevronRight size={16} />
          </button>
          <span className="ez-data-table-pagination-label">{t('table.page')} {page} {t('table.of')} {totalPages}</span>
          <button type="button" className="ez-icon-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label={t('table.next')}>
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
