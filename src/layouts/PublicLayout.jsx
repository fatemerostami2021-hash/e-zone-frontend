import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './PublicLayout.css';

function PublicLayout() {
  return (
    <div className="ez-public">
      <Header />
      <main className="ez-public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
