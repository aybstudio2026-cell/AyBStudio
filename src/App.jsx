import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './views/Home';
// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProductDetailView from './components/ui/ProductDetailView';
import ScrollToTop from './components/layout/ScrollToTop';
// Views
import EditProfileView from './views/EditProfileView';
import OrdersView from './views/OrdersView';
import CheckoutView from './views/CheckoutView';
import StoreView from './views/StoreView';
import DownloadsView from './views/DownloadsView';
import SuccessView from './views/SuccessView';
import WishlistView from './views/WishlistView';
import CoinsView from './views/CoinsView';

// Admin
import AdminLayout from './views/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminProducts from './views/admin/AdminProducts';
import AdminNews from './views/admin/AdminNews';
import AdminUsers from './views/admin/AdminUsers';
import AdminOrders from './views/admin/AdminOrders';
import AdminReviews from './views/admin/AdminReviews';
import AdminCategories from './views/admin/AdminCategories';
import AdminSupport from './views/admin/AdminSupport';

// Tools
import ToolsCatalog from './views/tools/ToolsCatalog';
import ImageConverter from './views/tools/ImageConverter';
import PlaceholderGen from './views/tools/PlaceholderGen';
import ImageCompressor from './views/tools/ImageCompressor';
import ColorExtractor from './views/tools/ColorExtractor';
import FaviconGenerator from './views/tools/FaviconGenerator';
import SvgOptimizer from './views/tools/SvgOptimizer';
import PasswordGenerator from './views/tools/PasswordGenerator';
import JsonValidator from './views/tools/JsonValidator';
import WordToPdf from './views/tools/Wordtopdf';
import WordCounter from './views/tools/WordCounter';
import CaseConverter from './views/tools/CaseConverter';
import WhatIsMyIp from './views/tools/Whatismyip';
import QrGenerator from './views/tools/Qrgenerator';
import TaxCalculator from './views/tools/TaxCalculator';
import JsonToCsv from './views/tools/JsonToCsv';
import TextToBinary from './views/tools/TextToBinary';
import TableGenerator from './views/tools/TableGenerator';
import DateCalculator from './views/tools/DateCalculator';
import OpenGraphPreview from './views/tools/OpenGraphPreview';
import SupportView from './views/SupportView';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-soft-snow font-sans flex flex-col">
      {!isAdmin && <Navbar />}
      <ScrollToTop />
      <main className="w-full flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cuenta" element={<EditProfileView />} />
          <Route path="/pedidos" element={<OrdersView />} />
          <Route path="/producto/:id" element={<ProductDetailView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/tienda" element={<StoreView />} />
          <Route path="/inventario" element={<DownloadsView />} />
          <Route path="/success" element={<SuccessView />} />
          <Route path="/favoritos" element={<WishlistView />} />
          <Route path="/billetera" element={<CoinsView />} />
          <Route path="/soporte" element={<SupportView />} />
          
          {/* Tools */}
          <Route path="/tools" element={<ToolsCatalog />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/placeholder-gen" element={<PlaceholderGen />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/color-extractor" element={<ColorExtractor />} />
          <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
          <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/json-validator" element={<JsonValidator />} />
          <Route path="/tools/word-to-pdf" element={<WordToPdf />} />
          <Route path="/tools/word-counter" element={<WordCounter />} />
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/what-is-my-ip" element={<WhatIsMyIp />} />
          <Route path="/tools/qr-code-generator" element={<QrGenerator />} />
          <Route path="/tools/tax-calculator" element={<TaxCalculator />} />
          <Route path="/tools/json-to-csv" element={<JsonToCsv />} />
          <Route path="/tools/text-to-binary" element={<TextToBinary />} />
          <Route path="/tools/table-generator" element={<TableGenerator />} />
          <Route path="/tools/date-calculator" element={<DateCalculator />} />
          <Route path="/tools/og-preview"     element={<OpenGraphPreview />} />
          

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="noticias" element={<AdminNews />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="ordenes" element={<AdminOrders />} />
            <Route path="reseñas" element={<AdminReviews />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="soporte" element={<AdminSupport />} />
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