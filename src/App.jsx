import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './views/Home';
import EditProfileView from './views/EditProfileView';
import Footer from './components/layout/Footer';
import ProductDetailView from './components/ui/ProductDetailView';
import OrdersView from './views/OrdersView';
import TermsView from './views/TermsView';
import PrivacyView from './views/PrivacyView';
import CheckoutView from './views/CheckoutView';
import StoreView from './views/StoreView';
import DownloadsView from './views/DownloadsView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-soft-snow font-sans flex flex-col">
        <Navbar />
        
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;