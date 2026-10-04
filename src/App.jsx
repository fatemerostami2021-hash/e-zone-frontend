import { BrowserRouter, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './routes/ScrollToTop';
import './App.css';
import CookieConsent from './components/CookieConsent';
import FloatingContact from './components/layout/FloatingContact';

// Public site only: hidden on the internal dashboard (/app/*)
function PublicFloatingContact() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/app')) return null;
  return <FloatingContact />;
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
        <CookieConsent />
        <PublicFloatingContact />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;