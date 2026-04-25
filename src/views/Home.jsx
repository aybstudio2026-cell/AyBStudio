import Features from '../components/ui/Features';
import NewsCarousel from '../components/ui/NewsCarousel';
import ProductSection from '../components/ui/ProductSection';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <div className="py-10 bg-soft-snow">
         <NewsCarousel />
      </div>
      <Features />
      <ProductSection />
    </div>
  );
}