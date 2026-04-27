import Features from '../components/ui/Features';
import NewsCarousel from '../components/ui/NewsCarousel';
import ProductSection from '../components/ui/ProductSection';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Sección 1: Gris (NewsCarousel) */}
      <div className="bg-studio-bg">
         <NewsCarousel />
      </div>

      {/* Sección 2: Blanco (Features) */}
      <div className="bg-white">
        <Features />
      </div>

      {/* Sección 3: Gris (ProductSection) */}
      <div className="bg-studio-bg/60"> 
        <ProductSection />
      </div>
    </div>
  );
}