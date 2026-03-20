import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

const LatestProducts = () => {
  const { data: products, isLoading } = useProducts();
  const latest = (products || []).slice(0, 6);

  return (
    <section className="px-6 lg:px-12 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2">New Arrivals</p>
          <h2 className="font-display text-2xl lg:text-3xl uppercase">Latest</h2>
        </div>
        <Link to="/shop" className="text-[11px] uppercase tracking-premium text-muted-foreground hover:text-foreground ghost-slide font-body">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : latest.length === 0 ? null : (
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {latest.map((product) => (
            <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0, 0, 1] } } }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default LatestProducts;
