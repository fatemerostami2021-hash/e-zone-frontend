// SAMPLE DATA ONLY. Replace with real API calls when the client's real content arrives.
const STATUSES = ['approved', 'pending', 'draft'];

const MODULE_PREFIX = {
  userAccess: 'USR',
  importDocs: 'IMP',
  domesticWarehouse: 'DWR',
  foreignWarehouse: 'FWR',
  consumptionPlan: 'BOM',
  production: 'PRD',
  productionCertificate: 'CRT',
  inventory: 'INV',
  orders: 'ORD',
  customsDeclaration: 'DEC',
  reports: 'RPT',
  fileManagement: 'FIL',
  notifications: 'NTF',
};

export const SAMPLE_MODULE_KEYS = Object.keys(MODULE_PREFIX);

export function buildSampleRows(moduleKey, count = 12) {
  const prefix = MODULE_PREFIX[moduleKey] || 'DOC';
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: n,
      ref: `${prefix}-${String(n).padStart(4, '0')}`,
      date: `2026-09-${String(((n * 2) % 28) + 1).padStart(2, '0')}`,
      companyId: (i % 4) + 1,
      quantity: ((n * 125) % 1000) + 50,
      status: STATUSES[i % STATUSES.length],
    };
  });
}
