import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategorySection from "@/components/home/CategorySection";
import LatestProducts from "@/components/home/LatestProducts";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <LatestProducts />
    </main>
  );
};

export default Index;
