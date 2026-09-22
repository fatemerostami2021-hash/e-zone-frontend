import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ModulesIndexPage from '../pages/ModulesIndexPage';
import LoginPage from '../pages/LoginPage';
import CompaniesPage from '../pages/CompaniesPage';
import NotFoundPage from '../pages/NotFoundPage';

function GenericModulePage() {
  return null;
}

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/modules" element={<ModulesIndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* App (Dashboard) */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="modules/:key" element={<GenericModulePage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
