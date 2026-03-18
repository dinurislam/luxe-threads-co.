import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { Link } from "react-router-dom";

const LatestProducts = () => {
  const latest = [...products].slice(0, 6);

  return (
    <section className="px-6 lg:px-12 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2">New Arrivals</p>
          <h2 className="font-display text-2xl lg:text-3xl uppercase">Latest</h2>
        </div>
        <Link
          to="/shop"
          className="text-[11px] uppercase tracking-premium text-muted-foreground hover:text-foreground ghost-slide font-body"
        >
          View All
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      >
        {latest.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0, 0, 1] } },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default LatestProducts;
