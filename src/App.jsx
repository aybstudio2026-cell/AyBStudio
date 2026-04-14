import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './views/Home';
import EditProfileView from './views/EditProfileView';
import Footer from './components/layout/Footer';
import ProductDetailView from './components/ui/ProductDetailView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-soft-snow font-sans flex flex-col">
        <Navbar />
        
        <main className="w-full flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cuenta" element={<EditProfileView />} />
            <Route path="/producto/:id" element={<ProductDetailView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;