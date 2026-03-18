import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import categoryShirts from "@/assets/category-shirts.jpg";
import categoryTshirts from "@/assets/category-tshirts.jpg";
import categoryPants from "@/assets/category-pants.jpg";

const cats = [
  { name: "Shirts", slug: "shirts", image: categoryShirts },
  { name: "T-Shirts", slug: "t-shirts", image: categoryTshirts },
  { name: "Pants", slug: "pants", image: categoryPants },
];

const CategorySection = () => {
  return (
    <section className="px-6 lg:px-12 py-20">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-premium text-muted-foreground mb-2">Browse</p>
        <h2 className="font-display text-2xl lg:text-3xl uppercase">Categories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {cats.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
          >
            <Link
              to={`/shop?category=${cat.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 ghost-slide" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl uppercase text-background">{cat.name}</h3>
                <p className="text-[10px] uppercase tracking-premium text-background/70 mt-1 font-body">
                  Explore →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
