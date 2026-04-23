import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './views/Home';
import EditProfileView from './views/EditProfileView';
import ProductDetailView from './components/ui/ProductDetailView';
import OrdersView from './views/OrdersView';
import TermsView from './views/TermsView';
import PrivacyView from './views/PrivacyView';
import CheckoutView from './views/CheckoutView';
import StoreView from './views/StoreView';
import DownloadsView from './views/DownloadsView';
import SuccessView from './views/SuccessView';
import AdminLayout from './views/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-soft-snow font-sans flex flex-col">
      {!isAdmin && <Navbar />}

      <main className="w-full flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cuenta" element={<EditProfileView />} />
          <Route path="/pedidos" element={<OrdersView />} />
          <Route path="/producto/:id" element={<ProductDetailView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/terminos" element={<TermsView />} />
          <Route path="/privacidad" element={<PrivacyView />} />
          <Route path="/tienda" element={<StoreView />} />
          <Route path="/descargas" element={<DownloadsView />} />
          <Route path="/success" element={<SuccessView />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;