// Visual + descriptive metadata for the 15 modules (used by /modules and the home showcase).
// `icon` is a key of ICONS in components/ModuleVisual.jsx.
export const MODULE_META = {
  userAccess: {
    icon: 'Users',
    fa: 'مدیریت کاربران، نقش‌ها و سطح دسترسی هر شرکت',
    en: 'Users, roles and per-company access control',
  },
  companies: {
    icon: 'Building',
    fa: 'ثبت و مدیریت شرکت‌ها با جداسازی کامل داده',
    en: 'Register and manage companies with strict data isolation',
  },
  baseInfo: {
    icon: 'Database',
    fa: 'کالاها، واحدها و اطلاعات پایه؛ یک‌بار ثبت، همه‌جا استفاده',
    en: 'Goods, units and master data: enter once, reuse everywhere',
  },
  importDocs: {
    icon: 'FileDown',
    fa: 'ثبت و پیگیری اسناد واردات تا ترخیص نهایی',
    en: 'Capture and track import documents through final clearance',
  },
  domesticWarehouse: {
    icon: 'Warehouse',
    fa: 'قبض انبار داخلی و ردیابی ورود و خروج کالا',
    en: 'Domestic warehouse receipts and goods movement tracking',
  },
  foreignWarehouse: {
    icon: 'Globe',
    fa: 'قبض انبار خارجی و اتصال به زنجیره تأمین بین‌المللی',
    en: 'Foreign warehouse receipts linked to the global supply chain',
  },
  consumptionPlan: {
    icon: 'ClipboardList',
    fa: 'طرح توجیهی و کیل مصرف (BOM) با نسخه‌بندی',
    en: 'Feasibility plans and versioned bills of materials (BOM)',
  },
  production: {
    icon: 'Factory',
    fa: 'ثبت تولید و مصرف مواد اولیه به‌صورت ردیابی‌پذیر',
    en: 'Traceable production runs and raw-material consumption',
  },
  productionCertificate: {
    icon: 'Award',
    fa: 'صدور و مدیریت گواهی تولید',
    en: 'Issue and manage production certificates',
  },
  inventory: {
    icon: 'Boxes',
    fa: 'موجودی لحظه‌ای بر پایه دفتر رویدادهای تغییرناپذیر',
    en: 'Live stock from an immutable event ledger',
  },
  orders: {
    icon: 'Truck',
    fa: 'ثبت سفارش و پیگیری تا تحویل به مقصد',
    en: 'Order registration and tracking through to delivery',
  },
  customsDeclaration: {
    icon: 'ShieldCheck',
    fa: 'اظهارنامه گمرکی با استفاده مجدد از داده‌های قبلی',
    en: 'Customs declarations that reuse data already captured',
  },
  reports: {
    icon: 'BarChart',
    fa: 'گزارش‌های مدیریتی و عملیاتی قابل‌اشتراک',
    en: 'Shareable management and operational reports',
  },
  fileManagement: {
    icon: 'Folder',
    fa: 'مخزن فایل رمزنگاری‌شده برای هر شرکت',
    en: 'Encrypted file repository per company',
  },
  notifications: {
    icon: 'Bell',
    fa: 'اعلان‌های رویدادهای مهم و وضعیت اسناد',
    en: 'Alerts for key events and document status changes',
  },
};

// Six modules featured on the landing page, in chain order.
export const FEATURED_MODULES = [
  'importDocs', 'domesticWarehouse', 'consumptionPlan',
  'production', 'inventory', 'customsDeclaration',
];
